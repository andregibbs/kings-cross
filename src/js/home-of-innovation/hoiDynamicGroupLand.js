const Handlebars = require("hbsfy/runtime");

import HandlebarsHelpers from '../../templates/helpers/handlebarsHelpers';

HandlebarsHelpers.register(Handlebars)

import fetchDynamicData from './hoiDynamicData';
import { createLoaderAnimation } from './utils'

const groupLandContainer = require('../../templates/partials/home-of-innovation/partials/groupLandLayout.hbs');

const ROW_ITEMS = 4

export default class HOIDynamicGroupLand {

  constructor(el) {

    // get component id
    this.dynamicID = el.getAttribute('dynamic')
    // target for templates to be placed (same as el for group land)
    this.dynamicTarget = el
    // create loader
    this.loader = createLoaderAnimation(el.querySelector('.hoiGroupLand__Loader'))

    // fetch
    fetchDynamicData()
      .then(d => {
        const data = d[this.dynamicID]
        if (!data) {
          throw 'Missing data for ID'
        }
        this.compileTemplate(data)
      })
      .catch(e => {
        // fall back or hide data?
        console.log(e.stack)
      })

  }

  compileTemplate(data) {
    this.dynamicTarget.insertAdjacentHTML('afterbegin', groupLandContainer(data))
  }

}
