import KXEnv from '../util/KXEnv';

const BASE_URL = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"
const LOCAL_URL = '/hoi-dynamic-local.json';
const STAGING_URL = BASE_URL + "hoi-dynamic-staging.json";
const LIVE_URL =  BASE_URL + "hoi-dynamic.json";

export default function fetchDynamicData() {

  let url = KXEnv.live ? LIVE_URL : STAGING_URL;
  url = KXEnv.local ? LOCAL_URL : url;

  return fetch(url).then(r => r.json())

}
