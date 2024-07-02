#!/bin/sh
METRIC_VALUE=$(awk -F '[:,}]' '{print $20}' ./coverage/coverage-summary.json | head -1)

curl --request POST \
--url https://verygoodsecurity.atlassian.net/gateway/api/compass/v1/metrics \
--user "$COMPASS_USER_EMAIL:$COMPASS_API_KEY" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
--data "{
  \"metricSourceId\": \"ari:cloud:compass:83673fa7-fd28-4f4a-9738-f584064570a7:metric-source/db43f86d-85fe-42e1-954d-457f5a4082b8/91fffb45-d70c-46b2-a118-5bd2d13e4d31\",
  \"value\": $METRIC_VALUE,
  \"timestamp\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"
}"
