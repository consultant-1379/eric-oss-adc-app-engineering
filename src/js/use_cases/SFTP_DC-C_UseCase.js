import http from 'k6/http';
import { check, group } from 'k6';

import * as config from "./config.js";
var value;
let Body = [];
let i = 0;
//Execution starts from below method for SFTP DC-C Registration
export default function () {
    group('Validation of SFTP-DC-C Registration', function () {
        console.log("==============================SFTP-DC-C-Registration Validation Starts===================================");
        const URL = config.SFTP_DCC_Registration + 'file-format';
        const SFTP_DCC = http.get(URL);
        console.log("SFTP : Status of SFTP DC-C Get API Call is " + SFTP_DCC.status);
        Body = JSON.parse(SFTP_DCC.body);
        //Validate SFTP DC-C Registration data with expected output if Status is 200
        if (SFTP_DCC.status == config.SFTP_DCC_Registration_Expected_Status) {
            for (let k = 0; k < Body.length; k++) {
                console.log("SFTP : Schema Name in Response Body is ", Body[k].dataType.schemaName);
                if (Body[k].dataType.schemaName == config.SFTP_DCC_Registration_Expected_Schema && Body[k].dataService.dataServiceName=="ran-pm-counter-sftp-file-transfer") {
                    value = k;
                    //Method for validate the SFTP DC-C Registration
                    Test();
                    if (k == 0) {
                        i = 1;
                    }
                    else {
                        i = 2;
                    }
                    break;
                }
            }

            if (i == 0) {
                console.log("Ran Schema Not found and not running the Use case");
                const DataType_schema = Body[i].dataType.schemaName;
                const instance = Body[i].dataService.dataServiceName;
                check(DataType_schema, {
                    ['Verify Schema Name in Datatype']: DataType_schema === config.SFTP_DCC_Registration_Expected_Schema,
                    ['Verify Data service instance Name in Datatype']: instance =="ran-pm-counter-sftp-file-transfer",
           
                })

            }
            else {
                console.log("Ran Schema Found and  use case ran Successfully");
                const DataType_schema = Body[value].dataType.schemaName;
                check(DataType_schema, {
                    ['Verify Schema Name in Datatype']: DataType_schema === config.SFTP_DCC_Registration_Expected_Schema,
                })
            }
        }
        else {
            console.log("SFTP : We are not Verifying Data of SFTP DC-C  since status is" + SFTP_DCC.status + " instead of 200");
            console.log("SFTP : Response Body for FNC_DC-C for Data Space " + SFTP_DCC.body);
        }
        console.log("-----------------SFTP-DC-C-END----------------------------------------");
    });
}//default Function End
// Validation of SFTP DC-C Registered data with expected data
export function Test() {
    //Validate Data Service and Data Service Instance
    const DataServiceInstBody = Body[value].dataService.dataServiceInstance;
    console.log("Dataservice Response Body", DataServiceInstBody);
    console.log("Number of Ran pods are ", DataServiceInstBody.length);
    if (DataServiceInstBody.length == 2) {
        for (let a = 0; a < DataServiceInstBody.length; a++) {
            //const DataServiceName = DataServiceInstBody[a].dataService.dataServiceName;
            const DataServiceInstanceName = DataServiceInstBody[a].dataServiceInstanceName;
            const consumedDataSpace = DataServiceInstBody[a].consumedDataSpace;
            const consumedDataCategory = DataServiceInstBody[a].consumedDataCategory;
            const consumedDataProvider = DataServiceInstBody[a].consumedDataProvider;
            const consumedSchemaVersion = DataServiceInstBody[a].consumedSchemaVersion;
            const consumedSchemaName = DataServiceInstBody[a].consumedSchemaName;

            
            switch (DataServiceInstanceName) {
                case config.SFTP_DCC_Registration_data_ENM1[1]:
                    //console.log("SFTP : DataServiceName for ENM1 is " + DataServiceName);
                    console.log("SFTP :	DataServiceInstanceName for ENM1 is " + DataServiceInstanceName);
                    console.log("SFTP : consumedDataSpace for ENM1 is " + consumedDataSpace);
                    console.log("SFTP : consumedDataCategory for ENM1 is " + consumedDataCategory);
                    console.log("SFTP : consumedDataProvider for ENM1 is " + consumedDataProvider);
                    console.log("SFTP : consumedSchemaVersion for ENM1 is " + consumedSchemaVersion);
                    console.log("SFTP : consumedSchemaName for ENM1 is " + consumedSchemaName);

                    check(DataServiceInstanceName, {
                        // ['Verify DataService value is matching for ENM1 for SFTP DC-C API GET call Status']: DataServiceName === data_ENM1[0],
                        ['Verify DataServiceInstanceName value is matching for ENM1']: DataServiceInstanceName === config.SFTP_DCC_Registration_data_ENM1[1],
                        ['Verify consumedDataSpace value is matching for ENM1']: consumedDataSpace === config.SFTP_DCC_Registration_data_ENM1[2],
                        ['Verify consumedDataCategory value is matching for ENM1']: consumedDataCategory === config.SFTP_DCC_Registration_data_ENM1[3],
                        ['Verify consumedDataProvider value is matching for ENM1']: consumedDataProvider === config.SFTP_DCC_Registration_data_ENM1[4],
                        ['Verify consumedSchemaVersion value is matching for ENM1']: consumedSchemaVersion === config.SFTP_DCC_Registration_data_ENM1[5],
                        ['Verify consumedSchemaName value is matching for ENM1']: consumedSchemaName === config.SFTP_DCC_Registration_data_ENM1[6],
                    })
                    break;
                case config.SFTP_DCC_Registration_data_ENM2[1]:
                    // console.log("SFTP : DataServiceName for ENM2 is " + DataServiceName);
                    console.log("SFTP:  DataServiceInstanceName for ENm2 is " + DataServiceInstanceName);
                    console.log("SFTP : consumedDataSpace for ENM2 is " + consumedDataSpace);
                    console.log("SFTP : consumedDataCategory for ENM2 is " + consumedDataCategory);
                    console.log("SFTP : consumedDataProvider for ENM2 is " + consumedDataProvider);
                    console.log("SFTP : consumedSchemaVersion for ENM2 is " + consumedSchemaVersion);
                    console.log("SFTP : consumedSchemaName for ENM2 is " + consumedSchemaName);

                    check(DataServiceInstanceName, {
                        //   ['Verify DataService value is matching for ENM2 for SFTP DC-C API GET call Status']: DataServiceName === data_ENM2[0],
                        ['Verify DataServiceInstanceName value is matching for ENM2']: DataServiceInstanceName === config.SFTP_DCC_Registration_data_ENM2[1],
                        ['Verify consumedDataSpace value is matching for ENM2']: consumedDataSpace === config.SFTP_DCC_Registration_data_ENM2[2],
                        ['Verify consumedDataCategory value is matching for ENM2']: consumedDataCategory === config.SFTP_DCC_Registration_data_ENM2[3],
                        ['Verify consumedDataProvider value is matching for ENM2']: consumedDataProvider === config.SFTP_DCC_Registration_data_ENM2[4],
                        ['Verify consumedSchemaVersion value is matching for ENM2']: consumedSchemaVersion === config.SFTP_DCC_Registration_data_ENM2[5],
                        ['Verify consumedSchemaName value is matching for ENM2']: consumedSchemaName === config.SFTP_DCC_Registration_data_ENM2[6],

                    })
                    break;
                default:
                    console.log("SFTP : DataServiceInstanceName is Not found in the list " + DataServiceInstanceName);
                    console.log("SFTP : consumedDataCategory is Not found in the list " + consumedDataCategory);
                    console.log("SFTP : consumedDataProvider is Not found in the list " + consumedDataProvider);
                    console.log("SFTP : consumedSchemaVersion is Not found in the list " + consumedSchemaVersion);
                    console.log("SFTP : consumedSchemaName is Not found in the list " + consumedSchemaName);
            }
        }
    }
    else {
        console.log("Number of Ran are not matching ");
        check(DataServiceInstBody, {
            'Verify whether 2 rans configured': DataServiceInstBody.length == config.SFTP_DCC_Registration_NumberofRanPODS,          
        })
    }
    //Validate Predicated Parameters Details
    const Supported_Predicate_Parameter = Body[value].dataService.predicateParameter;
    const ParameterName = Supported_Predicate_Parameter[0].parameterName;
    const isPassedToConsumedService = Supported_Predicate_Parameter[0].isPassedToConsumedService;
    const result_PredicateParamters = check(Supported_Predicate_Parameter, {
        'Verify parameterName in predicated Parameters': ParameterName == config.SFTP_DCC_Registration_ParameterName,
        'Verify isPassedToConsumedService in predicated Parameters': isPassedToConsumedService == config.SFTP_DCC_Registration_isPassedToConsumedService,
    });
    if(!result_PredicateParamters)
    {
        console.log("SFTP : Actual parameterName field value in Predicated Paramteres for SFTP DC-C is " + ParameterName);
        console.log("SFTP : Actual isPassedToConsumedService field value in Predicated Paramteres for SFTP DC-C is " + isPassedToConsumedService);    
    }
    //Validation of File Format Details
    const fielFileFormatList = Body[value].dataService.fileFormatList;
    const dataServiceName_fielFileFormatList = fielFileFormatList[0].dataService.dataServiceName;
    const specificationReference_fileFormat = fielFileFormatList[0].specificationReference;
    const dataEncoding_fileFormat = fielFileFormatList[0].dataEncoding;
    const result_fileFormat = check(fielFileFormatList, {
        'Verify Data Service Name value in FileFormat': dataServiceName_fielFileFormatList == config.SFTP_DCC_Registration_dataServiceName_fielFileFormatList,
        'Verify Specification Reference field value in FileFormat': specificationReference_fileFormat == config.SFTP_DCC_Registration_specificationReference_fileFormat,
        'Verify DataEncoding field value in FileFormat': dataEncoding_fileFormat == config.SFTP_DCC_Registration_dataEncoding_fileFormat,
    });
    if(!result_fileFormat)
    {
    console.log("SFTP : Actual Data Service Name in FileFormat for SFTP DC-C is " + dataServiceName_fielFileFormatList);
    console.log("SFTP : Actual Specification Reference field value in FileFormat for SFTP DC-C is " + specificationReference_fileFormat);
    console.log("SFTP : Actual DataEncoding field value in FileFormat for SFTP DC-C is " + dataEncoding_fileFormat);
    }
    //Validation of Bulk Repository Details
    const accessEndpoints_BulkRepository = Body[value].bulkDataRepository.accessEndpoints;
    const result_BulkRepository = check(accessEndpoints_BulkRepository, {
        'Verify Access Enpoint URL in BulkRepository': accessEndpoints_BulkRepository == config.SFTP_DCC_Registration_accessEndpoints_BulkRepository,
    });
    if(!result_BulkRepository)
    {
    console.log("SFTP : Actual Access Enpoint URL in BulkRepository for SFTP DC-C is " + accessEndpoints_BulkRepository);
    }

    //Validation of Message Bus Details
    const accessEndpoints_MessageBus = Body[value].notificationTopic.messageBus.accessEndpoints;
    const result_MessageBus =  check(accessEndpoints_MessageBus, {
        'Verify Access Enpoint URL in MessageBus': accessEndpoints_MessageBus == config.SFTP_DCC_Registration_accessEndpoints_MessageBus,
    });
    if(!result_MessageBus)
    {
    console.log("SFTP : Actual Access Enpoint URL in MessageBus for SFTP DC-C is " + accessEndpoints_MessageBus);
    }

   // Validation of Notification Topic Details
    const notificationTopic = Body[value].notificationTopic;
    const specificationReference = notificationTopic.specificationReference;
    const encoding = notificationTopic.encoding;
    const result_NotificationTopic =  check(notificationTopic, {
        'Verify specificationReference in notificationTopic': specificationReference == config.SFTP_DCC_Registration_specificationReference,
        'Verify encoding in notificationTopic': encoding == config.SFTP_DCC_Registration_encoding,
    });
    if(!result_NotificationTopic)
    {
        console.log("SFTP : Actual specificationReference field value in notificationTopic for SFTP DC-C is " + specificationReference);
        console.log("SFTP : Actual encoding field value in Predicated Paramteres for SFTP DC-C is " + encoding);
    }

    //Validation of Data Provider Type
    const dataspace_dataProvider = Body[value].notificationTopic.dataProviderType.dataSpace.name;
    const dataCategory_dataProvider = Body[value].notificationTopic.dataProviderType.dataCategoryType.dataCategoryName;
    const dataprovidterTypeName = Body[value].notificationTopic.dataProviderType.dataProviderName;
    const result_dataProvider =  check(dataprovidterTypeName, {
        ['Verify DataProviderType ID value']: dataprovidterTypeName == config.SFTP_DCC_Registration_dataprovidterTypeName,
        ['Verify Data Categorye ID value']: dataCategory_dataProvider == config.SFTP_DCC_Registration_dataCategory_dataProvider,
        ['Verify DataSPace']: dataspace_dataProvider == config.SFTP_DCC_Registration_dataspace_dataProvider,
    });
    if(!result_dataProvider)
    {
    console.log("SFTP : Actual Data Space in Data Provider Type  is " + dataspace_dataProvider);
    console.log("SFTP : Actual Data Category in Data Provider Type " + dataCategory_dataProvider);
    console.log("SFTP : Actual Data Provider Type Name is " + dataprovidterTypeName);
    }
    //Validation of Data Type Details
    const DataType_mediumtype = Body[value].dataType.mediumType;
    const DataType_schemaName = Body[value].dataType.schemaName;
    const DataType_schemaVersion = Body[value].dataType.schemaVersion;
    const DataType_isExternal = Body[value].dataType.isExternal;
    const result_dataType =  check(DataType_mediumtype, {
        ['Verify Medium Type in DataType']:DataType_mediumtype == config.SFTP_DCC_Registration_DataType_mediumtype,
        ['Verify Schema Name in DataType']:DataType_schemaName == config.SFTP_DCC_Registration_Expected_Schema,
        ['Verify Schema Version in DataType']:DataType_schemaVersion == config.SFTP_DCC_Registration_DataType_schemaVersion,
        ['Verify Is External field in DataType ']: DataType_isExternal == config.SFTP_DCC_Registration_DataType_isExternal,
    });
    if(!result_dataType)
    {
    console.log("SFTP : Actual Meidum TYpe in Datatype is " + DataType_mediumtype);
    console.log("SFTP : Actual Schema Name in Datatype is " + DataType_schemaName);
    console.log("SFTP : Actual Schema Version in Datatype is " + DataType_schemaVersion);
    console.log("SFTP : Actual Is External in Datatype is " + DataType_isExternal);
    }
}