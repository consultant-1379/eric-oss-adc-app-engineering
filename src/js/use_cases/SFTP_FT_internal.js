import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as utils from"./utils.js";
import * as config from "./config.js";
import * as fns from "./FNS_internal.js"


export var sftpInputTopic_count_BeforeROP,sftpOutputTopic_count_BeforeROP,sftpTransfedFiles_count_BeforeROP,sftpFilesFromENM_count_BeforeROP,sftpBDRUpload_count_BeforeROP,sftpBDRDataVolume_count_BeforeROP,sftpFailedBDRUpload_count_BeforeROP,sftpProcessedTime_BeforeROP;
export var sftpFailedOutputKFmessage_count_BeforeROP,sftpCounterfileDataVolume_count_BeforeROP,sftpFailedTransferFiles_count_BeforeROP;
export var sftpFilesFromENM_count_AfterROP,Diff_sftpBDRDataVolume_count,sftpKafka_replayed_BeforeRop,FNS_notification_received_BeforeROP;
export var sftp_kafka_count_BeforeROP,sftp_kafka_count_AfterROP;

export const sftpInputTopic           = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_input_kafka_messages_received_total";
export const sftpOutputTopic          = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_output_kafka_messages_produced_successfully_total";
export const sftpBDRUpload            = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_successful_bdr_uploads_total";
export const sftpTransfedFiles        = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_successful_file_transfer_total";
export const sftpFailedBDRUpload      = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_failed_bdr_uploads_total";
export const sftpFailedTransferFiles  = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_failed_file_transfer_total";
export const sftpFailedOutputKFmessage= utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_output_kafka_messages_failed_total";
export const sftpBDRDataVolume        = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:processed_bdr_data_volume_total";
export const sftpCounterfileDataVolume= utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:processed_counter_file_data_volume_total";
export const sftpKafkaReplayed        = utils.pm_server_baseUrl + "eric_oss_sftp_filetrans:num_input_kafka_messages_replayed_total"
export const sftp_KafkaCount            =  utils.pm_server_baseUrl + "kafka_producer_topic_record_send_total";

/*
eric_oss_sftp_filetrans:processed_counter_file_time_total_seconds_sum - Metric not using for SFTP-FT ms processing time calculation instead
individual kafka listeners processing time average is considered.
*/

export const sftpProcessedTimeKafkaListenerMetric_Prometheus   = "spring_kafka_listener_seconds_sum{job='eric-oss-sftp-filetrans',result='success'}";
export const sftpProcessedTimeKafkaListenerMetric_GasURL       = "spring_kafka_listener_seconds_sum%7Bkubernetes_name%3D%27eric-oss-sftp-filetrans%27%2Cresult%3D%27success%27%7D&g0";

let metrics_sftp={'sftpInputTopic':sftpInputTopic,'sftpOutputTopic':sftpOutputTopic,'sftpTransfedFiles':sftpTransfedFiles,'sftpBDRUpload':sftpBDRUpload,'sftpFailedBDRUpload':sftpFailedBDRUpload,'sftpFailedTransferFiles':sftpFailedTransferFiles,'sftpFailedOutputKFmessage':sftpFailedOutputKFmessage,'sftpBDRDataVolume':sftpBDRDataVolume,'sftpCounterfileDataVolume':sftpCounterfileDataVolume,'sftpKafkaReplayed':sftpKafkaReplayed,'sftp_KafkaCount':sftp_KafkaCount};

//Method for getting Metric Values before hitting the ROP
export function SFTP_FT_getMetricsValue_beforeRop(){
    let sftpValuesBeforeROP={};       //Mapping the value of metrics and utilise it for verification purpose in check.
        for(const metric in metrics_sftp){
                sftpValuesBeforeROP[metrics_sftp[metric]]=utils.get_metrics_total_replica(metrics_sftp[metric],config.sftp_job,config.sftp_app);
}
  //SFTP-FT Values BEFOREROP
  sftpInputTopic_count_BeforeROP             = sftpValuesBeforeROP[metrics_sftp['sftpInputTopic']];
  sftpOutputTopic_count_BeforeROP            = sftpValuesBeforeROP[metrics_sftp['sftpOutputTopic']];
  sftpTransfedFiles_count_BeforeROP          = sftpValuesBeforeROP[metrics_sftp['sftpTransfedFiles']];
  sftpBDRUpload_count_BeforeROP              = sftpValuesBeforeROP[metrics_sftp['sftpBDRUpload']];
  sftpFailedOutputKFmessage_count_BeforeROP  = sftpValuesBeforeROP[metrics_sftp['sftpFailedOutputKFmessage']];
  sftpFailedTransferFiles_count_BeforeROP    = sftpValuesBeforeROP[metrics_sftp['sftpFailedTransferFiles']];
  sftpFailedBDRUpload_count_BeforeROP        = sftpValuesBeforeROP[metrics_sftp['sftpFailedBDRUpload']];
  sftpCounterfileDataVolume_count_BeforeROP  = sftpValuesBeforeROP[metrics_sftp['sftpCounterfileDataVolume']];
  sftpBDRDataVolume_count_BeforeROP          = sftpValuesBeforeROP[metrics_sftp['sftpBDRDataVolume']];
  sftpProcessedTime_BeforeROP                = utils.processingTime_KafkaListeners(sftpProcessedTimeKafkaListenerMetric_Prometheus,sftpProcessedTimeKafkaListenerMetric_GasURL);
  sftpKafka_replayed_BeforeRop               = sftpValuesBeforeROP[metrics_sftp['sftpKafkaReplayed']]
  FNS_notification_received_BeforeROP    = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,"sftp-filetrans","enm1",config.fns_job);
  sftp_kafka_count_BeforeROP              = sftpValuesBeforeROP[metrics_sftp['sftp_KafkaCount']];

  console.log("==================== SFTP-FT values Before ROP ==============================================")
  console.log("BeforeROP - SFTP-FT - Input kafka Message Count        :",sftpInputTopic_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Output Kafka Message Count       :",sftpOutputTopic_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Successfull File Transfer        :",sftpTransfedFiles_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Successfull BDR Upload Count     :",sftpBDRUpload_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Failed SFTP-Transfer Count       :",sftpFailedTransferFiles_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Failed BDR Upload Count          :",sftpFailedBDRUpload_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Failed output kf Message Count   :",sftpFailedOutputKFmessage_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Counterfile Volume Count         :",sftpCounterfileDataVolume_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Replay Count                     :",sftpKafka_replayed_BeforeRop);
  console.log("BeforeROP - SFTP-FT - BDR Volume Count                 :",sftpBDRDataVolume_count_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Processing Time                  :",sftpProcessedTime_BeforeROP);
  console.log("BeforeROP - SFTP-FT - Number of Events produced to kafka:",sftp_kafka_count_BeforeROP);    
  console.log("===============================================================================================");

}
//Method for getting Metric Values after hitting the ROP
export function SFTP_FT_getMetricsValue_afterROP(){
    let sftpValuesAfterROP={};       //Mapping the value of metrics and utilise it for verification purpose in check.
        for(const metric in metrics_sftp){
            sftpValuesAfterROP[metrics_sftp[metric]]=utils.get_metrics_total_replica(metrics_sftp[metric],config.sftp_job,config.sftp_app);
}

  //SFTP-FT Values AFTERROP
  sftpFilesFromENM_count_AfterROP              = config.pmStatsfilecount;
  let sftpInputTopic_count_AfterROP            = sftpValuesAfterROP[metrics_sftp['sftpInputTopic']];
  let sftpOutputTopic_count_AfterROP           = sftpValuesAfterROP[metrics_sftp['sftpOutputTopic']];
  let sftpTransfedFiles_count_AfterROP         = sftpValuesAfterROP[metrics_sftp['sftpTransfedFiles']];
  let sftpBDRUpload_count_AfterROP             = sftpValuesAfterROP[metrics_sftp['sftpBDRUpload']];
  let sftpFailedTransferFiles_count_AfterROP   = sftpValuesAfterROP[metrics_sftp['sftpFailedTransferFiles']];
  let sftpFailedBDRUpload_count_AfterROP       = sftpValuesAfterROP[metrics_sftp['sftpFailedBDRUpload']];
  let sftpFailedOutputKFmessage_count_AfterROP = sftpValuesAfterROP[metrics_sftp['sftpFailedOutputKFmessage']];
  let sftpBDRDataVolume_count_AfterROP         = sftpValuesAfterROP[metrics_sftp['sftpBDRDataVolume']];
  let sftpCounterfileDataVolume_count_AfterROP = sftpValuesAfterROP[metrics_sftp['sftpCounterfileDataVolume']];
  let sftpProcessedTime_AfterROP               = utils.processingTime_KafkaListeners(sftpProcessedTimeKafkaListenerMetric_Prometheus,sftpProcessedTimeKafkaListenerMetric_GasURL);
  let sftpKafka_replayed_AfterRop               = sftpValuesAfterROP[metrics_sftp['sftpKafkaReplayed']]
  let FNS_notification_received_AfterROP       = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,"sftp-filetrans","enm1",config.fns_job);
  let sftp_kafka_count_AfterROP                  = sftpValuesAfterROP[metrics_sftp['sftp_KafkaCount']];

             // Verifying BDR,input topic, output topic, successfull sftp transfer should be same
             let Diff_sftpInputTopic_count           = sftpInputTopic_count_AfterROP - sftpInputTopic_count_BeforeROP;
             let Diff_sftpOutputTopic_count          = sftpOutputTopic_count_AfterROP - sftpOutputTopic_count_BeforeROP;
             let Diff_sftpTransfedFiles_count        = sftpTransfedFiles_count_AfterROP - sftpTransfedFiles_count_BeforeROP;
             let Diff_sftpBDRUpload_count            = sftpBDRUpload_count_AfterROP - sftpBDRUpload_count_BeforeROP;
             //let Diff_sftpFilesFromENM_count         = sftpFilesFromENM_count_AfterROP - sftpFilesFromENM_count_BeforeROP;
             let Diff_sftpFailedOutputKFmessage_count= Number(sftpFailedOutputKFmessage_count_AfterROP)-Number(sftpFailedOutputKFmessage_count_BeforeROP);
             let Diff_sftpFailedBDRUpload_count      = Number(sftpFailedBDRUpload_count_AfterROP)-Number(sftpFailedBDRUpload_count_BeforeROP);
             let Diff_sftpFailedTransferFiles_count  = Number(sftpFailedTransferFiles_count_AfterROP)-Number(sftpFailedTransferFiles_count_BeforeROP);
             let Diff_sftpCounterfileDataVolume_count = sftpCounterfileDataVolume_count_AfterROP - sftpCounterfileDataVolume_count_BeforeROP;
             Diff_sftpBDRDataVolume_count         = sftpBDRDataVolume_count_AfterROP - sftpBDRDataVolume_count_BeforeROP;
             let Diff_sftpProcessedTime               = sftpProcessedTime_AfterROP - sftpProcessedTime_BeforeROP;
             let Diff_sftpkafka_replayed            = sftpKafka_replayed_AfterRop - sftpKafka_replayed_BeforeRop;
             let Diff_FNS_notification_received     = FNS_notification_received_AfterROP - FNS_notification_received_BeforeROP;
             let Diff_sftp_Kafka_produced           = sftp_kafka_count_AfterROP - sftp_kafka_count_BeforeROP;

             console.log("====================SFTP-FT Metrics[AfterROP (-) BeforeROP]==========================");
             console.log("Difference - Input kafka Message Count        :",Diff_sftpInputTopic_count);
             console.log("Difference - Output Kafka Message Count       :",Diff_sftpOutputTopic_count);
             console.log("Difference - Successfull File Transfer        :",Diff_sftpTransfedFiles_count);
             console.log("Difference - Successfull BDR Upload Count     :",Diff_sftpBDRUpload_count);
             console.log("Difference - Failed SFTP-Transfer Count       :",Diff_sftpFailedTransferFiles_count);
             console.log("Difference - Failed BDR Upload Count          :",Diff_sftpFailedBDRUpload_count);
             console.log("Difference - Failed output kf Message Count   :",Diff_sftpFailedOutputKFmessage_count);
             console.log("Difference - Counterfile volume count         :",Diff_sftpCounterfileDataVolume_count);
             console.log("Difference - BDR Volume count                 :",Diff_sftpBDRDataVolume_count);
             console.log("Difference - SFTP-FT Processing time          :",Diff_sftpProcessedTime);
             console.log("Difference - SFTP-FT Replayed                 :",Diff_sftpkafka_replayed);
             console.log("Difference - FNS notification received        :",Diff_FNS_notification_received);
             console.log("Difference - Event Files Produced to Kafka     :",Diff_sftp_Kafka_produced);
             console.log("===================================================================================");

             let optionsfile = `${__ENV.OPTIONS_FILE}`;
             if (optionsfile == "/resources/config/ps.options.json"){ 
                group('Validation of SFTP-FT Test Assertions in PmMStats flow', function() {
                    check(sftpFailedBDRUpload_count_AfterROP, {
                        'Verify Input topic able to receive notification from FNS':(r) => Number(sftpInputTopic_count_AfterROP)!==0 && Number(sftpInputTopic_count_BeforeROP)- Number(Diff_sftpkafka_replayed)+Number(sftpFilesFromENM_count_AfterROP)<=Number(sftpInputTopic_count_AfterROP) - Number(Diff_sftpkafka_replayed),
                        'Verify expected notification send through Output Topic ':(r) => Number(sftpOutputTopic_count_AfterROP)!==0 && Number(sftpOutputTopic_count_BeforeROP)+Number(sftpFilesFromENM_count_AfterROP)<=Number(sftpOutputTopic_count_AfterROP) && Number(Diff_FNS_notification_received) == Number(Diff_sftpOutputTopic_count),
                        'Verify pmstats Files Downloaded successfully':(r) => Number(sftpTransfedFiles_count_AfterROP)!==0 && Number(sftpTransfedFiles_count_BeforeROP)- Number(Diff_sftpkafka_replayed)+Number(sftpFilesFromENM_count_AfterROP)<=Number(sftpTransfedFiles_count_AfterROP)-Number(Diff_sftpkafka_replayed),
                        'Verify pmstats files Uploaded to BDR-minio':(r) => Number(sftpBDRUpload_count_AfterROP)!==0 && Number(sftpBDRUpload_count_BeforeROP)- Number(Diff_sftpkafka_replayed) + Number(sftpFilesFromENM_count_AfterROP)<=Number(sftpBDRUpload_count_AfterROP)-Number(Diff_sftpkafka_replayed),
                        'Verify input topic,output topic ,bdr upload count should be same' : (r) => Diff_sftpInputTopic_count == Diff_sftpOutputTopic_count && Diff_sftpInputTopic_count == Diff_sftpTransfedFiles_count && Diff_sftpInputTopic_count == Diff_sftpBDRUpload_count && Diff_sftpOutputTopic_count==Diff_sftpBDRUpload_count && Diff_sftpOutputTopic_count==Diff_sftpBDRUpload_count,
                        'Verify Failed Output topic should  be zero' : (r) => Diff_sftpFailedOutputKFmessage_count === 0,
                        'Verify Failed BDR upload should  be zero' : (r) => Diff_sftpFailedBDRUpload_count === 0,
                        'Verify Failed SFTP Download should  be zero' : (r) => Diff_sftpFailedTransferFiles_count === 0,
                        'Verify Counterfile Volume ' : (r) => Diff_sftpCounterfileDataVolume_count === Diff_sftpBDRDataVolume_count,
                         });
                     });
             }
             else{
                group('Validation of SFTP-FT Test Assertions in PmMStats flow', function() {
                    check(sftpFailedBDRUpload_count_AfterROP, {
                        'Verify Input topic able to receive notification from FNS':(r) => Number(sftpInputTopic_count_AfterROP)!==0 && Number(sftpInputTopic_count_BeforeROP)+Number(sftpFilesFromENM_count_AfterROP)- Number(Diff_sftpkafka_replayed)+Number(config.EBSN_filecount)===Number(sftpInputTopic_count_AfterROP) - Number(Diff_sftpkafka_replayed),
                        'Verify expected notification send through Output Topic ':(r) => Number(sftpOutputTopic_count_AfterROP)!==0 && Number(sftpOutputTopic_count_BeforeROP)+Number(sftpFilesFromENM_count_AfterROP)+Number(config.EBSN_filecount)===Number(sftpOutputTopic_count_AfterROP),
                        'Verify pmstats Files Downloaded successfully':(r) => Number(sftpTransfedFiles_count_AfterROP)!==0 && Number(sftpTransfedFiles_count_BeforeROP)- Number(Diff_sftpkafka_replayed)+Number(sftpFilesFromENM_count_AfterROP)+Number(config.EBSN_filecount)===Number(sftpTransfedFiles_count_AfterROP) - Number(Diff_sftpkafka_replayed),
                        'Verify pmstats files Uploaded to BDR-minio':(r) => Number(sftpBDRUpload_count_AfterROP)!==0 && Number(sftpBDRUpload_count_BeforeROP)- Number(Diff_sftpkafka_replayed)+Number(sftpFilesFromENM_count_AfterROP)+Number(config.EBSN_filecount)===Number(sftpBDRUpload_count_AfterROP) - Number(Diff_sftpkafka_replayed),
                        'Verify input topic,output topic ,bdr upload count should be same' : (r) => Diff_sftpInputTopic_count == Diff_sftpOutputTopic_count && Diff_sftpInputTopic_count == Diff_sftpTransfedFiles_count && Diff_sftpInputTopic_count == Diff_sftpBDRUpload_count && Diff_sftpOutputTopic_count==Diff_sftpBDRUpload_count && Diff_sftpOutputTopic_count==Diff_sftpBDRUpload_count,
                        'Verify Failed Output topic should  be zero' : (r) => Diff_sftpFailedOutputKFmessage_count === 0,
                        'Verify Failed BDR upload should  be zero' : (r) => Diff_sftpFailedBDRUpload_count === 0,
                        'Verify Failed SFTP Download should  be zero' : (r) => Diff_sftpFailedTransferFiles_count === 0,
                        'Verify Counterfile Volume ' : (r) => Diff_sftpCounterfileDataVolume_count === Diff_sftpBDRDataVolume_count,
                         });
                     }); 
                    }            
}








