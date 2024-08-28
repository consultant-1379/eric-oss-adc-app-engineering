#!/bin/bash
KUBECONFIG=$1
NAMESPACE=$2
REPORT_PATH=$3
retries="10";
while [ $retries -ge 0 ]
do
  if [[ "$retries" -eq "0" ]]
    then
        echo no report file available
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs adc-k6-testsuite > ${REPORT_PATH}/k6-testsuite.log
        cat  ${REPORT_PATH}/k6-testsuite.log

        ERIC_OSS_SFTP_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-sftp-filetrans|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_SFTP_POD} > ${REPORT_PATH}/eric-oss-sftp-filetrans.log
        ERIC_OSS_fig_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-5gpmevt-filetx-proc|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_fig_POD} > ${REPORT_PATH}/eric-oss-5gpmevt.log
        ERIC_OSS_stub_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-file-notification-enm-stub|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_stub_POD} > ${REPORT_PATH}/enm-stub.log
        ERIC_OSS_fns_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-enm-fns|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_fns_POD} > ${REPORT_PATH}/eric-oss-enm-fns.log

        ERIC_OSS_3gpp_ranParser_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-3gpp-pm-xml-ran-parser|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_3gpp_ranParser_POD} > ${REPORT_PATH}/eric-oss-3gpp-pm-xml-ran-parser.log
        
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-sftp-filetrans-ran-2  --all-containers=true  > ${REPORT_PATH}/eric-oss-sftp-filetrans-ran-2.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-sftp-filetrans  --all-containers=true  > ${REPORT_PATH}/eric-oss-sftp-filetrans-ran-1.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-file-notification-enm-stub  --all-containers=true  > ${REPORT_PATH}/eric-oss-file-notification-enm-stub-1.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-file-notification-enm-stub-2 --all-containers=true  > ${REPORT_PATH}/eric-oss-file-notification-enm-stub-2.log

        kubectl --namespace ${NAMESPACE} delete pod adc-k6-testsuite
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-sftp-server-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-data-catalog-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-fns-stub-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-subsys-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-data-collection-controller-policy

        exit 1
    elif ! kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} cp adc-k6-testsuite:/reports/summary.json ${REPORT_PATH}/summary.json ;
    then
        let "retries-=1"
        echo report not available, Retries left = $retries :: Sleeping for 10 seconds
        sleep 10
    else
        echo report copied
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} cp adc-k6-testsuite:/reports/result.html ${REPORT_PATH}/result.html;
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs adc-k6-testsuite > ${REPORT_PATH}/k6-testsuite.log
        cat  ${REPORT_PATH}/k6-testsuite.log

        ERIC_OSS_SFTP_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-sftp-filetrans|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_SFTP_POD} > ${REPORT_PATH}/eric-oss-sftp-filetrans.log
        ERIC_OSS_fig_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-5gpmevt-filetx-proc|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_fig_POD} > ${REPORT_PATH}/eric-oss-5gpmevt.log
        ERIC_OSS_stub_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-file-notification-enm-stub|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_stub_POD} > ${REPORT_PATH}/enm-stub.log
        ERIC_OSS_fns_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-enm-fns|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_fns_POD} > ${REPORT_PATH}/eric-oss-enm-fns.log

        ERIC_OSS_3gpp_ranParser_POD=$(kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} get pods |grep eric-oss-3gpp-pm-xml-ran-parser|grep Running|awk '{print $1}')
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${ERIC_OSS_3gpp_ranParser_POD} > ${REPORT_PATH}/eric-oss-3gpp-pm-xml-ran-parser.log
        
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-sftp-filetrans-ran-2  --all-containers=true  > ${REPORT_PATH}/eric-oss-sftp-filetrans-ran-2.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-sftp-filetrans  --all-containers=true  > ${REPORT_PATH}/eric-oss-sftp-filetrans-ran-1.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-file-notification-enm-stub  --all-containers=true  > ${REPORT_PATH}/eric-oss-file-notification-enm-stub-1.log
        kubectl --namespace  ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs deployment/eric-oss-file-notification-enm-stub-2 --all-containers=true  > ${REPORT_PATH}/eric-oss-file-notification-enm-stub-2.log


        kubectl --namespace ${NAMESPACE} delete pod adc-k6-testsuite
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-sftp-server-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-data-catalog-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-fns-stub-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-subsys-policy
        kubectl --namespace ${NAMESPACE} delete networkpolicy/eric-adc-k6-data-collection-controller-policy

        checksFailedCount=$(jq -r '.metrics.checks.fails' ${REPORT_PATH}/summary.json)
        #[[ $failsCount -eq 0 && $checksFailedCount -eq 0 ]] && echo "all requests are successful in the report" && exit 0
        [[ $checksFailedCount -eq 0 ]] && echo "all requests are successful in the report" && exit 0
        echo "Failures detected in the report"
        exit 1
        break
    fi
done
