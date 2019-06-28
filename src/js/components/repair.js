export default function repair() {

	// 62711 - for one to one page
	// 37437 - for repair page
	const appointmentsURL = "https://bookings.qudini.com/booking-widget/booker/slots/73U8JNREMLS/2286/37437/0?startDate=";
	const date = new Date()
	const dateString = date.getFullYear() + "-" + (String(date.getMonth() + 1).length == 1 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1)) + "-" + (String(date.getDate()).length == 1 ? "0" + String(date.getDate()) : String(date.getDate()))

	$.get( appointmentsURL + dateString )
		.success(function (data) {

			//clear old data
			while ($(".calendar-times")[0].lastChild) {
				$(".calendar-times")[0].removeChild($(".calendar-times")[0].lastChild);
			}

			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			//I present the most complicated for loop you possibly ever seen
			//change to dateInd < data.length for ensuring only 5 available dates load
			for (var dateInd = 0, availableDays = 0; availableDays < 5 && dateInd < 5; (data[dateInd].unAvailable != true ? availableDays++ : availableDays), dateInd++) {
				// console.log(data[dateInd]);
				if (!data[dateInd].unAvailable) {
					var date = new Date(data[dateInd].date);

					var dateContainer = document.createElement("div");
					dateContainer.classList.add("calendar-times-date");

					var dateTitle = document.createElement("h4");
					dateTitle.innerText = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
					dateTitle.classList.add("calendar-times-date-header");

					dateContainer.appendChild(dateTitle);
					var cheekyContainer = document.createElement("div");
					cheekyContainer.classList.add("calendar-times-date-choices")

					for (var appointmentInd = 0; appointmentInd < data[dateInd].slots.length; appointmentInd++) {
						// console.log(appointmentInd);
						var slot = document.createElement("div");
						slot.classList.add("calendar-times-date-choices-choice");

						var time = document.createElement("h4");
						var slotTime = new Date(data[dateInd].slots[appointmentInd].start)
						time.innerText = slotTime.getHours() + ":" + (String(slotTime.getMinutes()).length == 1 ? "0" + String(slotTime.getMinutes()) : String(slotTime.getMinutes()));

						var available = document.createElement("p");
						available.innerText = "Available";

						slot.appendChild(time);
						slot.appendChild(available);
						$(slot).data("startTime", data[dateInd].slots[appointmentInd].start)

						slot.addEventListener("click", function () {
							// document.getElementsByClassName("kx-services-book-time")[0].innerText = (new Date(appointmentStartTime)).toGMTString();
							// main.switchTo("form");
							$(".calendar-times-date-choices-choice").removeClass("selected");
							$(".calendar-times-date-choices-choice").children("p").text("Available");
							appointmentStartTime = $(this).data("startTime");
							this.classList.add("selected");
							this.getElementsByTagName("p")[0].innerText = "Selected";
							document.getElementById("next").classList.add("active");
						})

						cheekyContainer.appendChild(slot);

					}


					dateContainer.appendChild(cheekyContainer);
					// dateContainer.appendChild(line);

					var arrow_container = document.createElement("div");
					var arrow = document.createElement("div");
					arrow_container.classList.add("cont");
					arrow.classList.add("arrow");
					arrow_container.appendChild(arrow);
					dateContainer.appendChild(arrow_container);

					$(".calendar-times")[0].appendChild(dateContainer);

					$(".cont").click(function () {
						var currScroll = $(this).prev().scrollTop();
						var heightOfBox = $(".calendar-times-date-choices-choice").eq(0).outerHeight(true)
						$(this).prev().animate({ scrollTop: currScroll + (currScroll % heightOfBox <= (heightOfBox / 2) ? heightOfBox - (currScroll % heightOfBox) : (Math.ceil(currScroll / heightOfBox) + 1) * heightOfBox - currScroll) + "px" });
					});

					$(".calendar-times-date-choices").each(function () {

						this.addEventListener("scroll", function (e) {
							//console.log(this, this.offsetHeight + this.scrollTop == this.scrollHeight);
							if (this.offsetHeight + this.scrollTop == this.scrollHeight) {
								if (this.nextElementSibling.classList.value == "cont") {
									this.nextElementSibling.style.display = "none";
								}
							}
							else {
								if (this.nextElementSibling.classList.value == "cont") {
									this.nextElementSibling.style.display = "";
								}
							}
						});

					});

				} else {
					var date = new Date(data[dateInd].date);

					var dateContainer = document.createElement("div");
					dateContainer.classList.add("calendar-times-date");

					var dateTitle = document.createElement("h4");
					dateTitle.innerText = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
					dateTitle.classList.add("calendar-times-date-header");

					dateContainer.appendChild(dateTitle);

					var slot = document.createElement("div");
					slot.classList.add("calendar-times-date-choices-choice");

					var time = document.createElement("h4");

					time.innerText = "No Slots Available"

					slot.appendChild(time);

					var cheekyContainer = document.createElement("div");
					cheekyContainer.classList.add("calendar-times-date-choices")

					slot.classList.add("unavailable");

					cheekyContainer.appendChild(slot);

					dateContainer.append(cheekyContainer)

					$(".calendar-times")[0].appendChild(dateContainer);
				}
			}
			$("#times_load").style.display = "none";
		})
		.fail(function (err) {
			$("#times_load").style.display = "";
			console.log(err);
		})

	handleSubmit()
	handleNext()
	handleNavigation()
	handleDateArrows()

	function handleSubmit() {

		var book = document.getElementById("book-appointment");
		var name = document.getElementById("name");
		var surname = document.getElementById("surname");
		var tel = document.getElementById("tel");
		var email = document.getElementById("email");
		var notes = document.getElementById("notes");
		var checkbox = document.getElementById("service-checkbox")

		book.addEventListener("click", function () {
			document.getElementById("confirmation_load").style.display = "block";

			if (
				name.value != "" &&
				surname.value != "" &&
				tel.value != "" &&
				email.value != ""
				// checkbox.checked// &&
				// notes.value != ""
			) {
				var postData = {
					"queueId": 4068,
					"firstName": name.value,
					"bwIdentifier": "73U8JNREMLS",
					"surname": surname.value,
					"emailAddress": email.value,
					"mobileNumber": tel.value,
					"notes": notes.value,
					"bookingStartTime": appointmentStartTime,
					"bookingStartTimeString": appointmentStartTime,
					"productId": productOption
				};

				$.ajax({
					type: "POST",
					dataType: 'json',
					contentType: 'application/json',
					url: "https://bookings.qudini.com/booking-widget/booker/book",
					data: JSON.stringify(postData),
					success: function (data) {
						if (data.status == "ok") {
							document.getElementById("confirmation_load").style.display = "none";
							main.switchTo("confirmation");

							document.getElementById("reference").innerText = data.bookingRef;
							document.getElementById("user-name").innerText = document.getElementById("name").value + " " + document.getElementById("surname").value;
							document.getElementById("user-email").innerText = document.getElementById("email").value;
							document.getElementById("user-tel").innerText = document.getElementById("tel").value;

							document.getElementsByClassName("kx-event-date")[0].innerText = (new Date(appointmentStartTime)).toGMTString();


						}
					},
					fail: function (err) {
						console.log(err);
						document.getElementsByClassName("loading")[0].style.display = "none";
					}

				});

			}
		})
	}

	function handleNext() {
		$(".calendar-next--btn").addEventListener("click", function () {
			if (this.classList.contains("active") && appointmentStartTime != "") {
				main.switchTo("form");
				$(".kx-services-book-date")[0].innerText = (new Date(appointmentStartTime)).toGMTString().slice(0, 16)
				$(".kx-services-book-time")[0].innerText = parseInt(appointmentStartTime.slice(11, 13)) > 11 ? appointmentStartTime.slice(11, 16) + "pm" : appointmentStartTime.slice(11, 16) + "am";
			}
		})
	}

	function handleNavigation() {
		document.getElementById("booking-back").addEventListener("click", function () {
			main.switchTo("times");
		})
		window.onpopstate = function (event) {
			if (document.getElementsByClassName("kx-services-book")[0].style.display == "block") {
				history.back;
				console.log("Works");
				main.switchTo("times");
			}
		};

	}

	function handleDateArrows() {
		var next = document.getElementById("next");
		document.getElementsByClassName("arrow right")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() + 5);
				main.getAndPopulateTimes(selectedDate);
			} else { //inefficient as calls are made when data is ready
				selectedDate.setDate(selectedDate.getDate() + 1);
				main.getAndPopulateTimes(selectedDate);
			}
		});
		document.getElementsByClassName("arrow left")[0].addEventListener("click", function () {
			appointmentStartTime = "";
			next.classList.remove("active");
			if (window.innerWidth > 768) {
				selectedDate.setDate(selectedDate.getDate() - 5);
				main.getAndPopulateTimes(selectedDate);
			} else {
				selectedDate.setDate(selectedDate.getDate() - 1);
				main.getAndPopulateTimes(selectedDate);
			}
		});
	}

}
