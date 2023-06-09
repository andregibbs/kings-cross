const Handlebars = require("hbsfy/runtime");

import HandlebarsHelpers from '../../templates/helpers/handlebarsHelpers';

HandlebarsHelpers.register(Handlebars)

import fetchDynamicData from './hoiDynamicData';
import { ListItemsUpdatedEvent } from './hoiEvents'
import listLoaderAnimation from '../animation/hoi-list-loader.json'
const itemTemplate = require('../../templates/partials/home-of-innovation/partials/listItem.hbs');
const itemSpacerTemplate = require('../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs');
const listLoaderTemplate = require('../../templates/partials/home-of-innovation/partials/listLoader.hbs')

const ROW_ITEMS = 4

export default class HOIDynamicLinkList {

  constructor(el) {

    // main el
    this.el = el
    // get component id
    this.dynamicID = el.getAttribute('dynamic')
    // target for templates to be placed
    this.dynamicTarget = el.querySelector('[dynamic-target]')

    // add loading element
    this.loaderAnimation = this.createLoaderAnimation()

    // fetch
    fetchDynamicData()
      .then(d => {
        const data = d[this.dynamicID]
        if (!data) {
          throw 'Missing data for ID ' + this.dynamicID
        }
        this.destroyLoaderAnimation()
        this.compileTemplate(data)
      })
      .catch(e => {
        // fall back or hide data?
        console.log(e)
      })

  }

  createLoaderAnimation() {
    // add loader template to parent
    this.el.insertAdjacentHTML('beforeend', listLoaderTemplate())
    const animEl = this.el.querySelector('.hoiLinkList__LoaderAnim')
    let loaderAnimation = false;
    // burger menu anim
    if (lottie) {
      loaderAnimation = lottie.loadAnimation({
        container: animEl, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        animationData: listLoaderAnimation // the path to the animation json
      });
    }
    return loaderAnimation
  }

  destroyLoaderAnimation() {
    this.loaderAnimation.destroy()
    this.el.removeChild(this.el.querySelector('.hoiLinkList__Loader'))
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

    // fire list update event (captured in hoiLinkListHoverScroll)
    this.dynamicTarget.dispatchEvent(ListItemsUpdatedEvent)

  }

}
