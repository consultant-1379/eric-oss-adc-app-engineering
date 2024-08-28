## Use Case: pmstats file collection from ENM and parsing by Ran-Parser

|  Prerequisites        | 	ENM producing files for SFTP-file trans per 15 mins  |
|-----------------------|--------------------------------------------------------|
| Total Number of files |   23240                                                |

|     File-type       |       Number of Files    |    File Size              |
|---------------------|--------------------------|---------------------------|
|    NR               |      11280               |    ~44kb  compressed      |   
|    LTE              |      8720                |    ~180kb compressed      |
|    Shared-CNF CUCP  |      1080                |     ~7.5K                 |
|    Shared-CNF CUUP  |      1080                |     ~1.1K                 |
|    Shared-CNF DU    |      1080                |     ~1.7K                 |                       

|        Usecase flow                    |               Test Assertions                |
|----------------------------------------|----------------------------------------------|
|Create Subscription   | <li>Verify expected topics are present in Kafka and Data Catalog</li><li> Verify Subscription created based on the IDS specificed.</li> |
| FNS query the PM stats files from RestSim and sent notification to pmcounter | **File Notification Service(FNS) Test Assertions**<ul><li> Verify FNS query RestSim and send notification to sftp-ft Input topic.</li></ul> |
|SFTP-FT(PM counter) should download those files based on the notifications and store it into BDR without any leakage of files. |**SFTP-FT(pmcounter) App Staging Assertions**<ul><li>Verify Input topic able to receive notification from FNS</li><li>Verify pmstats Files Downloaded successfully</li><li>Verify pmstats files Uploaded to BDR-minio</li><li>Verify expected notification send through Output Topic</li><li>Verify input topic,output topic ,bdr upload count should be same</li><li>Verify Failed Output topic should be zero</li><li>Verify Failed BDR upload and SFTP Download should be zero</li><li>Verify Counterfile datavolume and BDR datavolume should be same</li></ul> |
| Ran Parser received message from SFTP-FT and download the files from BDR and parse those file and send notifications to Kafka. |**Ran-Parser Test Assertions**<ul><li>Verify Input topic able to receive notification from SFTP-FT Output topic</li><li>Verifying Parser downloaded available files from BDR</li><li>Verifying Avro Schemas available notification count and Downloaded Avro Schemas count by ran parser are equal</li><li>Verifying Parser should parse the files</li><li>Verify expected number of messages are published to output topic</li><li>Total timetaken END-to-END should be less than 9 mins. |
| Output Kafka topic-Content Validation  |**Kafka Validation through kafka wrapper**<ul><li>Validate Output topic header contains the expected field based on SDK.</li><li>Verify Consumer can consume message and able to deseriliaze the messages based on the schemaID.</li></ul>|

