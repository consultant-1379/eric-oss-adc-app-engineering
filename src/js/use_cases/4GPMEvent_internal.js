import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as utils from "./utils.js";
import * as config from "./config.js";

export var pmeventProcessedFiles_BeforeROP, pmeventProcessedFiles_AfterROP;
export var pmeventTransferedFilesDataVolume_BeforeROP, pmeventTransferedFilesDataVolume_AfterROP;
export var pmeventFailedTransferFiles_BeforeROP, pmeventFailedTransferFiles_AfterROP;

export var pmeventTransferedFiles_BeforeROP, pmeventTransferedFiles_AfterROP;
export var pmeventProcessedFilesDataVolume_BeforeROP, pmeventProcessedFilesDataVolume_AfterROP;
export var pmeventProcessedFilesTimeTotal_BeforeROP, pmeventProcessedFilesTimeTotal_AfterROP ;

export var pmeventKfListenerProcessedTime_BeforeROP, pmeventKfListenerProcessedTime_AfterROP;
export var pmevent_kafka_count_BeforeROP,pmevent_kafka_count_AfterROP;
export var pmeventskippedFiles_BeforeROP,pmeventskippedFiles_AfterROP;

//4gpmevt metrics
export const pmeventProcessedFiles     = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:event_files_processed_total";
export const pmeventTransferedFiles    = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:num_successful_file_transfer_total";
export const pmeventFailedTransferFiles= utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:num_failed_file_transfer_total";

export const pmeventKafkaCount = utils.pm_server_baseUrl + "kafka_producer_topic_record_send_total";

//Following metrics are not for test assertions, Metric value are captured in logs for debug purpose .
export const pmeventTransferedFilesDataVolume     = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:transferred_file_data_volume";
export const pmeventProcessedFilesDataVolume     = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:processed_file_data_volume";
export const pmeventProcessedFilesTimeTotal    = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:processed_files_time_total_seconds_sum";

export const pmeventProducedevents           = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:total_event_produced_successfully_total";
export const pmeventskippedevents           = utils.pm_server_baseUrl + "eric_oss_4gpmevent_filetrans_proc:total_event_dropped_total";

// Metrics designed based on microservice spring.kafka.concurrency - Listeners

export const pmevent_kf_Listener_ProcessingTimeMetric_PrometheusMetric     ="spring_kafka_listener_seconds_sum{job='eric-oss-4gpmevent-filetrans-proc',result='success'}";
export const pmevent_kf_Listener_ProcessingTimeMetric_GasUrlMetric     = "spring_kafka_listener_seconds_sum%7Bapp_kubernetes_io_name%3D%27eric-oss-4gpmevent-filetrans-proc%27%2Cresult%3D%27success%27%7D&g0";

let metrics_4g={'pmeventProcessedFiles':pmeventProcessedFiles,'pmeventTransferedFiles':pmeventTransferedFiles,
                'pmeventFailedTransferFiles':pmeventFailedTransferFiles,'pmeventTransferedFilesDataVolume':pmeventTransferedFilesDataVolume,
                'pmeventProcessedFilesDataVolume':pmeventProcessedFilesDataVolume,'pmeventProcessedFilesTimeTotal':pmeventProcessedFilesTimeTotal,'pmeventKafkaCount':pmeventKafkaCount,'pmeventskippedevents':pmeventskippedevents};

// Method for getting values of each metric before hitting the ROP
export function pmevent_getMetricsValue_beforeRop(){
    let pmeventValuesBeforeROP={};
        for(const metric in metrics_4g){
            pmeventValuesBeforeROP[metrics_4g[metric]]=utils.get_metrics_total_replica(metrics_4g[metric],config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);
            }
        pmeventProcessedFiles_BeforeROP            = pmeventValuesBeforeROP[metrics_4g['pmeventProcessedFiles']];
        pmeventTransferedFiles_BeforeROP           = pmeventValuesBeforeROP[metrics_4g['pmeventTransferedFiles']];
        pmeventFailedTransferFiles_BeforeROP       = pmeventValuesBeforeROP[metrics_4g['pmeventFailedTransferFiles']];
        pmeventTransferedFilesDataVolume_BeforeROP = pmeventValuesBeforeROP[metrics_4g['pmeventTransferedFilesDataVolume']];
        pmeventProcessedFilesDataVolume_BeforeROP  = pmeventValuesBeforeROP[metrics_4g['pmeventProcessedFilesDataVolume']];
        pmeventProcessedFilesTimeTotal_BeforeROP   = pmeventValuesBeforeROP[metrics_4g['pmeventProcessedFilesTimeTotal']];
        pmevent_kafka_count_BeforeROP              = pmeventValuesBeforeROP[metrics_4g['pmeventKafkaCount']];
        pmeventskippedFiles_BeforeROP              = pmeventValuesBeforeROP[metrics_4g['pmeventskippedevents']];
        pmeventKfListenerProcessedTime_BeforeROP   = utils.processingTime_KafkaListeners(pmevent_kf_Listener_ProcessingTimeMetric_PrometheusMetric,pmevent_kf_Listener_ProcessingTimeMetric_GasUrlMetric);


        console.log("====================  4gpmevent metrics values Before ROP ====================================");
        console.log("BeforeROP - 4gpmevt - Event Files Processed  Count            :",pmeventProcessedFiles_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Successfull File transfer               :",pmeventTransferedFiles_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Failed Transferred Files                :",pmeventFailedTransferFiles_BeforeROP);
        console.log("BeforeROP - 4gpmevt - TransferredFilesDataVolume              :",pmeventTransferedFilesDataVolume_BeforeROP);
        console.log("BeforeROP - 4gpmevt - ProcessedFilesDataVolume                :",pmeventProcessedFilesDataVolume_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Microservice ProcessedFilesTimeTotal    :",pmeventProcessedFilesTimeTotal_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Microservice Skiped Total               :",pmeventskippedFiles_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Number of Events produced to kafka      :",pmevent_kafka_count_BeforeROP);
        console.log("BeforeROP - 4gpmevt - Kafka Listeners ProcessedFilesTimeTotal :",pmeventKfListenerProcessedTime_BeforeROP);
        console.log("===============================================================================================");
}
// Method for getting values of each metric after hitting the ROP
export function pmevent_getMetricsValue_afterRop(){
    let pmeventValuesAfterROP={};
    for(const metric in metrics_4g){
        pmeventValuesAfterROP[metrics_4g[metric]]=utils.get_metrics_total_replica(metrics_4g[metric],config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);
}
        pmeventProcessedFiles_AfterROP            = pmeventValuesAfterROP[metrics_4g['pmeventProcessedFiles']];
        pmeventTransferedFiles_AfterROP           = pmeventValuesAfterROP[metrics_4g['pmeventTransferedFiles']];
        pmeventFailedTransferFiles_AfterROP       = pmeventValuesAfterROP[metrics_4g['pmeventFailedTransferFiles']];
        pmeventTransferedFilesDataVolume_AfterROP = pmeventValuesAfterROP[metrics_4g['pmeventTransferedFilesDataVolume']];
        pmeventProcessedFilesDataVolume_AfterROP  = pmeventValuesAfterROP[metrics_4g['pmeventProcessedFilesDataVolume']];
        pmeventProcessedFilesTimeTotal_AfterROP   = pmeventValuesAfterROP[metrics_4g['pmeventProcessedFilesTimeTotal']];
        pmevent_kafka_count_AfterROP              = pmeventValuesAfterROP[metrics_4g['pmeventKafkaCount']];
        pmeventskippedFiles_AfterROP              = pmeventValuesAfterROP[metrics_4g['pmeventskippedevents']];
        pmeventKfListenerProcessedTime_AfterROP   = utils.processingTime_KafkaListeners(pmevent_kf_Listener_ProcessingTimeMetric_PrometheusMetric,pmevent_kf_Listener_ProcessingTimeMetric_GasUrlMetric);


        console.log("====================  4gpmevent metrics values After ROP ====================================");
        console.log("AfterROP - 4gpmevt - Event Files Processed  Count            :",pmeventProcessedFiles_AfterROP);
        console.log("AfterROP - 4gpmevt - Successfull File transfer               :",pmeventTransferedFiles_AfterROP);
        console.log("AfterROP - 4gpmevt - Failed Transferred Files                :",pmeventFailedTransferFiles_AfterROP);
        console.log("AfterROP - 4gpmevt - TransferredFilesDataVolume              :",pmeventTransferedFilesDataVolume_AfterROP);
        console.log("AfterROP - 4gpmevt - ProcessedFilesDataVolume                :",pmeventProcessedFilesDataVolume_AfterROP);
        console.log("AfterROP - 4gpmevt - Microservice ProcessedFilesTimeTotal    :",pmeventProcessedFilesTimeTotal_AfterROP);
        console.log("AfterROP - 4gpmevt - Number of Events produced to kafka      :",pmevent_kafka_count_AfterROP);
        console.log("AfterROP - 4gpmevt - Skipped Files Total                     :",pmeventskippedFiles_AfterROP);
        console.log("AfterROP - 4gpmevt - Kafka Listeners ProcessedFilesTimeTotal :",pmeventKfListenerProcessedTime_AfterROP);
        console.log("===============================================================================================");

    let diff_4gpmeventProcessedFiles            = pmeventProcessedFiles_AfterROP - pmeventProcessedFiles_BeforeROP ;
    let diff_4gpmeventTransferedFiles           = pmeventTransferedFiles_AfterROP - pmeventTransferedFiles_BeforeROP;
    let diff_4gpmeventFailedTransferFiles       = pmeventFailedTransferFiles_AfterROP - pmeventFailedTransferFiles_BeforeROP;
    let diff_4gpmeventTransferedFilesDataVolume = pmeventTransferedFilesDataVolume_AfterROP - pmeventTransferedFilesDataVolume_BeforeROP;
    let diff_4gpmeventProcessedFilesDataVolume  = pmeventProcessedFilesDataVolume_AfterROP - pmeventProcessedFilesDataVolume_BeforeROP;
    let diff_4gpmeventProcessedFilesTimeTotal   = pmeventProcessedFilesTimeTotal_AfterROP - pmeventProcessedFilesTimeTotal_BeforeROP;
    let diff_4gpmevent_Kafka_produced                     = pmevent_kafka_count_AfterROP - pmevent_kafka_count_BeforeROP;
    let diff_4gpmeventKfListenerProcessedTime   = pmeventKfListenerProcessedTime_AfterROP - pmeventKfListenerProcessedTime_BeforeROP;
    let diff_4gpmeventskippedevents             = pmeventskippedFiles_AfterROP - pmeventskippedFiles_BeforeROP;

    console.log("====================4gpmevent Metrics[AfterROP (-) BeforeROP]==========================");
    console.log("Difference - 4gpmevt - Event Files Processed  Count              :",diff_4gpmeventProcessedFiles);
    console.log("Difference - 4gpmevt - Successfull File transfer                 :",diff_4gpmeventTransferedFiles);
    console.log("Difference - 4gpmevt - Failed Transferred Files                  :",diff_4gpmeventFailedTransferFiles);
    console.log("Difference - 4gpmevt - TransferredFilesDataVolume                :",diff_4gpmeventTransferedFilesDataVolume);
    console.log("Difference - 4gpmevt - ProcessedFilesDataVolume                  :",diff_4gpmeventProcessedFilesDataVolume);
    console.log("Difference - 4gpmevt - Skipped Files                             :",diff_4gpmeventskippedevents);
    console.log("Difference - 4gpmevt - Microservice Processed Files TimeTotal    :",diff_4gpmeventProcessedFilesTimeTotal);
    console.log("Difference - 4gpmevt - Event Files Produced to Kafka             :",diff_4gpmevent_Kafka_produced);
    console.log("Difference - 4gpmevt - Kafka Listeners Processed Files TimeTotal :",diff_4gpmeventKfListenerProcessedTime);
    console.log("======================================================================================");

    //Method for validating all 4GPMevent flow Assertions
    group('Validation of 4G PM Event File Transfer flow Assertions', function() {
        check(pmeventProcessedFiles_AfterROP, {
            'Verify 4GPMEvent File Transfer is able to processed all expected files': (r) => Number(pmeventProcessedFiles_AfterROP) !== 0 && Number(pmeventProcessedFiles_BeforeROP) + Number(diff_4gpmeventProcessedFiles) == Number(pmeventProcessedFiles_AfterROP) && Number(diff_4gpmeventProcessedFiles) == config.Pmevent_4G_filecount,
            'Verify 4gpmevent File Transfer is able to successfully transfer the expected files': (r) => Number(pmeventTransferedFiles_AfterROP) !== 0 && Number(pmeventTransferedFiles_BeforeROP) + Number(diff_4gpmeventTransferedFiles) == Number(pmeventTransferedFiles_AfterROP) && Number(diff_4gpmeventTransferedFiles) == config.Pmevent_4G_filecount,
            'Verify 4gpmevent File Transfer is able to skip PI related events from sending to kafka': (r) => Number(pmeventskippedFiles_AfterROP) !== 0 && Number(diff_4gpmeventskippedevents) == config.Skipped_4G_events && Number(pmeventskippedFiles_BeforeROP) + Number(diff_4gpmeventskippedevents) == Number(pmeventskippedFiles_AfterROP),
            'Verify number of 4gpmevent File Transfer is failed to transfer files should  be zero': (r) => Number(pmeventFailedTransferFiles_AfterROP) == 0,
        });
    })
}