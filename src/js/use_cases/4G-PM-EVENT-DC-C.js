import http from 'k6/http';
import { check, group } from 'k6';
import * as config from "./config.js";
let Body = [];
let i;
export var k = 0;
export var PMEvent_4G_DCC;
//Execution starts from below method for 4G DC-C Registration
export default function () {
    group('Validation of 4G-PM-EVENT DC-C Registration', function () {
        console.log("==============================Validation of 4G-PM-EVENT DC-C Registation-Start===================================");
        const URL = config.datacatalog_V2_Endpoint + 'message-schema';
        PMEvent_4G_DCC = http.get(URL);
        console.log("4G-PM-EVENT DC-C : Status of 4G PM-EVENT DC-C Get API Call is " + PMEvent_4G_DCC.status);
        Body = JSON.parse(PMEvent_4G_DCC.body);

        //Validate DC-C Registration data with expected output if Status is 200
        if (PMEvent_4G_DCC.status == 200) {
            for (i = 0; i < Body.length; i++) {
                if (Body[i].dataType.schemaName == config.PMEVENT_4G_DCC_Registration_Expected_Schema) {
                    k = k + 1;
                    console.log(Body[i].dataType.schemaName +"Schema found in the message schema GET API response body , Test Assertions are started");
                    console.log("Body - ", Body[i]);
                    testAssertions(i);
                }
                //Properitary Schema
                if (Body[i].dataType.schemaName == config.PMEVENT_4G_DCC_Registration_Expected_PropretiarySchema) {
                    k = k + 1;
                    console.log(Body[i].dataType.schemaName + "Schema found in the message schema GET API response body , Test Assertions are started");
                    console.log("Body - ", Body[i]);
                    testAssertions(i);
                }
                if (k == 2) {
                    console.log("Test is passed for 4G DC-C Usecase ");
                    check(k, {
                        ['Verify 4GPM Event Schema found in 4G-PM-EVENT GET API']: k == 2,
                    });
                    break;
                }
                if (i == Body.length - 1 && k != 2) {
                    console.log("4G-PM-EVENT DC-C : Schema not found in the message schema GET API response body , Test Assertions are ignored");
                    console.log("4G-PM-EVENT DC-C: Response Body for 4G PMEVENT DC-C GET API " + PMEvent_4G_DCC.body);
                    check(k, {
                        ['Verify 4GPM Event Schema found in 4G-PM-EVENT GET API']: k == 2,
                    })
                    }
            } //for -end
        } //if -end
        else {
            console.log("4G-PM-EVENT DC-C: We are not Verifying Registration of 4G PMEVENT DC-C  since GET API status is " + PMEvent_4G_DCC.status + " instead of " + config.PMEVENT_Registration_Expected_Status);
            console.log("4G-PM-EVENT DC-C: Response Body for 4G PMEVENT DC-C GET API " + PMEvent_4G_DCC.body);
        } //else - end
        console.log("-----------------4G PMEVENT DC-C-END----------------------------------------");
    }); //group
} //export default function

// Following method has response body test assertions
export function testAssertions(i) {
    group('Validation of 4G-PM-EVENT DC-C Registration Data in Data-Catalog', function () {

        //Validation of DataSpace
        const dataSpaceName = Body[i].messageDataTopic.dataProviderType.dataSpace.name;
        const result_DataSpace = check("dataSpaceName", {
            ['Verify DataSpace Name in 4G-PM-EVENT DC-c Registration ']: dataSpaceName == config.PMEVENT_4G_DCC_dataSpace_dataSpaceName,
        });
        if (!result_DataSpace) {
            console.log("4G-PM-EVENT DC-C : Actual dataSpaceName name is " + dataSpaceName);
        }

        //Validation of DataService
        const dataServiceName = Body[i].dataService.dataServiceInstance[0].dataServiceInstanceName;
        const result_dataServiceName = check("dataServiceName", {
            ['Verify DataServiceName in 4G-PM-EVENT DC-c Registration ']: dataServiceName == config.PMEVENT_4G_DCC_dataService_dataServiceName,
        });
        if (!result_dataServiceName) {
            console.log("4G-PM-EVENT DC-C : Actual dataServiceName name is " + dataServiceName);
        }

        //Validation of DataCategory
        const dataCategoryName = Body[i].messageDataTopic.dataProviderType.dataCategoryType.dataCategoryName;
        const result_dataCategoryName = check("dataCategoryName", {
            ['Verify DataCategoryName Name in 4G-PM-EVENT DC-C Registration ']: dataCategoryName == config.PMEVENT_4G_DCC_dataCategory_dataCategoryName,
        });
        if (!result_dataCategoryName) {
            console.log("4G-PM-EVENT DC-C : Actual dataCategoryName name is " + dataCategoryName);
        }

        //validation of dataProviderType
        const providerVersion = Body[i].messageDataTopic.dataProviderType.providerVersion;
        const providerTypeId = Body[i].messageDataTopic.dataProviderType.providerTypeId;
        const result_dataProviderType = check("providerVersion", {
            ['Verify providerVersion Name in 4G-PM-EVENT DC-c Registration ']: providerVersion == config.PMEVENT_4G_DCC_dataProviderType_providerVersion,
            ['Verify providerTypeId Name in 4G-PM-EVENT DC-c Registration ']: providerTypeId == config.PMEVENT_4G_DCC_dataProviderType_providerTypeId,

        });
        if (!result_dataProviderType) {
            console.log("4G-PM-EVENT DC-C : Actual providerVersion name is " + providerVersion);
            console.log("4G-PM-EVENT DC-C : Actual providerTypeId name is " + providerTypeId);
        }

        //Validation of messageDataTopic
        const messageDataTopicName = Body[i].messageDataTopic.name;
        const messageDataTopic_messageBusId = Body[i].messageDataTopic.messageBus.id;
        const messageDataTopicEncoding = Body[i].messageDataTopic.encoding;

        console.log("4G-PM-EVENT DC-C : Actual messageDataTopicName is " + messageDataTopicName);
        console.log("4G-PM-EVENT DC-C : Actual messageBusId in messageDataTopic is " + messageDataTopic_messageBusId);
        console.log("4G-PM-EVENT DC-C : Actual Encoding in messageDataTopic is " + messageDataTopicEncoding);
        
        if(messageDataTopicName=="ctr-processed"){
            check("messageDataTopic", {
                ['Verify Name in messageDataTopic in 4G-PM-EVENT DC-C Registration for Standard Topic']: messageDataTopicName == config.PMEVENT_4G_DCC_messageDataTopic_messageDataTopicName,
                ['Verify MessageBusID in messageDataTopic in 4G-PM-EVENT DC-C Registration for Standard Topic ']: messageDataTopic_messageBusId == config.PMEVENT_4G_DCC_messageDataTopic_messageBusId,
                ['Verify Encoding in messageDataTopic in 4G-PM-EVENT DC-C Registration for Standard Topic']: messageDataTopicEncoding == config.PMEVENT_4G_DCC_messageDataTopic_Encoding,
        });
        }
        else{
            check("messageDataTopic", {
                ['Verify Name in messageDataTopic in 4G-PM-EVENT DC-C Registration for Propretiary Topic']: messageDataTopicName == config.PMEVENT_4G_DCC_messageDataTopic_messageDataPropretiaryTopicName,
                ['Verify MessageBusID in messageDataTopic in 4G-PM-EVENT DC-C Registration for Propretiary Topic']: messageDataTopic_messageBusId == config.PMEVENT_4G_DCC_messageDataTopic_messageBusId,
                ['Verify Encoding in messageDataTopic in 4G-PM-EVENT DC-C Registration for Propretiary Topic']: messageDataTopicEncoding == config.PMEVENT_4G_DCC_messageDataTopic_Encoding,
            });
        }

        //Validation of dataServiceInstance
        const dataServiceInstanceName = Body[i].dataService.dataServiceInstance[0].dataServiceInstanceName;
        const controlEndPoint = Body[i].dataService.dataServiceInstance[0].controlEndPoint;
        const consumedDataSpace = Body[i].dataService.dataServiceInstance[0].consumedDataSpace;
        const consumedDataCategory = Body[i].dataService.dataServiceInstance[0].consumedDataCategory;
        const consumedDataProvider = Body[i].dataService.dataServiceInstance[0].consumedDataProvider;
        const consumedSchemaName = Body[i].dataService.dataServiceInstance[0].consumedSchemaName;
        const consumedSchemaVersion = Body[i].dataService.dataServiceInstance[0].consumedSchemaVersion;

        const result_dataServiceInstance = check(dataServiceInstanceName, {
            ['Verify dataServiceInstanceName in dataServiceInstanceName']: dataServiceInstanceName == config.PMEVENT_4G_DCC_dataServiceInstance_dataServiceInstanceName,
            ['Verify controlEndPoint in dataServiceInstanceName']: controlEndPoint == config.PMEVENT_4G_DCC_dataServiceInstance_controlEndPoint,
            ['Verify consumedDataSpace in dataServiceInstanceName']: consumedDataSpace == config.PMEVENT_4G_DCC_dataServiceInstance_consumedDataSpace,
            ['Verify consumedDataCategory in dataServiceInstanceName']: consumedDataCategory == config.PMEVENT_4G_DCC_dataServiceInstance_consumedDataCategory,
            ['Verify consumedSchemaName in dataServiceInstanceName']: consumedSchemaName == config.PMEVENT_4G_DCC_dataServiceInstance_consumedSchemaName,
            ['Verify consumedSchemaVersion in dataServiceInstanceName']: consumedSchemaVersion == config.PMEVENT_4G_DCC_dataServiceInstance_consumedSchemaVersion,
            ['Verify consumedDataProvider in dataService']: consumedDataProvider == config.PMEVENT_4G_DCC_dataServiceInstance_consumedDataProvider,
        })
        if (!result_dataServiceInstance) {
            console.log("4G-PM-EVENT DC-C : Actual dataServiceInstanceName is  " + dataServiceInstanceName);
            console.log("4G-PM-EVENT DC-C : Actual controlEndPoint is " + controlEndPoint);
            console.log("4G-PM-EVENT DC-C : Actual consumedDataSpace is " + consumedDataSpace);
            console.log("4G-PM-EVENT DC-C : Actual consumedDataCategory is " + consumedDataCategory);
            console.log("4G-PM-EVENT DC-C : Actual consumedDataProvider is " + consumedDataProvider);
            console.log("4G-PM-EVENT DC-C : Actual consumedSchemaName is " + consumedSchemaName);
            console.log("4G-PM-EVENT DC-C : Actual consumedSchemaVersion is " + consumedSchemaVersion);

        }

        // Validation of DataType
        const mediumType = Body[i].dataType.mediumType;
        const dataType_schema = Body[i].dataType.schemaName;
        const dataType_schemaVersion = Body[i].dataType.schemaVersion;
        const isExternal = Body[i].dataType.isExternal;

        console.log("4G-PM-EVENT DC-C : Actual mediumType in DataType is " + mediumType);
        console.log("4G-PM-EVENT DC-C : Actual dataType_schema in DataType is " + dataType_schema);
        console.log("4G-PM-EVENT DC-C : Actual Schema Version in DataType is " + dataType_schemaVersion);
        console.log("4G-PM-EVENT DC-C : Actual isExternal in DataType is " + isExternal);
    
        if(messageDataTopicName=="ctr-processed"){
        check(dataType_schema, {
            ['Verify mediumType in Datatype for Standard Topic']: mediumType == config.PMEVENT_4G_DCC_dataType_mediumType,
            ['Verify Schema Name in Datatype for Standard Topic']: dataType_schema == config.PMEVENT_4G_DCC_dataType_schemaName,
            ['Verify Schema Version in Datatype for Standard Topic']: dataType_schemaVersion == config.PMEVENT_4G_DCC_dataType_schemaVersion,
            ['Verify isExternal in Datatype for Standard Topic']: isExternal == config.PMEVENT_4G_DCC_dataType_isExternal,
        });
        }
        else{
        check(dataType_schema, {
            ['Verify mediumType in Datatype for Propretiary Topic']: mediumType == config.PMEVENT_4G_DCC_dataType_mediumType,
            ['Verify Schema Name in Datatype for Propretiary Topic']: dataType_schema == config.PMEVENT_4G_DCC_dataType_PropertiaryschemaName,
            ['Verify Schema Version in Datatype for Propretiary Topic']: dataType_schemaVersion == config.PMEVENT_4G_DCC_dataType_schemaVersion,
            ['Verify isExternal in Datatype for Propretiary Topic']: isExternal == config.PMEVENT_4G_DCC_dataType_isExternal,
        });
        }

        //SupportedPredicatedParamaters
        var predicateParameter_Array = Body[i].dataService.predicateParameter;
        console.log("4G-PM-EVENT DC-C : Length of predicateParameter Array", predicateParameter_Array.length);
        for (let k = 0; k < predicateParameter_Array.length; k++) {
            const parameterName = Body[i].dataService.predicateParameter[k].parameterName;
            const isPassedToConsumedService = Body[i].dataService.predicateParameter[k].isPassedToConsumedService;
            if (parameterName == config.PMEVENT_4G_DCC_specificationReference_parameterName) {
                console.log("Parameter Name is ", parameterName);
                console.log("isPassedToConsumedService Name is ", isPassedToConsumedService);

                check(parameterName, {
                    ['Verify parameterName in SupportedPredicatedParamaters and actual paramter is ' + parameterName]: parameterName == config.PMEVENT_4G_DCC_specificationReference_parameterName,
                    ['Verify isPassedToConsumedService in SupportedPredicatedParamaters for Parameter Name : ' + parameterName]: isPassedToConsumedService == config.PMEVENT_4G_DCC_specificationReference_isPassedToConsumedService_nodeName,
                });
            }
            else {
                console.log("Parameter Name is ", parameterName);
                console.log("isPassedToConsumedService Name is ", isPassedToConsumedService);
                check(parameterName, {
                    ['Verify parameterName in SupportedPredicatedParamaters and actual paramter is ' + parameterName]: parameterName == config.PMEVENT_4G_DCC_specificationReference_parameterName_eventID,
                    ['Verify isPassedToConsumedService in SupportedPredicatedParamaters for Parameter Name : ' + parameterName]: isPassedToConsumedService == config.PMEVENT_4G_DCC_specificationReference_isPassedToConsumedService_eventID,
                });
            }
        }

        //Validation of messageSchema
        const specificationReference = Body[i].specificationReference;
        console.log("4G-PM-EVENT DC-C : Actual SpecificationReference is  " + specificationReference);
        if(messageDataTopicName=="ctr-processed"){
            check(specificationReference, {
                ['Verify SpecificationReference for Standard Topic']: specificationReference == config.PMEVENT_4G_DCC_specificationReference,

            });
            }
            else{
            check(specificationReference, {
                ['Verify SpecificationReference for Propretiary Topic']: specificationReference == config.PMEVENT_4G_DCC_specificationReference_proprietary,

            });
            }
    });
} // testAssertion-end