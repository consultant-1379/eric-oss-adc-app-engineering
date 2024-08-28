import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';

import * as SFTP from"./SFTP_FT_internal.js";
import * as utils from "./utils.js";
import * as config from"./config.js";
import * as topicvalidation from "./OutputTopic_Validation.js"


var parser_Inputkafka_Count_BeforeROP,parser_BDRDownload_Count_BeforeROP ,parser_FailedBDRDownload_Count_BeforeROP ,parser_ParsedFailed_Count_BeforeROP,parser_OutputTopic_Count_BeforeROP,parser_ProcessedTime_Total_BeforeROP,parser_EBSNParsedSuccessful_Count_BeforeROP,parser_EBSNParsedFailed_Count_BeforeROP;
var configurator_RanSchemasUpload_Total_BeforeROP,parser_SchemaNotification_MessageTotal_BeforeROP,parser_SchemaDownloads_Total_BeforeROP,configurator_EBSNSchemasUpload_Total_BeforeROP;
var parser_cRANParsed_Count_BeforeROP,parser_cRAN_OutputTopic_total_BeforeROP,parser_cRAN_Failed_parsed_files_BeforeROP,parser_cRAN_OutputTopic_CUCP_BeforeROP,parser_cRAN_OutputTopic_CUUP_BeforeROP,parser_cRAN_OutputTopic_DU_BeforeROP;

export var parser_ParsedSuccessful_Count_BeforeROP,parser_Inputkafka_Count_BeforeROP;

export var ranparser_kafka_count_ebsn_BeforeROP,ranparser_kafka_count_ebsn_AfterROP;
export var ranparser_kafka_count_logbook_BeforeROP,ranparser_kafka_count_logbook_AfterROP;
export var ranparser_kafka_count_lte_BeforeROP,ranparser_kafka_count_lte_AfterROP;
export var ranparser_kafka_count_nr_BeforeROP,ranparser_kafka_count_nr_AfterROP;
export var ranparser_kafka_count_Total_BeforeROP,ranparser_kafka_count_Total_AfterROP;

export const pmparserInputkafkaReceived =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_num_input_kafka_messages_received_total";
const configuratorRanSchemasUploadTotal =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_configurator_num_avro_schema_register_sr_ran_total";
const configuratorEBSNSchemasUploadTotal =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_configurator_num_avro_schema_register_into_sr_ebsn_total";
const pmparserSchemaNotificationMessageTotal =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_avro_schema_details_available_notification_message_total";
const pmparserSchemaDownloadsTotal =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_avro_schema_download_sr_total";
const pmparserSuccessfulBDRDownload          =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_successful_bdr_downloads_total";
const pmparserFailedBDRDownload              =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_failed_bdr_downloads_total";
export const pmparserPMounterFilesSuccessfulParsed  =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_parsed_files_total_successfully_total";
const pmparserPMcounterFilesFailedParsed     =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_parser_files_failed_total";
export const pmparserPMcounerFilesPublishOutputTopic=  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_output_kafka_messages_produced_successfully_total";
export const ranparser_KafkaCount              =  utils.pm_server_baseUrl + "kafka_producer_topic_record_send_total";

// RAN metrics for EBSN
export const parserEBSNFilesSuccessfulParsed  =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_parsed_files_ebsn_successfully_total";
export const pmparserEBSNFilesFailedParsed     =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_ebsn_parser_files_failed_total";
/*
eric_oss_3gpp_parser_processed_counter_files_time_total_seconds_sum - Metric not using for ran parser ms processing time calculation instead
individual kafka listeners processing average time is considered.
*/

//NON-TLS
const pmparserProcessedTimeTotalkafkaListenerMetric_PrometheusMetric  = "spring_kafka_listener_seconds_sum{job='eric-oss-3gpp-pm-xml-ran-parser',name='3gpp-PM-XML-Parser-Notification-0',result='success'}";
const ranparser_KafkaCount_ebsn_PrometheusMetric ="kafka_producer_topic_record_send_total{topic='eric-oss-3gpp-pm-xml-ran-parser-ebsn'}";
const ranparser_KafkaCount_logbook_PrometheusMetric ="kafka_producer_topic_record_send_total{topic='eric-oss-3gpp-pm-xml-ran-parser-logbook'}";
const ranparser_KafkaCount_lte_PrometheusMetric ="kafka_producer_topic_record_send_total{topic='eric-oss-3gpp-pm-xml-ran-parser-lte'}";
const ranparser_KafkaCount_nr_PrometheusMetric ="kafka_producer_topic_record_send_total{topic='eric-oss-3gpp-pm-xml-ran-parser-nr'}";

//TLS
const pmparserProcessedTimeTotalkafkaListenerMetric_GasUrlMetric  = "spring_kafka_listener_seconds_sum%7Bkubernetes_name%3D%27eric-oss-3gpp-pm-xml-ran-parser%27%2Cname%3D~%273gpp-PM-XML-Parser-Notification-0%27%2Cresult%3D%27success%27%7D&g0";
const ranparser_KafkaCount_ebsn_GasUrlMetric="kafka_producer_topic_record_send_total%7Btopic%3D%22eric-oss-3gpp-pm-xml-ran-parser-ebsn%22%7D&g0";
const ranparser_KafkaCount_logbook_GasUrlMetric="kafka_producer_topic_record_send_total%7Btopic%3D%22eric-oss-3gpp-pm-xml-ran-parser-logbook%22%7D&g0";
const ranparser_KafkaCount_lte_GasUrlMetric="kafka_producer_topic_record_send_total%7Btopic%3D%22eric-oss-3gpp-pm-xml-ran-parser-lte%22%7D&g0";
const ranparser_KafkaCount_nr_GasUrlMetric="kafka_producer_topic_record_send_total%7Btopic%3D%22eric-oss-3gpp-pm-xml-ran-parser-nr%22%7D&g0";

//cRAN metrics

const pmparsercRANparsedSuccessful        = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_cran_parsed_files_successfully_total";
const pmparsercRANOutputKafkamessage      = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_output_kafka_messages_produced_successfully_cran_total";
const pmparsercRANFailedParsedFiles       = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_cran_parser_files_failed_total";
const pmparsercRANOutputKafkamessage_CUCP = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_output_kafka_messages_produced_successfully_cucp_total"
const pmparsercRANOutputKafkamessage_CUUP = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_output_kafka_messages_produced_successfully_cuup_total"
const pmparsercRANOutputKafkamessage_DU   = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_output_kafka_messages_produced_successfully_du_total"

let metrics_Parser={'pmparserInputkafkaReceived':pmparserInputkafkaReceived,'pmparserSuccessfulBDRDownload':pmparserSuccessfulBDRDownload,
                    'pmparserPMounterFilesSuccessfulParsed':pmparserPMounterFilesSuccessfulParsed,
                    'pmparserPMcounterFilesFailedParsed':pmparserPMcounterFilesFailedParsed,
                    'pmparserPMcounerFilesPublishOutputTopic':pmparserPMcounerFilesPublishOutputTopic,
                    'pmparserSchemaNotificationMessageTotal':pmparserSchemaNotificationMessageTotal,
                    'pmparserSchemaDownloadsTotal':pmparserSchemaDownloadsTotal,
                    'configuratorRanSchemasUploadTotal':configuratorRanSchemasUploadTotal,
                    'configuratorEBSNSchemasUploadTotal':configuratorEBSNSchemasUploadTotal,
                    'pmparserEBSNFilesFailedParsed':pmparserEBSNFilesFailedParsed,
                    'parserEBSNFilesSuccessfulParsed':parserEBSNFilesSuccessfulParsed,
                    'pmparsercRANparsedSuccessful':pmparsercRANparsedSuccessful,
                    'pmparsercRANOutputKafkamessage':pmparsercRANOutputKafkamessage,
                    'pmparsercRANFailedParsedFiles' : pmparsercRANFailedParsedFiles,
                    'pmparsercRANOutputKafkamessage_CUCP':pmparsercRANOutputKafkamessage_CUCP,
                    'pmparsercRANOutputKafkamessage_CUUP':pmparsercRANOutputKafkamessage_CUUP,
                    'pmparsercRANOutputKafkamessage_DU':pmparsercRANOutputKafkamessage_DU,
                    'ranparser_KafkaCount' :ranparser_KafkaCount};

//Method for getting Metric Values before hitting the ROP
export function parser_getMetricsValue_BeforeRop(){
    parser_Inputkafka_Count_BeforeROP               = utils.get_metrics_total_replica(pmparserInputkafkaReceived,config.Ran_parser_job,config.Ran_parser_app);
    parser_BDRDownload_Count_BeforeROP              = utils.get_metrics_total_replica(pmparserSuccessfulBDRDownload,config.Ran_parser_job,config.Ran_parser_app);
    parser_FailedBDRDownload_Count_BeforeROP        = utils.get_metrics_total_replica(pmparserFailedBDRDownload,config.Ran_parser_job,config.Ran_parser_app);
    parser_ParsedSuccessful_Count_BeforeROP         = utils.get_metrics_total_replica(pmparserPMounterFilesSuccessfulParsed,config.Ran_parser_job,config.Ran_parser_app);
    parser_ParsedFailed_Count_BeforeROP             = utils.get_metrics_total_replica(pmparserPMcounterFilesFailedParsed,config.Ran_parser_job,config.Ran_parser_app);
    parser_OutputTopic_Count_BeforeROP              = utils.get_metrics_total_replica(pmparserPMcounerFilesPublishOutputTopic,config.Ran_parser_job,config.Ran_parser_app);
    parser_ProcessedTime_Total_BeforeROP            = utils.processingTime_KafkaListeners(pmparserProcessedTimeTotalkafkaListenerMetric_PrometheusMetric,pmparserProcessedTimeTotalkafkaListenerMetric_GasUrlMetric);
    parser_EBSNParsedSuccessful_Count_BeforeROP     = utils.get_metrics_total_replica(parserEBSNFilesSuccessfulParsed,config.Ran_parser_job,config.Ran_parser_app);
    parser_EBSNParsedFailed_Count_BeforeROP         = utils.get_metrics_total_replica(pmparserEBSNFilesFailedParsed,config.Ran_parser_job,config.Ran_parser_app);
    configurator_RanSchemasUpload_Total_BeforeROP   = utils.get_valueFromMetrics_resultIndexOne(configuratorRanSchemasUploadTotal);
    configurator_EBSNSchemasUpload_Total_BeforeROP  = utils.get_valueFromMetrics_resultIndexOne(configuratorEBSNSchemasUploadTotal);
    parser_SchemaNotification_MessageTotal_BeforeROP= utils.get_valueFromMetrics_resultIndexOne(pmparserSchemaNotificationMessageTotal);
    parser_SchemaDownloads_Total_BeforeROP          = utils.get_valueFromMetrics_resultIndexOne(pmparserSchemaDownloadsTotal);
    parser_cRANParsed_Count_BeforeROP               = utils.get_metrics_total_replica(pmparsercRANparsedSuccessful,config.Ran_parser_job,config.Ran_parser_app);
    parser_cRAN_OutputTopic_total_BeforeROP         = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage,config.Ran_parser_job,config.Ran_parser_app);
    parser_cRAN_Failed_parsed_files_BeforeROP       = utils.get_metrics_total_replica(pmparsercRANFailedParsedFiles,config.Ran_parser_job,config.Ran_parser_app);
    parser_cRAN_OutputTopic_CUCP_BeforeROP          = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_CUCP,config.Ran_parser_job,config.Ran_parser_app)
    parser_cRAN_OutputTopic_CUUP_BeforeROP          = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_CUUP,config.Ran_parser_job,config.Ran_parser_app)
    parser_cRAN_OutputTopic_DU_BeforeROP            = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_DU,config.Ran_parser_job,config.Ran_parser_app)

    ranparser_kafka_count_ebsn_BeforeROP            = utils.get_service_topic_count(ranparser_KafkaCount_ebsn_GasUrlMetric,ranparser_KafkaCount_ebsn_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    ranparser_kafka_count_logbook_BeforeROP         = utils.get_service_topic_count(ranparser_KafkaCount_logbook_GasUrlMetric,ranparser_KafkaCount_logbook_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    ranparser_kafka_count_lte_BeforeROP             = utils.get_service_topic_count(ranparser_KafkaCount_lte_GasUrlMetric,ranparser_KafkaCount_lte_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    ranparser_kafka_count_nr_BeforeROP              = utils.get_service_topic_count(ranparser_KafkaCount_nr_GasUrlMetric,ranparser_KafkaCount_nr_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    ranparser_kafka_count_Total_BeforeROP           = utils.get_metrics_total_replica(ranparser_KafkaCount,config.Ran_parser_job,config.Ran_parser_app);

    console.log("====================  3GPP Processed metric values Before ROP ====================================");
    //console.log("Inital number of files queried From stub to SFTP-FT        :",SFTP.sftpFilesFromENM_count_BeforeROP);
    console.log("Initial number of files input kafka message received count :",parser_Inputkafka_Count_BeforeROP);
    console.log("Initial number of BDR download files                       :",parser_BDRDownload_Count_BeforeROP);
    console.log("Initial number of failed BDR downloaded files              :",parser_FailedBDRDownload_Count_BeforeROP);
    console.log("Initial number of parsed successful count                  :",parser_ParsedSuccessful_Count_BeforeROP);
    console.log("Initial number of parsed Failed count                      :",parser_ParsedFailed_Count_BeforeROP);
    console.log("Initial number of files published to output topic          :",parser_OutputTopic_Count_BeforeROP);
    console.log("pm-parser processing time before ROP                       :",parser_ProcessedTime_Total_BeforeROP);
    console.log("Configurator upload RAN files to Schema Registry total before ROP      :",configurator_RanSchemasUpload_Total_BeforeROP);
    console.log("Configurator upload EBSN files to Schema Registry total before ROP      :",configurator_EBSNSchemasUpload_Total_BeforeROP);
    console.log("Initial number of EBSN_files_parsed successful count                  :",parser_EBSNParsedSuccessful_Count_BeforeROP);
    console.log("Initial number of EBSN_files_parsed Failed count                      :",parser_EBSNParsedFailed_Count_BeforeROP);
    console.log("Initial Avro Schema available notification total before ROP        :",parser_SchemaNotification_MessageTotal_BeforeROP);
    console.log("Initial Avro Schema Downloads total before ROP                  :",parser_SchemaDownloads_Total_BeforeROP);
    console.log("Initial cRAN parsed files before ROP                        :",parser_cRANParsed_Count_BeforeROP);
    console.log("Initial cRAN output topic messages before ROP               :",parser_cRAN_OutputTopic_total_BeforeROP);
    console.log("Initial cRAN Failed Parsed files before ROP               :",parser_cRAN_Failed_parsed_files_BeforeROP);
    console.log("Initial cRAN CUCP output topic messages before ROP        :",parser_cRAN_OutputTopic_CUCP_BeforeROP);
    console.log("Initial cRAN CUUP output topic messages before ROP        :",parser_cRAN_OutputTopic_CUUP_BeforeROP);
    console.log("Initial cRAN DU output topic messages before ROP          :",parser_cRAN_OutputTopic_DU_BeforeROP);
    console.log("Number of EBSN Events produced to kafka                    :",ranparser_kafka_count_ebsn_BeforeROP);
    console.log("Number of LOGBOOK Events produced to kafka                 :",ranparser_kafka_count_logbook_BeforeROP);
    console.log("Number of LTE Events produced to kafka                     :",ranparser_kafka_count_lte_BeforeROP);
    console.log("Number of NR Events produced to kafka                      :",ranparser_kafka_count_nr_BeforeROP);
    console.log("Number of Total Events produced to kafka                   :",ranparser_kafka_count_Total_BeforeROP);
    console.log("===============================================================================================");
}
//Method for getting Metric Values after hitting the ROP
export function parser_getMetricsValue_AfterRop(){

    let parser_Inputkafka_Count_AfterROP            = utils.get_metrics_total_replica(pmparserInputkafkaReceived,config.Ran_parser_job,config.Ran_parser_app);
    let parser_BDRDownload_Count_AfterROP           = utils.get_metrics_total_replica(pmparserSuccessfulBDRDownload,config.Ran_parser_job,config.Ran_parser_app);
    let parser_FailedBDRDownload_Count_AfterROP     = utils.get_metrics_total_replica(pmparserFailedBDRDownload,config.Ran_parser_job,config.Ran_parser_app);
    let parser_ParsedSuccessful_Count_AfterROP      = utils.get_metrics_total_replica(pmparserPMounterFilesSuccessfulParsed,config.Ran_parser_job,config.Ran_parser_app);
    let parser_ParsedFailed_Count_AfterROP          = utils.get_metrics_total_replica(pmparserPMcounterFilesFailedParsed,config.Ran_parser_job,config.Ran_parser_app);
    let parser_OutputTopic_Count_AfterROP           = utils.get_metrics_total_replica(pmparserPMcounerFilesPublishOutputTopic,config.Ran_parser_job,config.Ran_parser_app);
    let parser_ProcessedTime_Total_AfterROP         = utils.processingTime_KafkaListeners(pmparserProcessedTimeTotalkafkaListenerMetric_PrometheusMetric,pmparserProcessedTimeTotalkafkaListenerMetric_GasUrlMetric);
    let parser_EBSNParsedSuccessful_Count_AfterROP = utils.get_metrics_total_replica(parserEBSNFilesSuccessfulParsed,config.Ran_parser_job,config.Ran_parser_app);
    let parser_EBSNParsedFailed_Count_AfterROP     = utils.get_metrics_total_replica(pmparserEBSNFilesFailedParsed,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRANParsed_Count_AfterROP           = utils.get_metrics_total_replica(pmparsercRANparsedSuccessful,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRANOutputTopic_Count_AfterROP      = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRANFailed_parsedfiles_AfterROP     = utils.get_metrics_total_replica(pmparsercRANFailedParsedFiles,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRAN_CUCP_Topic_Count_AfterROP      = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_CUCP,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRAN_CUUP_Topic_Count_AfterROP      = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_CUUP,config.Ran_parser_job,config.Ran_parser_app);
    let parser_cRAN_DU_Topic_Count_AfterROP        = utils.get_metrics_total_replica(pmparsercRANOutputKafkamessage_DU,config.Ran_parser_job,config.Ran_parser_app);
    let ranparser_kafka_count_ebsn_AfterROP          = utils.get_service_topic_count(ranparser_KafkaCount_ebsn_GasUrlMetric,ranparser_KafkaCount_ebsn_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    let ranparser_kafka_count_logbook_AfterROP       = utils.get_service_topic_count(ranparser_KafkaCount_logbook_GasUrlMetric,ranparser_KafkaCount_logbook_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    let ranparser_kafka_count_lte_AfterROP           = utils.get_service_topic_count(ranparser_KafkaCount_lte_GasUrlMetric,ranparser_KafkaCount_lte_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    let ranparser_kafka_count_nr_AfterROP            = utils.get_service_topic_count(ranparser_KafkaCount_nr_GasUrlMetric,ranparser_KafkaCount_nr_PrometheusMetric,config.Ran_parser_job,config.Ran_parser_app);
    let ranparser_kafka_count_Total_AfterROP         = utils.get_metrics_total_replica(ranparser_KafkaCount,config.Ran_parser_job,config.Ran_parser_app);

    let configurator_RanSchemasUpload_Total_AfterROP        = utils.get_valueFromMetrics_resultIndexOne(configuratorRanSchemasUploadTotal);
    let configurator_EBSNSchemasUpload_Total_AfterROP        = utils.get_valueFromMetrics_resultIndexOne(configuratorEBSNSchemasUploadTotal);
    let parser_SchemaNotification_MessageTotal_AfterROP     = utils.get_valueFromMetrics_resultIndexOne(pmparserSchemaNotificationMessageTotal);
    let parser_SchemaDownloads_Total_AfterROP               = utils.get_valueFromMetrics_resultIndexOne(pmparserSchemaDownloadsTotal);


       console.log("====================  3GPP Processed metrics values After ROP ====================================");
       console.log("After ROP -  RESTSIM to sftp-ft[pmstats file]   :",SFTP.sftpFilesFromENM_count_AfterROP);
       console.log("After ROP -  input kafka message received count :",parser_Inputkafka_Count_AfterROP);
       console.log("After ROP -  BDR download files                 :",parser_BDRDownload_Count_AfterROP);
       console.log("After ROP -  failed BDR downloaded files        :",parser_FailedBDRDownload_Count_AfterROP);
       console.log("After ROP -  parsed successful count            :",parser_ParsedSuccessful_Count_AfterROP);
       console.log("After ROP -  parsed failed count                :",parser_ParsedFailed_Count_AfterROP);
       console.log("After ROP -  files published to output topic    :",parser_OutputTopic_Count_AfterROP);
       console.log("After ROP -  pm-parser processing time          :",parser_ProcessedTime_Total_AfterROP);
       console.log("After ROP -  EBSNfiles successful parsed  count            :",parser_EBSNParsedSuccessful_Count_AfterROP);
       console.log("After ROP -  EBSNfiles failed parsed  count                :",parser_EBSNParsedFailed_Count_AfterROP);
       console.log("After ROP -  Configurator RAN Avro Schema Upload total to Schema Registry  :",configurator_RanSchemasUpload_Total_AfterROP);
       console.log("After ROP -  Configurator EBSN Avro Schema Upload total to Schema Registry  :",configurator_EBSNSchemasUpload_Total_AfterROP);
       console.log("After ROP -  Avro Schema available notification total   :",parser_SchemaNotification_MessageTotal_AfterROP);
       console.log("After ROP -  Avro Schema Downloads total             :",parser_SchemaDownloads_Total_AfterROP);
       console.log("After ROP -  cRAN Parsed files                       :",parser_cRANParsed_Count_AfterROP);
       console.log("After ROP -  cRAN Output kafka message produced      :",parser_cRANOutputTopic_Count_AfterROP);
       console.log("After ROP -  cRAN Failed parsed files                :",parser_cRANFailed_parsedfiles_AfterROP);
       console.log("After ROP -  cRAN CUCP output topic messages         :",parser_cRAN_CUCP_Topic_Count_AfterROP);
       console.log("After ROP -  cRAN CUUP output topic messages         :",parser_cRAN_CUUP_Topic_Count_AfterROP);
       console.log("After ROP -  cRAN DU output topic messages           :",parser_cRAN_DU_Topic_Count_AfterROP);
       console.log("After ROP -  Number of EBSN Events produced to kafka      :",ranparser_kafka_count_ebsn_AfterROP);
       console.log("After ROP -  Number of LOGBOOK Events produced to kafka      :",ranparser_kafka_count_logbook_AfterROP);
       console.log("After ROP -  Number of LTE Events produced to kafka      :",ranparser_kafka_count_lte_AfterROP);
       console.log("After ROP -  Number of NR Events produced to kafka      :",ranparser_kafka_count_nr_AfterROP);
       console.log("After ROP  - Number of Total Events produced to kafka     :", ranparser_kafka_count_Total_AfterROP);
       console.log("===============================================================================================");

       let diff_parser_inputkafka_count            = parser_Inputkafka_Count_AfterROP - parser_Inputkafka_Count_BeforeROP;
       let diff_parser_BDRDownload_count           = parser_BDRDownload_Count_AfterROP - parser_BDRDownload_Count_BeforeROP;
       let diff_parser_failedBDRdownload_count     = parser_FailedBDRDownload_Count_AfterROP - parser_FailedBDRDownload_Count_BeforeROP;
       let diff_parser_ParsedSuccessful_count      = parser_ParsedSuccessful_Count_AfterROP - parser_ParsedSuccessful_Count_BeforeROP;
       let diff_parser_ParsedFailed_count          = parser_ParsedFailed_Count_AfterROP - parser_ParsedFailed_Count_BeforeROP;
       let diff_parser_countOutputTopic            = parser_OutputTopic_Count_AfterROP - parser_OutputTopic_Count_BeforeROP;
       let diff_parser_processedTime_Total         = parser_ProcessedTime_Total_AfterROP - parser_ProcessedTime_Total_BeforeROP;
       let diff_EBSNfiles_ParsedSuccessful_count   = parser_EBSNParsedSuccessful_Count_AfterROP - parser_EBSNParsedSuccessful_Count_BeforeROP;
       let diff_EBSNfiles_ParsedFailed_count       = parser_EBSNParsedFailed_Count_AfterROP - parser_EBSNParsedFailed_Count_BeforeROP;
       let diff_cRAN_files_ParsedSuccessfull_count = parser_cRANParsed_Count_AfterROP - parser_cRANParsed_Count_BeforeROP;
       let diff_cRANKafkamessage_count             = parser_cRANOutputTopic_Count_AfterROP - parser_cRAN_OutputTopic_total_BeforeROP;
       let diff_cRANFailedParserfiles_count        = parser_cRANFailed_parsedfiles_AfterROP - parser_cRAN_Failed_parsed_files_BeforeROP;
       let diff_cRANCUCPKafkamessage_count         = parser_cRAN_CUCP_Topic_Count_AfterROP - parser_cRAN_OutputTopic_CUCP_BeforeROP;
       let diff_cRANCUUPKafkamessage_count         = parser_cRAN_CUUP_Topic_Count_AfterROP - parser_cRAN_OutputTopic_CUUP_BeforeROP;
       let diff_cRANDUKafkamessage_count           = parser_cRAN_DU_Topic_Count_AfterROP - parser_cRAN_OutputTopic_DU_BeforeROP;
       let diff_ranparser_ebsn_Kafka_produced  = ranparser_kafka_count_ebsn_AfterROP - ranparser_kafka_count_ebsn_BeforeROP;
       let diff_ranparser_logbook_Kafka_produced  = ranparser_kafka_count_logbook_AfterROP - ranparser_kafka_count_logbook_BeforeROP;
       let diff_ranparser_lte_Kafka_produced  = ranparser_kafka_count_lte_AfterROP - ranparser_kafka_count_lte_BeforeROP;
       let diff_ranparser_nr_Kafka_produced  = ranparser_kafka_count_nr_AfterROP - ranparser_kafka_count_nr_BeforeROP;
       let diff_ranparser_Total_Kafka_produced  = ranparser_kafka_count_Total_AfterROP - ranparser_kafka_count_Total_BeforeROP;

       console.log("====================  3GPP Processed metrics  After ROP  - Before ROP ====================================");
       console.log("Difference -  input kafka message received count :",diff_parser_inputkafka_count);
       console.log("Difference -  BDR download files                 :",diff_parser_BDRDownload_count);
       console.log("Difference -  failed BDR downloaded files        :",diff_parser_failedBDRdownload_count);
       console.log("Difference -  Pmcounter parsed successful count  :",diff_parser_ParsedSuccessful_count);
       console.log("Difference -  Pmcounter parsed Failed count      :",diff_parser_ParsedFailed_count);
       console.log("Difference -  files published to output topic    :",diff_parser_countOutputTopic);
       console.log("Difference -  pm-parser processing time          :",diff_parser_processedTime_Total);
       console.log("Difference -  Pmcounter EBSN files successful parsedcount  :",diff_EBSNfiles_ParsedSuccessful_count);
       console.log("Difference -  Pmcounter EBSN_files Failed parsed  count      :",diff_EBSNfiles_ParsedFailed_count);
       console.log("Difference -  pm-parser cRAN files parsed successful        :",diff_cRAN_files_ParsedSuccessfull_count);
       console.log("Difference -  pm-parsercRAN files published to output       :",diff_cRANKafkamessage_count);
       console.log("Difference -  pm-parser cRAN files failed parsing        :",diff_cRANFailedParserfiles_count);
       console.log("Difference -  pm-parser cRAN CUCP output messages        :",diff_cRANCUCPKafkamessage_count);
       console.log("Difference -  pm-parser cRAN CUUP output messages        :",diff_cRANCUUPKafkamessage_count);
       console.log("Difference -  pm-parser cRAN DU output messages          :",diff_cRANDUKafkamessage_count);
       console.log("Difference -  ranparser EBSN Files Produced to Kafka       :",diff_ranparser_ebsn_Kafka_produced);
       console.log("Difference -  ranparser LOGBOOK Files Produced to Kafka       :",diff_ranparser_logbook_Kafka_produced);
       console.log("Difference -  ranparser LTE Files Produced to Kafka       :",diff_ranparser_lte_Kafka_produced);
       console.log("Difference -  ranparser NR Files Produced to Kafka       :",diff_ranparser_nr_Kafka_produced);
       console.log("Difference -  ranparser Total Files Produced to Kafka      :",diff_ranparser_Total_Kafka_produced);
       console.log("===============================================================================================");
       let optionsfile = `${__ENV.OPTIONS_FILE}`;
       if (optionsfile == "/resources/config/ps.options.json"){ 
            group('Validation of 3GPP Ran-Parser Test Assertions in PMStats flow', function() {
               check(diff_parser_processedTime_Total, {
                'Verify Input topic able to receive notification from SFTP-FT Output topic': (r) => Number(parser_Inputkafka_Count_AfterROP) !==0 && Number(parser_Inputkafka_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) <= Number(parser_Inputkafka_Count_AfterROP),
                'Verifying Parser downloaded available files from BDR': (r) => Number(diff_parser_failedBDRdownload_count) ==0 && Number(parser_BDRDownload_Count_AfterROP) !== 0 && Number(parser_BDRDownload_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) <= Number(parser_BDRDownload_Count_AfterROP),
                'Verifying Configurator ran schema files uploaded to schemaregistry are greater than or equal to 114 ': (r) => Number(configurator_RanSchemasUpload_Total_AfterROP) >= 114,
                'Verifying Ran Parser Downloaded Avro Schemas are greater than or equal to 114  ': (r) => Number(parser_SchemaDownloads_Total_AfterROP) >= 114,
                'Verifying Parser should parse the pmstats_files': (r) => Number(diff_parser_ParsedFailed_count) == 0 &&  Number(parser_ParsedSuccessful_Count_AfterROP) !== 0 && Number(parser_ParsedSuccessful_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) <= Number(parser_ParsedSuccessful_Count_AfterROP),
                ["count of  PM counter files are published to output topic  after ROP: " + diff_parser_countOutputTopic]: (r) => Number(diff_parser_countOutputTopic) !== 0  && Number(diff_parser_countOutputTopic) > 0,
                //["Verify the processing time taken by the Pm-parser to parse the files after ROP should be greater than zero : "+ diff_parser_processedTime_Total]: (r) => Number(diff_parser_processedTime_Total) > 0,
                   })
            })
        }
        else{
            group('Validation of 3GPP Ran-Parser Test Assertions in PMStats flow', function() {
                check(diff_parser_processedTime_Total, {
                 'Verify Input topic able to receive notification from SFTP-FT Output topic': (r) => Number(parser_Inputkafka_Count_AfterROP) !==0 && Number(parser_Inputkafka_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) + Number(config.EBSN_filecount) == Number(parser_Inputkafka_Count_AfterROP),
                 'Verifying Parser downloaded available files from BDR': (r) => Number(diff_parser_failedBDRdownload_count) ==0 && Number(parser_BDRDownload_Count_AfterROP) !== 0 && Number(parser_BDRDownload_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) + Number(config.EBSN_filecount) == Number(parser_BDRDownload_Count_AfterROP),
                 'Verifying Configurator ran schema files uploaded to schemaregistry are greater than or equal to 114 ': (r) => Number(configurator_RanSchemasUpload_Total_AfterROP) >= 114,
                 'Verifying Ran Parser Downloaded Avro Schemas are greater than or equal to 114  ': (r) => Number(parser_SchemaDownloads_Total_AfterROP) >= 114,
                 'Verifying Parser should parse the pmstats_files': (r) => Number(diff_parser_ParsedFailed_count) == 0 &&  Number(parser_ParsedSuccessful_Count_AfterROP) !== 0 && Number(parser_ParsedSuccessful_Count_BeforeROP) + Number(SFTP.sftpFilesFromENM_count_AfterROP) == Number(parser_ParsedSuccessful_Count_AfterROP),
                 'Verifying Parser should parse the EBSN_files': (r) => Number(diff_EBSNfiles_ParsedFailed_count) == 0 &&  Number(parser_EBSNParsedSuccessful_Count_AfterROP) !== 0 && Number(parser_EBSNParsedSuccessful_Count_BeforeROP) + Number(config.EBSN_filecount) == Number(parser_EBSNParsedSuccessful_Count_AfterROP),
                 ["count of  PM counter files are published to output topic  after ROP: " + diff_parser_countOutputTopic]: (r) => Number(diff_parser_countOutputTopic) !== 0  && Number(diff_parser_countOutputTopic) > 0,
                 'Verifying Ran Parser able to parser cRAN Files': (r) => Number(diff_cRAN_files_ParsedSuccessfull_count) == Number(config.cRANFilecount) && Number(diff_cRANFailedParserfiles_count) == 0,
                 'Verifying Ran Parser able to produce Output kafka messages for cRAN Files': (r) => diff_cRANKafkamessage_count > 1036800,
                 //["Verify the processing time taken by the Pm-parser to parse the files after ROP should be greater than zero : "+ diff_parser_processedTime_Total]: (r) => Number(diff_parser_processedTime_Total) > 0,
                 'Verify the number of EBSN Events produced to kafka ': (r) => Number(diff_ranparser_ebsn_Kafka_produced) == config.ebsn_produced_kafka,
                 'Verify the number of LTE Events produced to kafka ': (r) => Number(diff_ranparser_lte_Kafka_produced) == config.lte_produced_kafka,
                 'Verify the number of NR Events produced to kafka ': (r) => Number(diff_ranparser_nr_Kafka_produced) == config.nr_produced_kafka,
                 //["Verifying count of PM counter files are Produced to Kafka topic: " +[Number(ranparser_kafka_count_ebsn_AfterROP)+Number(ranparser_kafka_count_lte_AfterROP)+Number(ranparser_kafka_count_nr_AfterROP)+Number(ranparser_kafka_count_cran_cu_cp_AfterROP)+Number(ranparser_kafka_count_cran_cu_up_AfterROP)]]: (r) => [Number(ranparser_kafka_count_ebsn_AfterROP)+Number(ranparser_kafka_count_lte_AfterROP)+Number(ranparser_kafka_count_nr_AfterROP)+Number(ranparser_kafka_count_cran_cu_cp_AfterROP)+Number(ranparser_kafka_count_cran_cu_up_AfterROP)] == Number(parser_OutputTopic_Count_AfterROP)
                })
                check(diff_cRANDUKafkamessage_count, {
                'Verifying Ran Parser CUCP output topic producing kafka messages': (r) => diff_cRANCUCPKafkamessage_count == Number(config.ranCUCPTopicPublishedFiles),
                'Verifying Ran Parser CUUP output topic producing kafka messages': (r) => diff_cRANCUUPKafkamessage_count == Number(config.ranCUUPTopicPublishedFiles),
                'Verifying Ran Parser DU output topic producing kafka messages': (r) => diff_cRANDUKafkamessage_count == Number(config.ranDUTopicPublishedFiles),
                });
             })
        }
    }

