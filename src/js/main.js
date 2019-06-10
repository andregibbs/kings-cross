/* Components */
// import fetchData from './components/fetchData'

$( document ).ready( function() {

	// =================================================
	// Global vars
	// =================================================

	const seriesID = 'W3DMW9HUAYM' // Used for prod
	const liveSeriesID = 'EAKJZBQWQAH' // Used for QA events
	const apiUrl = 'https://bookings.qudini.com/booking-widget/event/events/'
	const isoCurrentDate = new Date();

	const standardTopic = "Standard Event"
	const reoccurringTopic = "Re-occurring event"
	const wowTopic = "WOW Event"
	const wowEventsToShow = 3
	const filteredPerPage = 9

	let events = []
	let wowEvents = []
	let todayEvents = []
	let futureEvents = []
	let weekEvents = []
	let monthEvents = []
	let todayPromotedEvents = []
	let weekPromotedEvents = []
	let monthPromotedEvents = []

	let now = new Date()
	let today = null
	let todayDDMMYYYY = null
	let weekStart = null
	let weekStartDDMMYYYY = null
	let weekEnd = null
	let weekEndDDMMYYYY = null
	let monthStart = null
	let monthStartDDMMYYYY = null
	let monthEnd = null
	let monthEndDDMMYYYY = null

	// =================================================
	// Scripts to fetch the data
	// =================================================

	sortDates()

	function getDDMMYYYY( d ) {
		// 23/02/2019
		var year = d.getFullYear(),
			month = d.getMonth() + 1, // months are zero indexed
			day = d.getDate();

		month = month < 10 ? "0" + month : month
		day = day < 10 ? "0" + day : day

		var str = day +
			"/" + month +
			"/" + year;

		return str;
	}

	function sortDates() {
		today = new Date( now.getFullYear(), now.getMonth(), now.getDate())
		todayDDMMYYYY = getDDMMYYYY(today)

		weekStart = new Date( today.getFullYear(), today.getMonth(), today.getDate() )
		weekEnd = new Date( weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
		weekEnd.setDate( weekEnd.getDate() + (7 - 1))
		weekStartDDMMYYYY = getDDMMYYYY(weekStart)
		weekEndDDMMYYYY = getDDMMYYYY(weekEnd)

		monthStart = new Date( today.getFullYear(), today.getMonth(), today.getDate() )
		monthEnd = new Date( monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate() )

		monthEnd.setDate( monthEnd.getDate() + (30 - 1))
		monthStartDDMMYYYY = getDDMMYYYY(monthStart)
		monthEndDDMMYYYY = getDDMMYYYY(monthEnd)
	}

	function sortEventExtra ( event) {
		if (event.description) {
			var bits = event.description.split("||");
			event.description = bits[0];
			if (bits.length > 1) {
				event.extra = JSON.parse(bits[1]);
			}
			else {
				event.extra = {};
			}
		}
	}

	function fetchData() {
		$.get( apiUrl + seriesID, {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success( function( data ) {

			for (var i = 0; i < data.length; i++) {
				// MERGE JSON DATA HELD WITHIN description INTO FEED as 'extra' property !!!!!
				var event = data[i];
				sortEventExtra(event);
			}

			// store the 'converted' data as events in main
			events = data;

			for ( var i = 0; i < events.length; i++ ) {
				var event = events[i];

				if ( event.topic.title.toLowerCase() == wowTopic.toLowerCase()) {
					if ( wowEvents.length < wowEventsToShow ) {
						wowEvents.push(event);
					}
				}

				var eventStartDate = new Date(event.startDate);

				// check if expired
				event.expired = event.startISO < isoCurrentDate.toISOString();

				// today
				if ( eventStartDate.getTime() === today.getTime()) {
					todayEvents.push(event);

					if ( event.extra && event.extra.promoted ) {
						todayPromotedEvents.push(event);
					}
				}

				// future
				if ( eventStartDate.getTime() > today.getTime()) {
					futureEvents.push(event);
				}

				// this week
				if ( eventStartDate.getTime() >= weekStart.getTime() && eventStartDate.getTime() <= weekEnd.getTime()) {
					weekEvents.push(event);

					if (event.extra && event.extra.promoted) {
						weekPromotedEvents.push(event);
					}
				}

				// this month
				if ( eventStartDate.getTime() >= monthStart.getTime() && eventStartDate.getTime() <= monthEnd.getTime()) {
					monthEvents.push(event);
					if (event.extra && event.extra.promoted) {
						monthPromotedEvents.push(event);
					}
				}

			}
		})

		console.log( 'evetns - wowEvents', wowEvents )
		console.log( 'evetns - todayEvents', todayEvents )
		console.log( 'evetns - futureEvents', futureEvents )
		console.log( 'evetns - weekEvents', weekEvents )
		console.log( 'evetns - monthEvents', monthEvents )
		console.log( 'evetns - todayPromotedEvents', todayPromotedEvents )
		console.log( 'evetns - weekPromotedEvents', weekPromotedEvents )
		console.log( 'evetns - monthPromotedEvents', monthPromotedEvents )
	}

	// =================================================
	// Loads scripts dynamically
	// =================================================

	switch ( window.location.pathname ) {
		case '/uk/kings-cross/':
			fetchData()
            break;

		case "/uk/kings-cross/xxx":
            // Your init here
            break;

		case "/uk/kings-cross/yyy":
            // Work.init();
			break;

        case "/uk/kings-cross/iii":
            // Legal.init();
            break;
		default: {
			// article
			// if( window.location.pathname.indexOf("/blog/") > -1 ) {
			// 	Blog.init();
			// }
		}
	}

})
