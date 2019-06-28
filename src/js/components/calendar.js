import '../librarys/calendar'
import '../librarys/calendar-localised'
import getUrlVars from './getUrlVars'
import handleTemplate from './handleTemplate'

export default function calendar(URL, type, allEvents) {
	
	//For appointments:
	//To get the proper appointmentsURL, go to Qudini admin panel, Venue information => details, and open the online booking widgets. Inside, use the browser network inspector to get the call which has the same structure to the one below:
	//https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0
	//For events:
	//https://bookings.qudini.com/booking-widget/event/event/ + eventID

	//type ∈ {"appointment", "event"}

	var selectedDate = new Date();

	try {
		type = type.toLowerCase();
	}
	catch (err) {
		console.error("2nd parameter of calendar() should be a string.");
	}

	console.log(type);

	switch (type) {
		case "appointment":
			getAppointmentDates(selectedDate);
			var appointmentStartTime = "";
			break;
		case "event":
			getEventDates();
			break;	
		case "debug":
			console.warn("Debug");
			getEventDates();
			var appointmentStartTime = "";
			getAppointmentDates(selectedDate);
		default:
			console.info("!!!");
			console.error('Calendar function used incorrectly. Expected "appointment" or "event", received', type);
			break;
	}

	
	handleDateArrows();



	function getAppointmentDates(date) {
		const appointmentURL = URL + "?startDate=";
		const dateString = date.getFullYear() + "-" + (String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1)) + "-" + (String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate()))
		var appointmentStartTime = "";
		$("#times_load")[0].style.display = "";
		$.get(appointmentURL + dateString)
			.success(function (data) {
				populateWithAppointments(data);
				$("#times_load")[0].style.display = "none";
			})
			.fail(function (err) {
				$("#times_load")[0].style.display = "";
				console.log(err);
			})
	}

	

	function populateWithAppointments(data) {

		console.log("µ", data);

		//clear old data
		while ($(".calendar__container")[0].lastChild) {
			$(".calendar__container")[0].removeChild($(".calendar__container")[0].lastChild);
		}

		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		for (var dateInd = 0; dateInd < 5; dateInd++) {
			console.log($("#dateColumn"))
			if (!data[dateInd].unAvailable) {

				var date = new Date(data[dateInd].date);
				var dateDisplayed = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

				//Append the date column
				$(".calendar__container").append( handleTemplate("dateColumn", {"date": dateDisplayed, "index":dateInd}));

				for (var appointmentInd = 0; appointmentInd < data[dateInd].slots.length; appointmentInd++) {
					
					var slotTime = new Date(data[dateInd].slots[appointmentInd].start)
					var time = slotTime.getHours() + ":" + (String(slotTime.getMinutes()).length == 1 ? "0" + String(slotTime.getMinutes()) : String(slotTime.getMinutes()));

					//Append the slot with template
					$(".calendar__choices").last().append( handleTemplate("slot", {"time":time, "available": true}));

					//Attach the slot time to slot's data tag		
					var slot = $(".calendar__choice").last()
					slot.data("startTime", data[dateInd].slots[appointmentInd].start);

					//Click handler
					slot.click(function () {
						$(".calendar__choice").removeClass("calendar--selected");
						$(".calendar__choice").children("p").text("Available");
						appointmentStartTime = $(this).data("startTime");
						this.classList.add("calendar--selected");
						this.getElementsByTagName("p")[0].innerText = "Selected";
						console.log("selected", appointmentStartTime);
					});

				}


			} else {
				var date = new Date(data[dateInd].date);

				var date = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

				$(".calendar__container").append( handleTemplate("dateColumn", {"date": date, "index":dateInd}));
				
				$(".calendar__choices").last().append( handleTemplate("slot", {"time":"No slots", "available": false}));

				$(".calendar__choice").last().addClass("calendar--unavailable");

			}
		}

		console.log($("#dateColumn"))
	}

	function handleDateArrows() {
		var next = document.getElementById("next");
		document.getElementsByClassName("arrow right")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() + 5);
				getAppointmentDates(selectedDate);
			} else { //inefficient as calls are made when data is ready
				selectedDate.setDate(selectedDate.getDate() + 1);
				getAppointmentDates(selectedDate);
			}
		});
		document.getElementsByClassName("arrow left")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() - 5);
				getAppointmentDates(selectedDate);
			} else {
				selectedDate.setDate(selectedDate.getDate() - 1);
				getAppointmentDates(selectedDate);
			}
		});
	};
	
	//Incomplete, don't use
	function populateWithEvents(data){
		while ($(".calendar__container")[0].lastChild) {
			$(".calendar__container")[0].removeChild($(".calendar__container")[0].lastChild);
		}

		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



	}

	function getEventDates() {
		const eventId = getUrlVars()["i"];
		const isoCurrentDate = new Date();
		let matchingTopicEvents = [];

		$.get('https://bookings.qudini.com/booking-widget/event/event/' + eventId + '', {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success(function (event) {
			console.log(event.topic.title);
			for (var eInd = 0; eInd < allEvents.length; eInd++) {
				if (allEvents[eInd].topic.title == event.topic.title) {
					matchingTopicEvents.push(allEvents[eInd]);
				}
			}
			console.log("µ", matchingTopicEvents);
		})
	}
		
}