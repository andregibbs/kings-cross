// Search Component for HOI Content

const Handlebars = require("hbsfy/runtime");
import HandlebarsHelpers from '../../../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)


import Fuse from 'fuse.js'
import { FetchEvents } from '../../util/Events'
import KXEnv from '../../util/KXEnv'
import config from '../../../data/config.json'

// Search Data Fetch URL
const BASE_URL = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"
const LOCAL_URL = '/hoi-search-local.json';
const STAGING_URL = BASE_URL + "hoi-search-staging.json";
const LIVE_URL =  BASE_URL + "hoi-search.json";
const SearchDataURL = KXEnv.live ? LIVE_URL : KXEnv.local ? LOCAL_URL : STAGING_URL;

// let fuse; // fuse instance

// template
const itemTemplate = require('../../../templates/partials/home-of-innovation/hoiLinkList.hbs');
Handlebars.registerPartial('home-of-innovation/partials/listItem', require('../../../templates/partials/home-of-innovation/partials/listItem.hbs'))
Handlebars.registerPartial('home-of-innovation/partials/listItemSpacer', require('../../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs'))

// listItemJS
// import initListItemHoverEvents from '../../home-of-innovation/hoiListItemHoverEvents';

const STATE = {
  loading: 'loading',
  results: 'results',
  noinput: 'noinput',
  noresults: 'noresults'
}

/*
  TODO:
  make class
  add render results function that pulls in search value & filters to generate results
  create second fuse instance for events?
*/

export default class HOISearch {
  constructor() {

    this.el = document.querySelector('.hoiSearch');
    if (!this.el) {
      return // console.log('no search component')
    }
    this.input = this.el.querySelector('.hoiSearch__input')
    this.resultsEl = this.el.querySelector('.hoiSearch__panel--results')
    this.resultsWrapEl = this.el.querySelector('.hoiSearch__results_wrap')
    this.filterElements = [].slice.call(this.el.querySelectorAll('.hoiSearch__filters input'))

    this.searchFuse = null
    this.eventsFuse = null
    this.renderResultsTimeout = null

    this.fetchSearchData()
      .then(searchData => {
        // Create fuse instance with search data
        this.searchFuse = new Fuse(searchData, {
          includeScore: true,
          // includeMatches: true, // debug: show search
          threshold: 0.25, // word accuracy level
          distance: 1500, // length of value to search
          findAllMatches: true, // search for multiple
          keys: ['title','description','values']
        })
      })

    this.fetchEventData()
      .then(eventData => {
        console.log('ass', eventData)
        this.eventFuse = new Fuse(eventData, {
          includeScore: true,
          // includeMatches: true, // debug: show search
          threshold: 0.4, // word accuracy level
          distance: 1500, // length of value to search
          findAllMatches: true, // search for multiple
          keys: ['title','description']
        })
      })

    this.input.addEventListener('input', this.findResults.bind(this))
    this.filterElements.forEach(filter => {
      filter.addEventListener('change', this.findResults.bind(this))
    })
  }

  activate() {
    this.el.setAttribute('active','')
  }

  deactivate() {
    console.log('deact')
    this.el.removeAttribute('active')
  }

  fetchSearchData() {
    return fetch(SearchDataURL).then(r => r.json())
  }

  fetchEventData() {
    return new Promise(function(resolve, reject) {
      FetchEvents(events => {
        // TODO: filter hidden events
        events.map(event => {
          return item = {
            title: event.title,
            description: event.description.replace(/(<.*?>)/gim,''), //remove links
            url: `/${ config.site }${ config.subfolder }/whats-on/event/?id=${event.identifier}`,
            image: event.imageURL
          }
        })
        console.log('events', events)
        resolve(events)
      })
    });
  }

  setSearchState(state) {
    this.el.setAttribute('search-state', state)
  }

  clearResults() {
    this.resultsWrapEl.style.height = ''
    setTimeout(() => {
      this.resultsEl.textContent = ''
    }, 300)
  }

  getActiveFilters(e) {
    return this.filterElements
      .filter(filter => {
        return filter.checked
      })
      .map(el => {
        return el.value
      })
  }

  findResults(e) {
   const value = this.input.value
   const activeFilters = this.getActiveFilters()
   let searchResults = []
   let eventResults = []

   console.log(activeFilters)

   if (this.searchFuse) {
     searchResults = this.searchFuse.search(value).map(r => r.item)
     if (activeFilters.length) {
       searchResults = searchResults.filter(result => {
         console.log(result)
         return activeFilters.indexOf(result.category) > -1
       })
     }
   }

   if (this.eventsFuse) {
     eventResults = this.eventsFuse.search(value).map(r => r.item)
   }

   this.clearResults()
   clearTimeout(this.renderResultsTimeout)

   if (value.length <= 0) {
     this.setSearchState(STATE.noinput)
   } else {
     this.renderResults(searchResults, eventResults);
    }
  }

  renderResults(searchResults, eventResults) {

    this.setSearchState(STATE.loading)

    if (!searchResults.length && !eventResults.length) {
      this.renderResultsTimeout = setTimeout(() => {
        this.setSearchState(STATE.noresults)
      }, 300)
    } else {
      // clear the element
      this.renderResultsTimeout = setTimeout(() => {
        this.resultsEl.textContent = '';
        // render template
        if (searchResults.length) {
          this.resultsEl.insertAdjacentHTML('beforeend', itemTemplate({
            items: searchResults
          }))
        }

        if (eventResults.length) {
          this.resultsEl.insertAdjacentHTML('beforeend', itemTemplate({
            items: eventResults
          }))
        }

        this.setSearchState(STATE.results)
        this.resultsWrapEl.style.height = (this.resultsEl.offsetHeight * 1.1) + 'px'
      }, 800)
    }

  }
}
