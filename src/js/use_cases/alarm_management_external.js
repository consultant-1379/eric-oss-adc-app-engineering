import http from 'k6/http';
import {
    check,
    group
} from 'k6';
import { metrics_URL } from '../use_cases/config.js';
export default function() {
    /*This use case validates retrieval of Alarm Management check details.*/
    group('Validation of Alarm Management Assertions', function() {
        console.log(metrics_URL);
        const ALARM_MANAGEMENT = http.get(metrics_URL + '/metrics/viewer/api/v1/targets?state=active');
        const result = check(ALARM_MANAGEMENT,{
            'Successfully Checks Alarm Management details': (r) => ALARM_MANAGEMENT.status === 200,
        });
        if (!result) {
            console.error("Alarm Management status verification failed , status is " + ALARM_MANAGEMENT.status);
        }
        if (ALARM_MANAGEMENT.status === 200) {
            let count = 0;
            let pools = JSON.parse(ALARM_MANAGEMENT.body);
            let allPoolsUp = true;
            for (let i = 0; i < pools.data.activeTargets.length; i++) {
                    let target = pools.data.activeTargets[i];
                    if (target.health != "up" && target.labels.app_kubernetes_io_instance == "eric-oss-adc") {
                    console.log("TARGET DOWN: " + target.scrapePool);
                    if (target.labels.pod_name != undefined) {
                        console.log("POD NAME: " + target.labels.pod_name);
                    }
                    else if (target.discoveredLabels.__meta_kubernetes_pod_name != undefined) {
                        console.log("POD NAME: " + target.discoveredLabels.__meta_kubernetes_pod_name);
                    }
                    count++;
                    allPoolsUp = false;
                }
            }
            console.log("Total no of pods connections UNHEALTHY ="+count)
            console.log("allpool up --> "+allPoolsUp)
                check(allPoolsUp, {
            "All scrape pools should be up": (r) => allPoolsUp == true
                });
        }
    });
}
