/* Components */
import whatson from './components/whatson'
import singleEvent from './components/singleEvent'
import whatIsKx from './components/whatIsKx'
import repair from './components/repair'
import oneToOne from './components/oneToOne'
import slider from './components/slider'

$( document ).ready( function() {

	// This will clear all unnecessary Samsung logs
	console.clear()

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

	function fetchData( callback ) {
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
		}).complete( function() {

			// Logs all events
			// console.log( 'evetns', events )
			// console.log( 'evetns - wowEvents', wowEvents )
			// console.log( 'evetns - todayEvents', todayEvents )
			// console.log( 'evetns - futureEvents', futureEvents )
			// console.log( 'evetns - weekEvents', weekEvents )
			// console.log( 'evetns - monthEvents', monthEvents )
			// console.log( 'evetns - todayPromotedEvents', todayPromotedEvents )
			// console.log( 'evetns - weekPromotedEvents', weekPromotedEvents )
			// console.log( 'evetns - monthPromotedEvents', monthPromotedEvents )

			// Callback function when all events are fetched
			callback( events )
		})

	}

	function testSlider() {
		testSlider1()
		testSlider2()
	}

	function testSlider1() {

		const sliderConfig1 = {
			lazyLoad: 'ondemand',
			dots: false,
			infinite: false,
			speed: 500,
			fade: false,
			cssEase: 'linear'
		}

		slider( wowEvents, '.slider1', sliderConfig1, 'homeKv' )
	}

	function testSlider2() {

		const dd = {
			todayEvents,
			monthPromotedEvents
		}

		const sliderConfig2 = {
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			infinite: true,
			speed: 500,
			fade: false,
			cssEase: 'linear',
		}

		slider( dd, '.upComing', sliderConfig2, 'upComing' )
	}


	// =========================================================
	// Loads scripts dynamically depending on which page you are
	// =========================================================

	switch ( window.location.pathname ) {
		case '/uk/kings-cross/':
			fetchData( testSlider )
			whatIsKx()
            break;

		case "/uk/kings-cross/discover/":
            // Your init here
            break;

		case "/uk/kings-cross/whats-on/":
			fetchData( whatson )
			break;

        case "/uk/kings-cross/whats-on/event/":
            singleEvent()
			break;

		case "/uk/kings-cross/support/repair/":
			repair()
			break;

		case "/uk/kings-cross/support/one-to-one/":
			oneToOne()
			break;
		default: {
			// Your init here
		}
	}

})
