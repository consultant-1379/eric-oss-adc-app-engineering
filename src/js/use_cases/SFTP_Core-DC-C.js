import http from 'k6/http';
import { check, group } from 'k6';
import * as config from "./config.js";
var value;
let Body = [];
let i = 0;
//Execution starts from below method for SFTP Core DC-C Registration
export default function () {

    group('Validation of SFTP-Core-DC-C Registration ', function () {
        console.log("==============================SFTP_core-DC-C-Start===================================");
        const URL = config.SFTP_DCC_Registration + 'file-format';
        const SFTP_core_DCC = http.get(URL);
        console.log("SFTP_core : Status of SFTP_core DC-C Get API Call is " + SFTP_core_DCC.status);
        Body = JSON.parse(SFTP_core_DCC.body);
        //Validate SFTP Core DC-C Registration data with expected output if Status is 200
        if (SFTP_core_DCC.status == config.SFTP_DCC_Registration_Expected_Status) {
            for (let k = 0; k < Body.length; k++) {
                console.log("SFTP_core : Schema Name in Response Body is ", Body[k].dataType.schemaName);
                if (Body[k].dataType.schemaName == config.SFTP_DCC_core_Registration_Expected_Schema) {
                    value = k;
                    //Method for validate the SFTP Core DC-C Registration
                    CoreTest();
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
                console.log("SFTP_core : Core Schema Not found and not running the Use case");
                const DataType_schema = Body[i].dataType.schemaName;
                check(DataType_schema, {
                    ['Verify Schema Name in SFTP Core DC-C']: DataType_schema === config.SFTP_DCC_core_Registration_Expected_Schema,
                })

            }
            else {
                console.log("SFTP_core : Core Schema Found and use case ran Successfully");
                const DataType_schema = Body[value].dataType.schemaName;
                check(DataType_schema, {
                    ['Verify Schema Name in SFTP Core DC-C']: DataType_schema === config.SFTP_DCC_core_Registration_Expected_Schema,
                })

            }
        }
        else {
            console.log("SFTP_core : We are not Verifying Data of SFTP_core DC-C API since status is " + SFTP_core_DCC.status + " instead of 200");
            console.log("SFTP_core : Response Body for FNC_DC-C for Data Space is " + SFTP_core_DCC.body);
        }
        console.log("-----------------SFTP_core core-DC-C-END----------------------------------------");
    });
}//default function end
// Validation of SFTP Core DC-C Registered data with expected data
export function CoreTest() {
    //Validate Data Service and Data Service Instance Details
    const DataServiceInstBody = Body[value].dataService.dataServiceInstance;
    const DataServiceInstanceName = DataServiceInstBody[0].dataServiceInstanceName;
    const consumedDataSpace = DataServiceInstBody[0].consumedDataSpace;
    const consumedDataCategory = DataServiceInstBody[0].consumedDataCategory;
    const consumedDataProvider = DataServiceInstBody[0].consumedDataProvider;
    const consumedSchemaVersion = DataServiceInstBody[0].consumedSchemaVersion;
    const consumedSchemaName = DataServiceInstBody[0].consumedSchemaName;
    const result_DataService= check(DataServiceInstanceName, {
        // ['Verify DataService value is matching for ENM1 for SFTP_core DC-C API GET call Status']: DataServiceName === data_ENM1[0],
        ['Verify DataServiceInstanceName value is matching for ENM1']: DataServiceInstanceName === config.SFTP_Core_DCC_Registration_data_ENM1[1],
        ['Verify consumedDataSpace value is matching for ENM1']: consumedDataSpace === config.SFTP_Core_DCC_Registration_data_ENM1[2],
        ['Verify consumedDataCategory value is matching for ENM1']: consumedDataCategory === config.SFTP_Core_DCC_Registration_data_ENM1[3],
        ['Verify consumedDataProvider value is matching for ENM1']: consumedDataProvider === config.SFTP_Core_DCC_Registration_data_ENM1[4],
        ['Verify consumedSchemaVersion value is matching for ENM1']: consumedSchemaVersion === config.SFTP_Core_DCC_Registration_data_ENM1[5],
        ['Verify consumedSchemaName value is matching for ENM1']: consumedSchemaName === config.SFTP_Core_DCC_Registration_data_ENM1[6],
    });
    if (!result_DataService) {
    console.log("SFTP_core : Actual DataServiceInstanceName for ENM1 is " + DataServiceInstanceName);
    console.log("SFTP_core : Actual consumedDataSpace for ENM1 is " + consumedDataSpace);
    console.log("SFTP_core : Actual consumedDataCategory for ENM1 is " + consumedDataCategory);
    console.log("SFTP_core : Actual consumedDataProvider for ENM1 is " + consumedDataProvider);
    console.log("SFTP_core : Actual consumedSchemaVersion for ENM1 is " + consumedSchemaVersion);
    console.log("SFTP_core : Actual consumedSchemaName for ENM1 is " + consumedSchemaName);
    }
    //Validate Predicated Parameters Details
    const Supported_Predicate_Parameter = Body[value].dataService.predicateParameter;
    const ParameterName = Supported_Predicate_Parameter[0].parameterName;
    const isPassedToConsumedService = Supported_Predicate_Parameter[0].isPassedToConsumedService;
    const result_predicatedparamters = check(Supported_Predicate_Parameter, {
        'Verify parameterName in predicated Parameters': ParameterName == config.SFTP_DCC_Registration_ParameterName,
        'Verify isPassedToConsumedService in predicated Parameters': isPassedToConsumedService == config.SFTP_DCC_Registration_isPassedToConsumedService,
     });
    if (!result_predicatedparamters) {
        console.log("SFTP_core : Actual parameterName value in SFTP_core DC-C is " + ParameterName);
        console.log("SFTP_core : Actual isPassedToConsumedService value in SFTP_core DC-C is " + isPassedToConsumedService);
    }
    //Validation of File Format Details
    const fielFileFormatList = Body[value].dataService.fileFormatList;
    const dataServiceName_fielFileFormatList = fielFileFormatList[0].dataService.dataServiceName;
    const specificationReference_fileFormat = fielFileFormatList[0].specificationReference;
    const dataEncoding_fileFormat = fielFileFormatList[0].dataEncoding;
    const result_fileformat = check(fielFileFormatList, {
        'Verify Data Service Name value in FileFormat': dataServiceName_fielFileFormatList == config.SFTP_Core_DCC_Registration_dataServiceName_fielFileFormatList,
        'Verify Specification Reference field value': specificationReference_fileFormat == config.SFTP_DCC_Registration_specificationReference_fileFormat,
        'Verify DataEncoding field value in FileFormat': dataEncoding_fileFormat == config.SFTP_DCC_Registration_dataEncoding_fileFormat,

    });
    if (!result_fileformat) {
    console.log("SFTP_core : Actual Data Service Name in FileFormat for SFTP_core DC-C is " + dataServiceName_fielFileFormatList);
    console.log("SFTP_core : Actual Specification Reference field value in FileFormat for SFTP_core DC-C is " + specificationReference_fileFormat);
    console.log("SFTP_core : Actual DataEncoding field value in FileFormat for SFTP_core DC-C is " + dataEncoding_fileFormat);
    }

    //Validation of Bulk Repository Details
    const accessEndpoints_BulkRepository = Body[value].bulkDataRepository.accessEndpoints;
    const result_bulkRepository = check(accessEndpoints_BulkRepository, {
        'Verify Access Enpoint URL in BulkRepository': accessEndpoints_BulkRepository == config.SFTP_DCC_Registration_accessEndpoints_BulkRepository,

    });
    if (!result_bulkRepository) {
       console.log("SFTP_core : Access Enpoint URL in BulkRepository for SFTP_core DC-C is " + accessEndpoints_BulkRepository);
    }
    //Validation of Message Bus Details
    const accessEndpoints_MessageBus = Body[value].notificationTopic.messageBus.accessEndpoints;
    const result_messageBus = check(accessEndpoints_MessageBus, {
        'Verify Access Enpoint URL in MessageBus': accessEndpoints_MessageBus == config.SFTP_DCC_Registration_accessEndpoints_MessageBus,
    });
    if (!result_messageBus) {
        console.log("SFTP_core : Actual Access Enpoint URL in MessageBus for SFTP_core DC-C is " + accessEndpoints_MessageBus);
    }
    //Validation of Notification Topic Details
    const notificationTopic = Body[value].notificationTopic;
    const specificationReference = notificationTopic.specificationReference;
    const encoding = notificationTopic.encoding;
    const result_NotificationTopic = check(notificationTopic, {
        'Verify specificationReference in notificationTopic': specificationReference == config.SFTP_DCC_Registration_specificationReference,
        'Verify encoding in notificationTopic': encoding == config.SFTP_DCC_Registration_encoding,

    });
    if (!result_NotificationTopic) {
    console.log("SFTP_core : Actual specificationReference field value in notificationTopic for SFTP_core DC-C is " + specificationReference);
    console.log("SFTP_core : Actual encoding field value in Predicated Paramteres for SFTP_core DC-C is " + encoding);
    }

    //Validation of Data Provider Type Details
    const dataspace_dataProvider = Body[value].notificationTopic.dataProviderType.dataSpace.name;
    const dataCategory_dataProvider = Body[value].notificationTopic.dataProviderType.dataCategoryType.dataCategoryName;
    const dataprovidterTypeName = Body[value].notificationTopic.dataProviderType.dataProviderName;
    const result_dataProvider = check(dataprovidterTypeName, {
        ['Verify DataProviderType ID value']: dataprovidterTypeName == config.SFTP_DCC_Registration_dataprovidterTypeName,
        ['Verify Data Categorye ID value']: dataCategory_dataProvider == config.SFTP_DCC_Registration_dataCategory_dataProvider,
        ['Verify DataSPace for SFTP_core Core']: dataspace_dataProvider == config.SFTP_DCC_Registration_dataspace_dataProvider,

    });
    if (!result_dataProvider) {
    console.log("SFTP_core : Actual Data Space in Data Provider Type  is " + dataspace_dataProvider);
    console.log("SFTP_core : Actual Data Category in Data Provider Type " + dataCategory_dataProvider);
    console.log("SFTP_core : Actual Data Provider Type Name is " + dataprovidterTypeName);
    }

    //Validation of Data Type Details
    const DataType_mediumtype = Body[value].dataType.mediumType;
    const DataType_schemaName = Body[value].dataType.schemaName;
    const DataType_schemaVersion = Body[value].dataType.schemaVersion;
    const DataType_isExternal = Body[value].dataType.isExternal;
    const result_dataType = check(DataType_mediumtype, {
        ['Verify Medium Type value in Data Type']: DataType_mediumtype === config.SFTP_DCC_Registration_DataType_mediumtype,
        ['Verify Schema Name in Datatype']: DataType_schemaName == config.SFTP_DCC_core_Registration_Expected_Schema,
        ['Verify Schema Version in Datatype']: DataType_schemaVersion == config.SFTP_DCC_Registration_DataType_schemaVersion,
        ['Verify Is External in Datatype']: DataType_isExternal == config.SFTP_DCC_Registration_DataType_isExternal
    });
    if (!result_dataType) {
    console.log("SFTP_core : Actual Meidum TYpe in Datatype is " + DataType_mediumtype);
    console.log("SFTP_core : Actual Schema Name in Datatype is " + DataType_schemaName);
    console.log("SFTP_core : Actual Schema Version in Datatype is " + DataType_schemaVersion);
    console.log("SFTP_core : Actual Is External in Datatype is " + DataType_isExternal);
    }

}
