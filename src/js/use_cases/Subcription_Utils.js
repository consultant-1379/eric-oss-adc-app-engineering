import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import * as config from "./config.js";
import * as utils from "./utils.js";
export var data1;

const fnsSubscriptions = utils.pm_server_baseUrl + "eric_oss_enm_fns:fns_subscriptions";
export var SubscriptionCount_Before_Subscription_SFTPTopic, SubscriptionCount_Before_Subscription_PCCPCGTopic, SubscriptionCount_Before_Subscription_5GTopic;
export var SubscriptionCount_Before_Subscription_ranParserAllSubscriptions_receivedTotal,SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_receivedTotal,SubscriptionCount_Before_Subscription_ranParserInActiveSubscriptions_receivedTotal,SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_FromDataCatalogAPI,SubscriptionCount_Before_Subscription_ranParserTotalActiveSubscriptions;
export var SubscriptionCount_Before_pmeventActiveSubscriptions;
export var SubscriptionCount_Before_Subscription_4GTopic,SubscriptionCount_After_Subscription_4GTopic;

//"num.subscription.notification.messages.received.total"=====>total subscriptions recieved from dcc notification topic
const ranParserAllSubscriptions_receivedTotal = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_subscription_notification_messages_received_total";

//"num.active.subscription.notification.messages.received.total"====>total active subscriptions receivedfrom dcc notificationTopic
const ranParserActiveSubscriptions_receivedTotal = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_active_subscription_notification_messages_received_total";

//"num.of.inactive.subscription.notification.messages.received.total"=======>total InActive subscriptions receivedfrom dcc notificationTopic
const ranParserInActiveSubscriptions_receivedTotal = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_of_inactive_subscription_notification_messages_received_total";

//"num.of.active.subscriptions.fetched.from.data.catalog.api.total"=======>total active subscriptions fetched from data catalog get api, it contains total active subscriptions receivedfrom dcc notificationTopic
const ranParserActiveSubscriptions_FromDataCatalogAPI = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_of_active_subscriptions_fetched_from_data_catalog_api_total";

//"num.of.active.subscriptions.available.total"========>total active subscriptions available in Ran-Parser
const ranParserTotalActiveSubscriptions = utils.pm_server_baseUrl + "eric_oss_3gpp_parser_num_of_active_subscriptions_available_total";

// 5G active subscription eric_oss_5gpmevt_filetx_proc:active_subscriptions
const pmeventActiveSubscriptions = utils.pm_server_baseUrl + "eric_oss_5gpmevt_filetx_proc:active_subscriptions";
//4G Active Subscriptions
const PmEvent_4G_Subscriptions=utils.pm_server_baseUrl + "csm_active_data_subscriptions";

let rappid = 0;
//Method for Creating the Subscription
export function Creation_of_Subscription(Subscriptionvalue) {
    group('Validation of Creation of New Subscription', function () {
        let i = Subscriptionvalue;
        console.log("Started creation of new Subscription for " + config.Subscription_topicname[i] + "-----------");
        let randomInt = Date.now();
        rappid = utils.get_rappid(randomInt + config.Subscription_Name[i]);
        console.log("rappid",rappid);
        const data = {
            "version": "1.0",
            "subscriptions": [
                {
                    "name": config.Subscription_Name[i],
                    "isMandatory": "yes",
                    "isOnHold": "no",
                    "isTagged": "no",
                    "dataType": {
                        "dataspace": config.Subscription_dataSpace[i],
                        "dataCategory": config.Subscription_dataCategory[i],
                        "schemaName": config.Subscription_schemaName[i],
                        "schemaVersion": config.Subscription_schemaVersion[i]
                    },
                    "predicates":
                    {
                        "nodeName": [config.Subscription_nodename[i]]
                    }
                }
            ]
        };
        const head = {
            headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
            }
        }
        //Hitting the Subscription Creation API
        console.log("Subscription IDS used is ",data);
        console.log("rApp ID used in Subscription creation for topic - " +config.Subscription_topicname[i]+ " is ",rappid);
        const CREATE_SUBSCRIPTION = http.put(config.Subscription_Base + "/" + rappid, JSON.stringify(data), head);
        console.log("Status of New Subscription creation for " + config.Subscription_topicname[i] + "===================" + CREATE_SUBSCRIPTION.status);
        check(CREATE_SUBSCRIPTION, {
            ['Verify Status of Creation of New Subscription of Topic : ' + config.Subscription_topicname[i] + ' is ']: (r) => CREATE_SUBSCRIPTION.status == 200,
        })
        console.log("End of creation of new Subscription for " + config.Subscription_topicname[i] + "-----------");
    }); //Create New Subscription - group end
} // function - end

//Method for Creating pmevent Subscription
export function Creation_of_PmeventSubscription(Subscriptionvalue) {
    group('Validation of Creation of Pmevent Subscription', function () {
        let i = Subscriptionvalue;
        console.log("Started creation of pmevent Subscription for " + config.Subscription_topicname[i] + "-----------");
        let randomInt = Date.now();
        rappid = utils.get_rappid(randomInt + config.Subscription_Name[i]);
        console.log("rappid",rappid);
        if(i==5){
        data1 = {
            "version": "1.0",
            "subscriptions": [
                {
                    "name": config.Subscription_Name[i],
                    "isMandatory": "yes",
                    "isOnHold": "no",
                    "isTagged": "no",
                    "dataType": {
                        "dataspace": config.Subscription_dataSpace[i],
                        "dataCategory": config.Subscription_dataCategory[i],
                        "schemaName": config.Subscription_schemaName[i],
                        "schemaVersion": config.Subscription_schemaVersion[i]
                    },
                    "predicates":
                    {
                        
                    }
                }
            ]
        };
    }
    else{
        data1 = {
            "version": "1.0",
            "subscriptions": [
                {
                    "name": config.Subscription_Name[i],
                    "isMandatory": "yes",
                    "isOnHold": "no",
                    "isTagged": "no",
                    "dataType": {
                        "dataspace": config.Subscription_dataSpace[i],
                        "dataCategory": config.Subscription_dataCategory[i],
                        "schemaName": config.Subscription_schemaName[i],
                        "schemaVersion": config.Subscription_schemaVersion[i]
                    },
                    "predicates":
                    {
                        "nodeName": [config.Subscription_nodename[i]],
                        "eventId": [config.Subscription_eventId_5g[0]]
                    }
                }
            ]
        };

    }
        const head = {
            headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
            }
        }
        console.log("Subscription IDS used is ",data1);
        console.log("rApp ID used in Subscription creation for topic - " +config.Subscription_topicname[i]+ " is ",rappid);
        //Hitting the Subscription Creation API
        const CREATE_SUBSCRIPTION = http.put(config.Subscription_Base + "/" + rappid, JSON.stringify(data1), head);
        console.log("Status of PmEvent Subscription creation for " + config.Subscription_topicname[i] + "===================" + CREATE_SUBSCRIPTION.status);
        sleep(10);
        check(CREATE_SUBSCRIPTION, {
            ['Verify Status of Creation of pmevent Subscription of Topic :' + config.Subscription_topicname[i] + 'is']: (r) => CREATE_SUBSCRIPTION.status == 200,
        })
        console.log("End of creation of pmevent Subscription for " + config.Subscription_topicname[i] + "-----------");
    }); //Create pmevent Subscription - group end
} // Create pmevent Subscription function - end


//Method to get the Subscription metrics values before creating the Subscription
export function Before_Subscription() {
    // Subscription Count for SFTP Topic
     SubscriptionCount_Before_Subscription_SFTPTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[0], "enm1", config.fns_job);

    // Subscription Count for PCC-PCG Topic
    SubscriptionCount_Before_Subscription_PCCPCGTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[1], "enm1", config.fns_job);

    // Subscription Count for 5G Topic
    SubscriptionCount_Before_Subscription_5GTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[2], "enm1", config.fns_job);

    //Ran-Parser Subscription Count
    SubscriptionCount_Before_Subscription_ranParserAllSubscriptions_receivedTotal = utils.get_valueFromMetrics_resultIndexOne(ranParserAllSubscriptions_receivedTotal);

    SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_receivedTotal = utils.get_valueFromMetrics_resultIndexOne(ranParserActiveSubscriptions_receivedTotal);

    SubscriptionCount_Before_Subscription_ranParserInActiveSubscriptions_receivedTotal = utils.get_valueFromMetrics_resultIndexOne(ranParserInActiveSubscriptions_receivedTotal);

    SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_FromDataCatalogAPI = utils.get_valueFromMetrics_resultIndexOne(ranParserActiveSubscriptions_FromDataCatalogAPI);

    SubscriptionCount_Before_Subscription_ranParserTotalActiveSubscriptions = utils.get_valueFromMetrics_resultIndexOne(ranParserTotalActiveSubscriptions);

    SubscriptionCount_Before_pmeventActiveSubscriptions = utils.get_valueFromMetrics_resultIndexZero(pmeventActiveSubscriptions);

    //Subscription Count for 4G Topic
    SubscriptionCount_Before_Subscription_4GTopic= utils.get_valueFromMetrics_resultIndexZero(PmEvent_4G_Subscriptions);



    console.log("----------------Subscription Count Before Creation of Subscription--------------");
    console.log("Subscritpion Count for SFTP Topic is ", SubscriptionCount_Before_Subscription_SFTPTopic);
    console.log("Subscritpion Count for PCC-PCG Topic is ", SubscriptionCount_Before_Subscription_PCCPCGTopic);
    console.log("Subscritpion Count for 5G Topic is ", SubscriptionCount_Before_Subscription_5GTopic);
    console.log("Subscritpion Count for Ran Parser all Subscriptions  is ", SubscriptionCount_Before_Subscription_ranParserAllSubscriptions_receivedTotal);
    console.log("Subscritpion Count for Ran Parser Active Subscriptions  is ", SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_receivedTotal);
    console.log("Subscritpion Count for Ran Parser InActive Subscriptions  is ", SubscriptionCount_Before_Subscription_ranParserInActiveSubscriptions_receivedTotal);
    console.log("Subscritpion Count for Ran Parser Active Subscriptions from DC is ", SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_FromDataCatalogAPI);
    console.log("Subscritpion Count for Ran Parser Total Active Subscriptions  is ", SubscriptionCount_Before_Subscription_ranParserTotalActiveSubscriptions);
    console.log("Subscritpion Count for pmevent Active Subscriptions  is ", SubscriptionCount_Before_pmeventActiveSubscriptions);
    console.log("Subscription Count for 4G PM EVent is ",SubscriptionCount_Before_Subscription_4GTopic);
    console.log("--------------------------------------------------------------------------------");
  //Validate the Subscritpion counts before Creating Subscription
    group("Validation of Subscription Counts", function () {
        group("Validation of Subscription Count Before creating new Subscription", function () {
            check("Validation of Subscription Count", {
                ['Verify Subscription count for FNS - PMStats Topic ']: (r) => SubscriptionCount_Before_Subscription_SFTPTopic == 0,
               ['Verify Subscription count for FNS - PCC-PCG Topic ']: (r) => SubscriptionCount_Before_Subscription_PCCPCGTopic == 0,
                ['Verify Subscription count for FNS - 5G Topic ']: (r) => SubscriptionCount_Before_Subscription_5GTopic == 0,
                //Below metrics are disbaled as they are for notificiation purpose not incremental Metrics .Please refer Ticket IDUN-96326
                //['Verify Ran Parser All Subscriptions Received Total Count  ']: (r) => SubscriptionCount_Before_Subscription_ranParserAllSubscriptions_receivedTotal == 0,
                //['Verify Ran Parser Active Subscriptions Received Total Count  ']: (r) => SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_receivedTotal == 0,
                //['Verify Ran Parser Active Subscriptions FromDataCatalogAPI Count  ']: (r) => SubscriptionCount_Before_Subscription_ranParserActiveSubscriptions_FromDataCatalogAPI == 0,
                //['Verify Ran Parser InActive Subscriptions Received Total Count  ']: (r) => SubscriptionCount_Before_Subscription_ranParserInActiveSubscriptions_receivedTotal == 0,
                ['Verify Ran Parser Total Active Subscriptions Count  ']: (r) => SubscriptionCount_Before_Subscription_ranParserTotalActiveSubscriptions == 0,
                ['Verify 5GPMEvent Active Subscriptions Count  ']: (r) => SubscriptionCount_Before_pmeventActiveSubscriptions == 0,
                ['Verify 4GPMEvent Active Subscriptions Count  ']: (r) => SubscriptionCount_Before_Subscription_4GTopic == 0,
            });
        });
    });



}
//Method to get the Subscription metrics values after creating the Subscription
export function After_Subscription() {
    // Subscription Count for SFTP Topic
    const SubscriptionCount_After_Subscription_SFTPTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[0], "enm1", config.fns_job);

    // Subscription Count for PCC-PCG Topic
    const SubscriptionCount_After_Subscription_PCCPCGTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[1], "enm1", config.fns_job);

    // Subscription Count for 5G Topic
    const SubscriptionCount_After_Subscription_5GTopic = utils.get_fns_value_bytopic(fnsSubscriptions, config.Subscription_topicname[2], "enm1", config.fns_job);

    //Ran-Parser Subscription Count
    const SubscriptionCount_After_Subscription_ranParserAllSubscriptions_receivedTotal_count = utils.get_valueFromMetrics_resultIndexOne(ranParserAllSubscriptions_receivedTotal);

    const SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_receivedTotal_count = utils.get_valueFromMetrics_resultIndexOne(ranParserActiveSubscriptions_receivedTotal);

    const SubscriptionCount_After_Subscription_ranParserInActiveSubscriptions_receivedTotal_count = utils.get_valueFromMetrics_resultIndexOne(ranParserInActiveSubscriptions_receivedTotal);

    const SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_DC_count = utils.get_valueFromMetrics_resultIndexOne(ranParserActiveSubscriptions_FromDataCatalogAPI);

    const SubscriptionCount_After_Subscription_ranParserTotalActiveSubscriptions_count = utils.get_valueFromMetrics_resultIndexOne(ranParserTotalActiveSubscriptions);

    const SubscriptionCount_After_pmeventActiveSubscriptions_count = utils.get_valueFromMetrics_resultIndexZero(pmeventActiveSubscriptions);
    //Subscription Count for 4G Topic
    SubscriptionCount_After_Subscription_4GTopic = utils.get_valueFromMetrics_resultIndexZero(PmEvent_4G_Subscriptions);


    console.log("------------------------Started Validation of Subscription Count--------------------------");
    console.log("----------------Subscription Count Post Creation of Subscription--------------");
    console.log("Subscription Count for SFTP Topic is ", SubscriptionCount_After_Subscription_SFTPTopic);
    console.log("Subscription Count for PCC-PCG Topic is ", SubscriptionCount_After_Subscription_PCCPCGTopic);
    console.log("Subscription Count for 5G Topic is ", SubscriptionCount_After_Subscription_5GTopic);
    console.log("Subscription Count for Ran Parser all Subscriptions  is ", SubscriptionCount_After_Subscription_ranParserAllSubscriptions_receivedTotal_count);
    console.log("Subscription Count for Ran Parser Active Subscriptions  is ", SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_receivedTotal_count);
    console.log("Subscription Count for Ran Parser InActive Subscriptions  is ", SubscriptionCount_After_Subscription_ranParserInActiveSubscriptions_receivedTotal_count);
    console.log("Subscription Count for Ran Parser Active Subscriptions from DC is ", SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_DC_count);
    console.log("Subscription Count for Ran Parser Total Active Subscriptions  is ", SubscriptionCount_After_Subscription_ranParserTotalActiveSubscriptions_count);
    console.log("Subscription Count for Pmevent Active Subscriptions  is ", SubscriptionCount_After_pmeventActiveSubscriptions_count);
    console.log("Subscription Count for 4G Pmevent Active Subscriptions  is ", SubscriptionCount_After_Subscription_4GTopic);

    console.log("--------------------------------------------------------------------------------");
//Validation of Subscription metrics
    group("Validation of Subscription Counts", function () {
        group("Validation of Subscription Count post creating New Subscription ", function () {
            check("Validation of Subscription Count", {
                ['Verify Subscription count for FNS - PM Stats Topic ']: (r) => SubscriptionCount_After_Subscription_SFTPTopic == Number(config.expected_SFTPTopic_Count),
                ['Verify Subscription count for FNS - PCC-PCG Topic ']: (r) => SubscriptionCount_After_Subscription_PCCPCGTopic == Number(config.expected_CoreTopic_Count),
                ['Verify Subscription count for FNS - 5G Topic ']: (r) => SubscriptionCount_After_Subscription_5GTopic == Number(config.expected_5GTopic_Count),
                //Below metrics are disbaled as they are for notificiation purpose not incremental Metrics .Please refer Ticket IDUN-96326
                //['Verify Ran Parser All Subscriptions Received Total Count  ']: (r) => SubscriptionCount_After_Subscription_ranParserAllSubscriptions_receivedTotal_count == Number(config.expected_Ran_AllSubscriptions_Count),
                //['Verify Ran Parser Active Subscriptions Received Total Count  ']: (r) => SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_receivedTotal_count == Number(config.expected_Ran_ActiveSubscriptions_Count),
                //['Verify Ran Parser Active Subscriptions FromDataCatalogAPI Count  ']: (r) => SubscriptionCount_After_Subscription_ranParserActiveSubscriptions_DC_count >= Number(config.expected_Ran_DCActiveSubscriptions_Count),
                //['Verify Ran Parser InActive Subscriptions Received Total Count  ']: (r) => SubscriptionCount_After_Subscription_ranParserInActiveSubscriptions_receivedTotal_count == Number(config.expected_Ran_InActiveSubscriptions_Count),
                ['Verify Ran Parser Total Active Subscriptions Count  ']: (r) => SubscriptionCount_After_Subscription_ranParserTotalActiveSubscriptions_count == Number(config.expected_Ran_TotalActiveSubscriptions_Count),
                ['Verify 5G PMEvent Active Subscriptions Count  ']: (r) => SubscriptionCount_After_pmeventActiveSubscriptions_count == Number(config.expected_pmevent_ActiveSubscriptions_Count),
                ['Verify 4G PMEvent Active Subscriptions Count  ']: (r) => SubscriptionCount_After_Subscription_4GTopic == Number(config.expected_4GPMEvent_ActiveSubscription_Count),

            });
        });
    });
    console.log("------------------End of Validation of Subscription Count -----------");
}
