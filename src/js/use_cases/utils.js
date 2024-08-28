import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as config from "./config.js";
export var pm_server_baseUrl;
const GAS_URL = config.GAS_URL;
const TLS_ENABLED = config.TLS_ENABLED;
const metrics_URL = config.metrics_URL;
pm_server_baseUrl = metrics_URL+'/metrics/viewer/api/v1/query?query=';


export function get_statusCode(metrics){
    let get_metric = http.get(metrics);
    return get_metric.status
}

export function get_valueFromMetrics_resultIndexZero(metrics){
    let get_values=http.get(metrics);
    let parse_data= JSON.parse(get_values.body);
    let Count = parse_data.data["result"]["0"]["value"]["1"];
    return Count
}

export function get_valueFromMetrics_resultIndexOne(metrics){
    let get_values=http.get(metrics);
    let parse_data= JSON.parse(get_values.body);
    let Count = parse_data.data["result"]["1"]["value"]["1"];
    return Count
}

export function get_fns_value_bytopic(metrics,topicname,enmType,job){
   let get_values = http.get(metrics);
   let parse_data = JSON.parse(get_values.body);
   let Length_of_response = Object.keys(parse_data.data["result"]).length;
   for (let i=0; i<Length_of_response; i++) {
       let topic = parse_data.data.result[i].metric.topic;
       let enmName = parse_data.data.result[i].metric.enmName;
       let jobname = parse_data.data.result[i].metric.job;
       if (topic == topicname && enmName == enmType && job == jobname) {
           let val = parse_data.data["result"][i]["value"]["1"];
           return val;
       }
   }
}
export function get_service_topic_count(tls_metrics,nontls_metrics,job_name,app_name){
    let value=0;
    if(TLS_ENABLED == "True"){
        value = get_metrics_total_replica(pm_server_baseUrl+tls_metrics,job_name,app_name);
       }
    else if(TLS_ENABLED == "False")
       {
        value = get_metrics_total_replica(pm_server_baseUrl+nontls_metrics,job_name,app_name);
       }
       return value;
}
export function get_metrics_total_replica(metrics,job_name,app_name) {
    let get_values = http.get(metrics);
    var value,sum=0;
    let parse_data = JSON.parse(get_values.body);
    let Length_of_response = Object.keys(parse_data.data["result"]).length;
    for (let i = 0; i < Length_of_response; i++) {
        let job = parse_data.data.result[i].metric.job;
        let app = parse_data.data.result[i].metric.app_kubernetes_io_name;
        if (job == job_name && app == app_name) {
            value = parse_data.data["result"][i]["value"]["1"];
            sum+=Number(value);
        }
    }
    return sum;
}
// This below method is not used anywhere keeping it until get solution from healthcheck of RESTSIM
export function FNS_login_into_ENM(){
    let get_values = http.get("http://eric-pm-server:9090/metrics/viewer/api/v1/query?query=eric_oss_enm_fns:logins_successful_total");
    let parse_data = JSON.parse(get_values.body);
    let Length_of_response = Object.keys(parse_data.data["result"]).length;
    for (let i=0; i<Length_of_response; i++) {
        let enmName = parse_data.data.result[i].metric.enmName;
        let jobname = parse_data.data.result[i].metric.job;
        if (enmName == "enm1" && "eric-oss-enm-fns" == jobname) {
            let val = parse_data.data["result"][i]["value"]["1"];
            return val;
        }
    }
}

/*
Following method written to calculate the average processing time of the pod replicas.
Currently Following Method not being used and instead we use ms/pod listeners to calculate processing time.
*/

export function avg_processing_time(){
    let get_values = http.get(pm_server_baseUrl+"eric_oss_3gpp_parser_processed_counter_files_time_total_seconds_sum");
    var value,average,sum=0;
    let parse_data = JSON.parse(get_values.body);
    let Length_of_response = Object.keys(parse_data.data["result"]).length;
    for (let i = 0; i < Length_of_response; i++) {
        let job = parse_data.data.result[i].metric.job;
        if (job == config.Ran_parser_job) {
            value = parse_data.data["result"][i]["value"]["1"];
            sum+=Number(value);
        }
    }
    average = sum/Length_of_response;
    return average;
}
//Method for Calculating KafkaListenres processing time
export function processingTime_KafkaListeners(prometheusMetric,gasUrlMetric){
console.log("--------------------Microservice Processing time calculation - Start----------------------");

// TLS_ENABLED is use to verify TLS pipeline(AS) as Enabled whereas NON-TLS pipeline(PS) as Disabled. 

    let response ;
    if(TLS_ENABLED == "True"){
     response = http.get(pm_server_baseUrl+gasUrlMetric);
    console.log("URL : ",pm_server_baseUrl+gasUrlMetric);
    }
    else if(TLS_ENABLED == "False")
    {
     response = http.get(pm_server_baseUrl+prometheusMetric);
    console.log("URL : ",pm_server_baseUrl+prometheusMetric);

    }

    let responseBody = JSON.parse(response.body);
    //console.log("responseBody : ",responseBody);

    let averageProcessingTime,totalProcessingTime=0;
    let count_KafkaListeners = Object.keys(responseBody.data["result"]).length;
    //console.log("count of microservice Listeners : ",count_KafkaListeners);

    for (let i = 0; i < count_KafkaListeners; i++) {

        let listenerName = responseBody.data.result[i].metric.name;
        console.log("listenerName " + (i+1) +" :" ,listenerName );
        let  listener_ProcessingTime = responseBody.data["result"][i]["value"]["1"];
        console.log("listener_ProcessingTime "+(i+1)+" :" ,listener_ProcessingTime );

        totalProcessingTime+=Number(listener_ProcessingTime);

    } //for -end
   console.log("Sum of "+count_KafkaListeners+" listeners processing time: ",totalProcessingTime);

   averageProcessingTime = totalProcessingTime/count_KafkaListeners;
   console.log("Average ProcessingTime of "+count_KafkaListeners+" listeners: ",averageProcessingTime);

   console.log("--------------------Microservice Processing time calculation - End----------------------");
    return averageProcessingTime;
}

var fetch_metrics;                                                                                                                                              
export function fetch(NODETYPE){                                                                                                                                
    let params = {                                                                                                                                              
        timeout: '200s'                                                                                                                                         
       };        
     let result;                                                                                                                                               
     fetch_metrics = http.get("http://eric-oss-fls-notifier:8080/api/v1/latest-metrics",params);                                                                
     console.log("The Status Code of instrumentation cluster metrics ",fetch_metrics.status);                                                                                               
     //console.log(fetch_metrics.body);                                                                                                                           
     let parse_data = JSON.parse(fetch_metrics.body);                                                                                                           
     for(let i = 0; i <= 3; i++) {                                                                                                                              
     let nodetype = parse_data["enm-1"][i].nodeType;                                                                                                            
     if( nodetype == NODETYPE){                                                                                                                                 
          result = parse_data["enm-1"][i].fileCount;                                                                                                         
}                                                                                                                                                               
}   
   return result; 
}

/*This method is to validate rappid is being used for creating subscription*/
export function get_rappid(rappid){

let GET_RAPPID = http.get(config.datacatalog_V2_Endpoint + 'subscriptions/?rAppId='+rappid)
console.log(GET_RAPPID.body);
console.log(GET_RAPPID.status);
let body = JSON.parse(GET_RAPPID.body);
while(body.length!==0){
    rappid=rappid+1;
    GET_RAPPID = http.get(config.datacatalog_V2_Endpoint + 'subscriptions/?rAppId='+rappid)
    console.log (GET_RAPPID.body);
    console.log (GET_RAPPID.status);
    body = JSON.parse(GET_RAPPID.body);
   }
return rappid;
}
