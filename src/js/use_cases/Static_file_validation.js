import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as config from "./config.js";

let produceStaticURL = config.kafka_URL + "/static-producer/ran-pm-counter-sftp-file-transfer";
let BDRUploadURL = "http://kafka-wrapper:8082/bdr/uploadfile/ran-pm-counter-sftp-file-transfer";
let ConsumeStaticURL = config.kafka_URL + "/consume-on-key/eric-oss-3gpp-pm-xml-ran-parser-nr";
const file_path = open('/resources/testfile.xml.gz', 'b');

export function static_file_validation() {
    group('Static File Validation', function () {
        //Upload file into BDR from k6 testware
        const data = {
            field: 'this is a standard form field',
            file: http.file(file_path, 'testfile.xml.gz'),
        };
        const BDR_responseBody = http.post(BDRUploadURL, data);
        console.log("BDR UPLOAD check: ", BDR_responseBody.body)
        check(BDR_responseBody, {
            'BDR Upload Successfully': (res) => res.body.includes('uploaded successfully to bucket')
        }, { legacy: "false" });

        //Producing Static File into ran-parser input topic
        const headers = {
            'Content-Type': 'application/json',
        };

        // passing message and key as a parameter through payload
        const producer_payload = JSON.stringify({
            'message_key': 'SubNetwork=Europe,SubNetwork=Ireland,MeContext=NR02gNodeBRadio00912,ManagedElement=NR02gNodeBRadio00912',
            'message': { "fileLocation": "ran-pm-counter-sftp-file-transfer/testfile.xml.gz" }
        });
        let produceStaticFile_response = http.post(produceStaticURL, producer_payload, { headers: headers });

        console.log("Static Producer response : ", produceStaticFile_response.body);
        check(produceStaticFile_response, {
            'Producer Static Message Successfully': (res) => res.body.includes('Delivered')
        }, { legacy: "false" });
        sleep(20);
        //Consume deserialised message based on the key
        let Consumepayload = JSON.stringify({
            'desired_key': 'SubNetwork=Europe,SubNetwork=Ireland,MeContext=NR02gNodeBRadio00912,ManagedElement=NR02gNodeBRadio00912',
        });
        let Consumer_response = http.post(ConsumeStaticURL, Consumepayload, { headers: headers });
        if (Consumer_response.status == 200) {
            const response = JSON.parse(Consumer_response.body);
            if (response != null) {
                const keys = response["pmCounters"];
                const keys1 = Object.keys(keys);
                for (let i = 0; i < keys1.length; i++) {
                    const keys2 = keys[keys1[i]];
                    const counterType_value = keys2["counterType"];
                    const counterValue = keys2["counterValue"];
                    const isValuePresent = keys2["isValuePresent"];
                    if (counterType_value == "single") {
                        const result =  check(isValuePresent, {
                            ' Verify isValuePresentValue for single counterType ': (res) => isValuePresent == true,
                        }, { legacy: "false" });
                        if(!result)
                        {
                            //console.log("Response of Output Topic Message with Single as Counter Type of Static File Message is ",response);
                            console.log("Response of one of the Single Counter Type Node is ",keys2);
                        }
                    }
                    if (counterType_value == "null") {
                        const result_null =  check(isValuePresent, {
                            ' Verify isValuePresentValue and Counter Value  for Null counterType ': (res) => isValuePresent == false && counterValue == 0,
                        
                        }, { legacy: "false" });
                        if(!result_null)
                        {
                           // console.log("Response of Output Topic Message with NUll as Counter Type of Static File Message is ",response);
                            console.log("Response of one of the Null Counter Type Node is ",keys2);
                        }
                    }
                }
            }
            else {
                check(null, {
                    'Response from static consumer is null': false
                }, { legacy: "false" });
            }
        }
        else {
            console.log("Status of Consuming Output Message is ", Consumer_response.status);
            console.log("Output Topic Consumption GET API Status is not 200 and we are not validating the content of the Message as status is ", Consumer_response.status);
            check(Consumer_response, {
                ['Validate Output Topic GET API Status for Static File Validation is  ' + Consumer_response.status]: Consumer_response.status == 200,
            }, { legacy: "false" });
        }
    });
}