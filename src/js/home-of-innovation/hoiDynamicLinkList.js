import Handlebars from 'handlebars'
const itemTemplate = require('../../templates/partials/home-of-innovation/partials/listItem.hbs');
const itemSpacerTemplate = require('../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs');

const BASE_URL = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"

const STAGING_FILE = BASE_URL + "hoi-dynamic-staging.json";
const LIVE_FILE =  BASE_URL + "hoi-dynamic.json";

export default class HOIDynamicLinkList {

  constructor(el) {


    this.dynamicID = el.getAttribute('dynamic')

    console.log('dynamic id', this.dynamicID)

    console.log(itemTemplate)



  }

}
