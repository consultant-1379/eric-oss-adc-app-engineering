//FNS metrics
import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';

import * as SFTP from"./SFTP_FT_internal.js";
import * as pmevent from"./pmevent_internal.js";
import * as utils from "./utils.js";
import * as config from "./config.js";
import { Counter } from 'k6/metrics';
const fns_sftp_thoughput = new Counter('Get FNS_throughput for sftp-ft');
const fns_5gpmevent_thoughput = new Counter('Get FNS_throughput for pmevent');
const fns_4Gpmevent_thoughput = new Counter('Get FNS_throughput for 4Gpmevent');

export var kafka_count_fns_sftp_BeforeROP,kafka_count_fns_sftp_AfterROP;
export var kafka_count_fns_5g_BeforeROP,kafka_count_fns_5g_AfterROP;
export var kafka_count_fns_4g_BeforeROP,kafka_count_fns_4g_AfterROP;


export const fnsProcessedFiles                         = utils.pm_server_baseUrl + "eric_oss_enm_fns:notifications_sent_total";
const fnsFailedQuery                            = utils.pm_server_baseUrl + "eric_oss_enm_fns:fls_requests_failed_total";
const fnsKafkaUnavailable                       = utils.pm_server_baseUrl + "eric_oss_enm_fns:kafka_unavailable_total";
export var fnsreceiviedfiles                         = utils.pm_server_baseUrl + "eric_oss_enm_fns:files_received_total";
const fns_files_processed_time_total_SecondsSum = utils.pm_server_baseUrl + "eric_oss_enm_fns:notifications_sent_time_seconds_sum";

//NON-TLS for kafka count metrics
const KafkaCount_fns_sftp_PrometheusMetric   = "kafka_producer_topic_record_send_total{topic='file-notification-service--sftp-filetrans--enm1'}";
const KafkaCount_fns_5g_PrometheusMetric= "kafka_producer_topic_record_send_total{topic='file-notification-service--5g-event--enm1'}";
const KafkaCount_fns_4g_PrometheusMetric= "kafka_producer_topic_record_send_total{topic='file-notification-service--4g-event--enm1'}";

//TLS for kafka count metrics
const KafkaCount_fns_sftp_GasUrlMetric   = "kafka_producer_topic_record_send_total%7Btopic%3D%27file-notification-service--sftp-filetrans--enm1%27%7D&g0";
const KafkaCount_fns_5g_GasUrlMetric     = "kafka_producer_topic_record_send_total%7Btopic%3D%27file-notification-service--5g-event--enm1%27%7D&g0";
const KafkaCount_fns_4g_GasUrlMetric     = "kafka_producer_topic_record_send_total%7Btopic%3D%27file-notification-service--4g-event--enm1%27%7D&g0";


let metrics_FNS={'fnsProcessedFiles':fnsProcessedFiles,'fnsFailedQuery':fnsFailedQuery,'fnsKafkaUnavailable':fnsKafkaUnavailable};
const sftp_ft_topic_name="sftp-filetrans";
const pmevent_topic_name="5g-event";
const enmType="enm1";
export var pmevent_4G_topic_name="4g-event";

export var fnsProcessedFiles_SFTPcount_BeforeROP,fnsProcessedFiles_5gcount_BeforeROP,FNS_processed_status_code,fnsProcessedTime_SFTP_BeforeROP,fnsProcessedTime_5g_BeforeROP;
export var fnsFailedQuery_SFTPcount_BeforeROP,fnsFailedQuery_5gCount_BeforeROP,fnsKafkaUnavailable_SFTPcount_BeforeROP,fnsKafkaUnavailable_5gcount_BeforeROP;
export var fns_sftp_throughput_beforeROP,fns_5G_throughput_beforeROP;

export var fnsProcessedFiles_4GPMEventcount_BeforeROP,fnsProcessedTime_4G_BeforeROP,fns_4G_throughput_beforeROP;

//Method for getting Metric Values before hitting the ROP
export function FNS_getMetricsValue_pmstats_beforeRop(){

    fnsProcessedFiles_SFTPcount_BeforeROP   = utils.get_fns_value_bytopic(fnsProcessedFiles,sftp_ft_topic_name,enmType,config.fns_job);
    fnsFailedQuery_SFTPcount_BeforeROP      = utils.get_fns_value_bytopic(fnsFailedQuery,sftp_ft_topic_name,enmType,config.fns_job);
    fnsKafkaUnavailable_SFTPcount_BeforeROP = utils.get_valueFromMetrics_resultIndexOne(fnsKafkaUnavailable);
    fnsProcessedTime_SFTP_BeforeROP         = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum,sftp_ft_topic_name,enmType,config.fns_job);
    kafka_count_fns_sftp_BeforeROP          = utils.get_service_topic_count(KafkaCount_fns_sftp_GasUrlMetric,KafkaCount_fns_sftp_PrometheusMetric,config.fns_job,config.fns_app);

        // for initial ROP throughput should be zero - SFTP
        if(fnsProcessedFiles_SFTPcount_BeforeROP == 0 && fnsProcessedTime_SFTP_BeforeROP == 0){
            fns_sftp_throughput_beforeROP =  0;
        }
        else{
            fns_sftp_throughput_beforeROP = Number(fnsProcessedFiles_SFTPcount_BeforeROP)/Number(fnsProcessedTime_SFTP_BeforeROP);
        }
    console.log("====================  FNS Processed metrics values Before ROP ===================================="); 
    console.log("BeforeROP - FNS - Number of files queried From stub to SFTP-FT :",fnsProcessedFiles_SFTPcount_BeforeROP);
    console.log("BeforeROP - FNS - Failed FNS query-SFTP                        :",fnsFailedQuery_SFTPcount_BeforeROP); 
    console.log("BeforeROP - FNS - Failed kf Unavailable query-SFTP Topic       :",fnsKafkaUnavailable_SFTPcount_BeforeROP); 
    console.log("BeforeRop - FNS - Throughput for Sftp-Ft files                 :",fns_sftp_throughput_beforeROP);
    console.log("BeforeROP - FNS - Number of Events produced to kafka topic-SFTP    :",kafka_count_fns_sftp_BeforeROP);
    console.log("===============================================================================================");
}
//Method for getting PM Stats Metrics Values after hitting the ROP
export function FNS_getMetricsValue_pmstats_afterRop(){
    let fnsProcessedFiles_SFTPcount_AfterROP   = utils.get_fns_value_bytopic(fnsProcessedFiles,sftp_ft_topic_name,enmType,config.fns_job);                                                                                   
    let fnsFailedQuery_SFTPcount_AfterROP      = utils.get_fns_value_bytopic(fnsFailedQuery,sftp_ft_topic_name,enmType,config.fns_job);
    let fnsKafkaUnavailable_SFTPcount_AfterROP = utils.get_valueFromMetrics_resultIndexOne(fnsKafkaUnavailable);
    let fnsProcessedTime_SFTP_AfterROP         = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum,sftp_ft_topic_name,enmType,config.fns_job);
    let kafka_count_fns_sftp_AfterROP           = utils.get_service_topic_count(KafkaCount_fns_sftp_GasUrlMetric,KafkaCount_fns_sftp_PrometheusMetric,config.fns_job,config.fns_app);

    let fns_sftp_throughput_afterROP         = Number(fnsProcessedFiles_SFTPcount_AfterROP)/Number(fnsProcessedTime_SFTP_AfterROP);

    let Diff_fnsProcessedFiles_SFTPcount   = fnsProcessedFiles_SFTPcount_AfterROP - fnsProcessedFiles_SFTPcount_BeforeROP;
    let Diff_fnsFailedQuery_SFTPcount      = fnsFailedQuery_SFTPcount_AfterROP - fnsFailedQuery_SFTPcount_BeforeROP;
    let Diff_fnsKafkaUnavailable_SFTPcount = fnsKafkaUnavailable_SFTPcount_AfterROP - fnsKafkaUnavailable_SFTPcount_BeforeROP;
    let Diff_fns_throughput_sftp           = fns_sftp_throughput_afterROP - fns_sftp_throughput_beforeROP;
    let Diff_kafka_count_fns_sftp          = kafka_count_fns_sftp_AfterROP - kafka_count_fns_sftp_BeforeROP;

    console.log("====================FNS metrics After Rop==============================");
    console.log("AfterROP - FNS - Value from ENM to sftp                :",fnsProcessedFiles_SFTPcount_AfterROP);                                                                                                                         
    console.log("AfterROP - FNS - Failed FNS query-SFTP                 :",fnsFailedQuery_SFTPcount_AfterROP); 
    console.log("AfterROP - FNS - Failed kf unavailable topic query-SFTP:",fnsKafkaUnavailable_SFTPcount_AfterROP); 
    console.log("AfterROP - FNS - Processed time total in seconds for SFTP files : ",fnsProcessedTime_SFTP_AfterROP);
    console.log("AfterROP - FNS - Throughput for Sftp-Ft files                   : ",fns_sftp_throughput_afterROP);
    console.log("AfterROP - FNS - Number of Events produced to kafka topic-SFTP :",kafka_count_fns_sftp_AfterROP);

    console.log("Difference - FNS - Processed value for sftp              :",Diff_fnsProcessedFiles_SFTPcount);
    console.log("Difference - FNS - Failed FNS query-SFTP                 :",Diff_fnsFailedQuery_SFTPcount);
    console.log("Difference - FNS - Failed kf unavailable topic query-SFTP:",Diff_fnsKafkaUnavailable_SFTPcount);
    console.log("Difference - FNS - throughput for SFTP                   :",Diff_fns_throughput_sftp);
    console.log("Difference - FNS - Number of Events produced to kafka topic-SFTP  :",Diff_kafka_count_fns_sftp);
    console.log("=========================================================================");

    fns_sftp_thoughput.add(Number(fns_sftp_throughput_afterROP));
    let optionsfile = `${__ENV.OPTIONS_FILE}`;
    if (optionsfile == "/resources/config/ps.options.json"){ 
    group('Validation of FNS and SFTP-FT Test Assertions in PMStats Flow', function() {
        check(FNS_processed_status_code, {
            'Verify whether FNS recieved all expected notifications from RESTSIM' :(r) => Number(SFTP.sftpFilesFromENM_count_AfterROP)<= Number(Diff_fnsProcessedFiles_SFTPcount) && Number(SFTP.sftpFilesFromENM_count_AfterROP)!== 0,
            'Verify Failed pmstats kf unavailable notification' :(r) => Number(Diff_fnsKafkaUnavailable_SFTPcount) == 0,
    })
    })
}
    else{
        group('Validation of FNS and SFTP-FT Test Assertions in PMStats Flow', function() {
            check(FNS_processed_status_code, {
                'Verify whether FNS recieved all expected notifications from RESTSIM' :(r) => Number(SFTP.sftpFilesFromENM_count_AfterROP)+ Number(config.EBSN_filecount)== Number(Diff_fnsProcessedFiles_SFTPcount) && Number(SFTP.sftpFilesFromENM_count_AfterROP)!== 0,
                //'Verify Failed FNS query to pmstats' :(r) => Number(Diff_fnsFailedQuery_SFTPcount) == 0,
                'Verify Failed pmstats kf unavailable notification' :(r) => Number(Diff_fnsKafkaUnavailable_SFTPcount) == 0,
                //["FNS throughput(No of PMStats files from enm-stub /processing time of FNS )  value for sftp-ft files is : " + Number(fns_sftp_throughput_afterROP)]: (r) =>  Number(fns_sftp_throughput_afterROP) > 0,
        })

    })
    }
}

//Method for getting PM events Metrics Values before hitting the ROP
export function FNS_getMetricsValue_pmevent_beforeRop(){
    fnsProcessedFiles_5gcount_BeforeROP     = utils.get_fns_value_bytopic(fnsProcessedFiles,pmevent_topic_name,enmType,config.fns_job);
    fnsFailedQuery_5gCount_BeforeROP        = utils.get_fns_value_bytopic(fnsFailedQuery,pmevent_topic_name,enmType,config.fns_job);
    fnsKafkaUnavailable_5gcount_BeforeROP   = utils.get_valueFromMetrics_resultIndexZero(fnsKafkaUnavailable);
    fnsProcessedTime_5g_BeforeROP           = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum,pmevent_topic_name,enmType,config.fns_job);
    kafka_count_fns_5g_BeforeROP          = utils.get_service_topic_count(KafkaCount_fns_5g_GasUrlMetric,KafkaCount_fns_5g_PrometheusMetric,config.fns_job,config.fns_app);

            // for initial ROP throughput should be zero - 5G
            if(fnsProcessedFiles_5gcount_BeforeROP == 0 && fnsProcessedTime_5g_BeforeROP == 0){
                fns_5G_throughput_beforeROP =  0;
            }
            else{
                fns_5G_throughput_beforeROP = Number(fnsProcessedFiles_5gcount_BeforeROP)/Number(fnsProcessedTime_5g_BeforeROP);
            }
    console.log("BeforeROP - FNS - Number of files queried From stub to 5gpmevt :",fnsProcessedFiles_5gcount_BeforeROP); 
    console.log("BeforeROP - FNS - Failed FNS query-5g                          :",fnsFailedQuery_5gCount_BeforeROP); 
    console.log("BeforeRop - FNS - Throughput for 5G files                      :",fns_5G_throughput_beforeROP);
    console.log("BeforeROP - FNS - Failed kf Unavailable query-5g Topic         :",fnsKafkaUnavailable_5gcount_BeforeROP); 
    console.log("BeforeROP - FNS - Number of Events produced to kafka topic-5G  :",kafka_count_fns_5g_BeforeROP);
}
//Method for getting PM events Metrics Values after hitting the ROP
export function FNS_getMetricsValue_pmevent_afterRop(){

    let fnsProcessedFiles_5gcount_AfterROP     = utils.get_fns_value_bytopic(fnsProcessedFiles,pmevent_topic_name,enmType,config.fns_job);  
    let fnsFailedQuery_5gCount_AfterROP        = utils.get_fns_value_bytopic(fnsFailedQuery,pmevent_topic_name,enmType,config.fns_job);
    let fnsKafkaUnavailable_5gcount_AfterROP   = utils.get_valueFromMetrics_resultIndexZero(fnsKafkaUnavailable);
    let fnsProcessedTime_5g_AfterROP           = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum,pmevent_topic_name,enmType,config.fns_job);
    let kafka_count_fns_5g_AfterROP           = utils.get_service_topic_count(KafkaCount_fns_5g_GasUrlMetric,KafkaCount_fns_5g_PrometheusMetric,config.fns_job,config.fns_app);

    let fns_5G_throughput_afterROP           = Number(fnsProcessedFiles_5gcount_AfterROP)/Number(fnsProcessedTime_5g_AfterROP);

    let Diff_fnsProcessedFiles_5gcount     = fnsProcessedFiles_5gcount_AfterROP - fnsProcessedFiles_5gcount_BeforeROP;
    let Diff_fnsFailedQuery_5gCount        = fnsFailedQuery_5gCount_AfterROP - fnsFailedQuery_5gCount_BeforeROP;
    let Diff_fnsKafkaUnavailable_5gcount   = fnsKafkaUnavailable_5gcount_AfterROP - fnsKafkaUnavailable_5gcount_BeforeROP;
    let Diff_fns_throughput_5G             = fns_5G_throughput_afterROP - fns_5G_throughput_beforeROP;
    let Diff_kafka_count_fns_5G          = kafka_count_fns_5g_AfterROP - kafka_count_fns_5g_BeforeROP;

    
    console.log("AfterROP - FNS - Value from ENM to 5g                  :",fnsProcessedFiles_5gcount_AfterROP);
    console.log("AfterROP - FNS - Failed FNS query-5g                   :",fnsFailedQuery_5gCount_AfterROP); 
    console.log("AfterROP - FNS - Failed kf unavailable topic query-5g  :",fnsKafkaUnavailable_5gcount_AfterROP); 
    console.log("AfterROP - FNS - Processed time total in seconds for 5G files   : ",fnsProcessedTime_5g_AfterROP);
    console.log("AfterROP - FNS - Throughput for 5G files                        : ",fns_5G_throughput_afterROP);
    console.log("AfterROP - FNS - Number of Events produced to kafka topic-5G :",kafka_count_fns_5g_AfterROP);

    console.log("Difference - FNS - Processed value for 5g                :",Diff_fnsProcessedFiles_5gcount);
    console.log("Difference - FNS - Failed FNS query-5g                   :",Diff_fnsFailedQuery_5gCount);
    console.log("Difference - FNS - Failed kf unavailable topic query-5g  :",Diff_fnsKafkaUnavailable_5gcount);
    console.log("Difference - FNS - throughput for 5G                     :",Diff_fns_throughput_5G);
    console.log("Difference - FNS - Number of Events produced to kafka topic-5G  :",Diff_kafka_count_fns_5G);

    fns_5gpmevent_thoughput.add(Number(fns_5G_throughput_afterROP));
    group('Validation of FNS and 5GPMEvent Test Assertions in 5G Flow', function() {
        check(FNS_processed_status_code, {
            'Verify FNS sents all expected files to 5G PMEvent File Transfer' :(r) => Number(Diff_fnsProcessedFiles_5gcount) == Number(config.pmCelltracefilecount) && Number(config.pmCelltracefilecount) !== 0,
            //'Verify failed FNS query to 5g' :(r) => Number(Diff_fnsFailedQuery_5gCount) == 0,
            'Verify Failed kafka unavilable to 5g' :(r) => Number(Diff_fnsKafkaUnavailable_5gcount) == 0,
            //["FNS throughput(No of PMCelltrace files from enm-stub /processing time of FNS ) value for 5G files is : " + Number(Diff_fns_throughput_5G)]: (r) =>  Number(Diff_fns_throughput_5G) > 0,
    })
    })

}

//Method for getting 4G PM events Metrics Values Before hitting the ROP
export function FNS_getMetricsValue_4Gpmevent_beforeRop() {
    fnsProcessedFiles_4GPMEventcount_BeforeROP = utils.get_fns_value_bytopic(fnsProcessedFiles, pmevent_4G_topic_name, enmType, config.fns_job);
    fnsProcessedTime_4G_BeforeROP = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum, pmevent_4G_topic_name, enmType, config.fns_job);
    kafka_count_fns_4g_BeforeROP          = utils.get_service_topic_count(KafkaCount_fns_4g_GasUrlMetric,KafkaCount_fns_4g_PrometheusMetric,config.fns_job,config.fns_app);

    // for initial ROP throughput should be zero - 4G
    if (fnsProcessedFiles_4GPMEventcount_BeforeROP == 0 && fnsProcessedTime_4G_BeforeROP == 0) {
        fns_4G_throughput_beforeROP = 0;
    }
    else {
        fns_4G_throughput_beforeROP = Number(fnsProcessedFiles_4GPMEventcount_BeforeROP) / Number(fnsProcessedTime_4G_BeforeROP);
    }
    console.log("BeforeROP - FNS - Number of files queried From RESTSIM    :", fnsProcessedFiles_4GPMEventcount_BeforeROP);
    console.log("BeforeRop - FNS - Throughput for 4G files                 :", fns_4G_throughput_beforeROP);
    console.log("BeforeROP - FNS - Number of Events produced to kafka topic-4G  :",kafka_count_fns_4g_BeforeROP);
}
//Method for getting 4G PM events Metrics Values after hitting the ROP
export function FNS_getMetricsValue_4Gpmevent_afterRop() {

    let fnsProcessedFiles_4GPMEventcount_AfterROP = utils.get_fns_value_bytopic(fnsProcessedFiles, pmevent_4G_topic_name, enmType, config.fns_job);
    let fnsProcessedTime_4G_AfterROP = utils.get_fns_value_bytopic(fns_files_processed_time_total_SecondsSum, pmevent_4G_topic_name, enmType, config.fns_job);
    let kafka_count_fns_4g_AfterROP           = utils.get_service_topic_count(KafkaCount_fns_4g_GasUrlMetric,KafkaCount_fns_4g_PrometheusMetric,config.fns_job,config.fns_app);

    let fns_4G_throughput_afterROP = Number(fnsProcessedFiles_4GPMEventcount_AfterROP) / Number(fnsProcessedTime_4G_AfterROP);

    let Diff_fnsProcessedFiles_4Gcount = fnsProcessedFiles_4GPMEventcount_AfterROP - fnsProcessedFiles_4GPMEventcount_BeforeROP;
    let Diff_fns_throughput_4G = fns_4G_throughput_afterROP - fns_4G_throughput_beforeROP;
    let Diff_kafka_count_fns_4G      = kafka_count_fns_4g_AfterROP - kafka_count_fns_4g_BeforeROP;

    console.log("AfterROP - FNS - Value from ENM to 4G PM Event                :", fnsProcessedFiles_4GPMEventcount_AfterROP);
    console.log("AfterROP - FNS - Processed time total in seconds for 4G files   : ", fnsProcessedTime_4G_AfterROP);
    console.log("AfterROP - FNS - Throughput for 4G files                        : ", fns_4G_throughput_afterROP);
    console.log("AfterROP - FNS - Number of Events produced to kafka topic-4G :",kafka_count_fns_4g_AfterROP);

    console.log("Difference - FNS - Processed value for 4G                :", Diff_fnsProcessedFiles_4Gcount);
    console.log("Difference - FNS - throughput for 4G                     :", Diff_fns_throughput_4G);
    console.log("Difference - FNS - Number of Events produced to kafka topic-4G  :",Diff_kafka_count_fns_4G);

    fns_4Gpmevent_thoughput.add(Number(fns_4G_throughput_afterROP));
    group('Validation of FNS and 4G PMEvent File Transfer Test Assertions in 4G Flow ', function () {
        check(FNS_processed_status_code, {
            'Verify whether FNS recieved and sent all expected files to 4G PMEvent File Transfer': (r) => Number(Diff_fnsProcessedFiles_4Gcount) != 0 && Number(Diff_fnsProcessedFiles_4Gcount) == Number(config.Pmevent_4G_filecount),
        });
    })

}

