import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as config from"./config.js";


export function RESTSIM_health_check(){
    let i=0;
    var Stub_check,Status_code;
    while(i<450){
    try{
    Stub_check = http.get(config.RESTSim_URL+"/api/v1/check-server-status");
    //console.log("Dependency : checking RESTSIM is deployed... ",Stub_check.status);
    Status_code= Stub_check.status;
       if (Status_code == 200){
            console.log("RESTSIM is UP and Healthy");
         break;
        }
    }
    catch(err){
    console.log("Waiting for RESTSIM to Come up...");
    }
    sleep(5);
    i+=5;
   }
}

export function verify_enm_data_in_ssm(){
    let i=0;
    var get_enm_data;
    while(i<180){
    try{
    get_enm_data = http.get(config.connected_system_url+"/subsystem-manager/v1/subsystems");
    let parse_data = JSON.parse(get_enm_data.body);
    let Length_of_response = Object.keys(parse_data).length;
    console.log(Length_of_response);
    for (let i = 0; i < Length_of_response; i++){
    if ((parse_data[i].name)=="enm1"){
      if(parse_data[i].url!=null);
          console.log("ENM is available in Connected System");
          return;
    } 
  }
}   
    catch(err){
    console.log("Waiting for Connected system to up");
    }
    console.log("Checking ENM details in connected system entries...");
    sleep(5);
    i+=5;
   }
}