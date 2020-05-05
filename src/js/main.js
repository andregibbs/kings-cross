/* Components */
import nav from "./components/nav";
import sidedrawer from "./components/sidedrawer";
import whatson from "./components/whatson";
import singleEvent from "./components/singleEvent";
import places from "./components/places";
import whatIsKx from "./components/whatIsKx";
import repair from "./components/repair";
import calendar from "./components/calendar";
import slider from "./components/slider";
import bookingRefFetcher from "./components/bookingRefFetcher";
import discover from "./components/discover";
import support from "./components/support";
import experience from "./components/experience";
import lottieAnim from "./components/lottieAnim";
import loadingScreen from "./components/loadingScreen";
import getParam from "./components/getParam";
import school from "./components/school";
import homeKV from './components/homeKV';

import loadingScreenAnimation from "../data/loadingScreen.json";
import create from "../data/Create.json";
import colab from "../data/Colab.json";
import coms from "../data/Coms.json";
import critical from "../data/Crit_think.json";
import doLogFunction from "./dev/doLog";
var doLog = doLogFunction();

//experimental
// import smoothScroll from './librarys/smoothscroll';

$(document).ready(function () {

	// This will clear all unnecessary Samsung logs


	// console.clear();

	//scroll past Navbar
	// $('.accordian').on('click', (e)=>{
	// 	console.log('clickeroonie')
	// 	$('.accordianContent').toggleClass('active')
	// 	$('.accordianIcon').hasClass('accordianIcon__expand') ? $(".accordianIcon").removeClass('accordianIcon__expand').addClass('accordianIcon__collapse') : $(".accordianIcon").removeClass('accordianIcon__collapse').addClass('accordianIcon__expand')
	// 	$('.accordian').hasClass('accordian__expanded') ? $(".accordian").removeClass('accordian__expanded').addClass('accordian__collapsed') : $(".accordian").removeClass('accordian__collapsed').addClass('accordian__expanded')
	// })
	if (window.jQuery) {
       // Open a URL in a lightbox
// var lightbox = lity('#video-intro');

// // Bind as an event handler
// $(document).on('click', '[data-lightbox]', lightbox);
    } else {
        // jQuery is not loaded
       console.log("Doesn't Work");
    }
	// =================================================
	// Global vars
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

	//Handlebars front end helpers
	Handlebars.registerHelper('dash', function (str) {
		return str.split(" ").join("-");
	});
	Handlebars.registerHelper('capitalize', function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});

	// =================================================
	// Scripts to fetch the data
	// =================================================

	sortDates();

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

	function fetchData(callback) {

		$.get(apiUrl + kxConfig.seriesId, {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success(function (data) {

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
		}).complete(function () {

			// Logs all events
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

			// Callback function when all events are fetched
			callback(events);
		});

	}

	function testSlider() {
		testSlider1();
		testSlider2();
	}

	function testSlider1() {

		const sliderConfig1 = {
			lazyLoad: 'ondemand',
			dots: false,
			infinite: false,
			speed: 500,
			fade: false,
			cssEase: 'linear'
		};

		slider(wowEvents, '.slider1', sliderConfig1, 'homeKv');
	}

	function testSlider2() {

		const dd = {
			todayEvents,
			monthPromotedEvents
		};

		const sliderConfig2 = {
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			infinite: true,
			speed: 500,
			fade: false,
			cssEase: 'linear',
		};

		slider(dd, '.upComing', sliderConfig2, 'upComing');
	}

	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return JSON.parse(str);
	}

	// =========================================================
	// Sticky nav
	// =========================================================

	nav();

  // =========================================================
	// Sidedraw nav
	// =========================================================

  sidedrawer();

	// =========================================================
	// Loads scripts dynamically depending on which page you are
	// =========================================================

	switch (window.location.pathname) {
		case '/uk/explore/kings-cross/':
    case '/uk/explore/kings-cross/hoi/':

			fetchData(whatIsKx);
			places();
      homeKV();

			var container = document.getElementById('loadingScreen__animation');
			loadingScreen(container, loadingScreenAnimation, () => {

        // initialise home page KV


      }, true)
			break;

		case "/uk/explore/kings-cross/discover/":
			//places();
			discover();
			function showImages(el) {
				var windowHeight = jQuery( window ).height();

				$(el).each(function(){
					var thisPos = $(this).offset().top;

					var topOfWindow = $(window).scrollTop();
					if (topOfWindow + windowHeight - 200 > thisPos ) {
						$(this).addClass("fadeIn");
					}
				});
			}

			// if the image in the window of browser when the page is loaded, show that image
			$(document).ready(function(){
					showImages('.star');
			});

			// if the image in the window of browser when scrolling the page, show that image
			$(window).scroll(function() {
					showImages('.star');
			});
			// //places();
			break;

		case "/uk/explore/kings-cross/whats-on/":
			fetchData(whatson);
			//places();
			break;

		case "/uk/explore/kings-cross/whats-on/event/":
			fetchData(singleEvent);
			//places();
			break;

		case "/uk/explore/kings-cross/support/":
			fetchData(function (allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/62764/0", "appointment", allEvents);
			});
			//Support goes last!
			support();
			//places();
			// smoothScroll();
			break;

		case "/uk/explore/kings-cross/support/repair/":
			fetchData(function (allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0", "appointment", allEvents);
			});
			break;

		case "/uk/explore/kings-cross/support/one-to-one/":
			fetchData(function (allEvents) {
				calendar("https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0", "appointment", allEvents);
			});
			break;

		case "/uk/explore/kings-cross/bookings/":
			fetchData(function (allEvents) {
				bookingRefFetcher(allEvents);
			});
			//places();
			break;

		case "/uk/explore/kings-cross/experience/":
			experience();
			//places();
			break;

		case "/uk/explore/kings-cross/not-a-school/":
				school()
				lottieAnim('colab', colab);
				lottieAnim('coms', coms);
				lottieAnim('crit', critical);
				lottieAnim('create', create);
				//places();

				function showImages(el) {
					var windowHeight = jQuery( window ).height();

					$(el).each(function(){
						var thisPos = $(this).offset().top;

						var topOfWindow = $(window).scrollTop();
						if (topOfWindow + windowHeight - 200 > thisPos ) {
							$(this).addClass("fadeIn");
						}
					});
				}
				function showVidSvg(el) {
					var windowHeight = jQuery( window ).height();

					$(el).each(function(){
						var thisPos = $(this).offset().top;

						var topOfWindow = $(window).scrollTop();
						if (topOfWindow + windowHeight - 200 > thisPos ) {
							$(this).addClass("fadevid");
						}
					});
				}

				// if the image in the window of browser when the page is loaded, show that image
				$(document).ready(function(){
						showImages('.star');
						showVidSvg('.vidstar');
						const week = getParam('week')
						const navBarHeight = $('section>.nav').innerHeight()
						switch(week){
							case "one":
								setTimeout(function(){$('html, body').animate({
									scrollTop: $("#weekOne").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "two":
								setTimeout(function(){$('html, body').animate({
									scrollTop: $("#weekTwo").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "three":
								setTimeout(function(){$('html, body').animate({
									scrollTop: $("#weekThree").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "four":
								setTimeout(function(){$('html, body').animate({
									scrollTop: $("#weekFour").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							default:
								break;
						}
						// if(window.location.href.indexOf("?week=one") > -1) {

						// 	// setTimeout(function(){$('html, body').animate({
						// 	// 	scrollTop: $("#scrollto").offset().top-10
						// 	// }, 1000); }, 2000);

						//  }

				});

				// if the image in the window of browser when scrolling the page, show that image
				$(window).scroll(function() {
						showImages('.star');
						showVidSvg('.vidstar');
				});

			break;

		case "/uk/explore/kings-cross/not-a-school/sign-up/":
			//places();
			break;

		default: {
			// Your init here
		}
	}

})
