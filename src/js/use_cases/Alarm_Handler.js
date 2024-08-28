import http from 'k6/http';
import {
    check,
    group
} from 'k6';
import * as config from "./config.js";
import * as utils from "./utils.js";
export const Alarm_success = utils.pm_server_baseUrl + "csm_http_req_success_alarm";
export const Alarm_fail = utils.pm_server_baseUrl + "csm_http_req_error_alarm";

// Below are the checks that MS validating for a alarm for each MS
/* when the output topic created successfully : KafkaConnectionError
 configuring all the kafka settings :  KafkaInvalidConfig
 when the ms reads and configures the app.  : InvalidConfig */

export var AlaramHandler_4G_Parser_Success, AlaramHandler_4G_Parser_Fail, AlaramHandler_VES_Success, AlaramHandler_VES_Fail;

export default function () {
    // This use case validates retrieval of Alarm Handler
    AlaramHandler_4G_Parser_Success = utils.get_metrics_total_replica(Alarm_success, config.pm_event_4g_job, config.pm_event_4g_parser_app);
    AlaramHandler_4G_Parser_Fail = utils.get_metrics_total_replica(Alarm_fail, config.pm_event_4g_job, config.pm_event_4g_parser_app);
    AlaramHandler_VES_Success = utils.get_metrics_total_replica(Alarm_success, config.Ves_job, config.Ves_app);
    AlaramHandler_VES_Fail = utils.get_metrics_total_replica(Alarm_fail, config.Ves_job, config.Ves_app);

    console.log("==================== Alarm Handling Metrics ====================================");
    console.log("Alarm-Handling : Number of Success requests for 4G Parser      :", AlaramHandler_4G_Parser_Success);
    console.log("Alarm-Handling : Number of Error requests for 4G Parser        :", AlaramHandler_4G_Parser_Fail);
    console.log("Alarm-Handling : Number of Success requests for Ves Collector  :", AlaramHandler_VES_Success);
    console.log("Alarm-Handling : Number of Error requests for Ves Collector    :", AlaramHandler_VES_Fail);
    console.log("===============================================================================");

    group('Validation of Alarm Handling Test Assertions for 4G PMEvent Parser and Ves Collector', function () {
        group('Validation of Alarm Handling checks for 4G PMEvent Parser', function () {
            check(AlaramHandler_4G_Parser_Success, {
                'Verify Number of Success requests for 4G PMEvent Parser': (r) => Number(AlaramHandler_4G_Parser_Success) > 0,
                'Verify Number of Error requests for 4G PMEvent Parser': (r) => Number(AlaramHandler_4G_Parser_Fail) == 0,
            }, { legacy: "false" });
        });
        group('Validation of Alarm Handling Test Assertions for Ves-Collector', function () {
            check(AlaramHandler_4G_Parser_Success, {
                'Verify Number of Success requests for Ves-Collector ': (r) => Number(AlaramHandler_VES_Success) > 0,
                'Verify Number of Error requests for Ves Collector ': (r) => Number(AlaramHandler_VES_Fail) == 0,
            }, { legacy: "false" });
        });
    });
}


