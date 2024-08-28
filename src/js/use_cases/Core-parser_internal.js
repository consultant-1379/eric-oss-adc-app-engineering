
import http from 'k6/http';
import {check, sleep, group } from 'k6';
import * as SFTP from "./SFTP_FT_Core_internal.js";
import * as utils from "./utils.js";
import * as config from"./config.js";

var coreparser_Inputkafka_Count_BeforeROP,coreparser_BDRDownload_Count_BeforeROP ,coreparser_FailedBDRDownload_Count_BeforeROP ;
var coreparser_ParsedFailed_Count_BeforeROP,coreparser_OutputTopic_Count_BeforeROP,coreparser_ProcessedTime_Total_BeforeROP;
var configuratorCoreAvroSchemaRegisterTotalinSR_BeforeROP,coreparserSchemadownloadSuccessfulTotal_BeforeROP,coreparserSchemadownloadFailedTotal_BeforeROP;
export var coreparser_ParsedSuccessful_Count_BeforeROP;
export var podname="eric-oss-3gpp-pm-xml-core-parser";


//const coreparserMoFailed =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_parser_MO_failed_total";
const coreparserInputNumberOfMetrics =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_successful_metrics_parsed_total";
//const coreparser_successful_ParsedMeasInfo        =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_successful_measinfo_parsed_total";
const coreparserInputkafkaReceived =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_input_kafka_messages_received_total";
const coreparserFailedkafkaReceived =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_output_kafka_messages_failed_total";
const coreparserPMcounerFilesPublishOutputTopic=  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_pm_xml_core_num_output_kafka_messages_produced_successfully_total";


//const coreparser_successful_cENMdownloadstotal        =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_successful_cenm_downloads_total";
//const coreparser_failed_cENMdownloadstotal            =  utils.pm_server_baseUrl +"eric_oss_3gpp_parser_pm_xml_core_num_failed_cenm_downloads_total";
//const coreparser_cENM_BDR_fileRead =  utils.pm_server_baseUrl + "eric.oss.3gpp.parser.pm.xml.core.processed.file.size.kbytes";// metrices is not implemented


const coreparserSuccessfulBDRDownload          =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_pm_xml_core_num_successful_bdr_downloads_total";
const coreparserFailedBDRDownload              =  utils.pm_server_baseUrl + "eric_oss_3gpp_parser_pm_xml_core_num_failed_bdr_downloads_total";


const coreparserProcessedTimeTotal            = utils.pm_server_baseUrl  + "eric_oss_3gpp_parser_pm_xml_core_processed_counter_files_time_seconds_total_seconds_sum";
export const coreparserSuccessfulProcessed            = utils.pm_server_baseUrl  + "eric_oss_3gpp_parser_pm_xml_core_num_parsed_files_successfully_total";
const coreparserFailedProcessed            = utils.pm_server_baseUrl  + "eric_oss_3gpp_parser_pm_xml_core_num_failed_processed_counter_files_total";


const configuratorCoreAvroSchemaRegisterTotalinSR    = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_configurator_num_avro_schema_files_core_total";
const coreparserSchemadownloadSuccessfulTotal           = utils.pm_server_baseUrl  + "eric_oss_3gpp_parser_pm_xml_core_num_successful_schema_download_total";
const coreparserSchemadownloadFailedTotal            = utils.pm_server_baseUrl  + "eric_oss_3gpp_parser_pm_xml_core_num_failed_schema_download_total";


let metrics_Parser={'coreparserInputkafkaReceived':coreparserInputkafkaReceived,'coreparserSuccessfulBDRDownload':coreparserSuccessfulBDRDownload,
'coreparserSuccessfulProcessed ':coreparserSuccessfulProcessed ,'coreparserFailedProcessed ':coreparserFailedProcessed,'configuratorCoreAvroSchemaRegisterTotalinSR':configuratorCoreAvroSchemaRegisterTotalinSR,
 'coreparserSchemadownloadSuccessfulTotal':coreparserSchemadownloadSuccessfulTotal,'coreparserSchemadownloadFailedTotal':coreparserSchemadownloadFailedTotal};
//Method for getting Metric Values before hitting the ROP
export function coreparser_getMetricsValue_BeforeRop(){
    coreparser_Inputkafka_Count_BeforeROP        = utils.get_metrics_total_replica(coreparserInputkafkaReceived,config.core_parser_job,config.core_parser_app);
    coreparser_BDRDownload_Count_BeforeROP       = utils.get_metrics_total_replica(coreparserSuccessfulBDRDownload,config.core_parser_job,config.core_parser_app);
    coreparser_FailedBDRDownload_Count_BeforeROP = utils.get_metrics_total_replica(coreparserFailedBDRDownload,config.core_parser_job,config.core_parser_app);
    coreparser_ParsedSuccessful_Count_BeforeROP  = utils.get_metrics_total_replica(coreparserSuccessfulProcessed,config.core_parser_job,config.core_parser_app);
    coreparser_ParsedFailed_Count_BeforeROP      = utils.get_metrics_total_replica(coreparserFailedProcessed,config.core_parser_job,config.core_parser_app);
    coreparser_OutputTopic_Count_BeforeROP       = utils.get_metrics_total_replica(coreparserPMcounerFilesPublishOutputTopic,config.core_parser_job,config.core_parser_app);
    coreparser_ProcessedTime_Total_BeforeROP     = utils.get_metrics_total_replica(coreparserProcessedTimeTotal,config.core_parser_job,config.core_parser_app);

    configuratorCoreAvroSchemaRegisterTotalinSR_BeforeROP      = utils.get_valueFromMetrics_resultIndexOne(configuratorCoreAvroSchemaRegisterTotalinSR);
    coreparserSchemadownloadSuccessfulTotal_BeforeROP         = utils.get_valueFromMetrics_resultIndexZero(coreparserSchemadownloadSuccessfulTotal);
    coreparserSchemadownloadFailedTotal_BeforeROP     = utils.get_valueFromMetrics_resultIndexZero(coreparserSchemadownloadFailedTotal);

    console.log("====================  3GPP-CORE Processed metric values Before ROP   ====================================");
    console.log("Initial number of files input kafka message received count :",coreparser_Inputkafka_Count_BeforeROP);
    console.log("Initial number of BDR download files                       :",coreparser_BDRDownload_Count_BeforeROP);
    console.log("Initial number of failed BDR downloaded files              :",coreparser_FailedBDRDownload_Count_BeforeROP);
    console.log("Initial number of parsed successful count                  :",coreparser_ParsedSuccessful_Count_BeforeROP);
    console.log("Initial number of parsed Failed count                      :",coreparser_ParsedFailed_Count_BeforeROP);
    console.log("Initial number of files published to output topic          :",coreparser_OutputTopic_Count_BeforeROP);
    console.log("pm-coreparser processing time before ROP                       :",coreparser_ProcessedTime_Total_BeforeROP);

    console.log("Count of Core avroschemas register in SR by Configurator   :",configuratorCoreAvroSchemaRegisterTotalinSR_BeforeROP);
    console.log("Count of Avro schemas successfully downloaded by core parser from SR :",coreparserSchemadownloadSuccessfulTotal_BeforeROP);
    console.log("Count of Avro schemas Failed downloaded by core parser from SR :",coreparserSchemadownloadFailedTotal_BeforeROP);
    console.log("===============================================================================================");
}
//Method for getting Metric Values After hitting the ROP
export function coreparser_getMetricsValue_AfterRop(){

    let coreparser_Inputkafka_Count_AfterROP        = utils.get_metrics_total_replica(coreparserInputkafkaReceived,config.core_parser_job,config.core_parser_app);
    let coreparser_BDRDownload_Count_AfterROP       = utils.get_metrics_total_replica(coreparserSuccessfulBDRDownload,config.core_parser_job,config.core_parser_app);
    let coreparser_FailedBDRDownload_Count_AfterROP = utils.get_metrics_total_replica(coreparserFailedBDRDownload,config.core_parser_job,config.core_parser_app);
    let coreparser_ParsedSuccessful_Count_AfterROP  = utils.get_metrics_total_replica(coreparserSuccessfulProcessed,config.core_parser_job,config.core_parser_app);
    let coreparser_ParsedFailed_Count_AfterROP      = utils.get_metrics_total_replica(coreparserFailedProcessed,config.core_parser_job,config.core_parser_app);
    let coreparser_OutputTopic_Count_AfterROP       = utils.get_metrics_total_replica(coreparserPMcounerFilesPublishOutputTopic,config.core_parser_job,config.core_parser_app);
    let coreparser_ProcessedTime_Total_AfterROP     = utils.get_metrics_total_replica(coreparserProcessedTimeTotal,config.core_parser_job,config.core_parser_app);

    let configuratorCoreAvroSchemaRegisterTotalinSR_AfterROP   = utils.get_valueFromMetrics_resultIndexOne(configuratorCoreAvroSchemaRegisterTotalinSR);
    let coreparserSchemadownloadSuccessfulTotal_AfterROP       = utils.get_valueFromMetrics_resultIndexZero(coreparserSchemadownloadSuccessfulTotal);
    let coreparserSchemadownloadFailedTotal_AfterROP           = utils.get_valueFromMetrics_resultIndexZero(coreparserSchemadownloadFailedTotal);

       console.log("====================  3GPP-CORE Processed metrics values After ROP ====================================");
       console.log("After ROP -  RESTSIM sent count                 :",SFTP.sftpFilesFromENM_count_AfterROP);
       console.log("After ROP -  input kafka message received count :",coreparser_Inputkafka_Count_AfterROP);
       console.log("After ROP -  BDR download files                 :",coreparser_BDRDownload_Count_AfterROP);
       console.log("After ROP -  failed BDR downloaded files        :",coreparser_FailedBDRDownload_Count_AfterROP);
       console.log("After ROP -  parsed successful count            :",coreparser_ParsedSuccessful_Count_AfterROP);
       console.log("After ROP -  parsed failed count                :",coreparser_ParsedFailed_Count_AfterROP);
       console.log("After ROP -  files published to output topic    :",coreparser_OutputTopic_Count_AfterROP);
       console.log("After ROP -  pm-coreparser processing time          :",coreparser_ProcessedTime_Total_AfterROP);

       console.log("Count of Core avroschemas register in SR by Configurator   :",configuratorCoreAvroSchemaRegisterTotalinSR_AfterROP);
       console.log("Count of Avro schemas successfully downloaded by core parser from SR :",coreparserSchemadownloadSuccessfulTotal_AfterROP);
       console.log("Count of Avro schemas Failed downloaded by core parser from SR :",coreparserSchemadownloadFailedTotal_AfterROP);

       console.log("===============================================================================================");

       let diff_coreparser_inputkafka_count = coreparser_Inputkafka_Count_AfterROP - coreparser_Inputkafka_Count_BeforeROP;
       let diff_coreparser_BDRDownload_count = coreparser_BDRDownload_Count_AfterROP - coreparser_BDRDownload_Count_BeforeROP;
       let diff_coreparser_failedBDRdownload_count = coreparser_FailedBDRDownload_Count_AfterROP - coreparser_FailedBDRDownload_Count_BeforeROP;
       let diff_coreparser_ParsedSuccessful_count = coreparser_ParsedSuccessful_Count_AfterROP - coreparser_ParsedSuccessful_Count_BeforeROP;
       let diff_coreparser_ParsedFailed_count = coreparser_ParsedFailed_Count_AfterROP - coreparser_ParsedFailed_Count_BeforeROP;
       let diff_coreparser_countOutputTopic = coreparser_OutputTopic_Count_AfterROP - coreparser_OutputTopic_Count_BeforeROP;
       let diff_coreparser_processedTime_Total = coreparser_ProcessedTime_Total_AfterROP - coreparser_ProcessedTime_Total_BeforeROP;

       console.log("====================  3GPP-CORE Processed metrics  After ROP - Before ROP  ====================================");
       console.log("Difference -  input kafka message received count :",diff_coreparser_inputkafka_count);
       console.log("Difference -  BDR download files                 :",diff_coreparser_BDRDownload_count);
       console.log("Difference -  failed BDR downloaded files        :",diff_coreparser_failedBDRdownload_count);
       console.log("Difference -  Pmcounter parsed successful count  :",diff_coreparser_ParsedSuccessful_count);
       console.log("Difference -  Pmcounter parsed Failed count      :",diff_coreparser_ParsedFailed_count);
       console.log("Difference -  files published to output topic    :",diff_coreparser_countOutputTopic);
       console.log("Difference -  pm-coreparser processing time          :",diff_coreparser_processedTime_Total);
       console.log("===============================================================================================");
//Validation of Core Flow Assertions
    group('Validation of 3GPP-CORE-Parser Processed Metrics', function () {
        check(diff_coreparser_processedTime_Total, {
            'Validate that BDR Download files count and input kafka message received count should be equal and failed BDR download files should be zero ': (r) => Number(diff_coreparser_failedBDRdownload_count) == 0 && Number(coreparser_BDRDownload_Count_AfterROP) !== 0 && Number(diff_coreparser_inputkafka_count) == Number(diff_coreparser_BDRDownload_count) && Number(diff_coreparser_inputkafka_count) == config.pcc_pcg_filecount && Number(diff_coreparser_BDRDownload_count) == config.pcc_pcg_filecount,
            'Validate that BDR Download files count and core_counter parsed successful count should be equal and Pmcounter parsed Failed count should be zero ': (r) => Number(diff_coreparser_ParsedFailed_count) == 0 && Number(coreparser_ParsedSuccessful_Count_AfterROP) !== 0 && Number(diff_coreparser_ParsedSuccessful_count) == Number(diff_coreparser_BDRDownload_count),
            'Validate Configurator Core schemas upload total and Total Avro Schemas successfully download from Schema Registry by core parser should be equal and  Total Avro Schemas failed download from Schema Registry should be zero ': (r) => Number(configuratorCoreAvroSchemaRegisterTotalinSR_AfterROP) <= Number(coreparserSchemadownloadSuccessfulTotal_AfterROP) && Number(coreparserSchemadownloadFailedTotal_AfterROP) == 0,
            'Validate the Count of PM counter files are published to output topic after ROP ' : (r) => Number(diff_coreparser_countOutputTopic) > 0,
            'Validate the processing time taken by the CoreParser to parse the files and time taken to parse is' : (r) => Number(diff_coreparser_processedTime_Total) > 0,
        });
    });
}








