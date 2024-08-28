#!/usr/bin/env groovy
package pipeline
def bob = "bob/bob -r \${WORKSPACE}/ci/ruleset2.0.yaml"
def filesChangedInCommit(path) {
    return sh(returnStdout: true, script: "git diff-tree --diff-filter=ACM --no-commit-id --name-only -r $GIT_COMMIT -- $path").trim()
}

pipeline {
    agent {
        label "common_agents"
    }
     parameters {
        string(name: 'KUBECONFIG_FILE',
                description: 'Kubernetes configuration file to specify which environment to install on' )
        string(name: 'NAMESPACE',
                description: 'Namespace to install the EO Chart' )
        string(name: 'ADC_HOSTNAME',
                description: 'ADC_HOSTNAME_URL used for VES collector tesing' )
        string(name: 'GAS_HOSTNAME',
                description: 'Gas url for PM server tesing' )
        string(
            name: 'FUNCTIONAL_USER_CREDENTIALS',
            defaultValue: 'ossapps100-user-credentials',
            description: 'Jenkins Credentials ID for ARM Registry access' )
     }
    options { timestamps () }
    stages {
        stage('Prepare') {
            steps {
                cleanWs()
                //sh 'git clean -xdff'
                sh 'git init'
                //sh 'ls -la'
                sh 'git clone ssh://gerrit.ericsson.se:29418/adp-cicd/bob/'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
                sh "${bob} --help"
            }
        }
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [[$class: 'CleanBeforeCheckout']], userRemoteConfigs: [[credentialsId: 'eoadm100-user-creds', url: 'https://gerrit.ericsson.se/OSS/com.ericsson.oss.appEngineering/eric-oss-adc-app-engineering']]])
                sh "chmod +x -R ${env.WORKSPACE}"
            }
        }
        stage('Create Job') {
            steps {
                script {
                sh "${bob} create-job"
                    }
                }
        }
        stage('Deploy Testware') {
                    steps {
                        script {
                            withCredentials([
                                usernamePassword(credentialsId: params.FUNCTIONAL_USER_CREDENTIALS, usernameVariable: 'FUNCTIONAL_USER_USERNAME', passwordVariable: 'FUNCTIONAL_USER_PASSWORD'),
                                file(credentialsId: env.KUBECONFIG_FILE, variable: 'KUBECONFIG')
                                ]) {
                                sh "install -m 600 ${KUBECONFIG} ./admin.conf"
                                sh "${bob} deploy-testware"
                            }
                        }
                    }
        }
        stage('wait testware') {
                    steps {
                        script {
                            withCredentials( [file(credentialsId: env.KUBECONFIG_FILE, variable: 'KUBECONFIG')]) {
                                sh "install -m 600 ${KUBECONFIG} ./admin.conf"
                                sh "${bob} wait-testware"
                                  
                            }
                        }
                    }
                    post {
                        always {
                             withCredentials( [file(credentialsId: env.KUBECONFIG_FILE, variable: 'KUBECONFIG')]) {
                                  sh "install -m 600 ${KUBECONFIG} ./admin.conf"
                                  sh "${bob} collect-log"
                                  sh "./ci/scripts/ADP_logs.sh ${env.NAMESPACE}"
                                  sh "${bob} uninstall-testware"
                             }

                                 
                        }
                    }
        }
        stage('check status') {
                    steps {
                        getBuildStatus()
                    }
        }

    }
      post {
        always {
            archiveArtifacts 'summary.json*'
            archiveArtifacts 'execution-status.properties'
            archiveArtifacts '*.log'
            archiveArtifacts artifacts: 'logs_*.tgz, logs/*, *.tgz,*.gz', allowEmptyArchive: true
            cleanWs()
        }
    }
}

def getBuildStatus() {
    if ( !fileExists('execution-status.properties') ) {
        error("execution-status.properties file not found")
    }
    def props = readProperties  file: 'execution-status.properties'
    currentBuild.description = "<a href=\""+ props["reportLink"] +"\">Testware Report</a>"
    if (props['passed'] == 'False') {
        error 'Testware Failed: ' + props['failureReason']
    }
}
def addTestsSummary() {
    def summary = manager.createSummary("warning.gif");
    summary.appendText("<h2>Tests Status</h2>", false);
    jsonOutput = readJSON file: 'execution-status.json'
    echo "Status Response:\n$jsonOutput"
    if (jsonOutput) {
        if (jsonOutput.executions.size() > 0) {
            jsonOutput.executions.each{ e ->
                failureOrSuccess = e.status.trim().equals('SUCCESSFUL') ? '<span style="color:green">' : '<span style="color:red">'
                summary.appendText("<span style=\"color:blue\"><b>${e.testware.replace('main_', '').replace('_', ' ').toUpperCase()}</b></span><br>"
                    + "&emsp;> Status: ${failureOrSuccess}$e.status</span>"
                    + "&emsp;<a href=\"http://seliius22639.seli.gic.ericsson.se/dev/staging-reports/#execution-reports/execution-details?executionId=$e.id\">Live Report Link</a><br>")

                echo "Report link: http://seliius22639.seli.gic.ericsson.se/dev/staging-reports/#execution-reports/execution-details?executionId=$e.id"
            }
        } else {
            message = 'There are no registered executions with the job'
            echsummary.appendText("<h3>$message</h3>")
            echo message
        }
    } else {
        message = 'Status file not found'
        summary.appendText("<h3>$message</h3>", false);
        echo message
    }
}
