import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as config from "./config.js";
import * as utils from "./utils.js";
//Varaibles Declartion
export var messageConsumption_starttime, messageConsumption_endtime, messageConsumption_totaltime;
export var total_message_count = Number(config.standardTopic_5G_PublishedFiles) + Number(config.nonStandardTopic_5G_PublishedFiles) ;

//export var total_message_count = Number(config.standardTopic_5G_PublishedFiles) + Number(config.nonStandardTopic_5G_PublishedFiles) + Number(config.standardTopic_4GParser_PublishedFiles) ;


//Kafka Metrics for consuming Messages
export const pmevents_5G_Standard_consumemessages = "kafka_wrapper_consume_message_total%7Btopic%3D%225g-pm-event-file-transfer-and-processing--standardized%22%7D&g0";
export const pmevents_5G_NonStandard_consumemessages = "kafka_wrapper_consume_message_total%7Btopic%3D%225g-pm-event-file-transfer-and-processing--ericsson%22%7D&g0";
export const pmevents_4G_Standard_consumemessages = "kafka_wrapper_consume_message_total%7Btopic%3D%22ctr-processed%22%7D&g0";

export const pmevents_5G_Standard_consumemessages_nonTLS = "kafka_wrapper_consume_message_total{topic='5g-pm-event-file-transfer-and-processing--standardized'}";
export const pmevents_5G_NonStandard_consumemessages_nonTLS = "kafka_wrapper_consume_message_total{topic='5g-pm-event-file-transfer-and-processing--ericsson'}";
export const pmevents_4G_Standard_consumemessages_nonTLS = "kafka_wrapper_consume_message_total{topic='ctr-processed'}";

export var consumemessages_5G_Standard, consumemessages_5G_NonStandard, consumemessages_4G_Standard, consumemessages_total;

//Method For validating Consumption flow
export default function () {
    let processingTime = 0;
    var i = 1;
    //Method to Validate whether Kafka wrapper consume messages
    while (i < config.buffertime_consumption_messages) {
        let consumemessages_5G_Standard = utils.get_service_topic_count(pmevents_5G_Standard_consumemessages, pmevents_5G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
        //let consumemessages_4G_Standard = utils.get_service_topic_count(pmevents_4G_Standard_consumemessages, pmevents_4G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);

        if (consumemessages_5G_Standard > 0 ) { //To start Time when kafka wrapper consumed messages
            messageConsumption_starttime = Date.now();
            console.log("Timestamp - Kafka Wrapper Message Consumption starts time in milliseconds  - ", messageConsumption_starttime);
            break;
        }
        sleep(10);
        i = i + 9;
    } //while - end
    console.log("Timestamp - Start Time of Message Consumption has been captured");
    //Validation of Consuming messages post Kafka Wrapper started consuming messages
    while (processingTime <= config.timeout_consumption_messages) {
        let consumemessages_5G_Standard_actual = utils.get_service_topic_count(pmevents_5G_Standard_consumemessages, pmevents_5G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
        let consumemessages_5G_NonStandard_actual = utils.get_service_topic_count(pmevents_5G_NonStandard_consumemessages, pmevents_5G_NonStandard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
        //let consumemessages_4G_Standard_actual = utils.get_service_topic_count(pmevents_4G_Standard_consumemessages, pmevents_4G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
        let consumemessages_total_actual = Number(consumemessages_5G_Standard_actual) + Number(consumemessages_5G_NonStandard_actual) ;
        //let consumemessages_total_actual = Number(consumemessages_5G_Standard_actual) + Number(consumemessages_5G_NonStandard_actual) + Number(consumemessages_4G_Standard_actual) ;
        console.log("=============== Kafka-wrapper ->Polling metrics to validate Consumption of messages ==============");
        console.log("Number of Actual 5G Standard Messages consumed by Kafka wrapper       : ", consumemessages_5G_Standard_actual);
        console.log("Number of Expected 5G Standard Messages consumed by Kafka wrapper     : ", config.standardTopic_5G_PublishedFiles);
        console.log("Number of Actual 5G Non-Standard Messages consumed by Kafka wrapper   : ", consumemessages_5G_NonStandard_actual);
        console.log("Number of Expected 5G Non-Standard Messages consumed by Kafka wrapper : ", config.nonStandardTopic_5G_PublishedFiles);
        //console.log("Number of Actual 4G Standard Messages consumed by Kafka wrapper       : ", consumemessages_4G_Standard_actual);
        //console.log("Number of Expected 4G Standard Messages consumed by Kafka wrapper     : ", config.standardTopic_4GParser_PublishedFiles);
        console.log("Total Actual Number of Messages consumed by Kafka wrapper             : ", consumemessages_total_actual);
        console.log("Total Expected Number of Messages consumed by Kafka wrapper           : ", total_message_count);
        console.log("===================================================================================================");
        //Validate Assertions when actual are matching with expected
        if (consumemessages_5G_Standard_actual == config.standardTopic_5G_PublishedFiles && consumemessages_5G_NonStandard_actual == config.nonStandardTopic_5G_PublishedFiles && consumemessages_total_actual == total_message_count) {
            messageConsumption_endtime = Date.now();
            console.log("Timestamp - Kafka Wrapper Consumption end time in milliseconds  - ", messageConsumption_endtime);
            messageConsumption_totaltime = (messageConsumption_endtime - messageConsumption_starttime) / 1000;
            console.log("Timestamp - Total time taken to consume all expected messages in seconds :", messageConsumption_totaltime);
            console.log("The Actual and Expected Messages are matched ,Testing started");
            assertions_Timestamp_RateFactor();
            break;
        }
        //Validate Assertions- when Kafka not able to consume all expected messages with in time limit
        else if (processingTime == (Number(config.timeout_consumption_messages) - 10)) {
            console.error("Either Actual or Expected Messages in Message Consumption are not same,Testing started.Please check the count Polling Metrics to get expected count values in logs");
            assertions_ConsumptionMessages();
            break;
        }
        //checking Kafka Wrapper consumed all messages 
        sleep(10);
        processingTime += 10;
    }

}
//Method for validating PM Stats flow Assertions
export function assertions_ConsumptionMessages() {
    group("Validation of Consumption of Kafka Output Topic Messages ", function () {
        assertions_5G_consumption();
        //assertions_4G_consumption();
        assertions_totalmessages_consumption();
    });
}
//Method for validating Throughput rate factors metrics

export function assertions_Timestamp_RateFactor() {
    group("Validation of Consumption of Kafka Output Topic Messages ", function () {
        assertions_5G_consumption();
        //assertions_4G_consumption();
        assertions_totalmessages_consumption();
        group("Validation of Total TimeTaken for Message Consumption file flow", function () {
            check("Time Taken", {
                ['Timestamp - Total time taken to Consume all messages  in seconds : ' + Number(messageConsumption_totaltime)]: (r) => Number(messageConsumption_totaltime),
            });
        });
    });
}

export function assertions_5G_consumption() {
    consumemessages_5G_Standard = utils.get_service_topic_count(pmevents_5G_Standard_consumemessages, pmevents_5G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
    consumemessages_5G_NonStandard = utils.get_service_topic_count(pmevents_5G_NonStandard_consumemessages, pmevents_5G_NonStandard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
    console.log("---Kafka-wrapper Metrics - 5G Consumption---------------");
    console.log("Number of 5G Standard Messages Consumed by Kafka-wrapper are : ", consumemessages_5G_Standard);
    console.log("Number of 5G Non Standard Messages Consumed by Kafka-wrapper are : ", consumemessages_5G_NonStandard);
    group('Validation of Consumption of 5G Topic Messages ', function () {
        check(consumemessages_5G_Standard, {
            'Validate whether able to consume all expected 5G Standard Output Messages': (r) => Number(consumemessages_5G_Standard) == config.standardTopic_5G_PublishedFiles,
            'Validate whether able to consume all expected 5G Non-Standard Output Messages': (r) => Number(consumemessages_5G_NonStandard) == config.nonStandardTopic_5G_PublishedFiles,
        },{ legacy: "false" });
    });
}
export function assertions_4G_consumption() {
    consumemessages_4G_Standard = utils.get_service_topic_count(pmevents_4G_Standard_consumemessages, pmevents_4G_Standard_consumemessages_nonTLS, config.kafka_wrapper_job, config.kafka_wrapper_app);
    console.log("---Kafka-wrapper Metrics - 4G Consumption---------------");
    console.log("Number of 4G Standard Messages Consumed by Kafka-wrapper are : ", consumemessages_4G_Standard);

    group('Validation of Consumption of 4G Topic Messages ', function () {
        check(consumemessages_4G_Standard, {
            'Validate whether able to consume all expected 4G Standard Output Messages': (r) => Number(consumemessages_4G_Standard) == config.standardTopic_4GParser_PublishedFiles,
        },{ legacy: "false" });
    });
}
export function assertions_totalmessages_consumption() {
    //consumemessages_total = Number(consumemessages_5G_Standard) + Number(consumemessages_5G_NonStandard) + Number(consumemessages_4G_Standard);
    consumemessages_total = Number(consumemessages_5G_Standard) + Number(consumemessages_5G_NonStandard) ;

    console.log("---Kafka-wrapper Metrics - Total Messages Consumption---------------");
    console.log("Number of Total Messages Consumed by Kafka-wrapper are : ", consumemessages_total);
    group('Validation of Consumption of Total Messages ', function () {
        check(consumemessages_total, {
            'Validate whether able to consume all expected Output Messages': (r) => Number(consumemessages_total) == total_message_count,
        },{ legacy: "false" });
    });
}