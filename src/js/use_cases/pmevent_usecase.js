import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as pmevent from"./pmevent_internal.js";
import * as fns from"./FNS_internal.js";
import * as utils from "./utils.js";
import * as config from "./config.js";
import * as subscription from "./Subcription_Utils.js";
import * as topic from "./OutputTopic_Validation.js";
import * as ContentValidation from "./Content_validation.js";

var fns_received_5G_files_beforeROP,fns_received_5G_files;
var buffer_time=480;
let pmevent_processingTime = 0;
var fns_starttime,pmevent_processing_endtime,totalTimeFromFNSto5GPmevent;
var value_from_RESTSIMto5g=config.pmCelltracefilecount;

//Method For validating PM Events flow
export default function (){
    group('Validation of Registration of PM Events output Topics in Datacatalog and Kafka', function () {
        topic.TopicValidation(config.expectedPMEventsTopicName, 120, 1,config.expectedpmeventsRetentionPeriod,config.expectedpmeventspartitions);
    });
    //Subscription creation for 5G Pm Event topic
    subscription.Creation_of_PmeventSubscription(config.Subscription_5G_Topic,0);
    subscription.Creation_of_PmeventSubscription(config.Subscription_5G_propretiary,0);
    fns_received_5G_files_beforeROP = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,config.fns_5GOutputTopic,config.csr_ENM1,config.fns_job);
    pmevent.pmevent_getMetricsValue_beforeRop();
    fns.FNS_getMetricsValue_pmevent_beforeRop();
    sleep(250);// We have wait for some time post all services up and Subscription creation
    let i=1;
    //Method to Validate whether RESTSIM is able to generate and FNS Started receiving PM Event files
     while(i<=buffer_time){
     console.log("Waiting for RESTSIM to generate 30K pmevent files");
     fns_received_5G_files = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,config.fns_5GOutputTopic,config.csr_ENM1,config.fns_job);
     let diff_fns_received = fns_received_5G_files - fns_received_5G_files_beforeROP;

        if( diff_fns_received > 0){
            console.log("Started Receiving PM Event files and Testing started");
            fns_starttime = Date.now();
            console.log("Timestamp - FNS Microservice starts time in milliseconds for 5GPMevent flow  - ",fns_starttime);
            break;
        }
         i+=30;
        sleep(30);
      }
      //Post FNS started receiving Pm Event files then below method will check PM Event flow
            while (pmevent_processingTime <= config.timeoutLimit) {

            let pmevent_Actual_Final_count          = utils.get_metrics_total_replica(pmevent.pmeventProcessedFiles,config.PMEvent_5G_job,config.PMEvent_5G_app);
            let pmevent_Expected_Final_count        = Number(pmevent.pmeventProcessedFiles_count_BeforeROP) + Number(value_from_RESTSIMto5g);
            let fnsProcessedFiles_5gcount           = utils.get_fns_value_bytopic(fns.fnsProcessedFiles,config.fns_5GOutputTopic,config.csr_ENM1,config.fns_job);
            let fns_expected_count                  = Number(fns_received_5G_files_beforeROP) + Number(config.pmCelltracefilecount);

            let pmevent_5G_Actual_ReadTotalEvents   = utils.get_metrics_total_replica(pmevent.pmeventEventReadTotal,config.PMEvent_5G_job,config.PMEvent_5G_app);
            let pmevent_5G_Expected_ReadTotalEvents = Number(pmevent.pmeventEventReadTotal_BeforeROP) + Number(config.expected_5G_ReadTotal_Count);

            let pmevent_5g_Kafka_Sent_Actualcount_standardTopic   = Number(utils.get_metrics_total_replica(pmevent.pmeventKafkaCount_StandardTopic,config.PMEvent_5G_job,config.PMEvent_5G_app));
            let pmevent_5g_Kafka_Sent_Expectedcount_standardTopic = Number(pmevent.pmevent_kafka_count_BeforeROP_StandardTopic) + Number(config.standardTopic_5G_PublishedFiles);

            let pmevent_5g_Kafka_Sent_Actualcount_NonstandardTopic   = Number(utils.get_metrics_total_replica(pmevent.pmeventKafkaCount_NonStandardTopic,config.PMEvent_5G_job,config.PMEvent_5G_app));
            let pmevent_5g_Kafka_Sent_Expectedcount_NonstandardTopic = Number(pmevent.pmevent_kafka_count_BeforeROP_NonStandardTopic) + Number(config.nonStandardTopic_5G_PublishedFiles);

            console.log("===============5gpmevent--> Polling metrics to get Expected Value==============");
            console.log("Actual 5G FNS Files Count                             :",fnsProcessedFiles_5gcount);
            console.log("Expected FNS 5G Files Count                           :",fns_expected_count);
            console.log("BeforeROP 5gpmevt Processed Count                     :",pmevent.pmeventProcessedFiles_count_BeforeROP);
            console.log("Files from RESTSIM to 5gpmevt count                   :",value_from_RESTSIMto5g);
            console.log("5gpmevt Actual processed count                        :",pmevent_Actual_Final_count);
            console.log("5gpmevt Expected processed count                      :",pmevent_Expected_Final_count);

            console.log("5G Actual Total messages produced/read total          :",pmevent_5G_Actual_ReadTotalEvents);
            console.log("5g Expected Total messages produced/read total        :",pmevent_5G_Expected_ReadTotalEvents);

            console.log("5g Actual messages sent to Standard output topic      :",pmevent_5g_Kafka_Sent_Actualcount_standardTopic);
            console.log("5g Expected messages sent to Standard output topic    :",pmevent_5g_Kafka_Sent_Expectedcount_standardTopic);

            console.log("5G Actual messages sent to NonStandard output topic   :",pmevent_5g_Kafka_Sent_Actualcount_NonstandardTopic);
            console.log("5g Expected messages sent to NonStandard output topic :",pmevent_5g_Kafka_Sent_Expectedcount_NonstandardTopic);
            console.log("===================================================================");

            //Validate Assertions when all expected files are transsferred and processed form RESTSIM to 5G
            if (pmevent_Expected_Final_count == pmevent_Actual_Final_count && value_from_RESTSIMto5g != 0 && fnsProcessedFiles_5gcount == fns_expected_count && pmevent_5G_Actual_ReadTotalEvents==pmevent_5G_Expected_ReadTotalEvents && pmevent_5g_Kafka_Sent_Actualcount_standardTopic>=pmevent_5g_Kafka_Sent_Expectedcount_standardTopic && pmevent_5g_Kafka_Sent_Actualcount_NonstandardTopic==pmevent_5g_Kafka_Sent_Expectedcount_NonstandardTopic){
                pmevent_processing_endtime = Date.now();
                console.log("Timestamp - 5Gpmevent Microservice end time in milliseconds  - ",pmevent_processing_endtime);
                totalTimeFromFNSto5GPmevent = (pmevent_processing_endtime - fns_starttime)/1000;
                console.log("Timestamp - Total time taken from FNS -> 5GPMEvent in seconds :",totalTimeFromFNSto5GPmevent);
                console.log("The Actual and Expected Values are matched with RESTSIM count with 5GPmevent processed files,Testing started");

                microservices_Assertions_Timestamp_RateFactor();
                break;
            }
            //Validate Assertions- even  when all expected files are not transferred and processed by 5G with in Scheduled time
            else if (pmevent_processingTime == 590) {
                console.error("Either Actual or Expected Values are not same,Testing started.Please check the count Polling Metrics to get expected count values in logs");
                pmevent_microservices_Assertions();
                break;
            }
            //checking FNS and 5G whether recieved and processed all expected files for every 20 seconds
            sleep(10);
            pmevent_processingTime += 10;
        }// while method - end

    }// end - default function
//Method for validating PM Event flow Assertions
export function pmevent_microservices_Assertions(){
    group("Validation of 5G PMEvent-files flow collection",function(){
        //pmevent.pmevent_getStatusCode();
        pmevent.pmevent_getMetricsValue_afterRop();
        fns.FNS_getMetricsValue_pmevent_afterRop();
        })
        proto_kfTopic_Header_Content_Validation();
}

//Method for validating Throughput rate factors metrics
export function throughput_RateFactor_pmEventFiles()
{
 // verify volume count and bytes
      //let pmstatsFileinBytes = sftp.Diff_sftpBDRDataVolume_count;
      //let sftp_BDRDataVolume = pmstatsFileinBytes/1000000000;
      let rateOfFilesTransferedPerSec = value_from_RESTSIMto5g/totalTimeFromFNSto5GPmevent;
    group("Validation of Rate of 5G PMEvent files transfered", function () {
        check("pm-stats files rate factor", {
            ['Number of files transfered from RestSIM to FNS and 5GPMEvent Filetransfer is  ' + Number(value_from_RESTSIMto5g)]: (r) => Number(value_from_RESTSIMto5g),
            //['PM Stats files BDR data Volume in GB ' + Number(sftp_BDRDataVolume)]:(r)  => Number(sftp_BDRDataVolume),
            ['Number of 5G PM event files transfered per second  is' + Number(rateOfFilesTransferedPerSec)]: (r) => Number(rateOfFilesTransferedPerSec),
        });
    })
}
export function microservices_Assertions_Timestamp_RateFactor(){
    group("Validation of 5G PMEvent file processing through FNS and 5GPmevent services", function () {
        pmevent.pmevent_getMetricsValue_afterRop();
        fns.FNS_getMetricsValue_pmevent_afterRop();

        group("Validation of Total TimeTaken for 5GPmevent file flow", function () {
            check("Time Taken", {
                ['Timestamp - Total time taken to Process 5GPmevent files from RESTSIM in seconds : ' + Number(totalTimeFromFNSto5GPmevent)]: (r) => Number(totalTimeFromFNSto5GPmevent),

            });
        })

        throughput_RateFactor_pmEventFiles();
    })
        proto_kfTopic_Header_Content_Validation();
}

export function proto_kfTopic_Header_Content_Validation() {
    //Standard Topic - Headers and content
    ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_5G, config.MessageCount, config.expectedLength_5G, config.expected_headers_5G);
    //ContentValidation.validateContent_protoMessagesKafkaTopic(config.OutputTopic_5G,config.standardTopic_5G_PublishedFiles,config.pmevent_5G_flowType);
    ContentValidation.validateContent_protoMessagesKafkaTopic(config.OutputTopic_5G, config.MessageCount, config.pmevent_5G_flowType);

    //Non Standard Topic - Headers and content
    ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_5G_NonStandard, config.MessageCount, config.expectedLength_5G, config.expected_headers_5G);
    //ContentValidation.validateContent_protoMessagesKafkaTopic(config.OutputTopic_5G_NonStandard,config.nonStandardTopic_5G_PublishedFiles,config.pmevent_5G_flowType);
    ContentValidation.validateContent_protoMessagesKafkaTopic(config.OutputTopic_5G_NonStandard, config.MessageCount, config.pmevent_5G_flowType);
}

