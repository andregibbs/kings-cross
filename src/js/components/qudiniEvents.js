/*

  QudiniEvents Viewer Component

  *** this.fetchEvents now abstracted to util/FetchQudiniEvents ***

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

const SHOW_MAX = {
  desktop: 8,
  mobile: 4
}

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
    this.showMoreEvents = this.el.querySelector('#qudini-events-more')

    this.eventFilters = {
      startDate: false,
      endDate: false,
      category: [],
      type: false
    }

    // update on resize
    this.isMobile = window.innerWidth <= 768

    this.fetchEvents(series)
      .then(eventData => {
        console.log({eventData})
        this.events = eventData
        // delay initial render
        setTimeout(this.renderEvents.bind(this), 1000)
        this.eventListeners()
      })
  }

  eventListeners() {
    const filterDateStart = document.querySelector('#filter-date-start')
    const filterDateEnd = document.querySelector('#filter-date-end')
    const filterCategoryCheckboxes = document.querySelectorAll('.qudiniEvents__category input[type="checkbox"]')
    const filterTypeRadios = document.querySelectorAll('.qudiniEvents__type input[type="radio"]')

    // function for change of date
    function filterDateChange(type, event) {
      let isValid = event.target.validity.valid
      let dateObj = DateTime.fromSQL(event.target.value)

      if (isValid) {
        // compare new start to end filter
        if (type === 'start' && this.eventFilters.endDate) {
          // if start is before end, set start to end date
          if (dateObj.diff(this.eventFilters.endDate, 'days').toObject().days > 0) {
            isValid = false
            dateObj = this.eventFilters.endDate
            event.target.value = this.eventFilters.endDate.toFormat('yyyy-LL-dd')
          }
        }
        // compare new end to start filter
        if (type === 'end' && this.eventFilters.startDate) {
          // if end is before start, set end to start date
          if (dateObj.diff(this.eventFilters.startDate, 'days').toObject().days < 0) {
            isValid = false
            dateObj = this.eventFilters.startDate
            event.target.value = this.eventFilters.startDate.toFormat('yyyy-LL-dd')
          }
        }
        this.eventFilters[`${type}Date`] = dateObj
        this.afterFilterUpdate()
      }

      event.target.setAttribute('valid', isValid)
    }

    // function for change of category
    function filterCategoryChange() {
      const checkedCategoryCheckboxes = Array.from(document.querySelectorAll('.qudiniEvents__category input[type="checkbox"]:checked'))
      this.eventFilters.category = checkedCategoryCheckboxes.map(el => el.id.replace('filter-category-',''))
      this.afterFilterUpdate()
    }

    // function for change of event type
    function filterTypeChange(e) {
      const selectedType = e.target.id.replace('filter-type-','')
      // condition for only always on
      if (selectedType === 'alwayson') {
        // dont trigger update after filtering here as were not messsing with the actual events
        this.eventFilters.type = false
      } else if (selectedType === this.eventFilters.type) {
        // revert if clicking the same one
        this.eventFilters.type = false
        this.afterFilterUpdate()
      } else {
        this.eventFilters.type = selectedType
        this.afterFilterUpdate()
      }
      // emit event this is clicked, used to scroll to position in parent page
      if (this.onEventTypeChange) {
        this.onEventTypeChange(selectedType)
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

    this.showMoreEvents.addEventListener('click', this.renderMore.bind(this))

    window.addEventListener('resize', this.handleResize.bind(this))

  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768
    this.eventsBody.style.height = `calc(${this.eventsTarget.offsetHeight}px + 1rem)`
  }

  afterFilterUpdate() {
    this.renderEvents()
  }

  getEventsToRender(startFromIndex = 0) {
    // sort by date
    let filteredEvents = this.events.sort((a,b) => a.luxonDate - b.luxonDate)

    // filter by filters
    filteredEvents = filteredEvents.filter(event => {
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

      if (this.eventFilters.type && includeEvent) {
        if (event.type) {
          includeEvent = event.type === this.eventFilters.type
        } else {
          return false
        }
      }

      if (this.eventFilters.startDate && includeEvent) {
        if (event.luxonDate >= this.eventFilters.startDate) {
          includeEvent = true
        } else {
          includeEvent = false
        }
      }

      if (this.eventFilters.endDate && includeEvent) {
        if (event.luxonDate <= this.eventFilters.endDate.plus({days: 1})) {
          includeEvent = true
        } else {
          includeEvent = false
        }
      }

      return includeEvent

    })

    // slice by show max
    const eventsToRender = filteredEvents.slice(startFromIndex, startFromIndex + (this.isMobile ? SHOW_MAX.mobile : SHOW_MAX.desktop))

    // return full filtered list and then sliced render list to compare totals
    return {
      eventsToRender,
      filteredEvents
    }

  }

  // initial render
  renderEvents() {
    // handle filters
    this.eventsBody.style.height = `3.5rem` // wrap loader then get inner loader height
    this.eventsBody.removeAttribute('events')
    this.eventsBody.setAttribute('loading', '')

    const { eventsToRender } = this.getEventsToRender()

    setTimeout(() => {

      this.eventsTarget.innerHTML = ''

      eventsToRender.forEach((event, i) => {
        event.animationDelay = `${0.35 + (0.1 * i)}s`
        this.eventsTarget.insertAdjacentHTML('beforeend', qudiniEventsItemTemplate(event))
      });

      this.eventsBody.removeAttribute('loading')
      setTimeout(() => {
        this.eventsBody.setAttribute('events','')
        this.eventsBody.style.height = `calc(${this.eventsTarget.offsetHeight}px + 1rem)`
        this.afterRender()
      }, 300)

    }, 300)

  }

  // subsequent renders
  renderMore() {
    const renderedEvents = this.eventsTarget.querySelectorAll('.qudiniEventsItem')
    const { eventsToRender } = this.getEventsToRender(renderedEvents.length)

    eventsToRender.forEach((event, i) => {
      event.animationDelay = `${0.1 + (0.1 * i)}s`
      this.eventsTarget.insertAdjacentHTML('beforeend', qudiniEventsItemTemplate(event))
    });

    this.eventsBody.style.height = `${this.eventsTarget.offsetHeight}px`
    this.afterRender()
  }

  // after any event render
  afterRender() {
    const { filteredEvents } = this.getEventsToRender()
    const renderedEvents = this.eventsTarget.querySelectorAll('.qudiniEventsItem')
    if (renderedEvents.length < filteredEvents.length) {
      this.showMoreEvents.setAttribute('active', '')
    } else {
      this.showMoreEvents.removeAttribute('active')
    }
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
      catch (e) {
        console.log('qudini description properties error', e)
        return {description, properties: false}
      }
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
          const eventDate = DateTime.fromISO(event.startISO).setZone('utc')
          const isToday = eventDate.diffNow('day').toObject().days <= 0
          event.luxonDate = eventDate
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
