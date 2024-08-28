export const buffertime=480;
export const timeoutLimit=600;
export var buffertime_consumption_messages = 180;
export var timeout_consumption_messages = 900;

export const metrics_URL = `${__ENV.metrics_url}`;
export const TLS_ENABLED = `${__ENV.TLS}`;
export const ADC_HOSTNAME = "https://"+`${__ENV.hostname_url}`+"/";
export var RESTSim_URL = `${__ENV.RESTSim_URL}`;


// pmStats usecase flow variables
export const pmStatsfilecount = `${__ENV.pmStatsfilecount}`;
export const cRANFilecount = 3240;

//PCC_PCG usecase flow variable
export const pcc_pcg_filecount =100;

//4GPMEvent files
export const Pmevent_4G_filecount =500;
export var produced_events_count=28893000;
export var Skipped_4G_events = 7123000;
export var standardTopic_4GParser_PublishedFiles="14483500";
export var propretiaryTopic_4GParser_PublishedFiles="14409500";
export var OutputTopic_4G_FT = "4g-pm-event-file-transfer-and-processing";
export var expectedLength_4G_FT=5;
export var expected_headers_4G_FT = ["eventId","subscriptionNames","nodeName", "ts", "dataVersion", "version"];
export var OutputTopic_4G_parser =  "ctr-processed";
export var expectedLength_3gpp_Ran=4;



// EBSN usecase flow variables
let optionsfile = `${__ENV.OPTIONS_FILE}`;
console.log("Optionsfile: ",optionsfile);
export var EBSN_filecount;
if (optionsfile == "/resources/config/default.options.json"){
    EBSN_filecount = 5;
}
else{
    EBSN_filecount = 0;
}

// Number of enm`s and names
export var csr_ENM1="enm1";
export var csr_ENM2="enm2";

//Output Topics details in DC and Kafka
//export var expectedTopicName = ["file-notification-service--sftp-filetrans--enm1", "file-notification-service--pcc_pcg--enm1", "file-notification-service--5g-event--enm1", "file-notification-service--sftp-filetrans--enm2", "file-notification-service--pcc_pcg--enm2", "file-notification-service--5g-event--enm2", "ran-pm-counter-sftp-file-transfer", "core-pm-counter-sftp-file-transfer", "eric-oss-3gpp-pm-xml-ran-parser-lte", "eric-oss-3gpp-pm-xml-ran-parser-nr", "eric-oss-3gpp-pm-xml-ran-parser-logbook", "eric-oss-3gpp-pm-xml-ran-parser-ebsn", "eric-oss-3gpp-pm-xml-core-parser-", "5g-pm-event-file-transfer-and-processing--enm1","3gpp-PM-XML-Parser-Update-Notification-Topic"];
export var expectedPMStatsTopicName = ["file-notification-service--sftp-filetrans--enm1","ran-pm-counter-sftp-file-transfer","eric-oss-3gpp-pm-xml-ran-parser-nr", "eric-oss-3gpp-pm-xml-ran-parser-lte", "eric-oss-3gpp-pm-xml-ran-parser-logbook","3gpp-PM-XML-Parser-Update-Notification-Topic","eric-oss-3gpp-pm-xml-ran-parser-cran-cu-up","eric-oss-3gpp-pm-xml-ran-parser-cran-du","eric-oss-3gpp-pm-xml-ran-parser-cran-cu-cp"];
export var expectedpmstatsRetentionPeriod = [1200000,3600000,1200000,1200000,1200000,604800000,1200000,1200000,1200000];
export var expectedpmstatspartitions=[36,36,3,3,3,3,3,3,3];
export var expectedPMEventsTopicName = ["file-notification-service--5g-event--enm1","5g-pm-event-file-transfer-and-processing--standardized","5g-pm-event-file-transfer-and-processing--ericsson"];
export var expectedpmeventsRetentionPeriod = [1200000,1200000,1200000];
export var expectedpmeventspartitions=[36,20,20];
export var expectedCoreStatsTopicName = ["file-notification-service--pcc_pcg--enm1","core-pm-counter-sftp-file-transfer","eric-oss-3gpp-pm-xml-core-parser-"];
export var expectedCoreRetentionPeriod = [1200000,3600000,7200000];
export var expectedCorepartitions=[36,36,3];
export var expected4GPMEventsTopicNames = ["file-notification-service--4g-event--enm1","4g-pm-event-file-transfer-and-processing","ctr-processed","ctr-processed-proprietary"];
export var expected4GRetentionPeriod = [1200000,1200000,1200000,1200000];
export var expected4Gpartitions=[72,36,50,50];

export var connected_system_url='http://eric-eo-subsystem-management:80';
export var kafka_URL='http://kafka-wrapper:8082/topic/';
export var kafka_list='http://kafka-wrapper:8082/topics';
export var expected_headers_3G_RAN_output_topic = ["schemaSubject","subscriptionNames","schemaID", "moType", "nodeFDN", "elementType", "spring_json_header_types", "b3"];
export var OutputTopic_3gPP_NR = "eric-oss-3gpp-pm-xml-ran-parser-nr";
export var OutputTopic_3gPP_LTE = "eric-oss-3gpp-pm-xml-ran-parser-lte";
export var OutputTopic_3gPP_du = "eric-oss-3gpp-pm-xml-ran-parser-cran-du";
export var OutputTopic_3gPP_CUCP = "eric-oss-3gpp-pm-xml-ran-parser-cran-cu-cp";
export var OutputTopic_3gPP_CUUP = "eric-oss-3gpp-pm-xml-ran-parser-cran-cu-up";
export var MessageCount=1;
export var MessageCount_CUCP=960;
export var MessageCount_CUUP=1;
export var Messagecount_du=10;

//FNS output topics
export var fns_5GOutputTopic="5g-event";

//5GPmevent Service variables
export var expected_headers_5G = ["event_id"];
export var OutputTopic_5G = "5g-pm-event-file-transfer-and-processing--standardized";
export var expectedLength_5G=1;
export var OutputTopic_5G_NonStandard = "5g-pm-event-file-transfer-and-processing--ericsson";
export const expected_5G_ReadTotal_Count=842230000;
export var standardTopic_5G_PublishedFiles="739670000";
export var nonStandardTopic_5G_PublishedFiles="24860000";
export var pmevent_5G_flowType="5g_pm_events";
export const pmCelltracefilecount = 30000;


export var ranNRTopicPublishedFiles=10000;
export var ranLTETopicPublishedFiles=5000;
export var pmevent_4G_publishedFiles=20000;
export var ranCUUPTopicPublishedFiles=1080;
export var ranCUCPTopicPublishedFiles=1036800;
export var ranDUTopicPublishedFiles=10800;
export var ran_flowType="pm_counters";
export var pmevent_4G_flowType="4g_pm_events";

export var expected_kafkalist=["file-notification-service--5g-event--enm2--query2--persistence","file-notification-service--sftp-filetrans--enm1--query1--persistence","file-notification-service--sftp-filetrans--enm2","file-notification-service--5g-event--enm2","file-notification-service--pcc_pcg--enm1--queryPCG--persistence","eric-oss-3gpp-pm-xml-core-parser-","eric-oss-3gpp-pm-xml-ran-parser-nr","eric-ran-cu-up-ppf-canary-upgrade","3gpp-PM-XML-Parser-Update-Notification-Topic","eric-oss-3gpp-pm-xml-core-parser-logbook","file-notification-service--sftp-filetrans--enm2--query1--persistence","eric-oss-3gpp-pm-xml-ran-parser-logbook","file-notification-service--sftp-filetrans--enm1--queryEBSN--persistence","5g-pm-event-file-transfer-and-processing--enm1","ran-pm-counter-sftp-file-transfer","file-notification-service--pcc_pcg--enm1--queryPCC--persistence","file-notification-service--5g-event--enm1","eric-oss-3gpp-pm-xml-ran-parser-ebsn","file-notification-service--pcc_pcg--enm2","_schemas","file-notification-service--pcc_pcg--enm2--queryPCC--persistence","ctr-processed","file-notification-service--pcc_pcg--enm2--queryPCG--persistence","dcc--notification-topic","file-notification-service--pcc_pcg--enm1","file-notification-service--4g-event--enm1--query4G--persistence","__consumer_offsets","eric-oss-3gpp-pm-xml-ran-parser-lte","file-notification-service--5g-event--enm1--query2--persistence","file-notification-service--sftp-filetrans--enm1","AdpFaultIndication","__strimzi-topic-operator-kstreams-topic-store-changelog","core-pm-counter-sftp-file-transfer","__strimzi_store_topic","file-notification-service--4g-event--enm1","4g-pm-event-file-transfer-and-processing","ctr-processed","5g-pm-event-file-transfer-and-processing--standardized","__transaction_state","5g-pm-event-file-transfer-and-processing--ericsson","ctr-processed-proprietary"] ;

export var enm_job="eric-oss-file-notification-enm-stub";
export var fns_job=`${__ENV.fns_job}`;
export var fns_app="eric-oss-enm-fns";
export var sftp_job= `${__ENV.sftp_podname}`;
export var sftp_app= "eric-oss-sftp-filetrans";
export var core_sftp_job="kubernetes-pods-istio-secure";
export var core_sftp_app="eric-oss-sftp-filetrans-core-1";
export var Ran_parser_job=`${__ENV.Ran_parser_job}`;
export var Ran_parser_app="eric-oss-3gpp-pm-xml-ran-parser";
export var core_parser_job="kubernetes-pods-istio-secure";
export var core_parser_app="eric-oss-3gpp-pm-xml-core-parser";
export var pm_event_4g_job="kubernetes-pods-istio-secure";
export var pm_event_4g_parser_app="eric-oss-4g-pm-event-parser";
export var PMEvent_5G_job="kubernetes-pods-istio-secure";
export var PMEvent_5G_app="eric-oss-5gpmevt-filetx-proc";
export var pmEvent_4g_FileTransfer_Job="kubernetes-pods-istio-secure";
export var pmEvent_4g_FileTransfer_App="eric-oss-4gpmevent-filetrans-proc";
export var Ves_job="kubernetes-pods-istio-secure";
export var Ves_app="oss-ves-collector";
export var kafka_wrapper_job="kubernetes-pods-istio-secure";
export var kafka_wrapper_app="kafka-wrapper";

//kafka metrics
export var ebsn_produced_kafka=337;
export var lte_produced_kafka=8720;
export var nr_produced_kafka=65942;

export var Subscription_SFTP_RAN_Topic=0;
export var Subscription_PCC_PCG_Topic=1;
export var Subscription_5G_Topic=2;
export var Subscription_SFTP_SDK=3;
export var Subscription_SFTP_LTE=4;
export var Subscription_4G_PMEvent=5;
export var Subscription_5G_propretiary=6;
export var Subscription_cRAN_CUUP=7;
export var Subscription_cRAN_CUCP=8;
export var Subscription_cRAN_du=9;
export var Subscription_4G_PMEvent_propretiary=10;

// Subscription usecase flow variables
export var Subscription_Base = 'http://eric-oss-data-collection-controller:8080/subscription/v1';
export var Subscription_Name=["adc-testware-subscription-create-sftp","adc-testware-subscription-create-pcc-pcg","adc-testware-subscription-create-5g","adc-testware-subscription-create-sftp-sdk","adc-testware-subscription-create-lte","adc-testware-subscription-create-4gpmevent","adc-testware-subscription-create-5g-propteiary","adc-testware-cran-cuup","adc-testware-cran-cucp","adc-testware-cran-du","adc-testware-subscription-create-4gpmevent-propteiary"];
export var Subscription_dataSpace=["5G","5G","5G","5G","4G","4G","5G","5G","5G","5G","4G"];
export var Subscription_dataCategory=["PM_COUNTERS","PM_COUNTERS","PM_EVENTS","PM_COUNTERS","PM_COUNTERS","PM_EVENTS","PM_EVENTS","PM_COUNTERS","PM_COUNTERS","PM_COUNTERS","PM_EVENTS"];
export var Subscription_dataProvider=["Vv101","vv101","gNodeB"];
export var Subscription_schemaName=["NR.RAN.PM_COUNTERS.EP_XnU_GNBCUUP_1","up_payload_dnn_slice_1","PmEventOuterClass.PmEvent","NR.RAN.PM_COUNTERS.NRCellCU_GNBCUCP_1","LTE.RAN.PM_COUNTERS.AclEntryIpv6Stats_1","4g-pm-event_schema","PmEventOuterClass.EricssonPmEvent","CRAN_E1Link_GNBCUUP_1","CRAN_NRCellCU_GNBCUCP_1","CRAN_NRCellDU_GNBDU_1","4g-pm-event_proprietary_schema"];
export var Subscription_schemaVersion=[1,1,1,1,1,1,1,1,1,1,1];
export var Subscription_topicname=["sftp-filetrans","pcc_pcg","5g-event","sftp-filetrans-sdk","sftp-lte","4g-event","5g-event-propretiary","ran-parser-cran-cuup","ran-parser-cran-cucp","ran-parser-cran-du","4g-event-propretiary"];
export var Subscription_nodename=["*ManagedElement=*","*ERBS*","*ManagedElement=*","NR01gNodeBRadio00001","*ManagedElement=*","*","*ManagedElement=*","*","*","*","*"];
export var Subscription_eventId_5g=["*"];
export var Predicates_4G_subscription=["*","8200"];

//Subscription Metric Expected Counts
export var expected_SFTPTopic_Count = 6;
export var expected_CoreTopic_Count = 1;
export var expected_5GTopic_Count = 2;
export var expected_Ran_AllSubscriptions_Count = 3;
export var expected_Ran_ActiveSubscriptions_Count = 3;
export var expected_Ran_InActiveSubscriptions_Count = 0;
export var expected_Ran_DCActiveSubscriptions_Count = 0;
export var expected_Ran_TotalActiveSubscriptions_Count = 6;
export var expected_pmevent_ActiveSubscriptions_Count = 2;
export var expected_4GPMEvent_ActiveSubscription_Count=1;

// Ran-Parser microservice output topic name registration in data-catalog - Variables
export var datacatalog_V2_Endpoint = "http://eric-oss-data-catalog:9590/catalog/v2/";
export var expectedOutputTopics = ["eric-oss-3gpp-pm-xml-ran-parser-nr", "eric-oss-3gpp-pm-xml-ran-parser-lte", "eric-oss-3gpp-pm-xml-ran-parser-logbook", "eric-oss-3gpp-pm-xml-core-parser-"];


// Dynamic Configurator output topic name registration in data-catalog - Variables
export var ranParser_Configurator_ExpectedTopic_Name = "3gpp-PM-XML-Parser-Update-Notification-Topic";


// <------------------------------------FNS-DC-C Varibles   - Start ------------------------------------------>


export const DataSPaceVal = ["5G", "4G5G", "PCC-PCG"];
export const data_service_name = ["eric-oss-enm-fns--PCC-PCG--PM_COUNTERS--enm1", "eric-oss-enm-fns--4G5G--PM_COUNTERS--enm1", "eric-oss-enm-fns--4G5G--PM_COUNTERS--enm2", "eric-oss-enm-fns--PCC-PCG--PM_COUNTERS--enm2", "eric-oss-enm-fns--5G--PM_EVENTS--enm1", "eric-oss-enm-fns--5G--PM_EVENTS--enm2"]

//data category
export var FNS_DC_C_datacategory_PM_EVENT="PM_EVENTS";
export var FNS_DC_C_datacategory_PM_COUNTER="PM_COUNTERS";

//Data Provider Type
export var FNS_DC_C_dataprovider_enm1 ="enm1";
export var FNS_DC_C_dataprovider_enm2 ="enm2";

//Message DataTopic

export var FNS_DC_C_messageDataTopic_fns_5g_event="file-notification-service--5g-event--enm1";
export var FNS_DC_C_messageDataTopic_fns_5g_event_messageBusid=1;

export var FNS_DC_C_messageDataTopic_fns_pcc_pcg_enm1="file-notification-service--pcc_pcg--enm1";
export var FNS_DC_C_messageDataTopic_fns_pcc_pcg_enm2="file-notification-service--pcc_pcg--enm2";
export var FNS_DC_C_messageDataTopic_fns_pcc_pcg_messageBusid=1;

export var FNS_DC_C_messageDataTopic_fns_sftp_ft_enm1="file-notification-service--sftp-filetrans--enm1";
export var FNS_DC_C_messageDataTopic_fns_sftp_ft_enm2="file-notification-service--sftp-filetrans--enm2";
export var FNS_DC_C_messageDataTopic_fns_sftp_ft_messageBusid=1;

//Data Type
export var FNS_DC_C_DataType_mediumtype ="stream";
export var FNS_DC_C_DataType_schemaName ="FLS";
export var FNS_DC_C_DataType_schemaVersion ="1";
export var FNS_DC_C_DataType_External =false;

//Specification Reference for Data Space 5G
export var FNS_DC_C_specificationReference_fns_5g_event="eric-oss-enm-fns--5G--PM_EVENTS--enm1";

//Specification Reference for Data Space PCC-PCG
export var FNS_DC_C_specificationReference_fns_pcc_pcg_enm1="eric-oss-enm-fns--PCC-PCG--PM_COUNTERS--enm1";
export var FNS_DC_C_specificationReference_fns_pcc_pcg_enm2="eric-oss-enm-fns--PCC-PCG--PM_COUNTERS--enm2";

//Specification Reference for Data Space 4G5G
export var FNS_DC_C_specificationReference_fns_4G5G_enm1="eric-oss-enm-fns--4G5G--PM_COUNTERS--enm1";
export var FNS_DC_C_specificationReference_fns_4G5G_enm2="eric-oss-enm-fns--4G5G--PM_COUNTERS--enm2"








// <------------------------------------FNS-DC-C Varibles   -  END ------------------------------------------>


//SFTP DC-C Registration

export var SFTP_DCC_Registration="http://eric-oss-data-catalog:9590/catalog/v2/";
export var SFTP_DCC_Registration_Expected_Status=200;
export var SFTP_DCC_Registration_Expected_Schema="ran";
export var SFTP_DCC_Registration_data_ENM1 = ["ran-pm-counter-sftp-file-transfer", "ran-pm-counter-sftp-file-transfer--enm1", "4G5G", "PM_COUNTERS", "enm1", "1", "FLS"];
export var SFTP_DCC_Registration_data_ENM2 = ["ran-pm-counter-sftp-file-transfer", "ran-pm-counter-sftp-file-transfer--enm2", "4G5G", "PM_COUNTERS", "enm2", "1", "FLS"];
export var SFTP_DCC_Registration_NumberofRanPODS=2;
export var SFTP_DCC_Registration_ParameterName = "nodeName";
export var SFTP_DCC_Registration_isPassedToConsumedService = true;
export var SFTP_DCC_Registration_dataServiceName_fielFileFormatList = "ran-pm-counter-sftp-file-transfer";
export var SFTP_DCC_Registration_specificationReference_fileFormat = "";
export var SFTP_DCC_Registration_dataEncoding_fileFormat = "XML";
export var SFTP_DCC_Registration_name_BulkRepository = "eric-data-object-storage-mn";
export var SFTP_DCC_Registration_clustername_BulkRepository = "hall941";
export var SFTP_DCC_Registration_nameSpace_BulkRepository = "adc-deploy";
export var SFTP_DCC_Registration_accessEndpoints_BulkRepository = "http://eric-data-object-storage-mn:9000";
export var SFTP_DCC_Registration_name_MessageBus = "eric-oss-dmm-kf-op-sz-kafka-bootstrap";
export var SFTP_DCC_Registration_clustername_MessageBus = "hall941";
export var SFTP_DCC_Registration_nameSpace_MessageBus = "adc-deploy";
export var SFTP_DCC_Registration_accessEndpoints_MessageBus = "eric-oss-dmm-kf-op-sz-kafka-bootstrap:9093";
export var SFTP_DCC_Registration_specificationReference = "";
export var SFTP_DCC_Registration_encoding = "JSON";
export var SFTP_DCC_Registration_dataprovidterTypeName = "enmFileNotificationService";
export var SFTP_DCC_Registration_dataCategory_dataProvider = "PM_COUNTERS";
export var SFTP_DCC_Registration_dataspace_dataProvider = "4G5G";
export var SFTP_DCC_Registration_DataType_mediumtype = "file";
export var SFTP_DCC_Registration_DataType_schemaVersion = "1";
export var SFTP_DCC_Registration_DataType_isExternal = false;
export var SFTP_DCC_core_Registration_Expected_Schema="core";
export var SFTP_Core_DCC_Registration_data_ENM1 = ["core-pm-counter-sftp-file-transfer", "core-pm-counter-sftp-file-transfer--enm1", "PCC-PCG", "PM_COUNTERS", "enm1", "1", "FLS"];
export var SFTP_Core_DCC_Registration_dataServiceName_fielFileFormatList = "core-pm-counter-sftp-file-transfer";


// <------------------------------------5G PMEVENT DC-C Registration - Start ------------------------------------------>

export var PMEVENT_Registration_Expected_Status=200;
export var PMEVENT_DCC_Registration_Expected_Schema="PmEventOuterClass.PmEvent";
export var PMEVENT_DCC_Registration_Expected_PropretiarySchema="PmEventOuterClass.EricssonPmEvent";

// messageDataTopic
export var PMEVENT_DCC_messageDataTopic_messageDataTopicName="5g-pm-event-file-transfer-and-processing--standardized";
export var PMEVENT_DCC_messageDataTopic_messageDataPropretiaryTopicName="5g-pm-event-file-transfer-and-processing--ericsson";
export var PMEVENT_DCC_messageDataTopic_messageDataTopicEncoding="PROTOBUF";
export var PMEVENT_DCC_messageDataTopic_MessageBusName="eric-oss-dmm-kf-op-sz-kafka-bootstrap";

//dataProviderType
export var PMEVENT_DCC_dataProviderType_dataSpaceName="5G";
export var PMEVENT_DCC_dataProviderType_dataCategoryName="PM_EVENTS";
export var PMEVENT_DCC_dataProviderType_dataProviderName="RAN";

//messageStatusTopic
export var PMEVENT_DCC_messageStatusTopicName="5g-pm-event-file-transfer-and-processing--standardized";
export var PMEVENT_DCC_messageStatusPropretiaryTopicName="5g-pm-event-file-transfer-and-processing--ericsson";
export var PMEVENT_DCC_messageStatusTopicEncoding="PROTOBUF";
export var PMEVENT_DCC_messageStatusTopic_messageBusName="eric-oss-dmm-kf-op-sz-kafka-bootstrap";

// dataService
export var PMEVENT_DCC_dataService_dataServiceInstanceName="eric-oss-5gpmevt-filetx-proc--enm1";
export var PMEVENT_DCC_dataService_consumedDataSpace="5G";
export var PMEVENT_DCC_dataService_consumedDataCategory="PM_EVENTS";
export var PMEVENT_DCC_dataService_consumedSchemaVersion="1";
export var PMEVENT_DCC_dataService_consumedSchemaName="FLS";
export var PMEVENT_DCC_dataService_predicateParameterName_eventId="eventId";
export var PMEVENT_DCC_dataService_predicateParameterName_nodeName="nodeName";
export var PMEVENT_DCC_dataService_isPassedToConsumedService_False=false;
export var PMEVENT_DCC_dataService_isPassedToConsumedService_True=true;
export var PMEVENT_DCC_dataService_dataServiceName="eric-oss-5gpmevt-filetx-proc";
export var PMEVENT_DCC_dataService_consumedDataProvider="enm1";

//DataType
export var PMEVENT_DCC_dataType_schema="PmEventOuterClass.PmEvent";
export var PMEVENT_DCC_dataType_isExternal=true;
export var PMEVENT_DCC_dataType_Propertiaryschema="PmEventOuterClass.EricssonPmEvent";

// specificationReference
export var PMEVENT_DCC_specificationReference="pm_event.PmEvent";
export var PMEVENT_DCC_specificationReference_propretiary="pm_event.EricssonPmEvent";

// <------------------------------------5G - PMEVENT DC-C Registration - END ------------------------------------------>

// <-----------------------------------4G-PMEVENT DC-C Registration - Start ------------------------------------------>

export var PMEVENT_4G_Registration_Expected_Status=200;
export var PMEVENT_4G_DCC_Registration_Expected_Schema="4g-pm-event_schema";
export var PMEVENT_4G_DCC_Registration_Expected_PropretiarySchema="4g-pm-event_proprietary_schema";

//DataSpace 
export var PMEVENT_4G_DCC_dataSpace_dataSpaceName="4G";

// dataService
export var PMEVENT_4G_DCC_dataService_dataServiceName="eric-oss-4g-pm-event-parser";

// dataCategory
export var PMEVENT_4G_DCC_dataCategory_dataCategoryName="PM_EVENTS";

//dataProviderType
export var PMEVENT_4G_DCC_dataProviderType_providerVersion="1";
export var PMEVENT_4G_DCC_dataProviderType_providerTypeId="RAN";
// messageDataTopic
export var PMEVENT_4G_DCC_messageDataTopic_messageDataTopicName="ctr-processed";
export var PMEVENT_4G_DCC_messageDataTopic_messageDataPropretiaryTopicName="ctr-processed-proprietary";
export var PMEVENT_4G_DCC_messageDataTopic_messageBusId=1;
export var PMEVENT_4G_DCC_messageDataTopic_Encoding="AVRO";

// dataServiceInstance
export var PMEVENT_4G_DCC_dataServiceInstance_dataServiceInstanceName="eric-oss-4g-pm-event-parser";
export var PMEVENT_4G_DCC_dataServiceInstance_controlEndPoint="";
export var PMEVENT_4G_DCC_dataServiceInstance_consumedDataSpace="4G";
export var PMEVENT_4G_DCC_dataServiceInstance_consumedDataCategory="PM_EVENTS";
export var PMEVENT_4G_DCC_dataServiceInstance_consumedDataProvider="RAN";
export var PMEVENT_4G_DCC_dataServiceInstance_consumedSchemaName="4g-pm-event_raw_schema";
export var PMEVENT_4G_DCC_dataServiceInstance_consumedSchemaVersion="1";

//DataType
export var PMEVENT_4G_DCC_dataType_mediumType="stream";
export var PMEVENT_4G_DCC_dataType_schemaName="4g-pm-event_schema";
export var PMEVENT_4G_DCC_dataType_PropertiaryschemaName="4g-pm-event_proprietary_schema";
export var PMEVENT_4G_DCC_dataType_schemaVersion="1"
export var PMEVENT_4G_DCC_dataType_isExternal=true;

// specificationReference
export var PMEVENT_4G_DCC_specificationReference_parameterName="nodeName";
export var PMEVENT_4G_DCC_specificationReference_parameterName_eventID="eventId";
export var PMEVENT_4G_DCC_specificationReference_isPassedToConsumedService_nodeName=true;
export var PMEVENT_4G_DCC_specificationReference_isPassedToConsumedService_eventID=false;
//Messageschema
export var PMEVENT_4G_DCC_specificationReference="eric-oss-4g-pm-event-parser-4G-PM_EVENTS--RAN";
export var PMEVENT_4G_DCC_specificationReference_proprietary="eric-oss-4g-pm-event-parser-4G-PM_PROPRIETARY_EVENTS--RAN";

// <------------------------------------PMEVENT_4G DC-C Registration - END ------------------------------------------>
export var Alarm_Handler_4G_Success = 3;

