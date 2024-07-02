#!/bin/sh
METRIC_VALUE=$(awk -F '[:,}]' '{print $20}' ./coverage/coverage-summary.json | head -1)

curl --request POST \
--url https://verygoodsecurity.atlassian.net/gateway/api/compass/v1/metrics \
--user "$COMPASS_USER_EMAIL:$COMPASS_API_KEY" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
--data "{
  \"metricSourceId\": \"ari:cloud:compass:83673fa7-fd28-4f4a-9738-f584064570a7:component/db43f86d-85fe-42e1-954d-457f5a4082b8/af3e4561-6bb9-40e3-8c38-e0d5da870dcf\",
  \"value\": $METRIC_VALUE,
  \"timestamp\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"
}"
