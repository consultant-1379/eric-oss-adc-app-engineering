import http from 'k6/http';
import {
  check
} from 'k6';
import * as config from "./config.js";
let CATALOG_V1_BASE = 'http://eric-oss-data-catalog:9590/catalog/v1/';
let Deactivate_BASE = 'http://eric-oss-data-catalog:9590/catalog/v2/subscriptions/?subscriptionName=';
let DCC_BASE = 'http://eric-oss-data-collection-controller:8080/subscription/v1/';
let body=[];
var Subscription;
//Default method for TearDown
export default function () {
  DeActivaterAppid();
  for (let i = 0; i < config.Subscription_Name.length; i++) {
    console.log("Started Deleting " + config.Subscription_Name[i] + " Subscription");
    Delete_Subscription(config.Subscription_Name[i], "Active");
    Delete_Subscription(config.Subscription_Name[i], "InActive");
  }
  console.log("Tear Down End");
}
//Method for Delete Subscription in DC
export function Delete_Subscription(SubscriptionName, Subscription_type) {
  const DelURL_Active = Deactivate_BASE + SubscriptionName + "&status=Active";
  const DelURL_InActive = Deactivate_BASE + SubscriptionName + "&status=Inactive";
  if (Subscription_type == "Active") {
    console.log(DelURL_Active);
    Subscription = 'Active Subscriptions';
    const Response1 = http.get(DelURL_Active);
    body = JSON.parse(Response1.body);
  }
  else {
    console.log(DelURL_InActive);
    Subscription = 'InActive Subscriptions';
    const Response1 = http.get(DelURL_InActive);
    body = JSON.parse(Response1.body);
  }
  if (body.length != 0) {
    let namesArray = body.map(obj => obj.ids.id);
    console.log("IDS are ", namesArray);
    const uniqueNumbers = Array.from(new Set(namesArray));
    console.log("Unique IDS are ", uniqueNumbers);
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const Response2 = http.del(CATALOG_V1_BASE + "ids-delete/" + uniqueNumbers[i]);
      console.log("Response body is " + Response2.body);
      console.log("Response status is " + Response2.status);
    }
  }
  else {
    console.log("No " + Subscription + " in DB");
  }
}
//Method for De-Activating the rAPP id in DC
export function DeActivaterAppid() {
  for (let a = 0; a < config.Subscription_Name.length; a++) {
    let DeactivaterAppid = Deactivate_BASE + config.Subscription_Name[a] + "&status=Active";
    console.log(DeactivaterAppid);
    const Response3 = http.get(DeactivaterAppid);
    //console.log(Response3.body);
    let body2 = JSON.parse(Response3.body);
    if (body2.length != 0) {
      let rAppidArray = body2.map(obj => obj.ids.rAppId);
      console.log("list of rApp id are ", rAppidArray);
      const uniquerAppid = Array.from(new Set(rAppidArray));
      console.log("Unique rAppid are ", uniquerAppid);
      for (let j = 0; j < uniquerAppid.length; j++) {
        const Response4 = http.del(DCC_BASE + uniquerAppid[j]);
        console.log("Response status is " + Response4.status);
      }
    }
  }
}
