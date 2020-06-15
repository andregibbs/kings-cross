const Handlebars = require("hbsfy/runtime");

import HandlebarsHelpers from '../../templates/helpers/handlebarsHelpers';

HandlebarsHelpers.register(Handlebars)

import KXEnv from '../util/KXEnv';

const itemTemplate = require('../../templates/partials/home-of-innovation/partials/listItem.hbs');
const itemSpacerTemplate = require('../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs');

const BASE_URL = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"

// TODO: move to env or find other solution
const LOCAL_HOSTNAME = 'kings-cross.samsung.com';
const LOCAL_URL = '/hoi-dynamic-local.json';

const STAGING_URL = BASE_URL + "hoi-dynamic-staging.json";
const LIVE_URL =  BASE_URL + "hoi-dynamic.json";

const ROW_ITEMS = 4

export default class HOIDynamicLinkList {

  constructor(el) {

    // get component id
    this.dynamicID = el.getAttribute('dynamic')
    // target for templates to be placed
    this.dynamicTarget = el.querySelector('[dynamic-target]')

    // configure url live/staging/local
    let url = KXEnv.live ? LIVE_URL : STAGING_URL;
    url = KXEnv.local ? LOCAL_URL : url;

    // fetch
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const data = d[this.dynamicID]
        if (!data) {
          throw 'Missing data for ID'
        }
        this.compileTemplate(data.items)
      })
      .catch(e => {
        // fall back or hide data?
        console.log(e.stack)
      })

  }

  compileTemplate(data) {

    // loop data and insert template
    data.forEach((item) => {
      this.dynamicTarget.insertAdjacentHTML('beforeend', itemTemplate(item))
    })

    // loop remainders for spacing items
    for (var i = 0; i < data.length % ROW_ITEMS; i++) {
      this.dynamicTarget.insertAdjacentHTML('beforeend', itemSpacerTemplate())
    }
  }

  isLocal() {
    return window.location.hostname === LOCAL_HOSTNAME;
  }

  isLive() {
    return window.location.hostname === "www.samsung.com"
  }

}
