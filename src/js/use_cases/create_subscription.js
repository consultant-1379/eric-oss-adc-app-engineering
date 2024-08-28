import http from 'k6/http';
import {
    check,
    sleep,
    group
} from 'k6';
import * as subscription from "./Subcription_Utils.js";

//Validation of Subscription counts post creating new Subscription
export default function(){
    //Getting values of Subscription Count before creating the Subscription
    subscription.Before_Subscription();
    sleep(400);
    subscription.After_Subscription();
}