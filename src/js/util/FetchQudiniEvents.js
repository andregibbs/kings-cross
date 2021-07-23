import KXEnv from './KXEnv'
import { DateTime } from 'luxon'

/*

  FetchQudiniEvents

  fetches, processes & returns array of qudini results from multiple series

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

const QUDINI_EVENTS_ENDPOINT = 'https://bookings.qudini.com/booking-widget/event/events/';

export function FetchQudiniEvents(seriesConfigArray = FetchQudiniEvents.ALL_SERIES, filterPrivate = true){
  // create fetch url
  function makeFetchUrl({seriesID, isoCurrentDate}) {
    return `${QUDINI_EVENTS_ENDPOINT}${seriesID}?timezone=Europe/London&isoCurrentDate=${isoCurrentDate}`
  }
  // extract description data
  function extractDescriptionData(descriptionString, identifier) {
    if (!descriptionString) {
      return {description: '', properties: {}}
    }
    const split = descriptionString.split("||")
    const description = split[0] || false
    const properties = split[1]
    // if no additional data in description
    if (!properties) return {description}
    // try catch parsing data as json
    try { JSON.parse(properties) }
    catch (e) {
      console.log('qudini description properties error: event ID '+identifier, e)
      return {description, properties: {}}
    }
    // return json
    return {description, properties: JSON.parse(properties)}
  }
  // promise setup
  return Promise.all(
    seriesConfigArray.map((series) => {
      return fetch(makeFetchUrl({
        seriesID: KXEnv.live ? series.live_id : series.test_id,
        isoCurrentDate: new Date().toISOString()
      }))
      .then(r => r.json())
    })
  )
  .then(seriesData => {
    // map returned api data array for each series
    const transformedSeriesData = seriesData.map((seriesEvents, index) => {
      const seriesType = seriesConfigArray[index].name
      // console.log({seriesEvents, seriesType})
      // map the series events
      return seriesEvents.map(event => {
        // make transforms to event object
        // event type
        event.type = seriesType
        // description and extra properties
        const {description, properties} = extractDescriptionData(event.description, event.identifier)
        event.description = description
        event.properties = properties
        event.color = (event.properties.categories && event.properties.categories.length > 0) ? FetchQudiniEvents.CATEGORY_COLORS[event.properties.categories[0]] : FetchQudiniEvents.CATEGORY_COLORS.default
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
    return filterPrivate ? filteredEventData : flattenedEventData
  })
  .catch(console.log)
}

FetchQudiniEvents.CATEGORY_COLORS = {
  default: '#E14D9A',
  innovation: '#00C3B2',
  entertainment: '#0077C8',
  creativity: '#FF4337',
  lifestyle: '#FFB546'
}

FetchQudiniEvents.LIVE_SERIES = {
  name: "live",
  live_id: "U3OWDF3I0JF",
  test_id: "W3DMW9HUAYM"
}

// formerly webinars
FetchQudiniEvents.VIRTUAL_SERIES = {
  name: "virtual",
  live_id: "JQXAE5L8AWF",
  test_id: "CMPWXUYK8II"
}

FetchQudiniEvents.SOLVE_FOR_TOMORROW_SERIES = {
  name: "virtual",
  live_id: "G652T9ZFBR8",
  test_id: "RCCRPTGL9DO"
}

FetchQudiniEvents.ALL_SERIES = [
  FetchQudiniEvents.LIVE_SERIES,
  FetchQudiniEvents.VIRTUAL_SERIES,
  FetchQudiniEvents.SOLVE_FOR_TOMORROW_SERIES
]

export default FetchQudiniEvents
