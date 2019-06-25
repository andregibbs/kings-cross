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

	// Booking functionality
	/////////////////////////

	$('.book__tickets-minus').click(function(){
		let inputVal = parseInt($('.book__tickets-tickets').val())
		$('.book__tickets-tickets').val( inputVal - 1 )
	})

	$('.book__tickets-plus').click(function(){
		let inputVal = parseInt($('.book__tickets-tickets').val())
		$('.book__tickets-tickets').val( inputVal + 1 )
	})

	$('.book__form-submit').click(function(e){
		e.preventDefault()

		if( $('#book__form')[0].checkValidity() ) {

            var form_name = document.getElementById("form-name");
            var form_surname = document.getElementById("form-surname");
            var form_tel = document.getElementById("form-tel");
            var form_email = document.getElementById("form-email");


			$.ajax({
				type: "POST",
				url: "https://bookings.qudini.com/booking-widget/series/" + main.seriesId + "/event/book",
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({
					"firstName": form_name.value,
					"lastName": form_surname.value,
					"email": form_email.value,
					"groupSize": tickets.value,
					"mobileNumber": form_tel.value,
					"subscribed": true,
					"eventId": number,
					"timezone": "Europe/London"
				}),
				success: function (data) {
					console.log(data);
					document.getElementById("reference").innerText = data.refNumber;
					regPage.style.display = "none";
					document.getElementById("quantity").innerText = tickets.value;
					document.getElementById("user-name").innerText = form_name.value + " " + form_surname.value;
					document.getElementById("user-email").innerText = form_email.value;
					document.getElementById("user-tel").innerText = form_tel.value;
					confirmPage.style.display = "block";
				},
				fail: function (err) {
					console.log(err);
				}
			});
		}
	})


}
