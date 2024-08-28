import http from 'k6/http';
import { check, group } from 'k6';
import * as config from "./config.js";
import { DataSPaceVal, datacatalog_V2_Endpoint, data_service_name } from './config.js';



//Metthod to register data into data catalog
export default function () {
    let value;
    group('Validation of FNS DC-C Registration', function () {
        for (let d = 0; d < DataSPaceVal.length; d++) {

            //Method for validating FNS-DC-C for Data Space
            group('Validation of FNS-DC-C Registrion for Data Space ' + DataSPaceVal[d], function () {
                console.log("==============================FNS-DC-C-" + DataSPaceVal[d] + "-Start===================================");
                const URL = datacatalog_V2_Endpoint + 'message-schema?dataSpace=' + DataSPaceVal[d];
                console.log(URL);
                const fns_DCC = http.get(URL);
                console.log("FNS : Status of FNS DC-C API for DataSPace " + DataSPaceVal[d] + " is " + fns_DCC.status);
                check(fns_DCC, {
                    'Validate API Status is 200': (r) => r.status === 200,
                })
                const Body = JSON.parse(fns_DCC.body);
                if (DataSPaceVal[d] == "5G") {
                    for (let k = 0; k < Body.length; k++) {
                        if (Body[k].specificationReference == "eric-oss-enm-fns--5G--PM_EVENTS--enm1") {
                            value = k;
                            break;
                        }
                    } // inner for loop -end
                } //if -end
                else {
                    value = 0;
                } //else - end

                if (fns_DCC.status == 200) {
                    const dataspace_value = Body[value].messageDataTopic.dataProviderType.dataSpace.name;
                    console.log("FNS : Data Space name is " + dataspace_value);
                    console.log("FNS : ---Fetching Data Service and Data Service Instance Details ------------------");
                    const DataServiceInstBody = Body[value].dataService.dataServiceInstance;
                    console.log("DataService-Instance-body is ", DataServiceInstBody);
                    for (let a = 0; a < DataServiceInstBody.length; a++) {
                        const DataServiceInstanceName = DataServiceInstBody[a].dataServiceInstanceName;
                        const ServiceInstance = "eric-oss-enm-fns";
                        console.log("FNS : DataServiceName is " + Body[value].dataService.dataServiceName);
                        console.log("FNS: DataServiceInstanceName is " + DataServiceInstanceName);
                        check(DataServiceInstanceName, {
                            ['Verify DataServiceInstanceName value is matching with DataSpace Name and Data Service instance for FNS DC-C API GET call Status']: DataServiceInstanceName == ServiceInstance
                        })
                    } // inner for loop -end
                    console.log("FNS : ---Fetching Supported Predicated Parameters Details ------------------");
                    const Supported_Predicate_Parameter = Body[value].dataService.predicateParameter[0].parameterName;
                    console.log("Support Predicate Paramter value for Data Space " + DataSPaceVal[d] + " is " + Supported_Predicate_Parameter);
                    check(Supported_Predicate_Parameter, {
                        ['Verify Supported_Predicate_Parameters value for Data Space is matching with nodeName for FNS DC-C API GET call Status']: Supported_Predicate_Parameter === "nodeName"
                    })
                    console.log("FNS : ---Fetching Data Category Name Details ------------------");
                    const datacategory = Body[value].messageDataTopic.dataProviderType.dataCategoryType.dataCategoryName;
                    console.log("FNS : Data category name is " + datacategory);
                    if (dataspace_value == "5G") {
                        //data category
                        check(datacategory, {
                            'Verify DataCategory Name value ': datacategory == config.FNS_DC_C_datacategory_PM_EVENT,
                        })
                    } //if - end
                    else {
                        check(datacategory, {
                            ['Verify DataCategory Name value ']: datacategory == config.FNS_DC_C_datacategory_PM_COUNTER,
                        })
                    } //else - end

                    //Getting Data Provider Type Details
                    console.log("FNS : ---Fetching Data Provider Type Details ------------------");
                    const dataprovidterTypeID = Body[value].messageDataTopic.dataProviderType.providerTypeId;
                    console.log("FNS : Data Provider Type Id is " + dataprovidterTypeID);
                    check(dataprovidterTypeID, {
                        ['Verify DataProviderType ID value']: dataprovidterTypeID == config.FNS_DC_C_dataprovider_enm1 || dataprovidterTypeID == config.FNS_DC_C_dataprovider_enm2,
                    })

                    //Getting Message Data Topic Details
                    console.log("FNS : ---Fetching Message Data Topic Details ------------------");
                    const messageDataTopic_name = Body[value].messageDataTopic.name;
                    console.log("FNS : Message Data Topic Name is " + messageDataTopic_name);
                    const messageDataTopic_messageBusid = Body[value].messageDataTopic.messageBus.id;
                    console.log("FNS : Message Bus id is " + messageDataTopic_messageBusid);


                    if (dataspace_value == "5G") {
                        check(messageDataTopic_name, {
                            ['Verify Message Data Topic Name']: messageDataTopic_name == config.FNS_DC_C_messageDataTopic_fns_5g_event,
                            ['Verify Message Bus ID ' ]: messageDataTopic_messageBusid == config.FNS_DC_C_messageDataTopic_fns_5g_event_messageBusid,
                        })
                    } //if - end

                    else if (dataspace_value == "PCC-PCG") {
                        check(messageDataTopic_name, {
                            ['Verify Message Data Topic Name ' ]: messageDataTopic_name == config.FNS_DC_C_messageDataTopic_fns_pcc_pcg_enm1 || messageDataTopic_name === config.FNS_DC_C_messageDataTopic_fns_pcc_pcg_enm2,
                            ['Verify Message Bus ID ' ]: messageDataTopic_messageBusid == config.FNS_DC_C_messageDataTopic_fns_pcc_pcg_messageBusid
                        })
                    } //else if - end

                    else {
                        check(messageDataTopic_name, {
                            ['Verify Message Data Topic Name ' ]: messageDataTopic_name === config.FNS_DC_C_messageDataTopic_fns_sftp_ft_enm1 || messageDataTopic_name === config.FNS_DC_C_messageDataTopic_fns_sftp_ft_enm2,
                            ['Verify Message Bus ID  '] : messageDataTopic_messageBusid === config.FNS_DC_C_messageDataTopic_fns_sftp_ft_messageBusid
                        })
                    } //else - end



                    //Getting Data Type Details
                    console.log("FNS : ---Fetching Data Type Details ------------------");
                    const DataType_mediumtype = Body[value].dataType.mediumType;
                    console.log("FNS : Meidum Type in Datatype is " + DataType_mediumtype);
                    console.log("FNS : Schema Name in Datatype is " + Body[value].dataType.schemaName);
                    console.log("FNS : Schema Version in Datatype is " + Body[value].dataType.schemaVersion);
                    console.log("FNS : FNS : Is External in Datatype is " + Body[value].dataType.isExternal);

                    check(DataType_mediumtype, {
                        ['Verify Medium Type value in DataType' ]: DataType_mediumtype === config.FNS_DC_C_DataType_mediumtype,
                        ['Verify Schema Name in Datatype']: Body[value].dataType.schemaName === config.FNS_DC_C_DataType_schemaName,
                        ['Verify Schema Version in Datatype' ]: Body[value].dataType.schemaVersion === config.FNS_DC_C_DataType_schemaVersion,
                        ['Verify Is External in Datatype' ]: Body[value].dataType.isExternal === config.FNS_DC_C_DataType_External
                    })


                    //Getting Message Schema Details
                    console.log("FNS : ---Fetching Message Schema Details ------------------");
                    const messageSchema_specificationReference = Body[value].specificationReference;
                    console.log("FNS : Specifciation Reference name is " + messageSchema_specificationReference);


                    //Validate FNS-DC-C registrations for Data Space 5G
                    if (dataspace_value == "5G") {
                        check(messageSchema_specificationReference, {
                            'Verify Specifciation Reference name in Message Schema for Data Space 5G': messageSchema_specificationReference === config.FNS_DC_C_specificationReference_fns_5g_event
                        })
                    } //if - end

                    //Validate FNS-DC-C registration for Data Space PCC_PCG
                    else if (dataspace_value == "PCC-PCG") {
                        check(messageSchema_specificationReference, {
                            'Verify Specifciation Reference name in Message Schema for DataSpace PCC-PCG': messageSchema_specificationReference === config.FNS_DC_C_specificationReference_fns_pcc_pcg_enm1 || messageSchema_specificationReference === config.FNS_DC_C_specificationReference_fns_pcc_pcg_enm2
                        })
                    } //else if - end

                    //Validate FNS-DC-C registration for Data Space 4G5G
                    else {
                        check(messageSchema_specificationReference, {
                            'Verify Specifciation Reference name in Message Schema for DataSpace 4G5G': messageSchema_specificationReference === config.FNS_DC_C_specificationReference_fns_4G5G_enm1|| messageSchema_specificationReference === config.FNS_DC_C_specificationReference_fns_4G5G_enm2
                        })
                    } //else - end
                } //if - end
                else {
                    console.log("FNS : We are not Verifying Data of FNS DC-C for Data Space " + DataSPaceVal[d] + " since status is " + fns_DCC.status + " instead of 200");
                    console.log("FNS : Response Body for FNC_DC-C for Data Space " + DataSPaceVal[d] + " is " + fns_DCC.body);
                } //else - end
                console.log("-----------------FNS-DC-C-" + DataSPaceVal[d] + "-END----------------------------------------");
            }); //group
        } //for loop -end
    });
}
