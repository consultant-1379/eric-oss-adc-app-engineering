#!/bin/sh
#chmod777 main.js
k6 run  --summary-export /reports/summary.json main.js -c /home/k6/config/default.options.json
#cat main.js
while true ; do sleep 600s ; done > /dev/null
