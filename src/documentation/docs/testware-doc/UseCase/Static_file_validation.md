## Use Case: Static file Validation


|        Usecase flow                    |               Test Assertions                |
|----------------------------------------|----------------------------------------------|
| **Validate Ran-parser Output kafka content** | <ul><li> Verify static file uploaded into BDR </li><li> Produce Kafka message contains the information of BDR location to Ran-parser input topic </li><li> Verify isValuePresent field should be false if countertype is null and true if countertype contains the counters </li></ul> |