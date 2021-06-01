/*

  QudiniEvents Viewer

  * Qudini description structure

  The description field within qudini is used as the event description
  and a place to hold additional data related to the booking

  Below is a oveview of the previous and new keys that can/have been used

  {
    categories: ["creativity","entertainment","innovation","lifestyle"] (OPTIONAL)
    private: true/false (OPTIONSL show/hide in list)
    externalbookinglink: "" (OPTIONAL for single event page)
    sponsor: "" (OPTIONAL for single event page)
    youtubeid: "" (OPTIONAL for single event page)

    // below no longer required
    instagramhashtag: "" (DEPRECATED was used for single event instagram feed, not enabled now)
    eventtype: [""] ??? (DEPRECATED was used for previous filtering options)
    passions: Array(1) (DEPRECATED replaced with categories)
    featured: false ??? (cant find referencee for usage)
  }

  Example Qudini Usage (MUST INCLUDE DOUBLE PIPE ( || ) prefix to split properties from the description string)

  "Decription for event page ||{"categories":["entertainment","innovation","creativity","lifestyle"],"externalbookinglink":"","youtubeid":"","sponsor":"","private":false}"

*/


import KXEnv from '../util/KXEnv'
import { DateTime } from 'luxon'

const QUDINI_EVENTS_ENDPOINT = 'https://bookings.qudini.com/booking-widget/event/events/';
const qudiniEventsItemTemplate = require('../../templates/partials/components/qudiniEvents/qudiniEventsItem.hbs');

class QudiniEvents {

  constructor(series = QudiniEvents.ALL_SERIES) {
    this.el = document.querySelector('.qudiniEvents')
    if (!this.el) {
      return console.log('QudiniEvents: template not present')
    }
    this.initTime = new Date()
    this.events = null
    this.eventsBody = this.el.querySelector('#qudini-events-body')
    this.eventsLoader = this.el.querySelector('#qudini-events-loader')
    this.eventsTarget = this.el.querySelector('#qudini-events-target')

    this.eventFilters = {
      startDate: false,
      endDate: false,
      category: [],
      type: false
    }

    this.fetchEvents(series)
      .then(eventData => {
        console.log({eventData})
        this.events = eventData
        // delay initial render
        setTimeout(this.renderEvents.bind(this), 1000)
        this.filterEventListeners()
      })
  }

  filterEventListeners() {
    const filterDateStart = document.querySelector('#filter-date-start')
    const filterDateEnd = document.querySelector('#filter-date-end')
    const filterCategoryCheckboxes = document.querySelectorAll('.qudiniEvents__category input[type="checkbox"]')
    const filterTypeRadios = document.querySelectorAll('.qudiniEvents__type input[type="radio"]')

    function filterDateChange(type, event) {
      let isValid = event.target.validity.valid
      const dateObj = DateTime.fromSQL(event.target.value)

      if (isValid) {
        // compare new start to end filter
        if (type === 'start' && this.eventFilters.endDate) {
          // if start is before end, set start to end date
          if (dateObj.diff(this.eventFilters.endDate, 'days').toObject().days > 0) {
            isValid = false
            event.target.value = this.eventFilters.endDate.toFormat('yyyy-LL-dd')
          }
        }
        // compare new end to start filter
        if (type === 'end' && this.eventFilters.startDate) {
          // if end is before start, set end to start date
          if (dateObj.diff(this.eventFilters.startDate, 'days').toObject().days < 0) {
            isValid = false
            event.target.value = this.eventFilters.startDate.toFormat('yyyy-LL-dd')
          }
        }
        this.eventFilters[`${type}Date`] = dateObj
        this.afterFilterUpdate()
      }

      event.target.setAttribute('valid', isValid)
    }

    function filterCategoryChange() {
      const checkedCategoryCheckboxes = Array.from(document.querySelectorAll('.qudiniEvents__category input[type="checkbox"]:checked'))
      this.eventFilters.category = checkedCategoryCheckboxes.map(el => el.id.replace('filter-category-',''))
      this.afterFilterUpdate()
    }

    function filterTypeChange(e) {
      const selectedType = e.target.id.replace('filter-type-','')
      // condition for only always on
      if (selectedType === 'alwayson') {
        // emit event this is clicked, used to scroll to position in parent page
        // dont trigger update after filtering here as were not messsing with the actual events
        if (this.onEventTypeChange) {
          this.onEventTypeChange(selectedType)
        }
        console.log(this)
        this.eventFilters.type = false
      } else if (selectedType === this.eventFilters.type) {
        // revert if clicking the same one
        this.eventFilters.type = false
        this.afterFilterUpdate()
      } else {
        this.eventFilters.type = selectedType
        this.afterFilterUpdate()
      }
    }

    // date listeners
    filterDateStart.addEventListener('change', filterDateChange.bind(this, 'start'))
    filterDateEnd.addEventListener('change', filterDateChange.bind(this, 'end'))
    // category listeners
    filterCategoryCheckboxes.forEach(input => {
      input.addEventListener('change', filterCategoryChange.bind(this))
    })
    // event type listeners
    filterTypeRadios.forEach(input => {
      input.addEventListener('change', filterTypeChange.bind(this))
    })
  }

  afterFilterUpdate() {
    this.renderEvents()
  }


  getFilteredEvents() {
    return this.events.filter(event => {
      // console.log(event)
      let includeEvent = true

      // check category filter
      if (this.eventFilters.category.length) {
        if (event.properties && event.properties.categories) {
          includeEvent = event.properties.categories.some(cat => this.eventFilters.category.includes(cat))
        } else {
          return false
        }
      }

      if (this.eventFilters.type) {
        if (event.type) {
          includeEvent = event.type === this.eventFilters.type
        } else {
          return false
        }
      }

      // if (this.eventFilters.startDate) {
      //   if (this.)
      // }

      return includeEvent

    })
  }

  renderEvents() {
    // handle filters
    this.eventsBody.style.height = `2.5rem` // wrap loader then get inner loader height
    this.eventsBody.removeAttribute('events')

    const eventsToRender = this.getFilteredEvents()

    setTimeout(() => {

      this.eventsTarget.innerHTML = ''

      eventsToRender.forEach((event, i) => {
        event.transitionDelay = `${0.35 + (0.1 * i)}s`
        this.eventsTarget.insertAdjacentHTML('beforeend', qudiniEventsItemTemplate(event))
      });

      setTimeout(() => {
        this.eventsBody.setAttribute('events','')
        this.eventsBody.style.height = `${this.eventsTarget.offsetHeight}px`
      }, 350)

    }, 250)

  }

  // maybe extract this method to replace Events.js
  fetchEvents(seriesConfigArray){
    // create fetch url
    function makeFetchUrl({seriesID, isoCurrentDate}) {
      return `${QUDINI_EVENTS_ENDPOINT}${seriesID}?timezone=Europe/London&isoCurrentDate=${isoCurrentDate}`
    }
    // extract description data
    function extractDescriptionData(descriptionString) {
      const split = descriptionString.split("||")
      const description = split[0] || false
      const properties = split[1]
      // if no additional data in description
      if (!properties) return {description}
      // try catch parsing data as json
      try { JSON.parse(properties) }
      catch (e) { return {description, properties: false} }
      // return json
      return {description, properties: JSON.parse(properties)}
    }
    // promise setup
    return Promise.all(
      seriesConfigArray.map((series) => {
        return fetch(makeFetchUrl({
          seriesID: KXEnv.live ? series.live_id : series.test_id,
          isoCurrentDate: this.initTime.toISOString()
        }))
        .then(r => r.json())
      })
    )
    .then(seriesData => {
      // map returned api data array for each series
      const transformedSeriesData = seriesData.map((seriesEvents, index) => {
        const seriesType = seriesConfigArray[index].name
        console.log({seriesEvents, seriesType})
        // map the series events
        return seriesEvents.map(event => {
          // make transforms to event object
          // event type
          event.type = seriesType
          // description and extra properties
          const {description, properties} = extractDescriptionData(event.description)
          event.description = description
          event.properties = properties
          event.color = (event.properties.categories && event.properties.categories.length > 0) ? QudiniEvents.CATEGORY_COLORS[event.properties.categories[0]] : QudiniEvents.CATEGORY_COLORS.default
          // dates/readables
          const eventDate = DateTime.fromISO(event.startISO)
          const isToday = eventDate.diffNow('day').toObject().days <= 0
          event.readableDate = `${isToday ? 'Today': eventDate.toFormat('d LLLL')} | ${eventDate.toFormat('H:mm')}`
          return event
        })
      })
      const flattenedEventData = [].concat.apply([], transformedSeriesData);
      // filter private events
      const filteredEventData = flattenedEventData.filter(event => !event.properties.private)
      // return filtered array
      return filteredEventData
    })
    .catch(console.log)
  }
}

QudiniEvents.CATEGORY_COLORS = {
  default: '#E14D9A',
  innovation: '#00C3B2',
  entertainment: '#0077C8',
  creativity: '#FF4337',
  lifestyle: '#FFB546'
}

QudiniEvents.LIVE_SERIES = {
  name: "live",
  live_id: "U3OWDF3I0JF",
  test_id: "W3DMW9HUAYM"
}

// formerly webinars
QudiniEvents.VIRTUAL_SERIES = {
  name: "virtual",
  live_id: "JQXAE5L8AWF",
  test_id: "CMPWXUYK8II"
}

QudiniEvents.ALL_SERIES = [
  QudiniEvents.LIVE_SERIES,
  QudiniEvents.VIRTUAL_SERIES
]


export default QudiniEvents

/*

kxConfig['seriesId'] = "{{ config.seriesId }}";
kxConfig['seriesId_Webinars'] = "{{ config.seriesId_Webinars }}";
kxConfig['LIVE___seriesId'] = "{{ config.LIVE___seriesId }}";
kxConfig['LIVE___seriesId_Webinars'] = "{{ config.LIVE___seriesId_Webinars }}";

*/
