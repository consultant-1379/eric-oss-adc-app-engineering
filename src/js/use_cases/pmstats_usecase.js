import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as sftp from"./SFTP_FT_internal.js";
import * as fns from"./FNS_internal.js";
import * as rop from"./ROP.js";
import * as ranParser from"./Ran-parser_internal.js";
import * as utils from"./utils.js";
import * as config from"./config.js";
import * as subscription from "./Subcription_Utils.js";
import * as topic from "./OutputTopic_Validation.js";
import * as File_validation from "./Static_file_validation.js";

var fns_starttime;
var ranParser_endtime;
var totalTimeFromFNStoRanParser;
var value_from_RESTSIMtoSFTP,fetch_fns_received_files_beforeROP,fetch_fns_received_files;
let optionsfile = `${__ENV.OPTIONS_FILE}`;

//Method For validating PM Stats flow
export default function (){
    if (optionsfile == "/resources/config/default.options.json"){
      value_from_RESTSIMtoSFTP = Number(config.pmStatsfilecount) + Number(config.EBSN_filecount);
      group('Validation of Registration of PM Stats output Topics in Datacatalog and Kafka', function () {
        topic.TopicValidation(config.expectedPMStatsTopicName, 120, 1,config.expectedpmstatsRetentionPeriod,config.expectedpmstatspartitions);
    });
    }
    else{
        value_from_RESTSIMtoSFTP = config.pmStatsfilecount;
    }
    fetch_fns_received_files_beforeROP = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,"sftp-filetrans","enm1",config.fns_job);
     //Subscription creation for SFTP RAN topic
     subscription.Creation_of_Subscription(config.Subscription_SFTP_RAN_Topic);
     if (optionsfile == "/resources/config/default.options.json"){
       //Method to create new SUbscription based on sample IDS as per SDK  
        subscription.Creation_of_Subscription(config.Subscription_SFTP_SDK);
       //Method to create new Subscription for 4G 
        subscription.Creation_of_Subscription(config.Subscription_SFTP_LTE);
        subscription.Creation_of_Subscription(config.Subscription_cRAN_CUUP);
        subscription.Creation_of_Subscription(config.Subscription_cRAN_CUCP);
        subscription.Creation_of_Subscription(config.Subscription_cRAN_du);
      }
     sleep(145);//Subscription logic requires to wait for 135 seconds post we creates subscription before hitting the ROP
  //Getting Metric values before Hitting ROP
    fns.FNS_getMetricsValue_pmstats_beforeRop();
    sftp.SFTP_FT_getMetricsValue_beforeRop();
    ranParser.parser_getMetricsValue_BeforeRop();
    console.log("We are Going to Hit the ROP");

    let ROP_status = rop.generateRop();
    console.log("Time After Hit the ROp");
    //Validating whether ROP status is 200 or not
    if(ROP_status == 200){
        let processingTime = 0;
        var i = 1;
        //Method to Validate whether RESTSIM is able to generate and FNS Started receiving PM Stats files
        while(i < config.buffertime)
        {
        //value_fromSTUBtoSFTP = utils.fetch("NR")+ utils.fetch("LTE");
        console.log("Waiting for RestSim to generate files.");
        fetch_fns_received_files = utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,"sftp-filetrans","enm1",config.fns_job);
        let diff_fns_received = fetch_fns_received_files - fetch_fns_received_files_beforeROP
        if(diff_fns_received > 0){ //To start Time when fns received first notification.
        fns_starttime = Date.now();
        console.log("Timestamp - FNS Microservice starts time in milliseconds  - ",fns_starttime);
        break;
        }
        sleep(10);
        i = i+9;
        } //while - end
        console.log("Timestamp - Start Time of FNS has been captured");
        //Post FNS started receiving Pm Stats files then below method will check PM Stats flow
        while (processingTime <= config.timeoutLimit) {
            let fns_actual_value=utils.get_fns_value_bytopic(fns.fnsreceiviedfiles,"sftp-filetrans","enm1",config.fns_job);
            let fns_expected_value=Number(fetch_fns_received_files_beforeROP)+Number(value_from_RESTSIMtoSFTP);
            let sftp_Actual_Final_count_input_kafka_message = utils.get_metrics_total_replica(sftp.sftpInputTopic,config.sftp_job,config.sftp_app);
            let sftp_Expected_Final_count_input_kafka_message = Number(sftp.sftpInputTopic_count_BeforeROP) + Number(value_from_RESTSIMtoSFTP); // 100+ 1400 = 1500
            let sftp_Actual_Final_count_output_kafka_message = utils.get_metrics_total_replica(sftp.sftpOutputTopic,config.sftp_job,config.sftp_app);
            let sftp_Expected_Final_count_output_kafka_message = Number(sftp.sftpOutputTopic_count_BeforeROP) + Number(value_from_RESTSIMtoSFTP);
            let Ran_parser_parsed_expected_values= Number(ranParser.parser_ParsedSuccessful_Count_BeforeROP)+ Number(config.pmStatsfilecount);
            let Ran_parser_actual_parser_values = utils.get_metrics_total_replica(ranParser.pmparserPMounterFilesSuccessfulParsed,config.Ran_parser_job,config.Ran_parser_app);
            let Ran_parser_inputkf_expected= Number(ranParser.parser_Inputkafka_Count_BeforeROP)+ Number(value_from_RESTSIMtoSFTP);
            let Ran_parser_inputkf_actual = utils.get_metrics_total_replica(ranParser.pmparserInputkafkaReceived,config.Ran_parser_job,config.Ran_parser_app);

            console.log("===============SFTP-FT->Polling metrics to get Expected Value==============");
            console.log("Number of Files from RESTSIM                        :",value_from_RESTSIMtoSFTP);
            console.log("FNS Actual files received from RESTSIM is           : ",fns_actual_value);
            console.log("FNS Expected files to be received from RESTSIM is   :",fns_expected_value);
            console.log("BeforeROP SFTP-FT_Input kafka messgage received     :",sftp.sftpInputTopic_count_BeforeROP);
            console.log("SFTP-FT Actual inputkafka messages received         :",sftp_Actual_Final_count_input_kafka_message);
            console.log("SFTP-FT Expected inputkafka messages received       :",sftp_Expected_Final_count_input_kafka_message);
            console.log("SFTP-FT Actual outputkafka messages received         :",sftp_Actual_Final_count_output_kafka_message);
            console.log("SFTP-FT Expected outputkafka messages received       :",sftp_Expected_Final_count_output_kafka_message);

            console.log("RAN parser Actual inputkafka count  received              :",Ran_parser_inputkf_actual);
            console.log("RAN parser Expected input kafka count received               :",Ran_parser_inputkf_expected);
            console.log("RAN parser Actual processed count                  :",Ran_parser_actual_parser_values);
            console.log("RAN parser Expected processed count                :",Ran_parser_parsed_expected_values);
            console.log("===================================================================");
            //Validate Assertions when all 10k files are transsferred and processed form RESTSIM to RanParser
            if ( sftp_Actual_Final_count_input_kafka_message >= sftp_Expected_Final_count_input_kafka_message && sftp_Actual_Final_count_output_kafka_message >= sftp_Expected_Final_count_output_kafka_message && value_from_RESTSIMtoSFTP != 0 && Ran_parser_actual_parser_values >= Ran_parser_parsed_expected_values){
                ranParser_endtime = Date.now();
                console.log("Timestamp - RanParser Microservice end time in milliseconds  - ",ranParser_endtime);
                totalTimeFromFNStoRanParser= (ranParser_endtime - fns_starttime)/1000;
                console.log("Timestamp - Total time taken from FNS -> Sftp-Ft -> RanParser in seconds :",totalTimeFromFNStoRanParser);
                console.log("The Actual and Expected Values are matched with RESTSIM count with ranparser processed files,Testing started");
                microservices_Assertions_Timestamp_RateFactor();
                break;
        }
            //Validate Assertions- even  when all 1ok files are not transsferred and processed by Ran Parser with in Scheduled time
            else if (processingTime == (config.timeoutLimit-10)) {
                console.error("Either Actual or Expected Values are not same,Testing started.Please check the count Polling Metrics to get expected count values in logs");
                microservices_Assertions();
                break;
        }
        //checking FNS and SFTP and RAN Parser whether recieved and processed all 10k files for every 10 seconds
        sleep(10);
        processingTime += 10;
    }
}
    else{
        console.error("ROP generateRop API return error other than 200 response ,Testing started");
        microservices_Assertions();
        }
        //Static File Assertions
        File_validation.static_file_validation()
    }

//Method for validating PM Stats flow Assertions
export function microservices_Assertions(){
    group("Validation of PMStats file parsing through Ran parser",function(){
        //sftp.SFTP_FT_getStatusCode();
        sftp.SFTP_FT_getMetricsValue_afterROP();
        //fns.FNS_getStatusCode();
        fns.FNS_getMetricsValue_pmstats_afterRop();
        //ranParser.parser_getStatusCode();
        ranParser.parser_getMetricsValue_AfterRop();
        group("Validation of Total TimeTaken for PMStats End to End file flow",function(){
            check("Total time taken from  FNS -> Sftp-Ft -> RanParser ", {
             ['RESTSIM sent files and processed files of microservices are different , timestamp can not be captured . Please verify the issue.' ]:(r)=> Number(totalTimeFromFNStoRanParser)>0,  
                 });
         })
        })
}
//Method for validating Throughput rate factors metrics
export function throughput_RateFactor_pmStatsFiles()
{
      let pmstatsFileinBytes = sftp.Diff_sftpBDRDataVolume_count;
      let sftp_BDRDataVolume = pmstatsFileinBytes/1000000000;
      let rateOfFilesTransferedPerSec = value_from_RESTSIMtoSFTP/totalTimeFromFNStoRanParser;
      group("Validation of Rate of PMStats files transfered",function(){
        check("pm-stats files rate factor", {
           ['PM Stats total number of files transfered - ' + Number(value_from_RESTSIMtoSFTP)]:(r)  => Number(value_from_RESTSIMtoSFTP),
           ['PM Stats files BDR data Volume in GB ' + Number(sftp_BDRDataVolume)]:(r)  => Number(sftp_BDRDataVolume),
           ['PM Stats files transfered per second ' + Number(rateOfFilesTransferedPerSec)]:(r)  => Number(rateOfFilesTransferedPerSec) ,
                  });
                })
}
export function microservices_Assertions_Timestamp_RateFactor(){
    group("Validation of PMStats file parsing through Ran parser",function(){
        //sftp.SFTP_FT_getStatusCode();
        sftp.SFTP_FT_getMetricsValue_afterROP();
        //fns.FNS_getStatusCode();
        fns.FNS_getMetricsValue_pmstats_afterRop();
        //ranParser.parser_getStatusCode();
        ranParser.parser_getMetricsValue_AfterRop();

        group("Validation of Total TimeTaken PMStats file flow",function(){
          check("Time Taken", {
              ['Timestamp - Total time taken to parsing pm stats files from RESTSIM in seconds : '+ Number(totalTimeFromFNStoRanParser)]:(r) => Number(totalTimeFromFNStoRanParser),

                });
                 })

        throughput_RateFactor_pmStatsFiles();
        })
}
