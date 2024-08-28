import http from 'k6/http';
import {
    sleep,check, group
} from 'k6';
import * as config from "./config.js";
import * as utils from "./utils.js";
import * as ranParser from "./Ran-parser_internal.js";
import * as pmevent4G from "./4GPMEventParser_internal.js"
let responseBody = [];
var listofTopics = [];
let i = 0;
export var number_of_partitions = 0, retention_period = 0;
export var OutputTopicResponse, Kafka_topic_status, kafka_flag, DC_flag;
export var Ranparser_ParsedSuccessful_Count_BeforeROP;
export var time,topicbuffertime;
export var OutputTopic_List,Kafka_list;
export var pmeventTransferedFiles_4G_Parser_BeforeROP;
export var Topics_notfound_list=[];

export var OuptutTopic_list = [];
export function metrics_BeforeROP() {
    Ranparser_ParsedSuccessful_Count_BeforeROP = utils.get_metrics_total_replica(ranParser.pmparserPMounterFilesSuccessfulParsed, config.Ran_parser_job, config.Ran_parser_app);
}

export function metrics_4G_FT_BeforeROP(){
    pmeventTransferedFiles_4G_Parser_BeforeROP=utils.get_metrics_total_replica(pmevent4G.PMEventparser_4G_input_received,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    console.log("4G PM Event files before ROP are ",pmeventTransferedFiles_4G_Parser_BeforeROP);          
}

export function getTopicList() {
    const URL = config.datacatalog_V2_Endpoint + 'message-data-topic';
    getTopics(URL);//Storing all topics registered  in MessageDataTopic in User Defined Array
    //console.log("list of Output Topics are ",listofTopics);
    const URL1 = config.datacatalog_V2_Endpoint + 'notification-topic';
    getTopics(URL1);//Storing all topics registered  in Notification Topic in User Defined Array
    //console.log("list of Output Topics are ",listofTopics);
}

//Getting all topics that are registered in DC and Storing in used defined Array
export function getTopics(URL) {
    OutputTopicResponse = http.get(URL);
    responseBody = JSON.parse(OutputTopicResponse.body);
    if (OutputTopicResponse.status == 200) {
        for (let k = 0; k < responseBody.length; k++) {
            const Topic = responseBody[k].name;
            listofTopics.push(Topic);
        }
    }
}//function-end

//Validate Whether topic is exist in Kafka or not and get the Rentention and Partition count from Kafka
export function validate_Kafkatopics(kafkatopicname,retentionPeriod,Count) {
    const Kafka_URL = config.kafka_URL + kafkatopicname + '/describe';
    const OutputKafkaresponse = http.get(Kafka_URL);
    Kafka_topic_status = OutputKafkaresponse.status;
    //Validate the Content when status is 200
    if (Kafka_topic_status == 200) {
        kafka_flag = true;
        const Kafka_responseBody = JSON.parse(OutputKafkaresponse.body);
        number_of_partitions = Kafka_responseBody.num_partitions;
        retention_period = Kafka_responseBody.retention_seconds;
        console.log("Topic : " + kafkatopicname + " is registered in kafka");
        group('Validation of Output Topic Details in Kafka', function () {
            const result_Output = check("Output Topic Details in Kafka", {
                ['Validate Output Topic Name  is ' + kafkatopicname]: (r) => kafkatopicname,
                ['Validate Retention Period for Topic : ' + kafkatopicname ]: retention_period==retentionPeriod,
                ['Validate Number of Partitions for Topic : ' + kafkatopicname ]: number_of_partitions==Count,
            });
            if (!result_Output) {
                console.log("Actual Number of partitions for Topic :  " + kafkatopicname + " is " + number_of_partitions);
                console.log("Actual Retention period for Topic :  " + kafkatopicname + " is " + retention_period);
            }
        });
    }
    else {
        kafka_flag = false;
        //console.log("Topic : " + kafkatopicname + " is not registered in Kafka");
    }
}//function-end

export function validate_DuplicateTopics() {
    for (let i = 0; i < listofTopics.length; i++) {
        for (let j = i + 1; j < listofTopics.length; j++) {
            if (listofTopics[i] == listofTopics[j]) {
                console.log(" Topic is duplicated ", listofTopics[i]);
                check(listofTopics[i], {
                    ['Topics that are created duplicate in Kafka are ']: listofTopics[i] != listofTopics[i]
                })
            }
        } // j loop -end
    } // i loop - end
} //method - closure

//Validate Topics registered in DC and Kafka
export function validate_OutputTopics(expectedTopicName,Retention,PartitionCount) {
    //console.log("------------ Started validation of Registration of Topic : " + expectedTopicName + " -----------------");
    for (i = 0; i < listofTopics.length; i++) {
        if (expectedTopicName == listofTopics[i]) {
            //console.log("Topic : " + expectedTopicName + " is registered in DC");
            DC_flag = true;
            validate_Kafkatopics(expectedTopicName,Retention,PartitionCount);
            break;
        }

        else {
            if (i == listofTopics.length - 1) {
                DC_flag = false;
                validate_Kafkatopics(expectedTopicName,Retention,PartitionCount);
                //console.log("Topic : " + expectedTopicName + " is not registered in DC");
            }
        }
    }//for loop -end
    check(DC_flag, {
        ['Validation of Registration of Topic : ' + expectedTopicName + ' in DC and Kafka ']: DC_flag == true && kafka_flag == true
    })

    //console.log("----------------- End of validation of Registration of Topic : " + expectedTopicName + " -----------------");
}
export function TopicValidation(topics, topicbuffertime, time,Retention,PartitionCount) {
    getTopicList();
    for (let t = 0; t < topics.length; t++) {
        if (t > 0 && time > 100) {
            topicbuffertime = 10;
        }
        var k = 1;
        console.log("Topicbuffertime for topic : "+topics[t]+" is ", topicbuffertime);
        console.log("Validation Time for topic : "+topics[t]+" is ", time);
        while (k < topicbuffertime) {
            validate_OutputTopics(topics[t],Retention[t],PartitionCount[t]);
            if (kafka_flag == true && DC_flag == true) {
                console.log("Topic : "+topics[t]+" is registered in DC and Kafka");
                break;
            }
            sleep(10);
            k = k + 9;
            time = time + 9;
        }
        if (kafka_flag != true && DC_flag != true) {
            console.log("Topic : " + topics[t] + " is not registered in DC and Kafka");
        }
        if (kafka_flag != true && DC_flag == true) {
            console.log("Topic : " + topics[t] + " is registered in DC and not registered in Kafka");
        }
        if (kafka_flag == true && DC_flag != true) {
            console.log("Topic : " + topics[t] + " is not registered in DC and registered in Kafka");
        }
    }
    validate_DuplicateTopics();
}
//Below mthod is to update all topics created in kafka in new Array
export function get_KafkaList() {
    OutputTopic_List = http.get(config.kafka_list);
    Kafka_list = JSON.parse(OutputTopic_List.body);
    for (let i = 0; i < Kafka_list.length; i++) {
        const header = Kafka_list[i];
        if (config.expected_kafkalist.includes(header)) {
            OuptutTopic_list.push(header);
        }
        else {
            console.log("Topic : " + header + " is not found in Expected Kafka Topic List");
            Topics_notfound_list.push(header);
        }
    }
}
export default function () {
    group('Validation of Output Topic List', function () {
        get_KafkaList();
        console.log("Started Validating Kafka Topic List");
        check(Topics_notfound_list, {
            ['Validate output Kafka topic list ']: Topics_notfound_list.length == 0,
        },{legacy: "false"});

        console.log("End of Validating Kafka Topic List");
    });
}
