## Use Case: 5G PMEVENT file collection from RestSim 


|  Prerequisites        | 	ENM producing 5G events files  per 15 mins                                   |
|-----------------------|--------------------------------------------------------------------------------|
| Total Number of files |   30000 [10,000 nodes * 3 File(Per Node)= 30,000 thousand file (DU/CUCP/CUUP)] |


|        Usecase flow                    |               Test Assertions                |
|----------------------------------------|----------------------------------------------|
|Create Subscription   | <li>Verify expected topics are present in Kafka and Data Catalog</li><li> Verify Subscription created based on the IDS specificed.</li> |
| FNS query the PM event files from RestSim and sent notification to 5gpmevent | **File Notification Service(FNS) Test Assertions**<ul><li> Verify FNS query RestSim and send notification to 5gpmevent Input topic.</li></ul> |
|5gpmevent should receive those files and process them and send notification to kafka. |**5gpmevent Test Assertions**<ul><li>Verify 5gpmevent successful transfer files getting from ENM </li><li>Verify both Standard and Non-standard topics published the expected notifications to kafka</li><li>Verify total number of errors encountered by a Kafka producer should be zero</li><li>Verify Failed processed files should be zero</li><li>Total timetaken END-to-END should be less than 9 mins.</li></ul> |
| Output Kafka topic-Content Validation  |**Kafka Validation through kafka wrapper**<ul><li>Validate Output topic header contains the expected field based on SDK.</li><li>Verify Consumer can consume message and able to deseriliaze the messages based on the eventID.</li></ul>|
