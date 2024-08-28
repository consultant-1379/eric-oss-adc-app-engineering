# Usecase Scenario
## Subscription
```json
{
       "subscription": {
            "exec": "subscription",
            "executor": "per-vu-iterations",
            "startTime": "5s",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "5m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## Ves_collector_flow_external
```json
{
        "Ves_collector_flow_external": {
            "exec": "Ves_collector_flow_external",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "5m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## moc_ctr_flow_internal
```json
{
        "moc_ctr_flow_internal": {
            "exec": "moc_ctr_flow_internal",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "5m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## FNS_DCC_reg_internal
```json
{
        "FNS_DCC_reg_internal": {
            "exec": "FNS_DCC_reg_internal",
            "startTime": "40s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## SFTP_DCC_reg_internal
```json
{
        "SFTP_DCC_reg_internal": {
            "exec": "SFTP_DCC_reg_internal",
            "startTime": "50s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## SFTP_Core_DCC
```json
{
        "SFTP_Core_DCC": {
            "exec": "SFTP_Core_DCC",
            "startTime": "55s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).


## pmstats_e2e_flow_internal
```json
{
        "pmstats_e2e_flow_internal": {
            "exec": "pmstats_e2e_flow_internal",
            "startTime": "60s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## pmevent_e2e_flow_internal
```json
{
        "pmevent_e2e_flow_internal": {
            "exec": "pmevent_e2e_flow_internal",
            "startTime": "60s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).


## corestats_e2e_flow_internal
```json
{
        "corestats_e2e_flow_internal": {
            "exec": "corestats_e2e_flow_internal",
            "startTime": "60s",
            "executor": "per-vu-iterations",
            "vus": 1,
            "iterations": 1,
            "maxDuration": "15m"
        }
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).