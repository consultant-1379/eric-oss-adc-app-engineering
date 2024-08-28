## Use Case: 4G pmevent File collection from ENM and parsing by 4gpmevent-Parser

|  Prerequisites        | 	ENM producing 4G pmevents files  per 15 mins                                             |
|-----------------------|------------------------------------------------------------------------------------------|
| Total Number of files |   500 [500 nodes * 1 File(Per Node) = 500 file (4G PM Event File)(CTR)]                  |


|        Usecase flow                    |               Test Assertions                |
|----------------------------------------|----------------------------------------------|
|Create Subscription   | <li>Verify expected topics are present in Kafka and Data Catalog</li><li> Verify Subscription created based on the IDS specificed.</li> |
| FNS query the 4GPM event files from RestSim and sent notification to 4Gpmevent filetrans | **File Notification Service(FNS) Test Assertions**<ul><li> Verify FNS query RestSim and send notification to 4Gpmevent filetrans Input topic.</li></ul> |
|4Gpmevent should receive those files and process them and send notification to kafka.|**4Gpmevent Test Assertions**<ul><li>Verify 4Gpmevent successful transfer files getting from ENM </li><li>Verify Failed processed files should be zero</li></ul> |
|4G PM Event Parser received message from 4gpmevent filetrans parse those file and send notifications to Kafka.|**4Gpmevent-parser Test Assertions**<ul><li> Verify the CSM Event[csm_received_event_count]should match with 4G filetrans output kafka messages.</li><li>Verify 4G pmevent parser should process expected Standard Events and publish expected notification to kafka.</li><li>Verify 4G pmevent should process expected proprietary Events and publish expected notification to kafka.</li><li>Validate that 4G PM Event Parser is not dropping any events</li><li>Total timetaken END-to-END should be less than 9 mins.</li></ul>|
| Output Kafka topic-Content Validation  |**Kafka Validation through kafka wrapper**<ul><li>Validate Output topic header contains the expected field based on SDK.</li><li>Verify Consumer can consume message and able to deseriliaze the messages based on the eventID.</li></ul>|
