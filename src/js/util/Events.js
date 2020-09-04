import doLogFunction from "../dev/doLog";
var doLog = doLogFunction();

export default function fetchData(callback) {

  // =================================================
  // Events vars
  // =================================================

  const apiUrl = 'https://bookings.qudini.com/booking-widget/event/events/';
  const isoCurrentDate = new Date();

  const standardTopic = "Standard Event";
  const reoccurringTopic = "Re-occurring event";
  const wowTopic = "WOW Event";
  const wowEventsToShow = 3;
  const filteredPerPage = 9;
  let events = [];
  let wowEvents = [];
  let todayEvents = [];
  let futureEvents = [];
  let weekEvents = [];
  let monthEvents = [];
  let todayPromotedEvents = [];
  let weekPromotedEvents = [];
  let monthPromotedEvents = [];
  let topics = [];

  let now = new Date();
  let today = null;
  let todayDDMMYYYY = null;
  let weekStart = null;
  let weekStartDDMMYYYY = null;
  let weekEnd = null;
  let weekEndDDMMYYYY = null;
  let monthStart = null;
  let monthStartDDMMYYYY = null;
  let monthEnd = null;
  let monthEndDDMMYYYY = null;

  // initial sortDates call
  sortDates()

  // =================================================
	// Scripts to fetch the data
	// =================================================

  // Generate jquery get
  function getSeriesData(seriesId, cb, data) {
    return $j.get(apiUrl + seriesId, {
      'timezone': "Europe/London",
      'isoCurrentDate': isoCurrentDate.toISOString()
    })
  }

  // using $j.when to make multiple api calls and then combining the event data
  $j.when(getSeriesData(kxConfig.seriesId), getSeriesData(kxConfig.seriesId_Webinars))
    .then((seriesData, webinarsData) => {
      // each response is an array of the ajax success function values [data, status, xhr]
      // using [0] key to concat data
      let data = seriesData[0].concat(webinarsData[0]);
      // var data = fakeEvents;
      doLog("All events:", data);
      for (var i = 0; i < data.length; i++) {
        // MERGE JSON DATA HELD WITHIN description INTO FEED as 'extra' property !!!!!
        var event = data[i];
        sortEventExtra(event);
        doLog(event);
      }

      // store the 'converted' data as events in main and filter out events with no extra info
      doLog(data.filter(event => !event.extra));
      events = data.filter(event => event.extra);

      // filter private events
      // events = events.filter((event) => {
      //   return !event.extra.private
      // })

      // console.warn('KX logs: We are not showing these events due to and error in the description', data.filter(event => !(event.extra)))
      doLog(events)

      //get all the topic ids
      events.forEach(event => {
        console.log(topics)
        if (topics.includes(event.topic.id)) {

        } else {
          topics.push(event.topic.id);
        }

      });

      for (var j = 0; j < events.length; j++) {
        var event = events[j];
        if (event.topic.title.toLowerCase() == wowTopic.toLowerCase()) {
          if (wowEvents.length < wowEventsToShow) {
            wowEvents.push(event);
          }
        }
        var eventStartDate = new Date(event.startDate);
        // check if expired
        event.expired = event.startISO < isoCurrentDate.toISOString();
        // today
        if (eventStartDate.getTime() === today.getTime()) {
          todayEvents.push(event);

          if (event.extra && event.extra.promoted) {
            todayPromotedEvents.push(event);
          }
        }

        // future
        if (eventStartDate.getTime() > today.getTime()) {
          futureEvents.push(event);
        }

        // this week
        if (eventStartDate.getTime() >= weekStart.getTime() && eventStartDate.getTime() <= weekEnd.getTime()) {
          weekEvents.push(event);

          if (event.extra && event.extra.promoted) {
            weekPromotedEvents.push(event);
          }
        }

        // this month
        if (eventStartDate.getTime() >= monthStart.getTime() && eventStartDate.getTime() <= monthEnd.getTime()) {
          monthEvents.push(event);
          if (event.extra && event.extra.promoted) {
            monthPromotedEvents.push(event);
          }
        }

      }

      // all transforms done
      doLog('events', events);
      doLog('topics', topics);
      doLog('events - wowEvents', wowEvents);
      doLog('events - todayEvents', todayEvents);
      doLog('events - futureEvents', futureEvents);
      doLog('events - weekEvents', weekEvents);
      doLog('events - monthEvents', monthEvents);
      doLog('events - todayPromotedEvents', todayPromotedEvents);
      doLog('events - weekPromotedEvents', weekPromotedEvents);
      doLog('events - monthPromotedEvents', monthPromotedEvents);

      // cb
      callback(events);

  })

  // =================================================
  // ADDITIONAL FUNCTION
  // =================================================

  function sortDates() {
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    todayDDMMYYYY = getDDMMYYYY(today);

    weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
    weekEnd.setDate(weekEnd.getDate() + (7 - 1));
    weekStartDDMMYYYY = getDDMMYYYY(weekStart);
    weekEndDDMMYYYY = getDDMMYYYY(weekEnd);

    monthStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());

    monthEnd.setDate(monthEnd.getDate() + (30 - 1));
    monthStartDDMMYYYY = getDDMMYYYY(monthStart);
    monthEndDDMMYYYY = getDDMMYYYY(monthEnd);
  }

  // Format Date
  function getDDMMYYYY(d) {
		// 23/02/2019
		var year = d.getFullYear(),
			month = d.getMonth() + 1, // months are zero indexed
			day = d.getDate();

		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;

		var str = day +
			"/" + month +
			"/" + year;

		return str;
	}


  // kxConfig holds suitable details from json file - events only hold the suitable code but we need to show the name, so convert here
  function getSuitableName(code) {
    var name = '';
    var newEventTypes = [];
    code.forEach(type => {
      for (var i = 0; i < kxConfig.suitables.length; i++) {

        if (kxConfig.suitables[i].code == type) {
          name = kxConfig.suitables[i].name;
          newEventTypes.push(name);

        }
      }
    });

    return newEventTypes;
  };

  // kxConfig holds passion details from json file - events only hold the passion code but we need to show the name, so convert here
  function getPassionColor(code) {
    var name = '';
    for (var i = 0; i < kxConfig.passions.length; i++) {

      if (kxConfig.passions[i].code == code) {

        name = kxConfig.passions[i].color;

      }
    }
    return name;
  }

  function sortEventExtra(event) {
    if (event.description) {
      var bits = event.description.split("||");

      event.description = bits[0];

      if (bits.length > 1) {
        event.extra = {};
        bits[1] = bits[1].replace(/"/gi, '"').replace(/"/gi, '"');
        // check if string is valid json
        if (IsJsonString(bits[1])) {
          event.extra = IsJsonString(bits[1]);
          event.extra['passionColor'] = getPassionColor(event.extra.passions[0]);
          event.extra['eventtypeName'] = getSuitableName(event.extra.eventtype);
        } else {
          doLog("Rejected", bits[1]);
          event.extra = false;
        }
      }

      else {
        event.extra = {};
      }
    }
  }

}



function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return JSON.parse(str);
}

export const FetchEvents = fetchData
