import http from 'k6/http';
import {
    check, group, sleep
} from 'k6';
import * as utils from "./utils.js";
import * as config from "./config.js";
import * as ContentValidation from "./Content_validation.js";
import * as ranParser from "./Ran-parser_internal.js";
import * as output from "./OutputTopic_Validation.js";
export var output_content_buffertime = 520, i = 1;
export var content_validation_flag = false;
export var parser_Output_Count_AfterROP, parser_Output_Count_beforeROP;
export default function Validate_RANParser_messageContent() {
    group('Validation of content of output Topics for 3GPP RAN Parser', function () {
        output.metrics_BeforeROP();
        //waiting for some time for Hitting Rop and File Generation
        sleep(450);
        while (i <= output_content_buffertime) {
            console.log("Waiting for Ran Parser to parse the files");
            parser_Output_Count_beforeROP = output.Ranparser_ParsedSuccessful_Count_BeforeROP;
            parser_Output_Count_AfterROP = utils.get_metrics_total_replica(ranParser.pmparserPMounterFilesSuccessfulParsed, config.Ran_parser_job, config.Ran_parser_app);
            console.log("Count of output files for Ran Parser Before ROP is ", parser_Output_Count_beforeROP);
            console.log("Count of output files for Ran Parser After ROP is ", parser_Output_Count_AfterROP);
            let diff_output_count = Number(parser_Output_Count_AfterROP) - Number(parser_Output_Count_beforeROP);

            //Method for Validating COntent Post Ran Parser recieve all 10k files
            if (diff_output_count >= 10000) {
                console.log("Started Validating Output Topic Message Content");
                //Required input parameters as Topic Name and Number of messages needs to be consumed and expected length and expected Headers
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_3gPP_NR, config.MessageCount, config.expectedLength_3gpp_Ran, config.expected_headers_3G_RAN_output_topic);
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_3gPP_LTE, config.MessageCount, config.expectedLength_3gpp_Ran, config.expected_headers_3G_RAN_output_topic);
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_3gPP_CUCP, config.MessageCount_CUCP, config.expectedLength_3gpp_Ran, config.expected_headers_3G_RAN_output_topic);
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_3gPP_CUUP, config.MessageCount_CUUP, config.expectedLength_3gpp_Ran, config.expected_headers_3G_RAN_output_topic);
                ContentValidation.validateHeaders_KafkaTopics(config.OutputTopic_3gPP_du, config.Messagecount_du, config.expectedLength_3gpp_Ran, config.expected_headers_3G_RAN_output_topic);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_3gPP_CUCP,config.MessageCount_CUCP,config.ran_flowType);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_3gPP_CUUP,config.MessageCount_CUUP,config.ran_flowType);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_3gPP_du,config.Messagecount_du,config.ran_flowType);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_3gPP_NR,config.ranNRTopicPublishedFiles,config.ran_flowType);
                ContentValidation.validateContent_Kafkatopics(config.OutputTopic_3gPP_LTE,config.ranLTETopicPublishedFiles,config.ran_flowType);
                content_validation_flag = true;
                check(content_validation_flag, {
                    ['Validate Whether Ran Parser published all 10k Output files' ]: content_validation_flag == true,
                });
                break;
            }
            else if (i >= 480) {
                console.log("All 10k files are not transffered yet .. Please check the logs ");
                check(content_validation_flag, {
                    ['Validate Whether Ran Parser published all 10k Output files ']: content_validation_flag == true,
                })
            }
            i += 30;
            sleep(30);
        }
    });
}