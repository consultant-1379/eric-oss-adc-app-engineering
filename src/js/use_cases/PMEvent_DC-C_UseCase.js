import http from 'k6/http';
import { check, group } from 'k6';

import * as config from "./config.js";

let Body = [];
let i;
export var k = 0;

export default function () {
    group('Validation of PM Event DC-C Registration GET API Response', function () {
        console.log("==============================PM Event DC-C-Start===================================");

        const URL = config.datacatalog_V2_Endpoint + 'message-schema';
        console.log(URL);
        const PMEvent_DCC = http.get(URL);
        console.log("PM EVENT  : Status of PM-EVENT DC-C Get API Call is" + PMEvent_DCC.status);
        Body = JSON.parse(PMEvent_DCC.body);

        if (PMEvent_DCC.status == config.PMEVENT_Registration_Expected_Status) {
            for (i = 0; i < Body.length; i++) {
                const length = Body.length - 1;
                if (Body[i].dataType.schemaName == config.PMEVENT_DCC_Registration_Expected_Schema) {
                    k = k + 1;
                    console.log(Body[i].dataType.schemaName + " schema found in the message schema GET API response body , Test Assertions are started");
                    console.log("Body - ", Body[i]);
                    testAssertions(i);
                }
                //Properitary Schema is added part of IDUN-91683 Step
                if (Body[i].dataType.schemaName == config.PMEVENT_DCC_Registration_Expected_PropretiarySchema) {
                    k = k + 1;
                    console.log(Body[i].dataType.schemaName + " schema found in the message schema GET API response body , Test Assertions are started");
                    console.log("Body - ", Body[i]);
                    testAssertions(i);
                }
                if (k == 2) {
                    console.log("Test is passed for 5G DC-C Usecase ");
                    check(k, {
                        ['Verify whether 2 data types in 5G are registered']: k == 2,

                    });
                    break;
                }
                if (i == length && k != 2) {
                    console.log("5G DC-C is not registered with expected results , please check the logs");
                    check(k, {
                        ['Verify whether 2 data types in 5G are registered with 2 Schemas']: k == 2,

                    });
                }
            } //for -end
        } //if -end
        else {
            console.log("PMEVENT : We are not Verifying Data of PMEVENT DC-C  since GET API status is" + PMEvent_DCC.status + " instead of " + config.PMEVENT_Registration_Expected_Status);
            console.log("PMEVENT : Response Body for PMEVENT DC-C GET API " + PMEvent_DCC.body);
        } //else - end
        console.log("-----------------PMEVENT DC-C-END----------------------------------------");

    }); //group
} //export default function

// Following method has response body test assertions
export function testAssertions(i) {
    //messageDataTopic
    const messageDataTopicName = Body[i].messageDataTopic.name;
    const messageDataTopicEncoding = Body[i].messageDataTopic.encoding;
    const messageDataTopic_MessageBusName = Body[i].messageDataTopic.messageBus.name;

    console.log("PM-EVENT DC-C : messageDataTopicName in messageDataTopic is " + messageDataTopicName);
    console.log("PM-EVENT DC-C : messageDataTopicEncoding in messageDataTopic is" + messageDataTopicEncoding);
    console.log("PM-EVENT DC-C : messageDataTopic_MessageBusName in messageDataTopic is " + messageDataTopic_MessageBusName);

    if (messageDataTopicName == "5g-pm-event-file-transfer-and-processing--standardized") {
        check("messageDataTopic", {
            ['Verify messageDataTopicName for Standard Topic ']: messageDataTopicName === config.PMEVENT_DCC_messageDataTopic_messageDataTopicName,
            ['Verify messageDataTopicEncoding for Standard Topic ']: messageDataTopicEncoding === config.PMEVENT_DCC_messageDataTopic_messageDataTopicEncoding,
            ['Verify MessageBusName in messageDataTopic for Standard Topic ']: messageDataTopic_MessageBusName === config.PMEVENT_DCC_messageDataTopic_MessageBusName,
        });
    }
    else {
        check("messageDataTopic", {
            ['Verify messageDataTopicName for Propretiary Topic ']: messageDataTopicName === config.PMEVENT_DCC_messageDataTopic_messageDataPropretiaryTopicName,
            ['Verify messageDataTopicEncoding for Propretiary Topic ']: messageDataTopicEncoding === config.PMEVENT_DCC_messageDataTopic_messageDataTopicEncoding,
            ['Verify MessageBusName in messageDataTopic for Propretiary Topic ']: messageDataTopic_MessageBusName === config.PMEVENT_DCC_messageDataTopic_MessageBusName,
        });
    }

    //dataProviderType

    const dataSpaceName = Body[i].messageDataTopic.dataProviderType.dataSpace.name;
    const dataCategoryName = Body[i].messageDataTopic.dataProviderType.dataCategoryType.dataCategoryName;
    const dataProviderName = Body[i].messageDataTopic.dataProviderType.dataProviderName;

    console.log("PMEVENT DC-C : dataSpaceName under dataProviderType is " + dataSpaceName);
    console.log("PMEVENT DC-C : dataCategoryName under dataCategoryType in dataProviderType  is " + dataCategoryName);
    console.log("PMEVENT DC-C : dataProviderName under dataProviderType is " + dataProviderName);

    check("dataProviderType", {
        ['Verify dataSpaceName under dataProviderType  ']: dataSpaceName === config.PMEVENT_DCC_dataProviderType_dataSpaceName,
        ['Verify dataCategoryName under dataCategoryType in dataProviderType ']: dataCategoryName === config.PMEVENT_DCC_dataProviderType_dataCategoryName,
        ['Verify dataProviderName in dataProviderType']: dataProviderName === config.PMEVENT_DCC_dataProviderType_dataProviderName,
    })

    //messageStatusTopic
    const messageStatusTopicName = Body[i].messageDataTopic.messageStatusTopic.name;
    const messageStatusTopicEncoding = Body[i].messageDataTopic.messageStatusTopic.encoding;
    const messageStatusTopic_messageBusName = Body[i].messageDataTopic.messageStatusTopic.messageBus.name;
    if (messageDataTopicName == "5g-pm-event-file-transfer-and-processing--standardized") {
        check("messageStatusTopic", {
            ['Verify topic name  under messageStatusTopic  for Standard Topic ']: messageStatusTopicName === config.PMEVENT_DCC_messageStatusTopicName,
            ['Verify encoding name  under messageStatusTopic for Standard Topic']: messageStatusTopicEncoding === config.PMEVENT_DCC_messageStatusTopicEncoding,
            ['Verify messageBusName under messageStatusTopic for Standard Topic']: messageStatusTopic_messageBusName === config.PMEVENT_DCC_messageStatusTopic_messageBusName,
        });
    }
    else {
        check("messageStatusTopic", {
            ['Verify topic name  under messageStatusTopic  for Propertiary Topic ']: messageStatusTopicName === config.PMEVENT_DCC_messageStatusPropretiaryTopicName,
            ['Verify encoding name  under messageStatusTopic for Propertiary Topic']: messageStatusTopicEncoding === config.PMEVENT_DCC_messageStatusTopicEncoding,
            ['Verify messageBusName under messageStatusTopic for Propertiary Topic']: messageStatusTopic_messageBusName === config.PMEVENT_DCC_messageStatusTopic_messageBusName,
        });

    }
    //dataService
    const dataServiceInstanceName = Body[i].dataService.dataServiceInstance[0].dataServiceInstanceName;
    const consumedDataSpace = Body[i].dataService.dataServiceInstance[0].consumedDataSpace;
    const consumedDataCategory = Body[i].dataService.dataServiceInstance[0].consumedDataCategory;
    const consumedSchemaVersion = Body[i].dataService.dataServiceInstance[0].consumedSchemaVersion;
    const consumedSchemaName = Body[i].dataService.dataServiceInstance[0].consumedSchemaName;

    var predicateParameter_Array = Body[i].dataService.predicateParameter;
    console.log("predicateParameter_Array ", predicateParameter_Array);
    let ParameterName, isPassedToConsumedService;
    console.log("length of predicateParameter Array", predicateParameter_Array.length);
    for (let k = 0; k < predicateParameter_Array.length; k++) {
        ParameterName = Body[i].dataService.predicateParameter[k].parameterName;
        console.log("ParameterName : ", ParameterName);
        isPassedToConsumedService = Body[i].dataService.predicateParameter[k].isPassedToConsumedService;
        console.log("isPassedToConsumedService : ", isPassedToConsumedService);
        if (ParameterName == config.PMEVENT_DCC_dataService_predicateParameterName_eventId) {
            check(ParameterName, {
                ['Verify predicateParameter Name ' + ParameterName]: ParameterName === config.PMEVENT_DCC_dataService_predicateParameterName_eventId,
                ['Verify isPassedToConsumedService for ' + ParameterName + ' is false']: isPassedToConsumedService === config.PMEVENT_DCC_dataService_isPassedToConsumedService_False,
            });

        } //if - end
        else if (ParameterName == config.PMEVENT_DCC_dataService_predicateParameterName_nodeName) {
            check(ParameterName, {
                ['Verify predicateParameter Name ' + ParameterName]: ParameterName === config.PMEVENT_DCC_dataService_predicateParameterName_nodeName,
                ['Verify isPassedToConsumedService for ' + ParameterName + ' is true']: isPassedToConsumedService === config.PMEVENT_DCC_dataService_isPassedToConsumedService_True,
            });

        } //else if - end
    } // inner for loop -end
    // DataService
    const dataServiceName = Body[i].dataService.dataServiceName;
    const consumedDataProvider = Body[i].dataService.dataServiceInstance[0].consumedDataProvider;
    
    console.log("PMEVENT DC-C : dataServiceInstanceName in dataService  " + dataServiceInstanceName);
    console.log("PMEVENT DC-C : consumedDataSpace in dataService    " + consumedDataSpace);
    console.log("PMEVENT DC-C : consumedDataCategory in dataService  " + consumedDataCategory);
    console.log("PMEVENT DC-C : consumedSchemaVersion in dataService    " + consumedSchemaVersion);
    console.log("PMEVENT DC-C : consumedSchemaName in dataService  " + consumedSchemaName);
    console.log("PMEVENT DC-C : dataServiceName in dataService    " + dataServiceName);
    console.log("PMEVENT DC-C : consumedDataProvider in dataService    " + consumedDataProvider);

    check(dataServiceInstanceName, {
        ['Verify dataServiceInstanceName in dataService']: dataServiceInstanceName === config.PMEVENT_DCC_dataService_dataServiceInstanceName,
        ['Verify consumedDataSpace in dataService']: consumedDataSpace === config.PMEVENT_DCC_dataService_consumedDataSpace,
        ['Verify consumedDataCategory in dataService']: consumedDataCategory === config.PMEVENT_DCC_dataService_consumedDataCategory,
        ['Verify consumedSchemaVersion in dataService']: consumedSchemaVersion === config.PMEVENT_DCC_dataService_consumedSchemaVersion,
        ['Verify consumedSchemaName in dataService']: consumedSchemaName === config.PMEVENT_DCC_dataService_consumedSchemaName,
        ['Verify dataServiceName in dataService']: dataServiceName === config.PMEVENT_DCC_dataService_dataServiceName,
        ['Verify consumedDataProvider in dataService']: consumedDataProvider === config.PMEVENT_DCC_dataService_consumedDataProvider,
    });
    // DataType
    const dataType_schema = Body[i].dataType.schemaName;
    const isExternal = Body[i].dataType.isExternal;
    console.log("PMEVENT DC-C :  dataType_schema is  " + dataType_schema);
    console.log("PMEVENT DC-C :  isExternal is  " + isExternal);
    if (messageDataTopicName == "5g-pm-event-file-transfer-and-processing--standardized") {
        check(dataType_schema, {
            ['Verify Schema Name in Datatype for standardized topic ']: dataType_schema === config.PMEVENT_DCC_dataType_schema,
            ['Verify isExternal in Datatype']: isExternal === config.PMEVENT_DCC_dataType_isExternal,
        });
    }
    else {
        check(dataType_schema, {
            ['Verify Schema Name in Datatype for Properitary topic ']: dataType_schema === config.PMEVENT_DCC_dataType_Propertiaryschema,
            ['Verify isExternal in Datatype']: isExternal === config.PMEVENT_DCC_dataType_isExternal,
        });
    }
    //specificationReference
    const specificationReference = Body[i].specificationReference;
    console.log("PMEVENT DC-C :  specificationReference is  " + specificationReference);
    if (messageDataTopicName == "5g-pm-event-file-transfer-and-processing--standardized") {
        check(specificationReference, {
            ['Verify SpecificationReference for standardized topic']: specificationReference === config.PMEVENT_DCC_specificationReference,
        });
    }
    else {
        check(specificationReference, {
            ['Verify SpecificationReference for Properitary topic']: specificationReference === config.PMEVENT_DCC_specificationReference_propretiary,
        });

    }
} // testAssertion - end
