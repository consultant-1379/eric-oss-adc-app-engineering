import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as config from"./config.js";

var ROP;
//Method for Generating the ROP where REST SIm will generate files and send to FNS


export function generateRop(){
    let params = {
        timeout: '200s'
       };
     ROP = http.get(config.RESTSim_URL+"/api/v1/start-pm-generation",params);
     console.log("The Status Code of ROP ",ROP.status);
     console.log(ROP.body);
     return ROP.status
}