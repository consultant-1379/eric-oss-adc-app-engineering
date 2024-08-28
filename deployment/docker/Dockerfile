#FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/loadimpact/k6 as k6base
# Image details: https://hub.docker.com/r/loadimpact/k6/tags
FROM armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6/tooling/k6-base-image:latest

ARG version
ENV hostname_url=$hostname_url
ENV TESTWARE_VERSION=$version
ENV TEST_VERSION=$version

ENV STAGING_TYPE="APPLICATION"
ENV APP_NAME="eric-oss-adc"
ADD js/ /tests
ADD resources/ /resources






