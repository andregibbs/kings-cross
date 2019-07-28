import getUrlVars from './getUrlVars'
import handleTemplate from './handleTemplate'
import customevent from '../polyfill/customevent-polyfill'

export default function calendar(URL, type, allEvents) {

	customevent();

	//For appointments:
	//To get the proper appointmentsURL, go to Qudini admin panel, Venue information => details, and open the online booking widgets. Inside, use the browser network inspector to get the call which has the same structure to the one below:
	//https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0
	//For events:
	//https://bookings.qudini.com/booking-widget/event/event/ + eventID

	//type ∈ {"appointment", "event"}

	//The component relies on a button with id "next" to be around

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

	document.getElementById("calendar").addEventListener("changeURL", function (e) {
		URL = e.detail.url;

		try {
			type = type.toLowerCase();
		}
		catch (err) {
			console.error("2nd parameter of calendar() should be a string.");
		}

		switch (type) {
			case "appointment":
				getAppointmentDates(selectedDate);
				appointmentStartTime = "";
				break;
			case "event":
				getEventDates();
				break;
			case "debug":
				console.warn("Debug");
				getEventDates();
				appointmentStartTime = "";
				getAppointmentDates(selectedDate);
			default:
				console.info("!!!");
				console.error('Calendar function used incorrectly. Expected "appointment" or "event", received', type);
				break;
		}
	})

	var selectedDate = new Date();



	handleDateArrows();
	// getEventDates();


	function getAppointmentDates(date) {
		var loadingScreen = document.getElementById("load-screen");
		const appointmentURL = URL + "?startDate=";

		const dateString = date.getFullYear() + "-" + (String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1)) + "-" + (String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate()))

		loadingScreen.style.display = "block";

		$.get(appointmentURL + dateString)
			.success(function (data) {
				populateWithAppointments(data);
				loadingScreen.style.display = "";
				handleScrollArrows();
				$(".calendar__choices").each(function(){
					this.scrollTop = 0;
				});
			})
			.fail(function (err) {
				loadingScreen.style.display = "";
				//console.log(err);
				//ADD A HEADS UP TO THE USER
			})
	}

	function populateWithAppointments(data) {
		//clear old data
		while ($(".calendar__container")[0].lastChild) {
			$(".calendar__container")[0].removeChild($(".calendar__container")[0].lastChild);
		}



		//For every date
		for (var dateInd = 0; dateInd < 5; dateInd++) {
			if (!data[dateInd].unAvailable) {

				//Format date
				var date = new Date(data[dateInd].date);
				// var dateFormatted = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
				var dateFormatted = moment(date).format('dddd Do MMMM YYYY');

				console.log(dateFormatted);

				//Append the date column
				$(".calendar__container").append(handleTemplate("dateColumn", { "dateFormatted": dateFormatted, "index": dateInd, "date": date.format("yyyy-MM-dd") }));

				//For every appointment in date
				for (var appointmentInd = 0; appointmentInd < data[dateInd].slots.length; appointmentInd++) {

					//Format time
					var slotTime = new Date(data[dateInd].slots[appointmentInd].start)
					var time = slotTime.getHours() + ":" + (String(slotTime.getMinutes()).length == 1 ? "0" + String(slotTime.getMinutes()) : String(slotTime.getMinutes()));

					//Append the slot with template
					$(".calendar__choices").last().append(handleTemplate("slot", { "time": time, "available": true }));

					//Attach the slot time to slot's data tag		
					var slot = $(".calendar__choice").last()
					slot.data("startTime", data[dateInd].slots[appointmentInd].start);
					slot.data("queueId", data[dateInd].slots[appointmentInd].queueId);

					//Click handler
					slot.click(function () {
						$(".calendar__choice").removeClass("calendar--selected");
						$(".calendar__choice").children("p").text("Available");
						appointmentStartTime = $(this).data("startTime");
						this.classList.add("calendar--selected");
						this.getElementsByTagName("p")[0].innerText = "Selected";
						//console.log("selected", appointmentStartTime);
						$("#next").data("slot", appointmentStartTime);
						$("#next").data("queueId", $(this).data("queueId"));
						document.getElementById("next").dispatchEvent(unlock);
					});

				}


			} else {
				var date = new Date(data[dateInd].date);

				// var dateFormatted = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

				var dateFormatted = moment(date).format('dddd Do MMMM YYYY');

				$(".calendar__container").append(handleTemplate("dateColumn", { "dateFormatted": dateFormatted, "index": dateInd, "date": date.format("yyyy-MM-dd") }));

				$(".calendar__choices").last().append(handleTemplate("slot", { "time": "No slots", "available": false }));

				$(".calendar__choice").last().addClass("calendar--unavailable");

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
		$(".load").each(function (ind, elm) {
			//Click To Scroll Animations
			//They ensure that no matter how much and when you click, it will always snap to an element as long as the container is 350px
			$(elm).click(function () {
				// var h = $(elm).siblings().find(".calendar__choice").outerHeight(false) + parseFloat($(".calendar__choice").css('marginTop'));
				var elementHeights = $('.calendar__choice').map(function () {
					return $(this).outerHeight(true);
				});
				var h = Math.max.apply(null, elementHeights);
				//console.log(h);
				if (this.classList.contains("load--bot")) {
					if (this.previousElementSibling.scrollTop % h == 0) {
						$(this.previousElementSibling).animate({
							scrollTop: '+=' + h
						}, 300);
					}
					else if (this.previousElementSibling.scrollTop % h > h / 2) {
						var scrollBy = 2 * h - (this.previousElementSibling.scrollTop % h);
						//console.log(scrollBy);
						$(this.previousElementSibling).animate({
							scrollTop: '+=' + scrollBy
						}, 300);
					}
					else {
						var scrollBy = h - this.previousElementSibling.scrollTop % h;
						//console.log(scrollBy);
						$(this.previousElementSibling).animate({
							scrollTop: '+=' + scrollBy
						}, 300);
					}

				} else {
					if (this.nextElementSibling.scrollTop % h == 0) {
						$(this.nextElementSibling).animate({
							scrollTop: '-=' + h
						}, 300);
					}
					else if (this.nextElementSibling.scrollTop % h > h / 2) {
						var scrollBy = h + (this.nextElementSibling.scrollTop % h);
						//console.log(scrollBy);
						$(this.nextElementSibling).animate({
							scrollTop: '-=' + scrollBy
						}, 300);
					}
					else {
						var scrollBy = 2 * h + this.nextElementSibling.scrollTop % h;
						//console.log(scrollBy);
						$(this.nextElementSibling).animate({
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

		$.get('https://bookings.qudini.com/booking-widget/event/event/' + eventId + '', {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success(function (event) {
			//console.log(event.topic.title);
			for (var eInd = 0; eInd < allEvents.length; eInd++) {
				if (allEvents[eInd].topic.title == event.topic.title) {
					matchingTopicEvents.push(allEvents[eInd]);
				}
			}
			//console.log("µ", matchingTopicEvents); //presorted in ascending order
			populateWithEvents(matchingTopicEvents);
		})
	}

	function populateWithEvents(data) {
		while ($(".calendar__container")[0].lastChild) {
			$(".calendar__container")[0].removeChild($(".calendar__container")[0].lastChild);
		}

		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		//Dates depend on events being presorted
		var dates = [];

		data.forEach(function (event) {
			if (!dates.includes(event.startDate)) {
				dates.push(event.startDate);
			}
		})

		//console.log("∞", dates);
		// var date = new Date(event.startDate);
		// var dateDisplayed = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
		// //console.log(dateDisplayed);
		// dates.forEach((date) => {
		// 	//
		// })
	}

	function handleResize() {

		//console.log('%c%s', 'color: #f2ceb6', "Tis logged");

		if (window.innerWidth <= 768 && (viewport != "mobile" || calendarRestart)) {
			//console.log("Still mobile");
			$("[date]").each(function (ind, elm) {
				var a = new Date(elm.getAttribute("date"));
				// elm.innerText = shortDays[a.getDay()] + " " + a.getDate() + " " + shortMonths[a.getMonth()];
				elm.innerText = moment(a).format('ddd Do MMM YYYY');
			});
			viewport = "mobile";
			calendarRestart = false;
		} else if (window.innerWidth >= 768 && (viewport != "desktop" || calendarRestart)) {
			$("[date]").each(function (ind, elm) {
				var a = new Date(elm.getAttribute("date"));
				// elm.innerText = days[a.getDay()] + " " + a.getDate() + " " + months[a.getMonth()] + " " + a.getFullYear();
				elm.innerText = moment(a).format('dddd Do MMMM YYYY');
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