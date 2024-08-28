//FNS metrics
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import * as SFTPCore from "./SFTP_FT_Core_internal.js";
import * as utils from "./utils.js";
import * as config from "./config.js";

export var kafka_count_fns_core_BeforeROP,kafka_count_fns_core_AfterROP;

//FNS-CORE metrics
export const fnsProcessedFiles = utils.pm_server_baseUrl + "eric_oss_enm_fns:notifications_sent_total";
const fnsFailedQuery = utils.pm_server_baseUrl + "eric_oss_enm_fns:fls_requests_failed_total";
const fnsKafkaUnavailable = utils.pm_server_baseUrl + "eric_oss_enm_fns:kafka_unavailable_total";
const fns_files_processed_time_total_SecondsSum = utils.pm_server_baseUrl + "eric_oss_enm_fns:notifications_sent_time_seconds_sum";

//NON-TLS for kafka count metrics
const KafkaCount_fns_core_PrometheusMetric = "kafka_producer_topic_record_send_total{topic='file-notification-service--pcc_pcg--enm1'}";

//TLS for kafka count metrics
const KafkaCount_fns_core_GasUrlMetric   = "kafka_producer_topic_record_send_total%7Btopic%3D%27file-notification-service--pcc_pcg--enm1%27%7D&g0";

let metrics_FNS = { 'fnsProcessedFiles': fnsProcessedFiles, 'fnsFailedQuery': fnsFailedQuery, 'fnsKafkaUnavailable': fnsKafkaUnavailable };
const coreft_topic_name = "pcc_pcg";
const enmType = "enm1";

export var fnsProcessedFiles_corecount_BeforeROP, FNS_processed_status_code, fnsProcessedTime_core_BeforeROP;
export var fnsFailedQuery_corecount_BeforeROP, fnsKafkaUnavailable_corecount_BeforeROP;
export var fns_core_throughput_beforeROP;
//Method for getting values of each metric before hitting the ROP
export function FNS_getMetricsValue_corestats_beforeRop() {

    fnsProcessedFiles_corecount_BeforeROP = utils.get_fns_value_bytopic(fnsProcessedFiles, coreft_topic_name, enmType, config.fns_job);
    fnsFailedQuery_corecount_BeforeROP = utils.get_fns_value_bytopic(fnsFailedQuery, coreft_topic_name, enmType, config.fns_job);
    fnsKafkaUnavailable_corecount_BeforeROP = utils.get_valueFromMetrics_resultIndexOne(fnsKafkaUnavailable);
    fnsProcessedTime_core_BeforeROP = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum, coreft_topic_name, enmType, config.fns_job);
    kafka_count_fns_core_BeforeROP    = utils.get_service_topic_count(KafkaCount_fns_core_GasUrlMetric,KafkaCount_fns_core_PrometheusMetric,config.fns_job,config.fns_app);

    // for initial ROP throughput should be zero - SFTP
    if (fnsProcessedFiles_corecount_BeforeROP == 0 && fnsProcessedTime_core_BeforeROP == 0) {
        fns_core_throughput_beforeROP = 0;
    }
    else {
        fns_core_throughput_beforeROP = Number(fnsProcessedFiles_corecount_BeforeROP) / Number(fnsProcessedTime_core_BeforeROP);
    }
    console.log("====================  FNS-CORE Processed metrics values Before ROP ====================================");
    console.log("BeforeROP - FNS-CORE- Number of files queried From stub to core-FT :", fnsProcessedFiles_corecount_BeforeROP);
    console.log("BeforeROP - FNS-CORE - Failed FNS query-core                       :", fnsFailedQuery_corecount_BeforeROP);
    console.log("BeforeROP - FNS-CORE - Failed kf Unavailable query-core Topic       :", fnsKafkaUnavailable_corecount_BeforeROP);
    console.log("BeforeRop - FNS-CORE - Throughput for core-Ft files                 :", fns_core_throughput_beforeROP);
    console.log("BeforeROP - FNS-CORE - Number of Events produced to kafka topic    :",kafka_count_fns_core_BeforeROP);
    console.log("===============================================================================================");
}
//Method for getting values of each metric Post hitting the ROP
export function FNS_getMetricsValue_corestats_afterRop() {
    let fnsProcessedFiles_corecount_AfterROP = utils.get_fns_value_bytopic(fnsProcessedFiles, coreft_topic_name, enmType, config.fns_job);
    let fnsFailedQuery_corecount_AfterROP = utils.get_fns_value_bytopic(fnsFailedQuery, coreft_topic_name, enmType, config.fns_job);
    let fnsKafkaUnavailable_corecount_AfterROP = utils.get_valueFromMetrics_resultIndexOne(fnsKafkaUnavailable);
    let fnsProcessedTime_core_AfterROP = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum, coreft_topic_name, enmType, config.fns_job);
    let kafka_count_fns_core_AfterROP      = utils.get_service_topic_count(KafkaCount_fns_core_GasUrlMetric,KafkaCount_fns_core_PrometheusMetric,config.fns_job,config.fns_app);

    let fns_core_throughput_afterROP = Number(fnsProcessedFiles_corecount_AfterROP) / Number(fnsProcessedTime_core_AfterROP);

    let Diff_fnsProcessedFiles_corecount = fnsProcessedFiles_corecount_AfterROP - fnsProcessedFiles_corecount_BeforeROP;
    let Diff_fnsFailedQuery_corecount = fnsFailedQuery_corecount_AfterROP - fnsFailedQuery_corecount_BeforeROP;
    let Diff_fnsKafkaUnavailable_corecount = fnsKafkaUnavailable_corecount_AfterROP - fnsKafkaUnavailable_corecount_BeforeROP;
    let Diff_fns_throughput_core = fns_core_throughput_afterROP - fns_core_throughput_beforeROP;
    let Diff_kafka_count_fns_core         = kafka_count_fns_core_AfterROP - kafka_count_fns_core_BeforeROP;

    console.log("====================FNS-CORE metrics After Rop==============================");
    console.log("AfterROP - FNS-CORE - Value from ENM to core                :", fnsProcessedFiles_corecount_AfterROP);
    console.log("AfterROP - FNS-CORE - Failed FNS query-core                 :", fnsFailedQuery_corecount_AfterROP);
    console.log("AfterROP - FNS-CORE - Failed kf unavailable topic query-core:", fnsKafkaUnavailable_corecount_AfterROP);

    console.log("AfterROP - FNS-CORE - Processed time total in seconds for core files : ", fnsProcessedTime_core_AfterROP);
    console.log("AfterROP - FNS-CORE - Throughput for core-Ft files                   : ", fns_core_throughput_afterROP);
    console.log("AfterROP - FNS-CORE - Number of Events produced to kafka topic :",kafka_count_fns_core_AfterROP);

    console.log("Difference - FNS-CORE - Processed value for core              :", Diff_fnsProcessedFiles_corecount);
    console.log("Difference - FNS-CORE - Failed FNS query-core                 :", Diff_fnsFailedQuery_corecount);
    console.log("Difference - FNS-CORE - Failed kf unavailable topic query-core:", Diff_fnsKafkaUnavailable_corecount);
    console.log("Difference - FNS-CORE - throughput for core                   :", Diff_fns_throughput_core);
    console.log("Difference - FNS-CORE - Number of Events produced to kafka topic :",Diff_kafka_count_fns_core);
    console.log("=========================================================================");
//Method of FNS -Core Assertions
    group('Validation of FNS and SFTP Core Test Assertions in Core Stats Flow', function () {
        check(FNS_processed_status_code, {
            'Validate FNS sents all expected core files to SFTP-Core ': (r) => Number(Diff_fnsProcessedFiles_corecount) == Number(SFTPCore.sftpFilesFromENM_count_AfterROP) && Number(SFTPCore.sftpFilesFromENM_count_AfterROP) !== 0,
            // 'Verify Failed FNS-CORE query to coretats' :(r) => Number(Diff_fnsFailedQuery_corecount) == 0,
            'Validate Failed CoreStats kafka unavailable notifications and should ba equal to zero': (r) => Number(Diff_fnsKafkaUnavailable_corecount) == 0,
            //["FNS-CORE throughput(No of coreStats files from enm-stub /processing time of FNS-CORE )  value for core-ft files is : " + Number(Diff_fns_throughput_core)]: (r) => Number(Diff_fns_throughput_core) > 0,
        })
    })
}



