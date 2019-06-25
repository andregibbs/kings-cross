import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'

export default function singleEvent(){
	const isoCurrentDate = new Date();
	const number = getUrlVars()["i"];

	$.get( 'https://bookings.qudini.com/booking-widget/event/event/'+ number +'', {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
	}).success( function( data ) {

		const options = {
			identifier: data.identifier,
			eventId: data.id,
			image: data.imageURL,
			title: data.title,
			startDate: data.startDate,
			startTime: data.startTime,
			passion: data.passions
		}

		$('.singleEvent .section__inner').append( handleTemplate( 'singleEvent', options ) )

	})

}


// booking an event
// document.getElementById("book-btn").addEventListener("click", function () {
// 	if (
// 		form_name.value != "" &&
// 		form_surname.value != "" &&
// 		form_tel.value != "" &&
// 		form_email.value != ""
// 	) {
// 		$.ajax({
// 			type: "POST",
// 			url: "https://bookings.qudini.com/booking-widget/series/" + main.seriesId + "/event/book",
// 			dataType: "json",
// 			contentType: "application/json; charset=utf-8",
// 			data: JSON.stringify({
// 				"firstName": form_name.value,
// 				"lastName": form_surname.value,
// 				"email": form_email.value,
// 				"groupSize": tickets.value,
// 				"mobileNumber": form_tel.value,
// 				"subscribed": true,
// 				"eventId": $(this).data('eventId'),
// 				"timezone": "Europe/London"
// 			}),
// 			success: function (data) {
// 				console.log(data);
// 				document.getElementById("reference").innerText = data.refNumber;
// 				regPage.style.display = "none";
// 				document.getElementById("quantity").innerText = tickets.value;
// 				document.getElementById("user-name").innerText = form_name.value + " " + form_surname.value;
// 				document.getElementById("user-email").innerText = form_email.value;
// 				document.getElementById("user-tel").innerText = form_tel.value;
// 				confirmPage.style.display = "block";
// 			},
// 			fail: function (err) {
// 				console.log(err);
// 			}
// 		});
// 	} else {
// 		this.style.backgroundColor = "red";
// 		setTimeout(function () {
// 			document.getElementById("book-btn").style.backgroundColor = "";
// 		}, 500);
// 	}
// });
