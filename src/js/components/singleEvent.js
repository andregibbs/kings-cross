import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'

export default function singleEvent(){
	const isoCurrentDate = new Date();
	const eventId = getUrlVars()["i"];
	let ticketQuantity = 1

	$.get( 'https://bookings.qudini.com/booking-widget/event/event/'+ eventId +'', {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
	}).success( function( data ) {

		console.log( 'Event details: ', data )

		const options = {
			identifier: data.identifier,
			groupSize: data.maxGroupSize,
			eventId: data.id,
			image: data.imageURL,
			title: data.title,
			startDate: data.startDate,
			startTime: data.startTime,
			passion: data.passions,
			description: data.description
		}

		$('.singleEvent').append( handleTemplate( 'singleEvent', options ) )

		// Event out of stock
		if( data.slotsAvailable == 0 ) {
			$('.event__content-book .btn--primary').addClass('btn--primary-notActive')
		}
	})

	$('.singleEvent').on('click', '.action-btn', function(e) {
		e.preventDefault()

		$('.book').addClass('book--active')
		$('.book-action').addClass('book-action--active')
	})

	// =================================================
	// Booking functionality
	// =================================================

	$('.book__tickets-minus').click(function(){
		ticketQuantity = parseInt($('.book__tickets-tickets').val())
		$('.book__tickets-tickets').val( ticketQuantity - 1 )
	})

	$('.book__tickets-plus').click(function(){
		ticketQuantity = parseInt($('.book__tickets-tickets').val())
		$('.book__tickets-tickets').val( ticketQuantity + 1 )
	})

	$('.book__form-submit').click(function(e){
		e.preventDefault()

		if( $('#book__form')[0].checkValidity() ) {
            const form_name = $(".book__form-name").val();
            const form_surname = $(".book__form-surname").val();
            const form_tel = $(".book__form-tel").val();
            const form_email = $(".book__form-email").val();

			$.ajax({
				type: "POST",
				url: "https://bookings.qudini.com/booking-widget/series/W3DMW9HUAYM/event/book",
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({
					"firstName": form_name,
					"lastName": form_surname,
					"email": form_email,
					"groupSize": ticketQuantity,
					"mobileNumber": form_tel,
					"subscribed": true,
					"eventId": eventId,
					"timezone": "Europe/London"
				}),
				success: function (data) {
					$('.book-action').removeClass('book-action--active')
					$('.book-confirmation__summary .order-reference').text( data.refNumber )
					$('.book-confirmation__summary .order-quantity').text( ticketQuantity )
					$('.book-confirmation__summary .order-name').text( form_name + form_surname )
					$('.book-confirmation__summary .order-email').text( form_email )
					$('.book-confirmation__summary .order-tel').text( form_tel )
					$('.order__event-title').text( form_tel )
					$('.order__event-date').text( form_tel )
					$('.order__event-time').text( form_tel )

					$('.book-confirmation').addClass('book-confirmation--active')

				},
				fail: function (err) {
					console.log(err);
				}
			});
		}
	})


}
