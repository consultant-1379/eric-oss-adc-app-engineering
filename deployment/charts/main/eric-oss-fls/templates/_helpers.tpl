{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-oss-fls.fullname" -}}
{{- $name := default .Chart.Name .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- printf "%s" $name }}
{{- end }}

{{/*
Create imagePath.
*/}}
{{- define "eric-oss-fls.imagePath" -}}
{{- $productInfo := fromYaml (.Files.Get "eric-product-info.yaml") -}}
{{- $repoUrl := .Values.image.repoUrl -}}
{{- $repoPath := .Values.image.repoPath -}}
{{- $imageName := $productInfo.images.fls.name -}}
{{- $tag := default .Chart.AppVersion .Values.image.tag -}}
{{- $imagePath := printf "%s/%s/%s:%s" $repoUrl $repoPath $imageName $tag -}}
{{- print (regexReplaceAll "[/]+" $imagePath "/") -}}
{{- end }}

{{/*
Create image pull secret, service level parameter takes precedence
*/}}
{{- define "eric-oss-fls.pullSecret.global" -}}
{{- $pullSecret := "" -}}
{{- if .Values.global -}}
{{- if .Values.global.pullSecret -}}
{{- $pullSecret = .Values.global.pullSecret -}}
{{- end -}}
{{- end -}}
{{- print $pullSecret -}}
{{- end -}}

{{- define "eric-oss-fls.pullSecret" -}}
{{- $pullSecret := ( include "eric-oss-fls.pullSecret.global" . ) -}}
{{- if .Values.imageCredentials.pullSecret -}}
{{- $pullSecret = .Values.imageCredentials.pullSecret -}}
{{- end -}}
{{- print $pullSecret -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-oss-fls.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "eric-oss-fls.labels" -}}
helm.sh/chart: {{ include "eric-oss-fls.chart" . }}
{{ include "eric-oss-fls.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "eric-oss-fls.selectorLabels" -}}
app: {{ include "eric-oss-fls.fullname" . }}
app.kubernetes.io/name: {{ include "eric-oss-fls.fullname" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels for postgress-db
*/}}
{{- define "eric-oss-fls-postgress-db.labels" -}}
{{ include "eric-oss-fls-postgress-db.selectorLabels" . }}
app.kubernetes.io/name: {{ include "eric-oss-fls.fullname" . }}-postgress-db 
{{- end }}

{{/*
Selector labels for postgress-db
*/}}
{{- define "eric-oss-fls-postgress-db.selectorLabels" -}}
app: {{ include "eric-oss-fls.fullname" . }}-postgres-db
run: {{ include "eric-oss-fls.fullname" . }}-postgres-db
{{- end }}