{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-oss-fls-notifier.fullname" -}}
{{- $name := default .Chart.Name .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- printf "%s" $name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-oss-fls-notifier.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "eric-oss-fls-notifier.labels" -}}
helm.sh/chart: {{ include "eric-oss-fls-notifier.chart" . }}
{{ include "eric-oss-fls-notifier.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "eric-oss-fls-notifier.selectorLabels" -}}
app: {{ include "eric-oss-fls-notifier.fullname" . }}
app.kubernetes.io/name: {{ include "eric-oss-fls-notifier.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels for postgress-db
*/}}
{{- define "eric-oss-fls-notifier-postgress-db.labels" -}}
{{ include "eric-oss-fls-notifier-postgress-db.selectorLabels" . }}
app.kubernetes.io/name: {{ include "eric-oss-fls-notifier.fullname" . }}-postgress-db 
{{- end }}

{{/*
Selector labels for postgress-db
*/}}
{{- define "eric-oss-fls-notifier-postgress-db.selectorLabels" -}}
app: {{ include "eric-oss-fls-notifier.fullname" . }}-postgres-db
run: {{ include "eric-oss-fls-notifier.fullname" . }}-postgres-db
{{- end }}

