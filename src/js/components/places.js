import handleTemplate from "./handleTemplate";
import instagram from "./instagram";
import upcomingEvents from "./upcomingEvents";
import getUrlVars from "./getUrlVars";
import createDropDown from "./createDropDown";
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function places() {

  // =================================================
  // Populating event details from query string
  // =================================================

  $.get(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBu9auy0x9Og1YGPl__MkoxswdFd6vxB7M"
  ).success(function (data) {
    
    console.log('places', data)
  });
}
