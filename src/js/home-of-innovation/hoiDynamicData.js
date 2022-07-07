import KXEnv from '../util/KXEnv';

const BASE_URL = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"
const LOCAL_URL = '/hoi-dynamic-local.json';
const STAGING_URL = BASE_URL + "hoi-dynamic-staging.json";
const LIVE_URL =  BASE_URL + "hoi-dynamic.json";

let storedData = false;
let isFetching = false;

export default function fetchDynamicData() {

  let url = KXEnv.live ? LIVE_URL : STAGING_URL;
  url = KXEnv.local ? LOCAL_URL : url;

  // if fetching data already, just wait it out
  if (isFetching) {
    return new Promise(function(resolve, reject) {
      function checkForData() {
        if (storedData !== false) {
          resolve(storedData)
        } else {
          setTimeout(checkForData, 100)
        }
      }
      checkForData()
    });
  }

  // if data already here, send it
  if (storedData) {
    return storedData
  }

  // otherwise get it
  isFetching = true
  return fetch(url).then(r => {
    storedData = r.json()
    isFetching = false
    return storedData
  })

}
