import http from 'k6/http';
import {
    check, group, sleep
} from 'k6';
import * as utils from "./utils.js";
import * as config from "./config.js";
import * as ContentValidation from "./Content_validation.js";
import * as pmevent4G from "./4GPMEventParser_internal.js"
import * as output from "./OutputTopic_Validation.js";
export var output_content_buffertime = 720, i = 1;
export var content_validation_flag = false;
export var Output_Count_4G_FT_AfterROP, Output_Count_4G_FT_beforeROP;
export default function Validate_4G_FT_messageContent() {
    group('Validation of content of output Message for 4G PMEvent flow', function () {
        output.metrics_4G_FT_BeforeROP();
        //waiting for some time for Hitting Rop and File Generation
        sleep(240);
        while (i <= output_content_buffertime) {
            console.log("Waiting for 4G PM event FIle trnasfer to process the events");
            Output_Count_4G_FT_beforeROP = output.pmeventTransferedFiles_4G_Parser_BeforeROP;
            Output_Count_4G_FT_AfterROP = utils.get_metrics_total_replica(pmevent4G.PMEventparser_4G_input_received,config.pm_event_4g_job,config.pm_event_4g_parser_app);
            console.log("Count of 4G output files for Before ROP is ", Output_Count_4G_FT_beforeROP);
            console.log("Count of 4G output files for After ROP is ", Output_Count_4G_FT_AfterROP);
            let diff_output_count_4G = Number(Output_Count_4G_FT_AfterROP) - Number(Output_Count_4G_FT_beforeROP);

            //Method for Validating COntent Post Ran Parser recieve all 10k files
            if (diff_output_count_4G >= config.produced_events_count) {
                console.log("Started Validating Output Topic Message Content for 4G PM Events");
                //Required input parameters as Topic Name and Number of messages needs to be consumed and expected length and expected Headers
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_4G_FT, config.MessageCount, config.expectedLength_4G_FT, config.expected_headers_4G_FT);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_4G_parser,config.pmevent_4G_publishedFiles,config.pmevent_4G_flowType);
                content_validation_flag = true;
                check(content_validation_flag, {
                    ['Validate Whether 4G PM event pubished all expected files']: content_validation_flag == true,
                });
                break;
            }
            else if (i >= 690) {
                console.log("All expected files are not transffered yet .. Please check the logs ");
                check(content_validation_flag, {
                    ['Validate Whether 4G PM event pubished all expected files ']: content_validation_flag == true,
                })
            }
            i += 30;
            sleep(30);
        }
    });
}