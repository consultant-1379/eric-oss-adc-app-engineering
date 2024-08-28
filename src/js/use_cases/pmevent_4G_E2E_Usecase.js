import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as utils from "./utils.js";
import * as config from "./config.js";
import * as subscription from "./Subcription_Utils.js";
import * as topic from "./OutputTopic_Validation.js";
import * as fns from "./FNS_internal.js";
import * as ContentValidation from "./Content_validation.js";
import * as PMEvent_FileTransfer from "./4GPMEvent_internal.js";
import * as PMEvent_4G_Parser from "./4GPMEventParser_internal.js";
import * as filetrans from "./4GPMEvent_internal.js"
var fns_4G_starttime, Parser_4G_endtime;
var totalTimeFromFNSto4GParser, fetch_fns_4G_received_files_beforeROP, fetch_fns_4G_received_files;
var buffer_time = 300;
let pmevent_4G_processingTime = 0;
//Method For validating 4G PM Events flow
export default function () {
    group('Validation of Registration of 4GPMEvents output Topics in Datacatalog and Kafka', function () {
        topic.TopicValidation(config.expected4GPMEventsTopicNames, 120, 1,config.expected4GRetentionPeriod,config.expected4Gpartitions);
    });


    fetch_fns_4G_received_files_beforeROP = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles, fns.pmevent_4G_topic_name, config.csr_ENM1, config.fns_job);
    //Subscription creation for 4G PM Event service
    subscription.Creation_of_PmeventSubscription(config.Subscription_4G_PMEvent,1);
    //subscription.Creation_of_PmeventSubscription(config.Subscription_4G_PMEvent_propretiary,1);
    //Getting Metric values before Hitting ROP
    fns.FNS_getMetricsValue_4Gpmevent_beforeRop();
    PMEvent_FileTransfer.pmevent_getMetricsValue_beforeRop();
    //Parser related assertions are still in design phase
    PMEvent_4G_Parser.parser_4GPmEvent_getMetricsValue_BeforeRop();
    sleep(250);// We have wait for some time post all services up and Subscription creation    
    var i = 1;
    //Method to Validate whether RESTSIM is able to generate and FNS Started receiving 4G PM Events files
    while (i < buffer_time) {
        console.log("Waiting for RestSim to generate 4G PM Events files.");
        fetch_fns_4G_received_files = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles, fns.pmevent_4G_topic_name, config.csr_ENM1, config.fns_job);
        let diff_fns_4G_received = fetch_fns_4G_received_files - fetch_fns_4G_received_files_beforeROP;
        if (diff_fns_4G_received > 0) { //To start Time when fns received first notification.
            fns_4G_starttime = Date.now();
            console.log("Timestamp - 4G PM Events Flow - FNS Microservice starts time in milliseconds  - ", fns_4G_starttime);
            break;
        }
        sleep(10);
        i = i + 9;
    }
    console.log("Timestamp - 4G PM Events Flow - Start Time of FNS has been captured");
    //Post FNS started receiving 4G Pm Events files then below method will check 4G PM Events flow
    while (pmevent_4G_processingTime <= config.timeoutLimit) {

        let fnsProcessedFiles_4G_Actual_count                = utils.get_fns_value_bytopic(fns.fnsProcessedFiles, fns.pmevent_4G_topic_name, config.csr_ENM1, config.fns_job);
        let fns_4G_expected_count                            = Number(fetch_fns_4G_received_files_beforeROP) + Number(config.Pmevent_4G_filecount);
        let PMEvent_4G_Filetransfer_ActualprocessedCount     = utils.get_metrics_total_replica(PMEvent_FileTransfer.pmeventProcessedFiles,config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);
        let pmevent_4G_Filetransfer_Expected_Processedcount  = Number(PMEvent_FileTransfer.pmeventProcessedFiles_BeforeROP) + Number(config.Pmevent_4G_filecount); // 10+ 10 = 20
        let PMEvent_4G_Filetransfer_Actual_sent              = utils.get_metrics_total_replica(PMEvent_FileTransfer.pmeventTransferedFiles,config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);
        let pmevent_4G_Filetransfer_Expected_sent            = Number(PMEvent_FileTransfer.pmeventTransferedFiles_BeforeROP) + Number(config.Pmevent_4G_filecount);
        let pmevent_4G_FT_produced_events                    = Number(utils.get_metrics_total_replica(filetrans.pmeventProducedevents,config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App))- Number(PMEvent_4G_Parser.pmevent_ft_produced_event_files_BeforeROP);
        let pmevent_4G_Parser_Actual_recieved                = utils.get_metrics_total_replica(PMEvent_4G_Parser.PMEventparser_4G_input_received,config.pm_event_4g_job,config.pm_event_4g_parser_app);
        let pmevent_4G_Parser_Expected_recieved              = Number(PMEvent_4G_Parser.pmevent_4G_Parser_Input_count_BeforeROP) + Number(config.produced_events_count);
        let pmevent_4G_Parser_drop_count_AfterROP            = utils.get_metrics_total_replica(PMEvent_4G_Parser.PMEventParser_4G_dropcount,config.pm_event_4g_job,config.pm_event_4g_parser_app);
        let pmevent_4G_Parser_Actual_Processed               = utils.get_metrics_total_replica(PMEvent_4G_Parser.PMEventparser_4G_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
        let pmevent_4G_Parser_Expected_Processed             = Number(PMEvent_4G_Parser.pmevent_4G_Parser_processed_count_BeforeROP)+ Number(config.standardTopic_4GParser_PublishedFiles);
        let pmevent_4G_Parser_Actual_Sent                    = utils.get_metrics_total_replica(PMEvent_4G_Parser.PMEventparser_4G_sent,config.pm_event_4g_job,config.pm_event_4g_parser_app);
        let pmevent_4G_Parser_Expected_Sent                  = Number(PMEvent_4G_Parser.pmevent_4G_Parser_Sent_count_BeforeROP)+ Number(config.produced_events_count);
        let pmevent_4G_Parser_Actual_Processed_Proprietary   = utils.get_metrics_total_replica(PMEvent_4G_Parser.PMEventparser_4G_Propretiary_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
        let pmevent_4G_Parser_Expected_Processed_Proprietary = Number(PMEvent_4G_Parser.pmevent_4G_Parser_propretiary_processed_count_BeforeROP)+ Number(config.propretiaryTopic_4GParser_PublishedFiles);

        console.log("===============4GPMEvents-FLow->Polling metrics to get Expected Value==============");
        console.log("Expected 4g Files from  RESTSIM                       :", config.Pmevent_4G_filecount);
        console.log("Acutal FNS Recieved 4G PM Event files from RESTSIM    :", fnsProcessedFiles_4G_Actual_count);
        console.log("Expected FNS Recieved 4G PM Event files from RESTSIM  :", fns_4G_expected_count);
        console.log("4G-FT Actual processed                                :", PMEvent_4G_Filetransfer_ActualprocessedCount);
        console.log("4G-FT Expected processed                              :", pmevent_4G_Filetransfer_Expected_Processedcount);
        console.log("4G-FT Actual Sent count                               :", PMEvent_4G_Filetransfer_Actual_sent);
        console.log("4G-FT Expected Sent count                             :", pmevent_4G_Filetransfer_Expected_sent);
        console.log("4G-FT Produced events                                 :", pmevent_4G_FT_produced_events);
        console.log("4G-Parser Actual Recieved count                       :", pmevent_4G_Parser_Actual_recieved);
        console.log("4G-Parser Expected Recieved count                     :", pmevent_4G_Parser_Expected_recieved);
        console.log("4G-Parser Actual Processed count to Standard Topic    :", pmevent_4G_Parser_Actual_Processed);
        console.log("4G-parser Expected Processed count to Standard Topic  :", pmevent_4G_Parser_Expected_Processed);
        console.log("4G-Parser Actual Processed count to Proprietary Topic    :", pmevent_4G_Parser_Actual_Processed_Proprietary);
        console.log("4G-parser Expected Processed count to Proprietary Topic  :", pmevent_4G_Parser_Expected_Processed_Proprietary);
        console.log("4G-Parser Number of events dropped                    :", pmevent_4G_Parser_drop_count_AfterROP);
        console.log("4G-Parser Actual Sent count                           :", pmevent_4G_Parser_Actual_Sent);
        console.log("===================================================================");
        //Validate Assertions when all expected files are transsferred and processed form RESTSIM to 4G-Parser
        if (fnsProcessedFiles_4G_Actual_count == fns_4G_expected_count && PMEvent_4G_Filetransfer_ActualprocessedCount == pmevent_4G_Filetransfer_Expected_Processedcount && PMEvent_4G_Filetransfer_Actual_sent == pmevent_4G_Filetransfer_Expected_sent && pmevent_4G_Parser_Actual_recieved == pmevent_4G_Parser_Expected_recieved && pmevent_4G_Parser_Actual_Processed == pmevent_4G_Parser_Expected_Processed && pmevent_4G_Parser_Actual_Sent == pmevent_4G_Parser_Expected_Sent && pmevent_4G_Parser_Actual_Processed_Proprietary == pmevent_4G_Parser_Expected_Processed_Proprietary) {
            Parser_4G_endtime = Date.now();
            console.log("Timestamp - 4G PM Events Flow - 4GParser Microservice end time in milliseconds  - ", Parser_4G_endtime);
            totalTimeFromFNSto4GParser = (Parser_4G_endtime - fns_4G_starttime) / 1000;
            console.log("Timestamp - Total time taken from FNS -> 4G-FT -> 4G-Parser in seconds :", totalTimeFromFNSto4GParser);
            console.log("The Actual and Expected Values are matched with RESTSIM count with 4G processed files,Testing started");
            microservices_Assertions_Timestamp_RateFactor();
            break;
        }
        //Validate Assertions- even  when all 4G PM Events files are not transsferred and processed by 4G Parser with in Scheduled time
        else if (pmevent_4G_processingTime == 590) {
            console.error("Either Actual or Expected Values are not same for 4G PMEvents Flow ,Testing started for 4G PMEvents flow. Please check the count Polling Metrics to get expected count values in logs");
            microservices_Assertions();
            break;
        }
        //checking FNS and 4G File Transfer and 4G Parser whether recieved and processed all expected files for every 10 seconds
        sleep(10);
        pmevent_4G_processingTime += 10;
    }
}

//Method for validating 4G PM Events flow Assertions
export function microservices_Assertions() {
    group("Validation of 4GPMEvents file Flow", function () {
        fns.FNS_getMetricsValue_4Gpmevent_afterRop();
        PMEvent_FileTransfer.pmevent_getMetricsValue_afterRop();
        PMEvent_4G_Parser.parser_4GPmEvent_getMetricsValue_AfterRop();
        group("Validation of Total TimeTaken for 4G PMEvents file flow", function () {
            check("Total time taken from  FNS -> 4G-FT -> 4G-Parser ", {
                ['RESTSIM sent files and processed files of microservices are different , timestamp can not be captured . Please verify the issue.']: (r) => Number(totalTimeFromFNSto4GParser) > 0,
            });
        });
    });
  content_Validation_4G();
}
export function microservices_Assertions_Timestamp_RateFactor() {
    group("Validation of 4GPMEvents file Flow", function () {
        fns.FNS_getMetricsValue_4Gpmevent_afterRop();
        PMEvent_FileTransfer.pmevent_getMetricsValue_afterRop();
        PMEvent_4G_Parser.parser_4GPmEvent_getMetricsValue_AfterRop();
        group("Validation of Total TimeTaken for 4G PMEvents file flow", function () {
            check("Time Taken", {
                ['Timestamp - Total time taken to parsing 4G PMEvents files from RESTSIM in seconds : '+Number(totalTimeFromFNSto4GParser)]: (r) => Number(totalTimeFromFNSto4GParser),

            });
        });
    });
    content_Validation_4G();
}


export function content_Validation_4G() {
    console.log("Started Validating Output Topic Message Content for 4G PM Events");
    //Required input parameters as Topic Name and Number of messages needs to be consumed and expected length and expected Headers
    ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_4G_FT, config.MessageCount, config.expectedLength_4G_FT, config.expected_headers_4G_FT);
    ContentValidation.validateContent_Kafkatopics(config.OutputTopic_4G_parser, config.pmevent_4G_publishedFiles, config.pmevent_4G_flowType);
    console.log("End of Validation of Output Topic Message Content for 4G PM Events");
}
