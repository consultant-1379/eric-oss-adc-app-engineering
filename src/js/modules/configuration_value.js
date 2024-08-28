export function configuration(){
    const testWareProperties = {
        gasUrl: `${__ENV.GAS_hostname}`,
        metrics_url : `${__ENV.metrics_url}`,
        RESTSim_URL : `${__ENV.RESTSim_URL}`,
        optionsfile : `${__ENV.OPTIONS_FILE}`,
        sftp_job : `${__ENV.sftp_podname}`,
        fns_job : `${__ENV.fns_job}`,
        Ran_parser_job : `${__ENV.Ran_parser_job}`,
        pmStatsfilecount : `${__ENV.pmStatsfilecount}`,
        TARGET_CLUSTER : `${__ENV.TARGET_CLUSTER}`,
        TLS_ENABLED : `${__ENV.TLS}`,
        TARGET_NAMESPACE : `${__ENV.TARGET_NAMESPACE}`,

      };
      console.log('========== Testware Properties ==========');
        for (const key in testWareProperties) {
          console.log(`${key}: ${testWareProperties[key]}`);
        }
        console.log('=======================================');
}
