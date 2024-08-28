## Use Case: PCC_PCG file collection from RestSim and parsing  by Core-Parser

|  Prerequisites        | 	ENM producing 5G events files  per 15 mins                                             |
|-----------------------|------------------------------------------------------------------------------------------|
| Total Number of files |   100 [50 PCC[934 Bytes per file compressed] + 50 PCC[706 Bytes per file compressed]]    |


|        Usecase flow                    |               Test Assertions                |
|----------------------------------------|----------------------------------------------|
|Create Subscription   | <li>Verify expected topics are present in Kafka and Data Catalog</li><li> Verify Subscription created based on the IDS specificed.</li> |
| FNS query the PCC_PCG files from RestSim and sent notification to pmcounter | **File Notification Service(FNS) Test Assertions**<ul><li> Verify FNS query RestSim and send notification to sftp-ft Input topic.</li></ul> |
|SFTP-FT(Core) should receive those files and store it into BDR without any leakage of files. |**SFTP-FT(pmcounter) App Staging Assertions**<ul><li>Verify Input topic able to receive notification from FNS</li><li>Verify expected notification send through Output Topic</li><li>Verify pmstats Files Downloaded successfully</li><li>Verify pmstats files Uploaded to BDR-minio</li><li>Verify input topic,output topic ,bdr upload count should be same</li><li>Verify Failed Output topic should be zero</li><li>Verify Failed BDR upload and SFTP Download should be zero</li><li>Verify Counterfile datavolume and BDR datavolume should be same</li></ul> |
| Core Parser received message from SFTP-FT and download the files from BDR and parse those file and send notifications to Kafka. |**Core-Parser Test Assertions**<ul><li>Verify Input topic able to receive notification from SFTP-FT Output topic</li><li>Verifying Parser downloaded available files from BDR</li><li>Verifying Parser should parse the files</li><li>Verify messages are published to output topic</li><li>Total timetaken END-to-END should be less than 9 mins |

