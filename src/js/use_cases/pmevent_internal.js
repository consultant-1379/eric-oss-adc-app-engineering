import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as utils from "./utils.js";
import * as config from "./config.js";

export var pmeventProcessedFiles_count_BeforeROP , pmeventTransferedFiles_count_BeforeROP , pmeventFailedTransferFiles_count_BeforeROP , pmeventProcessedTime_BeforeROP,ROP,pmeventFilesFromENM_count_BeforeROP;
export var pmeventEventReadTotal_BeforeROP, pmeventEventReadTotal_AfterROP,pmeventActiveSubscriptions_BeforeROP,pmeventActiveSubscriptions_AfterROP;
export var pmevent_kafka_count_BeforeROP_StandardTopic,pmevent_kafka_count_BeforeROP_NonStandardTopic,pmevent_kafka_count_AfterROP_StandardTopic,pmevent_kafka_count_AfterROP_NonStandardTopic;
export var kafka_topic_record_errorrate_BeforeROP_StandardTopic,kafka_topic_record_errortotal_BeforeROP_StandardTopic,kafka_topic_record_errorrate_AfterROP_StandardTopic,kafka_topic_record_errortotal_AfterROP_StandardTopic;
//5gpmevt metrics
export const pmeventProcessedFiles      = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc:event_files_processed_total";
export const pmeventTransferedFiles     = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc:num_successful_file_transfer_total";
export const pmeventFailedTransferFiles = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc:num_failed_file_transfer_total";
export const pmeventEventReadTotal      = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc:event_read_total";
export const pmeventActiveSubscriptions = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc";

export const pmeventKafkaCount_StandardTopic = utils.pm_server_baseUrl + "kafka_producer_topic_record_send_total%7Btopic%3D%27"+config.OutputTopic_5G+"%27%7D&g0";
export const pmeventKafkaCount_NonStandardTopic = utils.pm_server_baseUrl + "kafka_producer_topic_record_send_total%7Btopic%3D%27"+config.OutputTopic_5G_NonStandard+"%27%7D&g0";

/*
eric_oss_5gpmevt_filetx_proc:processed_files_time_total_seconds_sum - Metric not using for 5gpmevent ms processing time calculation instead
individual kafka listeners processing time average is considered.
*/

//rate at which events sent by a Kafka producer encounter errors related to specific topic
export const kafka_topic_record_errorrate_StandardTopic = utils.pm_server_baseUrl + "kafka_producer_topic_record_error_rate%7Btopic%3D%27"+config.OutputTopic_5G+"%27%7D&g0";
//total number of errors encountered by a Kafka producer related to specific topic
export const kafka_topic_record_errortotal_StandardTopic = utils.pm_server_baseUrl + "kafka_producer_topic_record_error_total%7Btopic%3D%27"+config.OutputTopic_5G+"%27%7D&g0";

// Metrics designed based on microservice spring.kafka.concurrency - Listeners
export const pmevent_ProcessingTimeMetric_PrometheusMetric = "spring_kafka_listener_seconds_sum{name=~'inputTopic5gEventKafkaListener.*',result='success'}";
export const pmevent_ProcessingTimeMetric_GasUrlMetric     = "spring_kafka_listener_seconds_sum%7Bname%3D~%27inputTopic5gEventKafkaListener.*%27%2Cresult%3D%27success%27%2Cservice_istio_secure%3D%27true%27%7D&g0";

let metrics_5g={'pmeventProcessedFiles':pmeventProcessedFiles,'pmeventTransferedFiles':pmeventTransferedFiles,'pmeventFailedTransferFiles':pmeventFailedTransferFiles,'pmeventEventReadTotal':pmeventEventReadTotal,'pmeventKafkaCount_StandardTopic':pmeventKafkaCount_StandardTopic,'pmeventKafkaCount_NonStandardTopic':pmeventKafkaCount_NonStandardTopic,'kafka_topic_record_errortotal_StandardTopic':kafka_topic_record_errortotal_StandardTopic,'kafka_topic_record_errorrate_StandardTopic':kafka_topic_record_errorrate_StandardTopic};

// Method for getting values of each metric before hitting the ROP
export function pmevent_getMetricsValue_beforeRop(){
    let pmeventValuesBeforeROP={};       //Mapping the value of metrics and utilise it for verification purpose in check.
        for(const metric in metrics_5g){
            pmeventValuesBeforeROP[metrics_5g[metric]]=utils.get_metrics_total_replica(metrics_5g[metric],config.PMEvent_5G_job,config.PMEvent_5G_app);
            }
        pmeventProcessedFiles_count_BeforeROP          = pmeventValuesBeforeROP[metrics_5g['pmeventProcessedFiles']];
        pmeventTransferedFiles_count_BeforeROP         = pmeventValuesBeforeROP[metrics_5g['pmeventTransferedFiles']];    ////Mapping values with respect to metrics
        pmeventFailedTransferFiles_count_BeforeROP     = pmeventValuesBeforeROP[metrics_5g['pmeventFailedTransferFiles']];
        pmeventProcessedTime_BeforeROP                 = utils.processingTime_KafkaListeners(pmevent_ProcessingTimeMetric_PrometheusMetric,pmevent_ProcessingTimeMetric_GasUrlMetric);
        pmeventEventReadTotal_BeforeROP                = pmeventValuesBeforeROP[metrics_5g['pmeventEventReadTotal']];
        pmevent_kafka_count_BeforeROP_StandardTopic    = Number(pmeventValuesBeforeROP[metrics_5g['pmeventKafkaCount_StandardTopic']]);
        pmevent_kafka_count_BeforeROP_NonStandardTopic = Number(pmeventValuesBeforeROP[metrics_5g['pmeventKafkaCount_NonStandardTopic']]);
        kafka_topic_record_errorrate_BeforeROP_StandardTopic  = Number(pmeventValuesBeforeROP[metrics_5g['kafka_topic_record_errorrate_StandardTopic']]);
        kafka_topic_record_errortotal_BeforeROP_StandardTopic = Number(pmeventValuesBeforeROP[metrics_5g['kafka_topic_record_errortotal_StandardTopic']]);

        console.log("====================  5gpmevent metrics values Before ROP ====================================");
        console.log("BeforeROP - 5gpmevt - Event Files Processed  Count      :",pmeventProcessedFiles_count_BeforeROP);
        console.log("BeforeROP - 5gpmevt - Successfull File transfer         :",pmeventTransferedFiles_count_BeforeROP);
        console.log("BeforeROP - 5gpmevt - Failed Processed Files            :",pmeventFailedTransferFiles_count_BeforeROP);
        console.log("BeforeROP - 5gpmevt - Processing Time                   :",pmeventProcessedTime_BeforeROP);
        console.log("BeforeROP - 5gpmevt - Event Read Total                  :",pmeventEventReadTotal_BeforeROP);
        console.log("BeforeROP - 5gpmevt - Number of Events produced to standard kafka topic       :",pmevent_kafka_count_BeforeROP_StandardTopic);
        console.log("BeforeROP - 5gpmevt - Number of Events produced to Non - standard kafka topic :",pmevent_kafka_count_BeforeROP_NonStandardTopic);
        console.log("BeforeROP - 5gpmevt - kafka topic record error rate count for StandardTopic   :",kafka_topic_record_errorrate_BeforeROP_StandardTopic);
        console.log("BeforeROP - 5gpmevt - kafka topic record error total count for StandardTopic  :",kafka_topic_record_errortotal_BeforeROP_StandardTopic);
        console.log("===============================================================================================");
}
// Method for getting values of each metric after hitting the ROP
export function pmevent_getMetricsValue_afterRop(){
    let pmeventValuesAfterROP={};       //Mapping the value of metrics and utilise it for verification purpose in check.
    for(const metric in metrics_5g){
        pmeventValuesAfterROP[metrics_5g[metric]]=utils.get_metrics_total_replica(metrics_5g[metric],config.PMEvent_5G_job,config.PMEvent_5G_app);
            //console.log(metric+"-->",pmeventValuesAfterROP[metrics_5g[metric]]);
       } //for-end
    let pmeventProcessedFiles_count_AfterROP      = pmeventValuesAfterROP[metrics_5g['pmeventProcessedFiles']]; 
    let pmeventTransferedFiles_count_AfterROP     = pmeventValuesAfterROP[metrics_5g['pmeventTransferedFiles']];      //convert an object to a string
    let pmeventFailedTransferFiles_count_AfterROP = pmeventValuesAfterROP[metrics_5g['pmeventFailedTransferFiles']];
    let pmeventProcessedTime_AfterROP             = utils.processingTime_KafkaListeners(pmevent_ProcessingTimeMetric_PrometheusMetric,pmevent_ProcessingTimeMetric_GasUrlMetric);
    pmeventEventReadTotal_AfterROP                = pmeventValuesAfterROP[metrics_5g['pmeventEventReadTotal']];
    pmevent_kafka_count_AfterROP_StandardTopic    = Number(pmeventValuesAfterROP[metrics_5g['pmeventKafkaCount_StandardTopic']]);
    pmevent_kafka_count_AfterROP_NonStandardTopic = Number(pmeventValuesAfterROP[metrics_5g['pmeventKafkaCount_NonStandardTopic']]);
    kafka_topic_record_errorrate_AfterROP_StandardTopic  = Number(pmeventValuesAfterROP[metrics_5g['kafka_topic_record_errorrate_StandardTopic']]);
    kafka_topic_record_errortotal_AfterROP_StandardTopic = Number(pmeventValuesAfterROP[metrics_5g['kafka_topic_record_errortotal_StandardTopic']]);

    console.log("========================AfterROP Value of 5gpmevt Metrics==============================");
    console.log("AfterROP - 5gpmevt - Event Files Processed  Count      :",pmeventProcessedFiles_count_AfterROP);
    console.log("AfterROP - 5gpmevt - Successfull File transfer         :",pmeventTransferedFiles_count_AfterROP);
    console.log("AfterROP - 5gpmevt - Failed Processed Files            :",pmeventFailedTransferFiles_count_AfterROP);
    console.log("AfterROP - 5gpmevt - Files from RESTSIM                :",Number(config.pmCelltracefilecount));
    console.log("AfterROP - 5gpmevt - Processing Time                   :",pmeventProcessedTime_AfterROP);
    console.log("AfterROP - 5gpmevt - Total Event Read/produced Total                       :",pmeventEventReadTotal_AfterROP);
    console.log("AfterROP - 5gpmevt - Number of Events produced to standard kafka topic     :",pmevent_kafka_count_AfterROP_StandardTopic);
    console.log("AfterROP - 5gpmevt - Number of Events produced to non standard kafka topic :",pmevent_kafka_count_AfterROP_NonStandardTopic);
    console.log("AfterROP - 5gpmevt - kafka topic record error rate count for StandardTopic   :",kafka_topic_record_errorrate_AfterROP_StandardTopic);
    console.log("AfterROP - 5gpmevt - kafka topic record error total count for StandardTopic  :",kafka_topic_record_errortotal_AfterROP_StandardTopic);

    console.log("=================================================================================");

    let Diff_5gpmevt_processed_files         = pmeventProcessedFiles_count_AfterROP - pmeventProcessedFiles_count_BeforeROP ;
    let Diff_5gpmevt_Successful_files        = pmeventTransferedFiles_count_AfterROP - pmeventTransferedFiles_count_BeforeROP;
    let Diff_5gpmevt_Failed_Transfer         = pmeventFailedTransferFiles_count_AfterROP - pmeventFailedTransferFiles_count_BeforeROP;
    let Diff_pmeventProcessedTime            = pmeventProcessedTime_AfterROP - pmeventProcessedTime_BeforeROP;
    let Diff_pmeventEventReadTotal           = pmeventEventReadTotal_AfterROP - pmeventEventReadTotal_BeforeROP;
    let Diff_Kafka_produced_standardTopic    = pmevent_kafka_count_AfterROP_StandardTopic   - pmevent_kafka_count_BeforeROP_StandardTopic;
    let Diff_Kafka_produced_NonStandardTopic = pmevent_kafka_count_AfterROP_NonStandardTopic   - pmevent_kafka_count_BeforeROP_NonStandardTopic;
    let Diff_kafka_topic_record_errorrate_StandardTopic = kafka_topic_record_errorrate_AfterROP_StandardTopic - kafka_topic_record_errorrate_BeforeROP_StandardTopic;
    let Diff_kafka_topic_record_errortotal_StandardTopic = kafka_topic_record_errortotal_AfterROP_StandardTopic - kafka_topic_record_errortotal_BeforeROP_StandardTopic;




    console.log("====================5gpmevent Metrics value in current ROP [AfterROP (-) BeforeROP]==========================");
    console.log("Difference - 5gpmevt - Event Files Processed  Count                  :",Diff_5gpmevt_processed_files);
    console.log("Difference - 5gpmevt - Successfull File transfer                     :",Diff_5gpmevt_Successful_files);
    console.log("Difference - 5gpmevt - Failed Processed Files                        :",Diff_5gpmevt_Failed_Transfer);
    console.log("Difference - 5gpmevt - Service Processing Time                       :",Diff_pmeventProcessedTime);
    console.log("Difference - 5gpmevt - Event Read/produced Total                     :",Diff_pmeventEventReadTotal);
    console.log("Difference - 5gpmevt - Event Files Produced to standard topic        :",Diff_Kafka_produced_standardTopic);
    console.log("Difference - 5gpmevt - Event Files Produced to Non Standard topic    :",Diff_Kafka_produced_NonStandardTopic);
    console.log("Difference - 5gpmevt - kafka topic record error rate count for StandardTopic     :",Diff_kafka_topic_record_errorrate_StandardTopic);
    console.log("Difference - 5gpmevt - kafka topic record error total count for StandardTopic    :",Diff_kafka_topic_record_errortotal_StandardTopic);
    console.log("======================================================================================");

    //Method for validating all PM Event flow Assertions
    group('Validation of 5GPMEvents Test Assertions in 5G Flow', function () {
        check(pmeventProcessedFiles_count_AfterROP, {
            'Verify 5G PMEvent File Transfer successfully transfer the all expected files': (r) => Number(pmeventTransferedFiles_count_AfterROP) !== 0 && Number(pmeventTransferedFiles_count_BeforeROP) + Number(config.pmCelltracefilecount) == Number(pmeventTransferedFiles_count_AfterROP),
            //'Verifying the after rop files count is more than before rop': (r) =>  Number(pmeventProcessedFiles_count_BeforeROP) < Number(pmeventProcessedFiles_count_AfterROP),
            'Verify 5G PMEvent File Transfer processed all expected files': (r) => Number(pmeventProcessedFiles_count_AfterROP) !== 0 && Number(pmeventProcessedFiles_count_BeforeROP) + Number(config.pmCelltracefilecount) == Number(pmeventProcessedFiles_count_AfterROP), //0+4===4
            'Verify there are no files that are 5G PMEvent File Transfer is failed to process ': (r) => Number(pmeventFailedTransferFiles_count_AfterROP) == 0,
            'Verify Number of total/read  messages produced by 5G PMEvent File Transfer ': (r) => Number(Diff_pmeventEventReadTotal) == Number(config.expected_5G_ReadTotal_Count),
            // As per kafka retry happens for failed events - Actual count could increase than expected. IDUN-113797
            'Verify Number of messages published messages to Standard topic by 5G PMEvent File Transfer ': (r) => Number(Diff_Kafka_produced_standardTopic) >= Number(config.standardTopic_5G_PublishedFiles),
            'Verify Number of messages published messages to Non-standard topic by 5G PMEvent File Transfer': (r) => Number(Diff_Kafka_produced_NonStandardTopic) == Number(config.nonStandardTopic_5G_PublishedFiles),
            'Verify rate at which events sent by a Kafka producer encounter errors should be zero for standard topic': (r) => Number(kafka_topic_record_errorrate_AfterROP_StandardTopic) == 0,
            'Verify total number of errors encountered by a Kafka producer should be zero for standard topic ': (r) => Number(kafka_topic_record_errortotal_AfterROP_StandardTopic) == 0,

        });
    });
}