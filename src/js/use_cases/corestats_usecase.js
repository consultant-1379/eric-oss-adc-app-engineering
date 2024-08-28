import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as sftp_core from"./SFTP_FT_Core_internal.js";
import * as fns from"./FNS_Core_internal.js";
import * as fns1 from"./FNS_internal.js";
import * as coreParser from"./Core-parser_internal.js";
import * as utils from"./utils.js";
import * as config from"./config.js";
import * as subscription from "./Subcription_Utils.js";
import * as topic from "./OutputTopic_Validation.js";

var buffer_time=480;
let core_processingTime = 0;
var value_from_RESTSIMtoCORE;
var fns_received_PCC_PCG_files_beforeROP,fns_received_PCC_PCG_files;

//Method For validating Core Stats flow
export default function (){
    group('Validation of Registration of Core output Topics in Datacatalog and Kafka', function () {
        topic.TopicValidation(config.expectedCoreStatsTopicName, 120, 1,config.expectedCoreRetentionPeriod,config.expectedCorepartitions);
    });
    //Subscription creation for Core topic
    subscription.Creation_of_Subscription(config.Subscription_PCC_PCG_Topic);
    fns_received_PCC_PCG_files_beforeROP = utils.get_fns_value_bytopic(fns1.fnsreceiviedfiles,"pcc_pcg","enm1",config.fns_job);   
    fns.FNS_getMetricsValue_corestats_beforeRop();
    sftp_core.SFTP_FT_getMetricsValue_beforeRop();
    coreParser.coreparser_getMetricsValue_BeforeRop();
    sleep(250);// We have wait for some time post all services up and Subscription creation and Rop hit
    value_from_RESTSIMtoCORE = config.pcc_pcg_filecount;
    let i=1;
    //Method to Validate whether RESTSIM is able to generate and FNS Started receiving Core Stats files
     while(i<=buffer_time){
     console.log("Waiting for RESTSIM to generate 100 core_pmevent files");
     fns_received_PCC_PCG_files = utils.get_fns_value_bytopic(fns1.fnsreceiviedfiles,"pcc_pcg","enm1",config.fns_job);
     let diff_fns_received = fns_received_PCC_PCG_files - fns_received_PCC_PCG_files_beforeROP;

        if( diff_fns_received > 0){
            console.log("Started Receiving Core_pmstats files and Testing started");
            break;
        }
         i+=30;
        sleep(30);
      }
      //Post FNS started receiving Core files then below method will check Core Stats flow
        while (core_processingTime <= config.timeoutLimit) {
            let sftp_Actual_Final_count_core = utils.get_metrics_total_replica(sftp_core.sftpInputTopic,config.core_sftp_job,config.core_sftp_app);
            let sftp_Expected_Final_count_core = Number(sftp_core.sftpInputTopic_count_BeforeROP) + Number(value_from_RESTSIMtoCORE); // 100+ 1400 = 1500
            let Core_parser_parsed_expected_values= Number(coreParser.coreparser_ParsedSuccessful_Count_BeforeROP)+ Number(value_from_RESTSIMtoCORE);
            let Core_parser_actual_parser_values = utils.get_metrics_total_replica(coreParser.coreparserSuccessfulProcessed ,config.core_parser_job,config.core_parser_app); 
            let fnsProcessedFiles_Actualcorecount   = utils.get_fns_value_bytopic(fns1.fnsProcessedFiles,"pcc_pcg","enm1",config.fns_job);
            let fns_expected_fnscorecount=Number(fns_received_PCC_PCG_files_beforeROP) + Number(config.pcc_pcg_filecount);
            console.log("===============SFTP-CORE-FT->Polling metrics to get Expected Value==============");
            console.log("Actual FNS core Count : ",fnsProcessedFiles_Actualcorecount);
            console.log("Expected FNS core Count : ",fns_expected_fnscorecount);
            console.log("Files from  RESTSIM to SFTP-CORE-FT                :",value_from_RESTSIMtoCORE);
            console.log("BeforeROP SFTP-CORE-FT_Input kafka messgage received  :",sftp_core.sftpInputTopic_count_BeforeROP);
            console.log("Files from  RESTSIM to SFTP-CORE-FT                :",value_from_RESTSIMtoCORE);
            console.log("SFTP-CORE-FT Actual Processed count                  :",sftp_Actual_Final_count_core);
            console.log("SFTP-CORE-FT Expected Processed count                :",sftp_Expected_Final_count_core);
            console.log("Core parser Actual processed count                  :",Core_parser_actual_parser_values);
            console.log("Core parser Expected processed count                :",Core_parser_parsed_expected_values);
            console.log("===================================================================");
      //Validate Assertions when all expected files are transsferred and processed form RESTSIM to Core Parser
            if (sftp_Expected_Final_count_core == sftp_Actual_Final_count_core && value_from_RESTSIMtoCORE != 0 && Core_parser_actual_parser_values == Core_parser_parsed_expected_values  && fnsProcessedFiles_Actualcorecount == fns_expected_fnscorecount){
            microservices_Assertions();
                break;
        }
            else if (core_processingTime == 590) {
                console.error("Either Actual or Expected Values are not same,Testing started.Please check the count Polling Metrics to get expected count values in logs");
                microservices_Assertions();
                break;
        }
        sleep(10);
        core_processingTime += 10;
    }
}
//Method of Assertions for Core Stats
export function microservices_Assertions(){
    group("Validation of Core stats file parsing through CORE parser",function(){
        //sftp.SFTP_FT_getStatusCode();
        sftp_core.SFTP_FT_getMetricsValue_afterROP();
        //fns.FNS_getStatusCode();
        fns.FNS_getMetricsValue_corestats_afterRop();
        //coreParser.parser_getStatusCode();
        coreParser.coreparser_getMetricsValue_AfterRop();
        })
}

