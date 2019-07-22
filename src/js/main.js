/* Components */
import nav from './components/nav'
import whatson from './components/whatson'
import singleEvent from './components/singleEvent'
import whatIsKx from './components/whatIsKx'
import repair from './components/repair'
import calendar from './components/calendar'
import slider from './components/slider'
import bookingRefFetcher from './components/bookingRefFetcher'
import discover from './components/discover'
import support from './components/support'
import experience from './components/experience'

//experimental
// import smoothScroll from './librarys/smoothscroll';


$(document).ready(function () {

	// This will clear all unnecessary Samsung logs
	console.clear()

	//scroll past Navbar


	setTimeout(function () {
	window.scrollTo($('.cheil-static').offset().top, 0);
},500);

	// =================================================
	// Global vars
	// =================================================

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
	let topics = []

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

	function getDDMMYYYY(d) {
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

	  // kxConfig holds passion details from json file - events only hold the passion code but we need to show the name, so convert here
	function getPassionColor(code) {
		var name = '';
		for (var i = 0; i < kxConfig.passions.length; i++) {
			
			if (kxConfig.passions[i].code == code) {

				name = kxConfig.passions[i].color;
				
			}
		}
		return name;
	};
	// kxConfig holds suitable details from json file - events only hold the suitable code but we need to show the name, so convert here
	 function getSuitableName(code) {
		var name = '';
		var newEventTypes = [];
		code.forEach(type => {
			for (var i = 0; i < kxConfig.suitables.length; i++) {
			
				if (kxConfig.suitables[i].code == type) {
					name = kxConfig.suitables[i].name;
					newEventTypes.push(name)
					
				}
			}
		})
		
		return newEventTypes;
	};

	function sortDates() {
		today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		todayDDMMYYYY = getDDMMYYYY(today)

		weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
		weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
		weekEnd.setDate(weekEnd.getDate() + (7 - 1))
		weekStartDDMMYYYY = getDDMMYYYY(weekStart)
		weekEndDDMMYYYY = getDDMMYYYY(weekEnd)

		monthStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
		monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate())

		monthEnd.setDate(monthEnd.getDate() + (30 - 1))
		monthStartDDMMYYYY = getDDMMYYYY(monthStart)
		monthEndDDMMYYYY = getDDMMYYYY(monthEnd)
	}

	function sortEventExtra(event) {
		if (event.description) {
			var bits = event.description.split("||");

			console.log( 'bits', bits )

			

			event.description = bits[0];
			if (bits.length > 1) {
				event.extra = JSON.parse(bits[1]);
				event.extra['passionColor'] = getPassionColor(event.extra.passions[0]);
				event.extra['eventtypeName'] = getSuitableName(event.extra.eventtype);
			}
			
			else {
				event.extra = {};
			}
		}
	}

	function fetchData(callback) {
		$.get(apiUrl + kxConfig.seriesId, {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success(function (data) {

			for (var i = 0; i < data.length; i++) {
				// MERGE JSON DATA HELD WITHIN description INTO FEED as 'extra' property !!!!!
				var event = data[i];
				sortEventExtra(event);
				console.log(event)
			}

			// store the 'converted' data as events in main
			events = data;

			//get all the topic ids

			events.forEach(event => {
				if (topics.includes(event.topic.id)) {

				} else {
					topics.push(event.topic.id);
				}
				
			});

			for (var i = 0; i < events.length; i++) {
				var event = events[i];

				

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
		}).complete(function () {

			// Logs all events
			console.log( 'events', events )
			console.log( 'topics', topics )
			console.log( 'events - wowEvents', wowEvents )
			console.log( 'events - todayEvents', todayEvents )
			console.log( 'events - futureEvents', futureEvents )
			console.log( 'events - weekEvents', weekEvents )
			console.log( 'events - monthEvents', monthEvents )
			console.log( 'events - todayPromotedEvents', todayPromotedEvents )
			console.log( 'events - weekPromotedEvents', weekPromotedEvents )
			console.log( 'events - monthPromotedEvents', monthPromotedEvents )

			// Callback function when all events are fetched
			callback(events)
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

		slider(wowEvents, '.slider1', sliderConfig1, 'homeKv')
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

		slider(dd, '.upComing', sliderConfig2, 'upComing')
	}

	// =========================================================
	// Sticky nav
	// =========================================================

	nav()

	// =========================================================
	// Loads scripts dynamically depending on which page you are
	// =========================================================

	switch (window.location.pathname) {
		case '/uk/explore/kings-cross/':
			fetchData(whatIsKx)
			whatIsKx()
			break;

		case "/uk/explore/kings-cross/discover/":
			discover();
            break;

		case "/uk/explore/kings-cross/whats-on/":
			fetchData(whatson)
			break;

		case "/uk/explore/kings-cross/whats-on/event/":
			fetchData(singleEvent)
			break;

		case "/uk/explore/kings-cross/support/":
			fetchData(function(allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/62764/0", "appointment", allEvents);
			});
			//Support goes last!
			support();
			// smoothScroll();
			break;

		case "/uk/explore/kings-cross/support/repair/":
			fetchData(function(allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0", "appointment", allEvents);
			})
			break;

		case "/uk/explore/kings-cross/support/one-to-one/":
			fetchData(function(allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0", "appointment", allEvents);
			})
			break;

		case "/uk/explore/kings-cross/bookings/":
			bookingRefFetcher()
			break;

		case "/uk/explore/kings-cross/experience/":
			experience();
            break;

		default: {
			// Your init here
		}
	}

})
