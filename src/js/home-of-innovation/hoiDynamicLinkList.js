const Handlebars = require("hbsfy/runtime");

import HandlebarsHelpers from '../../templates/helpers/handlebarsHelpers';

HandlebarsHelpers.register(Handlebars)

import fetchDynamicData from './hoiDynamicData';

const itemTemplate = require('../../templates/partials/home-of-innovation/partials/listItem.hbs');
const itemSpacerTemplate = require('../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs');

const ROW_ITEMS = 4

export default class HOIDynamicLinkList {

  constructor(el) {

    // get component id
    this.dynamicID = el.getAttribute('dynamic')
    // target for templates to be placed
    this.dynamicTarget = el.querySelector('[dynamic-target]')

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

    // loop data and insert template
    data.items.forEach((item) => {
      this.dynamicTarget.insertAdjacentHTML('beforeend', itemTemplate(item))
    })

    // loop remainders for spacing items
    if (data.style && data.style.scroll) {
      // dont show if style.scroll is set
    } else {
      for (var i = 0; i < data.items.length % ROW_ITEMS; i++) {
        this.dynamicTarget.insertAdjacentHTML('beforeend', itemSpacerTemplate())
      }
    }
  }

}
