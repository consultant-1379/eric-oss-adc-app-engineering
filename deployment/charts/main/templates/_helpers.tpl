{{/*
Expand the name of the chart.
*/}}
{{- define "eric-oss-adc-app-engineering.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-oss-adc-app-engineering.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-oss-adc-app-engineering.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "eric-oss-adc-app-engineering.labels" -}}
helm.sh/chart: {{ include "eric-oss-adc-app-engineering.chart" . }}
{{ include "eric-oss-adc-app-engineering.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "eric-oss-adc-app-engineering.selectorLabels" -}}
app.kubernetes.io/name: {{ include "eric-oss-adc-app-engineering.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Create the name of the service account to use
*/}}
{{- define "eric-oss-adc-app-engineering.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "eric-oss-adc-app-engineering.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
User Defined Labels (DR-D1121-068)
*/}}
{{ define "eric-oss-adc-app-engineering.config-labels" }}
{{- if .Values.labels -}}
{{- range $name, $config := .Values.labels }}
{{ $name }}: {{ tpl $config $ }}
{{- end }}
{{- end }}
{{- end }}



{{/*
Create Ericsson product app.kubernetes.io info
*/}}
{{- define "eric-oss-adc-app-engineering.kubernetes-io-info" -}}
app.kubernetes.io/name: {{ .Chart.Name | quote }}
app.kubernetes.io/version: {{ .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" | quote }}
app.kubernetes.io/instance: {{ .Release.Name | quote }}
{{- end -}}


{{/*
Create annotation for the product information (DR-D1121-064, DR-D1121-067)
*/}}
{{- define "eric-oss-adc-app-engineering.product-info" }}
ericsson.com/product-name: "eric-oss-adc-app-engineering"
ericsson.com/product-number: "CXC 111 0088"
ericsson.com/product-revision: {{ regexReplaceAll "(.*)[+|-].*" .Chart.Version "${1}" | quote }}
{{- end }}

{{/*
Get to Display TLS enabled or disabled using configmap
*/}}
{{- define "tls-enabled" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "testware-global-config").data }}
  {{- $TlsConfiguration := (get $configMapObj "tls-enabled")  }}
  {{- $TlsConfiguration  }}
{{- end }}

{{/*
This helper defines which out-mesh services will be reached by adc testware.
*/}}
{{- define "eric-oss-adc.service-mesh-ism2osm-labels" }}
{{- if eq (include "tls-enabled" .) "True" }}
eric-pm-server-ism-access: "true"
{{- end -}}
{{- end -}}

{{/*
This helper defines the annotation for defining service mesh volume. Here, the ADC testware certificates are mounted inside istio proxy container 
*/}}
{{- define "eric-oss-adc.service-mesh-volume" }}
{{- if eq (include "tls-enabled" .) "True" }}
sidecar.istio.io/userVolume: '{"eric-oss-adc-app-engineering-pm-server-certs-tls":{"secret":{"secretName":"eric-oss-adc-app-engineering-pm-server-secret","optional":true}},"eric-oss-adc-app-engineering-certs-ca-tls":{"secret":{"secretName":"eric-sec-sip-tls-trusted-root-cert"}}}'
sidecar.istio.io/userVolumeMount: '{"eric-oss-adc-app-engineering-pm-server-certs-tls":{"mountPath":"/etc/istio/tls/eric-pm-server/","readOnly":true},"eric-oss-adc-app-engineering-certs-ca-tls":{"mountPath":"/etc/istio/tls-ca","readOnly":true}}'
{{ end }}
{{- end -}}


{{/*
Get to create metrics url using configmap
*/}}
{{- define "get-metrics-url" -}}
  {{- if eq (include "tls-enabled" .) "True" }}
  http://eric-pm-server:9089
  {{- else -}}
  http://eric-pm-server:9090
  {{- end }}
{{- end }}

{{/*
Used to create adc testware inside service mesh
*/}}
{{- define "eric-oss-adc.service-mesh-inject" }}
{{- if eq (include "tls-enabled" .) "True" }}
sidecar.istio.io/inject: "true"
{{- else -}}
sidecar.istio.io/inject: "false"
{{- end -}}
{{- end -}}

{{/*
Used to create adc prehook inside service mesh
*/}}
{{- define "eric-oss-adc-app-engineering.service-mesh-inject" }}
sidecar.istio.io/inject: "true"
{{- end -}}

{{- define "eric-oss-adc-app-engineering.service-mesh-proxy-config" }}
{{- if eq (include "tls-enabled" .) "True" }}
proxy.istio.io/config: |
  holdApplicationUntilProxyStarts: true
{{- end -}}
{{- end -}}

{{- define "get-application-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications").data }}
  {{- $configData := (get $configMapObj "Installed") | fromYaml }}
  {{- range $configData.csar }}
    {{- if eq .name "eric-oss-adc" }}
        {{ .version }}
    {{ end}}
  {{- end}}
{{- end}}

{{- define "get-product-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications").data }}
  {{- $configData := (get $configMapObj "Installed") | fromYaml }}
  {{- $configHelm := $configData.helmfile }}
  {{ $configHelm.release }}
{{- end}}

{{- define "eric-oss-adc-app-engineering.service-mesh-sidecar-quit" }}
{{- if .Values.env.TLS }}
curl -X POST http://127.0.0.1:15020/quitquitquit
{{- end -}}
{{- end -}}




