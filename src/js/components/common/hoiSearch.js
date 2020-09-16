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

let fuse; // fuse instance

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

export default function HOISearch() {

  const el = document.querySelector('.hoiSearch');
  if (!el) {
    return // console.log('no search component')
  }
  const input = el.querySelector('.hoiSearch__input')
  const resultsEl = el.querySelector('.hoiSearch__panel--results')
  const resultsWrapEl = el.querySelector('.hoiSearch__results_wrap')

  fetch(SearchDataURL)
    .then(r => r.json())
    .then(data => {
      // Create fuse instance with search data
      fuse = new Fuse(data, {
        includeScore: true,
        // includeMatches: true, // debug: show search
        threshold: 0.25, // word accuracy level
        distance: 1500, // length of value to search
        findAllMatches: true, // search for multiple
        keys: ['title','description','values']
      })
      addEventData(fuse)
    })

  // Add additional event data
  function addEventData(fuse) {
    // fetch event data
    FetchEvents((events) => {
      console.log('events', events)
      // TODO: filter hidden events
      events.forEach(event => {
        const item = {
          title: event.title,
          description: event.description.replace(/(<.*?>)/gim,''), //remove links
          url: `/${ config.site }${ config.subfolder }/whats-on/event/?id=${event.identifier}`,
          image: event.imageURL
        }
        fuse.add(item)
      })
    })
  }

  input.addEventListener('input', (e) => {
    const value = input.value
    const results = fuse.search(value)
    clearResults()
    clearTimeout(renderResultsTimeout)

    if (value.length <= 0) {
      setSearchState(STATE.noinput)
    } else {
      renderResults(results.map(r => r.item));
    }
  })

  function setSearchState(state) {
    el.setAttribute('search-state', state)
  }

  function clearResults() {
    resultsWrapEl.style.height = ''
    setTimeout(() => {
      resultsEl.textContent = '';
    }, 300)
  }


  // init observer on hoiSearch__results for result hover events
  // initListItemHoverEvents('.hoiSearch__results')

  let renderResultsTimeout = null;

  function renderResults(results) {


    setSearchState(STATE.loading)

    if (!results.length) {
      renderResultsTimeout = setTimeout(() => {
        setSearchState(STATE.noresults)
      }, 300)
    } else {
      // clear the element
      renderResultsTimeout = setTimeout(() => {
        resultsEl.textContent = '';
        // render template
        resultsEl.insertAdjacentHTML('beforeend', itemTemplate({
          items: results
        }))
        setSearchState(STATE.results)
        resultsWrapEl.style.height = resultsEl.offsetHeight + 'px'
      }, 800)
    }

  }
}
