import {
    sleep
} from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.1/index.js';
import {
    textSummary
} from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import Ves_collector_flow from "./use_cases/VES/VES_external.js"
import {RESTSIM_health_check,verify_enm_data_in_ssm} from "./use_cases/setup.js"
import pmstats_flow from "./use_cases/pmstats_usecase.js"
import pmevent_flow from "./use_cases/pmevent_usecase.js"
import fns_dcc_registration from "./use_cases/FNS_DC_C.js"
import sftp_dcc from "./use_cases/SFTP_DC-C_UseCase.js"
import corestats_flow from "./use_cases/corestats_usecase.js"
import Subscription from "./use_cases/create_subscription.js"
import sftp_core_dcc from "./use_cases/SFTP_Core-DC-C.js"
import pmEvent_DCC from "./use_cases/PMEvent_DC-C_UseCase.js"
import Outputcontent_3Gpp_RANTopic from "./use_cases/OutputTopicValidation_3GPP_Ran.js"
import * as utils from"./use_cases/utils.js";
import pmEvent_4G_DCC from "./use_cases/4G-PM-EVENT-DC-C.js"
import Teardown from "./use_cases/teardown.js"
import KakfaTopiclist from "./use_cases/OutputTopic_Validation.js"
import pmevent_4G_flow from "./use_cases/pmevent_4G_E2E_Usecase.js"
import alarm_management_check from "./use_cases/alarm_management_external.js"
import Outputcontent_4G from "./use_cases/OutputTopicValidation_4G.js"
import alarm_handling from "./use_cases/Alarm_Handler.js"
import { configuration } from "./modules/configuration_value.js";
import messageconsume from "./use_cases/messages_consume.js"

export function handleSummary(data) {
    return {
        '/reports/summary.json': JSON.stringify(data),
        stdout: textSummary(data, {
            indent: ' ',
            enableColors: true
        }),

    };
}
// Set the UUID generated by the K6 image as a constant to be used in your code.
const UUID = `${__ENV.UUID}`;
//Set the API url used to publish results to the K6 Reporting Tool
const K6_API_URL = `${__ENV.K6_API_URL}`;
const gashostname= `${__ENV.metrics_url}`;

console.log("Metrics URL used : " ,utils.pm_server_baseUrl);
console.log("GAS Hostname : ",gashostname);

export function setup(){
    verify_enm_data_in_ssm();
    RESTSIM_health_check();
    sleep(90);
    configuration()
}
export function teardown(){
    console.log("TearDown Started");
    Teardown();

}

export function subscription() {
    try {
        Subscription();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in Subscription Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function Validate_OutputKafkaTopic() {
    try {
        KakfaTopiclist();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in Output Kafka Topic Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function Validate_messageConsumption() {
    try {
        messageconsume();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in Message Consumption Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function Ves_collector_flow_external() {
    try{
        Ves_collector_flow();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in Ves Collector Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}
export function pmstats_e2e_flow_internal() {
    try{
        pmstats_flow();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in PM Stats flow Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}
export function pmevent_e2e_flow_internal() {
    try{
        pmevent_flow();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in 5G PMEVent flow Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}
export function pmevent_4G_e2e_flow_internal() {
    try{
        pmevent_4G_flow();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in 4GPMEvent flow Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}
export function FNS_DCC_reg_internal() {
    try{
        fns_dcc_registration();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in FNS DC-C Registration Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }

}
export function SFTP_DCC_reg_internal() {
    try{
        sftp_dcc();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in SFTP DC-C Registration Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}
export function SFTP_Core_DCC() {
    try{
        sftp_core_dcc();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in SFTP Core DC-C Registration Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
}

export function corestats_e2e_flow_internal() {
    try{
        corestats_flow();
        }
        catch(e){
            let err=(e, e.stack.split("\n"));
            let name=(e.name);
            let message=( e.message);
            let exception_error = name.concat(" ", message);
            console.error(err);
            describe('Something went Wrong in Core Stats flow Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
    }
 }

   export function pmEvent_DC_C_Validations() {
   try{
           pmEvent_DCC();
          }
          catch(e){
              let err=(e, e.stack.split("\n"));
              let name=(e.name);
              let message=( e.message);
              let exception_error = name.concat(" ", message);
              console.error(err);
              describe('Something went Wrong in 5G PMEvent DC-C Registration Validations', (t) => {
                throw 'Please verify the logs for more information';
            });
      }



   }
export function ContentMessage_Validation_3gPP_RANTopic() {
    try {
        Outputcontent_3Gpp_RANTopic();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in PM Stats Content Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function ContentMessage_Validation_4G() {
    try {
        Outputcontent_4G();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in 4G Content Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function pmEvent_4G_DC_C_Validations() {
    try {
        pmEvent_4G_DCC();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in 4G PMEvent DC-C Registration Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function alarm_management_external() {
    try {
        alarm_management_check();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in Alarm Management Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}

export function alarm_handling_validations() {
    try {
        alarm_handling();
    }
    catch (e) {
        let err = (e, e.stack.split("\n"));
        let name = (e.name);
        let message = (e.message);
        let exception_error = name.concat(" ", message);
        console.error(err);
        describe('Something went Wrong in Alarm Handling Validations', (t) => {
            throw 'Please verify the logs for more information';
        });
    }
}