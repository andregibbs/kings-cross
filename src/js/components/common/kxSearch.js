// Search Component for HOI Content

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

// template
const Handlebars = require("hbsfy/runtime");
import HandlebarsHelpers from '../../../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)

const searchItemTemplate = require('../../../templates/partials/home-of-innovation/hoiLinkList.hbs');
const eventItemTemplate = require('../../../templates/partials/components/common/kxEventTile.hbs');
Handlebars.registerPartial('home-of-innovation/partials/listItem', require('../../../templates/partials/home-of-innovation/partials/listItem.hbs'))
Handlebars.registerPartial('home-of-innovation/partials/listItemSpacer', require('../../../templates/partials/home-of-innovation/partials/listItemSpacer.hbs'))

// State obj
const STATE = {
  loading: 'loading',
  results: 'results',
  noinput: 'noinput',
  noresults: 'noresults'
}

const MAX_SEARCH_RESULTS = 20;

export default class KXSearch {
  constructor(navContainsSearchComponent) {

    this.el = document.querySelector('.kxSearch');
    if (!this.el) {
      return // console.log('no search component')
    }
    this.input = this.el.querySelector('.kxSearch__input')
    this.resultsEl = this.el.querySelector('.kxSearch__panel--results')
    this.resultsWrapEl = this.el.querySelector('.kxSearch__results_wrap')
    this.searchResultsTarget = this.el.querySelector('#search-results')
    this.filterElements = [].slice.call(this.el.querySelectorAll('.kxSearch__filters input'))
    this.eventResultsTarget = this.el.querySelector('#event-results')

    this.searchFuse = null
    this.eventsFuse = null
    this.renderResultsTimeout = null
    this.hasResults = false
    this.navContainsSearchComponent = navContainsSearchComponent

    if (this.navContainsSearchComponent) {
      this.el.setAttribute('search-in-nav', '')
    }

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

        // input field may be populated after back/fwd navigation
        if (this.input.value.length > 0) {
          setTimeout(this.findResults(), 300)
        }

      })

    this.fetchEventData()
      .then(eventData => {
        this.eventsFuse = new Fuse(eventData, {
          includeScore: true,
          // includeMatches: true, // debug: show search
          threshold: 0.25, // word accuracy level
          distance: 1500, // length of value to search
          findAllMatches: true, // search for multiple
          keys: ['title','description']
        })
      })

    this.input.addEventListener('input', this.findResults.bind(this))
    this.filterElements.forEach(filter => {
      filter.addEventListener('change', this.findResults.bind(this))
    })

    window.addEventListener('resize', this.updateResultsHeight.bind(this))
  }

  activate() {
    this.el.setAttribute('active','')
    this.input.focus()
    if (this.navContainsSearchComponent) {
      document.querySelector('html').style.overflow = 'hidden'
    }
  }

  deactivate() {
    this.el.removeAttribute('active')
    this.input.blur()
    if (this.navContainsSearchComponent) {
      document.querySelector('html').style.overflow = ''
    }
  }

  fetchSearchData() {
    return fetch(SearchDataURL).then(r => r.json())
  }

  fetchEventData() {
    return new Promise(function(resolve, reject) {
      FetchEvents(events => {
        resolve(events)
      })
    });
  }

  setSearchState(state) {
    this.el.setAttribute('search-state', state)
  }

  clearResults(delay = 300) {
    this.resultsWrapEl.style.height = ''
    setTimeout(() => {
      this.searchResultsTarget.textContent = '';
      this.eventResultsTarget.textContent = '';
    }, delay)
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

    if (this.searchFuse) {
      // get search results
      searchResults = this.searchFuse.search(value).map(r => r.item)
      if (activeFilters.length) {
        // filter if filters are checked
        searchResults = searchResults.filter(result => {
          return activeFilters.indexOf(result.category) > -1
        })
      }
      // trim to max items
      searchResults = searchResults.slice(0,MAX_SEARCH_RESULTS);
    }

    if (this.eventsFuse) {
      // get event results
      eventResults = this.eventsFuse.search(value).map(r => r.item)
    }

    // console.log('eventResults', eventResults)

    this.clearResults()
    clearTimeout(this.renderResultsTimeout)

    if (value.length <= 0) {
      this.setSearchState(STATE.noinput)
    } else {
      this.renderResults(searchResults, eventResults);
    }
  }

  updateResultsHeight() {
    if (this.hasResults) {
      this.resultsWrapEl.style.height = ((this.resultsEl.offsetHeight) + 50) + 'px'
    }
  }

  renderResults(searchResults, eventResults) {

    this.setSearchState(STATE.loading)

    if (!searchResults.length && !eventResults.length) {
      // if no results
      this.hasResults = false
      this.resultsWrapEl.removeAttribute('search-results')
      this.resultsWrapEl.removeAttribute('event-results')
      this.renderResultsTimeout = setTimeout(() => {
        this.setSearchState(STATE.noresults)
      }, 300)
    } else {
      this.hasResults = true
      this.renderResultsTimeout = setTimeout(() => {
        // clear result targets
        this.searchResultsTarget.textContent = '';
        this.eventResultsTarget.textContent = '';
        // add result count to wrapper
        this.resultsWrapEl.setAttribute('search-results', searchResults.length > 0)
        this.resultsWrapEl.setAttribute('event-results', eventResults.length > 0)

        // render serach results template
        if (searchResults.length) {
          this.searchResultsTarget.insertAdjacentHTML('beforeend', searchItemTemplate({
            items: searchResults
          }))
        }
        // render event results
        if (eventResults.length) {
          eventResults.forEach(eventObj => {
            // make uk date
            let splitDate = eventObj.startDate.split('/')
            eventObj.startDate = splitDate[1]+'/'+splitDate[0]+'/'+splitDate[2]
            console.log(eventObj)
            this.eventResultsTarget.insertAdjacentHTML('beforeend', eventItemTemplate(eventObj))
          });
        }
        // set state and height to animate
        this.setSearchState(STATE.results)

        this.updateResultsHeight()
      }, 800)
    }

  }
}
