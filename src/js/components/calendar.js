import getUrlVars from './getUrlVars';
import handleTemplate from './handleTemplate';
import customevent from '../polyfill/customevent-polyfill';
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function calendar(URL, type, allEvents) {

	customevent();

	var unlock = new CustomEvent("unlock");
	var lock = new CustomEvent("lock");

	var viewport = "";
	var calendarRestart = null;

	var URL = URL || "";

	var appointmentStartTime = "";


	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const shortDays = days.map((a) => a.slice(0, 3))
	const shortMonths = months.map((a) => a.slice(0, 3))

	doLog("???");

	document.getElementById("calendar").addEventListener("changeURL", function (e) {
		URL = e.detail.url;

		doLog("got activated");

		// try {
		// 	type = type.toLowerCase();
		// }
		// catch (err) {
		// 	console.error("2nd parameter of calendar() should be a string.");
		// }

		// switch (type) {
		// 	case "appointment":
		getAppointmentDates(selectedDate);
		appointmentStartTime = "";
		// 		break;
		// 	case "event":
		// 		getEventDates();
		// 		break;
		// 	case "debug":
		// 		console.warn("Debug");
		// 		getEventDates();
		// 		appointmentStartTime = "";
		// 		getAppointmentDates(selectedDate);
		// 	default:
		// 		console.info("!!!");
		// 		console.error('Calendar function used incorrectly. Expected "appointment" or "event", received', type);
		// 		break;
		// }
	});

	document.getElementById("calendar").setAttribute("ready", "true");

	var selectedDate = new Date();
	var currentDate = new Date();



	handleDateArrows();
	// getEventDates();


	function getAppointmentDates(date) {
		var loadingScreen = document.getElementById("load-screen");
		const appointmentURL = URL + "?startDate=";

		const dateString = date.getFullYear() + "-" + (String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1)) + "-" + (String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate()))

		loadingScreen.style.display = "block";

		showHideLeftArrow(date);

		$j.get(
      appointmentURL + dateString,
      function (data) {
				doLog("Got data");
				populateWithAppointments(data);
				loadingScreen.style.display = "";
				handleScrollArrows();
				$j(".calendar__choices").each(function () {
					this.scrollTop = 0;
				});
			})
			.fail(function (err) {
				loadingScreen.style.display = "";
				// console.error(err);
				showCalendarError(err)
				//ADD A HEADS UP TO THE USER
			})
	}

	function showHideLeftArrow(date) {

		if (date <= currentDate) {
			document.getElementsByClassName("arrow left")[0].style.visibility = "hidden";
		} else {
			document.getElementsByClassName("arrow left")[0].style.visibility = "visible";
		}

	}

	function showCalendarError(error) {
		$j('.calendar__container').empty().append('Error Collecting Appointments')
	}

	function populateWithAppointments(data) {
		doLog("populating with data");
		//clear old data
		// while ($j(".calendar__container")[0].lastChild) {
		// 	$j(".calendar__container")[0].removeChild($j(".calendar__container")[0].lastChild);
		// }
		$j('.calendar__container').empty()
		doLog("Children cleared");


		//For every date
		for (var dateInd = 0; dateInd < 5; dateInd++) {
			if (!data[dateInd].unAvailable) {

				//Format date
				var date = new Date(data[dateInd].date);
				// var dateFormatted = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
				var dateFormatted = moment(date).format('dddd Do <br> MMMM');

				doLog("Formatted date", dateFormatted);

				//Append the date column
				$j(".calendar__container").append(handleTemplate("dateColumn", { "dateFormatted": dateFormatted, "index": dateInd, "date": moment(date).format('YYYY-MM-DD') }));

				//For every appointment in date
				for (var appointmentInd = 0; appointmentInd < data[dateInd].slots.length; appointmentInd++) {

					//Format time
					var slotTime = new Date(data[dateInd].slots[appointmentInd].start)
					var time = slotTime.getHours() + ":" + (String(slotTime.getMinutes()).length == 1 ? "0" + String(slotTime.getMinutes()) : String(slotTime.getMinutes()));

					//Append the slot with template
					$j(".calendar__choices").last().append(handleTemplate("slot", { "time": time, "available": true }));

					//Attach the slot time to slot's data tag
					var slot = $j(".calendar__choice").last()
					slot.data("startTime", data[dateInd].slots[appointmentInd].start);
					slot.data("queueId", data[dateInd].slots[appointmentInd].queueId);

					//Click handler
					slot.click(function () {
						$j(".calendar__choice").removeClass("calendar--selected");
						$j(".calendar__choice").children("p").text("Available");
						appointmentStartTime = $j(this).data("startTime");
						this.classList.add("calendar--selected");
						this.getElementsByTagName("p")[0].innerText = "Selected";
						doLog("selected", appointmentStartTime);
						$j("#next").data("slot", appointmentStartTime);
						$j("#next").data("queueId", $j(this).data("queueId"));
						document.getElementById("next").dispatchEvent(unlock);
					});

				}


			} else {
				var date = new Date(data[dateInd].date);

				// var dateFormatted = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

				var dateFormatted = moment(date).format('ddd Do MMMM');

				$j(".calendar__container").append(handleTemplate("dateColumn", { "dateFormatted": dateFormatted, "index": dateInd, "date": moment(date).format('YYYY-MM-DD') }));

				$j(".calendar__choices").last().append(handleTemplate("slot", { "time": "No slots", "available": false }));

				$j(".calendar__choice").last().addClass("calendar--unavailable");

			}
		}

		calendarRestart = true;
		handleResize();

	}

	function handleDateArrows() {
		var next = document.getElementById("next");
		document.getElementsByClassName("arrow right")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			document.getElementById("next").dispatchEvent(lock);


			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() + 5);
				getAppointmentDates(selectedDate);
			} else { //inefficient as calls are made when data is ready
				selectedDate.setDate(selectedDate.getDate() + 4);
				getAppointmentDates(selectedDate);
			}
		});
		document.getElementsByClassName("arrow left")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			document.getElementById("next").dispatchEvent(lock);

			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() - 5);
				getAppointmentDates(selectedDate);
			} else {
				selectedDate.setDate(selectedDate.getDate() - 4);
				getAppointmentDates(selectedDate);
			}
		});
	};

	function handleScrollArrows() {
		$j(".load").each(function (ind, elm) {
			//Click To Scroll Animations
			//They ensure that no matter how much and when you click, it will always snap to an element as long as the container is 350px
			$j(elm).click(function () {
				// var h = $j(elm).siblings().find(".calendar__choice").outerHeight(false) + parseFloat($j(".calendar__choice").css('marginTop'));
				var elementHeights = $j('.calendar__choice').map(function () {
					return $j(this).outerHeight(true);
				});
				var h = Math.max.apply(null, elementHeights);
				doLog(h);
				if (this.classList.contains("load--bot")) {
					if (this.previousElementSibling.scrollTop % h == 0) {
						$j(this.previousElementSibling).animate({
							scrollTop: '+=' + h
						}, 300);
					}
					else if (this.previousElementSibling.scrollTop % h > h / 2) {
						var scrollBy = 2 * h - (this.previousElementSibling.scrollTop % h);
						doLog(scrollBy);
						$j(this.previousElementSibling).animate({
							scrollTop: '+=' + scrollBy
						}, 300);
					}
					else {
						var scrollBy = h - this.previousElementSibling.scrollTop % h;
						doLog(scrollBy);
						$j(this.previousElementSibling).animate({
							scrollTop: '+=' + scrollBy
						}, 300);
					}

				} else {
					if (this.nextElementSibling.scrollTop % h == 0) {
						$j(this.nextElementSibling).animate({
							scrollTop: '-=' + h
						}, 300);
					}
					else if (this.nextElementSibling.scrollTop % h > h / 2) {
						var scrollBy = h + (this.nextElementSibling.scrollTop % h);
						doLog(scrollBy);
						$j(this.nextElementSibling).animate({
							scrollTop: '-=' + scrollBy
						}, 300);
					}
					else {
						var scrollBy = 2 * h + this.nextElementSibling.scrollTop % h;
						doLog(scrollBy);
						$j(this.nextElementSibling).animate({
							scrollTop: '-=' + scrollBy
						}, 300);
					}
				}
			})

		})
	}

	function getEventDates() {
		const eventId = getUrlVars()["i"];
		const isoCurrentDate = new Date();
		let matchingTopicEvents = [];


    // Rewritten in jquery2+ not sure if used.
    // $j.get({
    //   url: 'https://bookings.qudini.com/booking-widget/event/event/' + eventId + '',
    //   data: {
  	// 		'timezone': "Europe/London",
  	// 		'isoCurrentDate': isoCurrentDate.toISOString()
  	// 	},
    //   success: (event) => {
  	// 		doLog(event.topic.title);
  	// 		for (var eInd = 0; eInd < allEvents.length; eInd++) {
  	// 			if (allEvents[eInd].topic.title == event.topic.title) {
  	// 				matchingTopicEvents.push(allEvents[eInd]);
  	// 			}
  	// 		}
  	// 		doLog("µ", matchingTopicEvents); //presorted in ascending order
  	// 		populateWithEvents(matchingTopicEvents);
  	// 	}
    // })

		$j.get('https://bookings.qudini.com/booking-widget/event/event/' + eventId + '', {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success(function (event) {
			doLog(event.topic.title);
			for (var eInd = 0; eInd < allEvents.length; eInd++) {
				if (allEvents[eInd].topic.title == event.topic.title) {
					matchingTopicEvents.push(allEvents[eInd]);
				}
			}
			doLog("µ", matchingTopicEvents); //presorted in ascending order
			populateWithEvents(matchingTopicEvents);
		})
	}

	function populateWithEvents(data) {
		// while ($j(".calendar__container")[0].lastChild) {
		// 	$j(".calendar__container")[0].removeChild($j(".calendar__container")[0].lastChild);
		// }
		$j('.calendar__container').empty()

		// const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		//Dates depend on events being presorted
		var dates = [];

		data.forEach(function (event) {
			if (!dates.includes(event.startDate)) {
				dates.push(event.startDate);
			}
		})

		doLog("∞", dates);
		// var date = new Date(event.startDate);
		// var dateDisplayed = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
		// doLog(dateDisplayed);
		// dates.forEach((date) => {
		// 	//
		// })
	}

	function handleResize() {


		if (window.innerWidth <= 768 && (viewport != "mobile" || calendarRestart)) {
			doLog("Still mobile");
			$j("[date]").each(function (ind, elm) {
				var a = new Date(elm.getAttribute("date"));
				// elm.innerText = shortDays[a.getDay()] + " " + a.getDate() + " " + shortMonths[a.getMonth()];
				elm.innerText = moment(a).format('ddd Do MMMM');
			});
			viewport = "mobile";
			calendarRestart = false;
		} else if (window.innerWidth >= 768 && (viewport != "desktop" || calendarRestart)) {
			$j("[date]").each(function (ind, elm) {
				var a = new Date(elm.getAttribute("date"));
				// elm.innerText = days[a.getDay()] + " " + a.getDate() + " " + months[a.getMonth()] + " " + a.getFullYear();
				elm.innerText = moment(a).format('ddd Do MMMM');
			});
			viewport = "desktop";
			calendarRestart = false;
		}
	}


	handleResize();

	window.addEventListener('resize', function () {
		handleResize();
	})

}
