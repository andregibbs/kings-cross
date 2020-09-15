/* polyfills */
import 'whatwg-fetch';
require('es6-promise/auto');

/* JQuery */
// import jquery scoped to project
const $ = require('jquery')

import 'slick-carousel'
import 'lity'

// loading via html tags caused the slick initialization to vanish
// multiple jquery versions loaded
// use $j to avoid external conflicts\
window.$j = $

/* Components */
import nav from "./components/nav";
import sidedrawer from "./components/sidedrawer";
import whatson from "./components/whatson";
import singleEvent from "./components/singleEvent";
// import places from "./components/places";
import FindKX from './components/findKX';
import whatIsKx from "./components/whatIsKx";
import repair from "./components/repair";
import calendar from "./components/calendar";
import slider from "./components/slider";
import bookingRefFetcher from "./components/bookingRefFetcher";
import discover from "./components/discover";
import support from "./components/support";
// import gaming from "./components/gaming";
import experience from "./components/experience";
import lottieAnim from "./components/lottieAnim";
import loadingScreen from "./components/loadingScreen";
import getParam from "./components/getParam";
import school from "./components/school";
import homeKV from './components/homeKV';
import HOISearch from './components/common/hoiSearch';
import KXNav from './components/common/kxNav'

import loadingScreenAnimation from "../data/loadingScreen.json";
import create from "../data/Create.json";
import colab from "../data/Colab.json";
import coms from "../data/Coms.json";
import critical from "../data/Crit_think.json";
import doLogFunction from "./dev/doLog";
var doLog = doLogFunction();

import fetchData from './util/Events';

//experimental
// import smoothScroll from './librarys/smoothscroll';


$j(document).ready(function () {


	//Handlebars front end helpers
	Handlebars.registerHelper('dash', function (str) {
		return str.split(" ").join("-");
	});
	Handlebars.registerHelper('capitalize', function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});

	// =========================================================
	// Sticky nav
	// =========================================================

	// nav(); //old nav
  new FindKX(); // init find KX
  new KXNav() // new
  HOISearch(); // init search

	// =========================================================
	// Loads scripts dynamically depending on which page you are
	// =========================================================

  const location = getParam('pn') || window.location.pathname

	switch (location) {
		case '/uk/explore/kings-cross/':
    case '/uk/explore/kings-cross/hoi/':
    case '/uk/explore/kings-cross-test/':

			fetchData(whatIsKx);
			// places();
      homeKV();

			var container = document.getElementById('loadingScreen__animation');
			loadingScreen(container, loadingScreenAnimation, () => {
        // loading screen done
      }, false)
			break;

		case "/uk/explore/kings-cross/discover/":
			//places();
			discover();
			function showImages(el) {
				var windowHeight = $j( window ).height();

				$j(el).each(function(){
					var thisPos = $j(this).offset().top;

					var topOfWindow = $j(window).scrollTop();
					if (topOfWindow + windowHeight - 200 > thisPos ) {
						$j(this).addClass("fadeIn");
					}
				});
			}

			// if the image in the window of browser when the page is loaded, show that image
			$j(document).ready(function(){
					showImages('.star');
			});

			// if the image in the window of browser when scrolling the page, show that image
			$j(window).scroll(function() {
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
					var windowHeight = $j( window ).height();

					$j(el).each(function(){
						var thisPos = $j(this).offset().top;

						var topOfWindow = $j(window).scrollTop();
						if (topOfWindow + windowHeight - 200 > thisPos ) {
							$j(this).addClass("fadeIn");
						}
					});
				}
				function showVidSvg(el) {
					var windowHeight = $j( window ).height();

					$j(el).each(function(){
						var thisPos = $j(this).offset().top;

						var topOfWindow = $j(window).scrollTop();
						if (topOfWindow + windowHeight - 200 > thisPos ) {
							$j(this).addClass("fadevid");
						}
					});
				}

				// if the image in the window of browser when the page is loaded, show that image
				$j(document).ready(function(){
						showImages('.star');
						showVidSvg('.vidstar');
						const week = getParam('week')
						const navBarHeight = $j('section>.nav').innerHeight()
						switch(week){
							case "one":
								setTimeout(function(){$j('html, body').animate({
									scrollTop: $j("#weekOne").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "two":
								setTimeout(function(){$j('html, body').animate({
									scrollTop: $j("#weekTwo").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "three":
								setTimeout(function(){$j('html, body').animate({
									scrollTop: $j("#weekThree").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							case "four":
								setTimeout(function(){$j('html, body').animate({
									scrollTop: $j("#weekFour").offset().top-parseInt(navBarHeight)
								}, 500); }, 2000);
								break;
							default:
								break;
						}
						// if(window.location.href.indexOf("?week=one") > -1) {

						// 	// setTimeout(function(){$j('html, body').animate({
						// 	// 	scrollTop: $j("#scrollto").offset().top-10
						// 	// }, 1000); }, 2000);

						//  }

				});

				// if the image in the window of browser when scrolling the page, show that image
				$j(window).scroll(function() {
						showImages('.star');
						showVidSvg('.vidstar');
				});

			break;

		case "/uk/explore/kings-cross/not-a-school/sign-up/":
			//places();
			break;

    // case "/uk/explore/kings-cross/next-level-gaming/":
    //   fetchData(function (allEvents) {
    //     calendar("https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/62764/0", "appointment", allEvents);
    //   });
    //   gaming();
    //   break;

		default:
			// Your init here

	}

})
