import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';

import * as utils from "./utils.js";
import * as config from"./config.js";
import * as filetrans from "./4GPMEvent_internal.js"

export var pmevent_4G_Parser_Input_count_BeforeROP,pmevent_4G_Parser_processed_count_BeforeROP,pmevent_4G_Parser_Sent_count_BeforeROP,pmevent_4G_Parser_drop_count_BeforeROP,pmevent_4G_Parser_propretiary_processed_count_BeforeROP;
export var pmevent_4G_Parser_Input_count_AfterROP,pmevent_4G_Parser_processed_count_AfterROP,pmevent_4G_Parser_Sent_count_AfterROP,pmevent_4G_Parser_drop_count_AfterROP,pmevent_4G_Parser_propretiary_processed_count_AfterROP;
export var pmevent_ft_produced_event_files_BeforeROP,pmevent_ft_produced_event_files_AfterROP;

export const PMEventparser_4G_input_received =  utils.pm_server_baseUrl +"csm_received_event_count";
export const PMEventparser_4G_processed =  utils.pm_server_baseUrl +"csm_ctr_processed";
export const PMEventparser_4G_Propretiary_processed =  utils.pm_server_baseUrl +"csm_ctr_processed_proprietary";
export const PMEventparser_4G_sent =  utils.pm_server_baseUrl +"csm_sent_event_count";
export const PMEventParser_4G_dropcount=utils.pm_server_baseUrl +"csm_event_drop_count";


let metrics_Parser = {
    'PMEventparser_4G_input_received': PMEventparser_4G_input_received,
    'PMEventparser_4G_processed': PMEventparser_4G_processed,
    'PMEventparser_4G_sent': PMEventparser_4G_sent,
    'PMEventparser_4G_Propretiary_processed': PMEventparser_4G_Propretiary_processed
};

//Method for getting Metric Values before hitting the ROP
export function parser_4GPmEvent_getMetricsValue_BeforeRop(){
    pmevent_4G_Parser_Input_count_BeforeROP       =  utils.get_metrics_total_replica(PMEventparser_4G_input_received,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_processed_count_BeforeROP   = utils.get_metrics_total_replica(PMEventparser_4G_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_propretiary_processed_count_BeforeROP = utils.get_metrics_total_replica(PMEventparser_4G_Propretiary_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_Sent_count_BeforeROP        = utils.get_metrics_total_replica(PMEventparser_4G_sent,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_drop_count_BeforeROP        = utils.get_metrics_total_replica(PMEventParser_4G_dropcount,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_ft_produced_event_files_BeforeROP     = utils.get_metrics_total_replica(filetrans.pmeventProducedevents,config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);

    console.log("====================  4G PMEvent Parser metric values Before ROP ====================================");
    console.log("Initial number of events produced by 4G File Transfer       :", pmevent_ft_produced_event_files_BeforeROP)
    console.log("Initial number of events input kafka message received count :",pmevent_4G_Parser_Input_count_BeforeROP);
    console.log("Initial number of events Standard processed by 4G Pm Event Parser    :",pmevent_4G_Parser_processed_count_BeforeROP);
    console.log("Initial number of events Propretairy processed by 4G Pm Event Parser    :",pmevent_4G_Parser_propretiary_processed_count_BeforeROP);
    console.log("Initial number of events sent to output Kafka               :",pmevent_4G_Parser_Sent_count_BeforeROP);
    console.log("Initial number of dropped events count                      :",pmevent_4G_Parser_drop_count_BeforeROP);
    console.log("===============================================================================================");
}
//Method for getting Metric Values after hitting the ROP
export function parser_4GPmEvent_getMetricsValue_AfterRop(){

    pmevent_4G_Parser_Input_count_AfterROP       = utils.get_metrics_total_replica(PMEventparser_4G_input_received,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_processed_count_AfterROP   = utils.get_metrics_total_replica(PMEventparser_4G_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_propretiary_processed_count_AfterROP   = utils.get_metrics_total_replica(PMEventparser_4G_Propretiary_processed,config.pm_event_4g_job,config.pm_event_4g_parser_app);
    pmevent_4G_Parser_Sent_count_AfterROP        = utils.get_metrics_total_replica(PMEventparser_4G_sent,config.pm_event_4g_job,config.pm_event_4g_parser_app); 
    pmevent_4G_Parser_drop_count_AfterROP        = utils.get_metrics_total_replica(PMEventParser_4G_dropcount,config.pm_event_4g_job,config.pm_event_4g_parser_app); 
    pmevent_ft_produced_event_files_AfterROP     = utils.get_metrics_total_replica(filetrans.pmeventProducedevents,config.pmEvent_4g_FileTransfer_Job,config.pmEvent_4g_FileTransfer_App);

    console.log("==================== 4G PMEvent Parser metric values After ROP ====================================");
    console.log("After ROP - Number of events produced by 4G File Transfer      :",pmevent_ft_produced_event_files_AfterROP);
    console.log("After Rop - Number of events input kafka message received count:",pmevent_4G_Parser_Input_count_AfterROP);
    console.log("After Rop - Number of events Standard processed by 4G Pm Event Parser   :",pmevent_4G_Parser_processed_count_AfterROP);
    console.log("After Rop - Number of events Propretiary processed by 4G Pm Event Parser   :",pmevent_4G_Parser_propretiary_processed_count_AfterROP);
    console.log("After Rop - Number of events sent to output Kafka              :",pmevent_4G_Parser_Sent_count_AfterROP);
    console.log("After Rop - Number of dropped events by 4G Parser              :",pmevent_4G_Parser_drop_count_AfterROP);
    console.log("===============================================================================================");
       let diff_4G_ft_produced_events_count       = Number(pmevent_ft_produced_event_files_AfterROP)-Number(pmevent_ft_produced_event_files_BeforeROP);
       let diff_4G_PmEvent_parser_inputkafka_count = Number(pmevent_4G_Parser_Input_count_AfterROP) - Number(pmevent_4G_Parser_Input_count_BeforeROP);
       let diff_4G_PmEvent_parser_Standard_processed_count = Number(pmevent_4G_Parser_processed_count_AfterROP) - Number(pmevent_4G_Parser_processed_count_BeforeROP);
       let diff_4G_PmEvent_parser_Propretiary_processed_count = Number(pmevent_4G_Parser_propretiary_processed_count_AfterROP) - Number(pmevent_4G_Parser_propretiary_processed_count_BeforeROP);
       let diff_4G_PmEvent_parser_sent_count = Number(pmevent_4G_Parser_Sent_count_AfterROP) - Number(pmevent_4G_Parser_Sent_count_BeforeROP);
       let diff_4G_PmEvent_parser_drop_count = Number(pmevent_4G_Parser_drop_count_AfterROP) - Number(pmevent_4G_Parser_drop_count_BeforeROP);

       console.log("====================  4G PMEvent Parser Processed metrics  After ROP  - Before ROP ====================================");
       console.log("Difference -  Number of events produced by 4G FT        :",diff_4G_ft_produced_events_count);
       console.log("Difference -  input kafka message received count        :",diff_4G_PmEvent_parser_inputkafka_count);
       console.log("Difference -  Number of Standard processed events count          :",diff_4G_PmEvent_parser_Standard_processed_count);
       console.log("Difference -  Number of Propretiary processed events count          :",diff_4G_PmEvent_parser_Propretiary_processed_count);
       console.log("Difference -  Number of events sent to output Kafka     :",diff_4G_PmEvent_parser_sent_count);
       console.log("Difference -  Number of events drop to output Kafka     :",diff_4G_PmEvent_parser_drop_count);
       console.log("===============================================================================================");

    group('Validation of 4GPmEventParser Test Assertions', function () {
        check(diff_4G_PmEvent_parser_sent_count, {
            'Verify 4G PM Event Parser Input topic is able to receive all expected events from 4G PMEvent File Transfer': (r) => Number(pmevent_4G_Parser_Input_count_AfterROP) !== 0 && Number(pmevent_4G_Parser_Input_count_BeforeROP) + Number(config.produced_events_count) == Number(pmevent_4G_Parser_Input_count_AfterROP),
            'Verify 4G PM Event Parser should be able to process the all expected 4GPM Standard Events and count is' : (r) =>
                Number(pmevent_4G_Parser_processed_count_AfterROP) != 0 && Number(diff_4G_PmEvent_parser_Standard_processed_count)==Number(config.standardTopic_4GParser_PublishedFiles),
            'Verify 4G PM Event Parser is able to process the all expected Number of Propretiary events is ' : (r) => Number(pmevent_4G_Parser_propretiary_processed_count_AfterROP) != 0 && Number(diff_4G_PmEvent_parser_Propretiary_processed_count)==Number(config.propretiaryTopic_4GParser_PublishedFiles),
            'Validate that 4G PM Event Parser is able to publish expected events to output topic and count is ' : (r) => Number(diff_4G_PmEvent_parser_sent_count) !== 0 && Number(diff_4G_PmEvent_parser_sent_count) == Number(config.produced_events_count),
            'Validate that 4G PM Event Parser is not dropping any events and Number of 4G PMEvent dropped events is ' :(r) => Number(diff_4G_PmEvent_parser_drop_count) == 0  && Number(pmevent_4G_Parser_drop_count_AfterROP) == 0,

        });
    });
}