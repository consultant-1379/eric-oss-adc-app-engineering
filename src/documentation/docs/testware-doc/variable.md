## Required  Env Variables
To run this testware the following environment variables are required

| Variable Name   | Path on Values.yaml   |  Description            | Sample Value      |
|-----------------|-----------------------|-------------------------|---------------|
| hostname        |  env.hostname         | ADC hostname for the VES collector ingress  | https://adc.hart102-sm1.ews.gic.ericsson.se/ | 
| OPTIONS_FILE    |  env.OPTIONS_FILE     | Option file for the testsuite         | default.options.json  |
| sftp_podname    |  env.sftp_podname     | Get name of sftp-ft pod to fetch load testing metrics |eric-oss-sftp-filetrans|             
| pmStatsfilecount|  env.pmStatsfilecount |  Get number of files to run against load test|10500                  |        