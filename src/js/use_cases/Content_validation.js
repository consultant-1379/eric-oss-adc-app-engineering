import http from 'k6/http';
import {
    check, group
} from 'k6';
import * as config from "./config.js";
export var value, Schema_ID_flag,eventId_flag, schema_id,event_Id,elementType;
//Method for validating Headers of Kafka Output Topic Message
export function validateHeaders_KafkaTopics(kafkatopicname, countofmessages, length, expected_array) {
    group('Validation of Output Topic Headers for ' + kafkatopicname + ' topic', function () {
        const Kafka_URL = config.kafka_URL + kafkatopicname + '/' + countofmessages;
        const OutputKafkaresponse = http.get(Kafka_URL);
        //Validating status of Kafka API and if status 200 then proceeding with testing of Content Validation
        if (OutputKafkaresponse.status == 200) {
            console.log("-------------Started Validation of Output Kafka Topic Headers for " + kafkatopicname + "-----------------------");
            const Kafka_responseBody = JSON.parse(OutputKafkaresponse.body);
            //Stored Response of API into Json format
            for (let i = 0; i < Kafka_responseBody.length; i++) {
                const OuptutTopic_headers_keys = [];
                //Storing all headers of Kafka Response into one Array
                for (let j = 0; j < Kafka_responseBody[i].headers.length; j++) {
                    const header = Kafka_responseBody[i].headers[j][0];
                    OuptutTopic_headers_keys.push(header);
                    //Validating whether SchemaID value is integer or not
                    if (header == "schemaID") {
                        const schema_id = Kafka_responseBody[i].headers[j][1];
                        Schema_ID_flag = isNaN(schema_id);
                        const result_SchemaID = check(schema_id, {
                            ['Validate Schema ID is integer or not for ' + kafkatopicname + ' Topic ']: Schema_ID_flag == false,
                        });
                        if (!result_SchemaID) {
                            console.log("Value of Schema id for " + kafkatopicname + " output Topic Message : " + i + " is " + schema_id);
                        }
                    }
                    if (header == "event_id") {
                        event_Id = Kafka_responseBody[i].headers[j][1];
                        eventId_flag = isNaN(event_Id);
                        console.log("Kafka Response body is ",Kafka_responseBody);
                            const result_eventID = check(event_Id, {
                                ['Validate Event ID is integer or not for ' + kafkatopicname + ' Topic']: eventId_flag == false,
                               // ['Validate Event ID for ' + kafkatopicname + ' Topic is matching with expected value ' + event_Id]: event_Id == config.Subscription_eventId_5g[1],
                            });
                    }
                    if ((kafkatopicname == config.OutputTopic_3gPP_CUCP) || (kafkatopicname == config.OutputTopic_3gPP_CUUP) || (kafkatopicname == config.OutputTopic_3gPP_du))
                    {
                    if (header == "elementType") {
                        elementType = Kafka_responseBody[i].headers[j][1];
                        check(elementType, {
                            ['Validate cRAN output topics contains Shared-CNF elementType']: elementType == "Shared-CNF" && elementType != "RadioNode",
                        });   
                    }
                }
                else if ((kafkatopicname == config.OutputTopic_3gPP_NR) || (kafkatopicname == config.OutputTopic_3gPP_LTE))
                {
                if (header == "elementType") {
                    elementType = Kafka_responseBody[i].headers[j][1];
                    check(elementType, {
                        ['Validate pRAN output topics contains RadioNode as elementType']: elementType == "RadioNode" && elementType != "Shared-CNF",
                    });
                }
            }
                }
                //Method of checking whether all expected headers are present in output Message
                value = OuptutTopic_headers_keys.every(element => expected_array.includes(element));
                //Validating whether output content Header Array is empty or not
                const Headers_empty = OuptutTopic_headers_keys.some((element) => true);
                //Validating Output Header length
                const result_headers = check(value, {
                    ['Validate output topic header Array for ' + kafkatopicname + ' Topic is empty or not']: Headers_empty == true,
                    ['Validate output topic header length for ' + kafkatopicname + ' Topic and length is ' + OuptutTopic_headers_keys.length]: OuptutTopic_headers_keys.length >= length,
                    ['Validate output topic headers for ' + kafkatopicname + ' Topic are matching with expected headers ']: value == true,
                });
                if(!result_headers)
                {
                console.log("Length of Output Topic Content Headers for  " + kafkatopicname + " output Topic Message : " + i + " is", OuptutTopic_headers_keys.length);
                console.log("Headers in " + kafkatopicname + " output Topic Message : " + i + " are ", OuptutTopic_headers_keys);
                }
            }
        }//function-end
        else {
            console.log("Status of Output Topic is ", OutputKafkaresponse.status);
            console.log("Output Topic GET API Status is not 200 and we are not validating the content of the Message as status is ", OutputKafkaresponse.status);
            check(OutputKafkaresponse, {
                ['Validate Output Topic GET API Status for Topic :' + kafkatopicname + ' is ' + OutputKafkaresponse.status]: OutputKafkaresponse.status == 200,
            })
        }
        console.log("-------------End of Validation of Headers of Output Kafka Topic-----------------------");
    });
}
export function validateContent_Kafkatopics(kafkatopicname,messagesCount,flowtype) {
    group('Validation of Output Topic Message Content for ' + kafkatopicname + ' topic', function () {
        const Kafka_URL1 = config.kafka_URL + 'consume/avro/' + kafkatopicname + '/' + messagesCount + '?flow='+flowtype;
        const params = {
            timeout: '240s'
        };
        console.log("Time before Starting validating the content of output Message");
        const OutputKafkaresponse = http.get(Kafka_URL1, params);
        console.log("Time after completing validating the content of output Message");
        //Validating status of Kafka API and if status 200 then proceeding with testing of Output Message
        if (OutputKafkaresponse.status == 200) {
            console.log("----Started Validation of Output Message Content for " + kafkatopicname + "--------------");
            const Kafka_responseBody = JSON.parse(OutputKafkaresponse.body);
            const Message_PassedCount = Kafka_responseBody["deserialization-passed"];
            const Message_FailedCount = Kafka_responseBody["deserialization-failed"];
            const Message_FailedId    = Kafka_responseBody["deserizlization-FailedEventid"];
            console.log("List of failed ID's to Deserialiaze the events/Schemas for  " + kafkatopicname + "are : ",Message_FailedId);
            const result = check(Kafka_responseBody, {
                ['Validate whether able to Desiriliaze the '+messagesCount+' messages for Topic :' + kafkatopicname ]: Message_PassedCount == Number(messagesCount),
                ['Validate Failed Deseriliaze count of Messages for Topic :' + kafkatopicname ]: Message_FailedCount == 0,
                ['Validate there are no events/schema id that are failed to De-serailiaze for  Topic : ' + kafkatopicname ]: Message_FailedId.length == 0,
            },{legacy: "true"});
            if (!result) {
                console.log(Kafka_URL1);
                console.log("Number of Messages able Deserialize from "+messagesCount+" for topic : " + kafkatopicname + " is ", Message_PassedCount);
                console.log("Number of Messages not able Deserialize for topic : " + kafkatopicname + " is ", Message_FailedCount);
                console.log("Repsonse for Output Message Content of "+messagesCount+" for topic : " + kafkatopicname + " is ", Kafka_responseBody);
            }
        }//function-end
        else {
            console.log(Kafka_URL1);
            console.log("Status of Output Topic Message is ", OutputKafkaresponse.status);
            console.log("Output Message Content GET API Status is not 200 and we are not validating the content of the Message as status is ", OutputKafkaresponse.status);
            check(OutputKafkaresponse, {
                ['Validate Output Message Content Topic GET API Status for Topic :' + kafkatopicname ]: OutputKafkaresponse.status == 200,
            },{legacy: "true"});
        }
        console.log("-------End of Validation of Output Kafka Topic Message Content------------------");
    });
}

/*
Method being used to fetch proto type kafka topic deserialization
*/
export function validateContent_protoMessagesKafkaTopic(kafkatopicname,messagesCount,flowtype) {
    group('Validation of Proto Message Content for ' + kafkatopicname + ' topic', function () {
        const URL = config.kafka_URL + 'consume/proto/' + kafkatopicname + '/' + messagesCount + '?flow='+flowtype;
        const params = {
            timeout: '360s'
        };
        console.log("Time before getting API Response Payload for "+kafkatopicname+" captured in info");
        const OutputKafkaresponse = http.get(URL, params);
        console.log("Time after getting API Response Payload for "+kafkatopicname+" captured in info");
        //Validating status of Kafka API and if status 200 then proceeding with testing of Output Message
        if (OutputKafkaresponse.status == 200) {
            console.log("----Started Validation of Output Message Content for " + kafkatopicname + "--------------");
            const Kafka_responseBody = JSON.parse(OutputKafkaresponse.body);

            const decode_outer_passed = Kafka_responseBody["decode-outer-passed"];
            console.log("decode_outer_passed ",decode_outer_passed);
            const decode_functional_passed = Kafka_responseBody["decode-functional-passed"];

            const decode_outer_failed = Kafka_responseBody["decode-outer-failed"];
            const decode_functional_failed = Kafka_responseBody["decode-functional-failed"];

            const invalid_message_group_count    = Kafka_responseBody["invalid-message-group-count"];

            const cucp_group_count = Kafka_responseBody["cucp-group-count"];
            const cuup_group_count = Kafka_responseBody["cuup-group-count"];
            const du_group_count = Kafka_responseBody["du-group-count"];

            console.log("count of messages went to cucp-group ", cucp_group_count);
            console.log("count of messages went to cuup-group ", cuup_group_count);
            console.log("count of messages went to du-group ", du_group_count);

            console.log("Repsonse for Output Message Content of "+messagesCount+" for topic : " + kafkatopicname + " is ", Kafka_responseBody);

            console.log("Count of decode outer failed to deserialiaze the messages for  " + kafkatopicname + "are : ",decode_outer_failed);
            console.log("Count of decode functional failed  to deserialiaze the messages for  " + kafkatopicname + "are : ",decode_functional_failed);
            const result = check(Kafka_responseBody, {
                ['Validate whether able to desiriliaze  '+messagesCount+' decode OuterBody messages for Topic']: decode_outer_passed == Number(messagesCount),
                ['Validate whether able to desiriliaze  '+messagesCount+' decode functional messages for Topic ']: decode_functional_passed == Number(messagesCount),

                ['Validate decode outer failed Deseriliaze count of Messages for Topic']: decode_outer_failed == 0,
                ['Validate decode functional failed Deseriliaze count of Messages for Topic']: decode_functional_failed == 0,

                ['Validate there are no invalid message group count in Topic']: invalid_message_group_count == 0,

                //['Number of cucp-group-count  for the given input count '+messagesCount+' is ' + Number(cucp_group_count)]:(r)  => Number(cucp_group_count)>=0,
                //['Number of cuup-group-count for the given input count '+messagesCount+' is ' + Number(cuup_group_count)]:(r)  => Number(cuup_group_count)>=0,
                //['Number of du-group-count for the given message count '+messagesCount+' is ' + Number(du_group_count)]:(r)  => Number(du_group_count)>=0,

            });
            if (!result) {
                console.log("Kafka wrapper API URL : ",URL);
                console.log("Number of Messages able to decode outer body deserialize from "+messagesCount+" for topic : " + kafkatopicname + " is ", decode_outer_passed);
                console.log("Number of Messages able to decode functional body deserialize from "+messagesCount+" for topic : " + kafkatopicname + " is ", decode_functional_passed);

                console.log("Number of input messages not able to decode outer body deserialize for : " + kafkatopicname + " is ", decode_outer_failed);
                console.log("Number of input messages not able to decode functional body deserialize for : " + kafkatopicname + " is ", decode_functional_failed);

                console.log("Repsonse for Output Message Content of "+messagesCount+" for topic : " + kafkatopicname + " is ", Kafka_responseBody);
            }
        }//function-end
        else {
            console.log(URL);
            console.log("Status of Output Topic Message is ", OutputKafkaresponse.status);
            console.log("Output Message Content GET API Status is not 200 and we are not validating the content of the Message as status is ", OutputKafkaresponse.status);
            check(OutputKafkaresponse, {
                ['Validate Output Message Content Topic GET API Status for Topic :' + kafkatopicname]: OutputKafkaresponse.status == 200,
            });
        }
        console.log("-------End of Validation of Output Kafka Topic Proto Message Content------------------");
    });
}