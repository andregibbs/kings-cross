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

let fuse; // fuse instance

export default function HOISearch() {

  const el = document.querySelector('.hoiSearch');
  if (!el) {
    return // console.log('no search component')
  }
  const input = el.querySelector('.hoiSearch__input input')
  const resultsEl = el.querySelector('.hoiSearch__results')

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
    // if (value.length > 2) {
    const results = fuse.search(value)
    console.clear()
    console.log(value,results,fuse)
      renderResults(results)
    // } else {
      // renderResults([])
    // }
  })


  function renderResults(results) {


    resultsEl.textContent = ''

    results.forEach(r => {
      // console.log(r)
      var newEl = document.createElement('div')
      // newEl.className = "result"
      newEl.href = r.item.url
      // newEl.style.backgroundImage = `url('${r.item.image}')`
      newEl.innerText = `${r.item.title}, Score: ${r.score}`
      resultsEl.appendChild(newEl)
    })
  }
}
