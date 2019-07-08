import handleTemplate from './handleTemplate'
import instagram from './instagram'
import getUrlVars from './getUrlVars'

export default function singleEvent( events ){
	const isoCurrentDate = new Date();
	let eventId = '';
	const id = getUrlVars()["id"];
	let ticketQuantity = 1
	let instagramHashTag = ''

	// =================================================
	// Populating event details from query string
	// =================================================

    $.get("https://bookings.qudini.com/booking-widget/event/eventId/" + id, {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
	}).success( function( data ) {

		console.log( 'Event details: ', data )

		function sortEventExtra(event) {
			if (event.description) {
				var bits = event.description.split("||");

				console.log( 'bits', bits )

				event.description = bits[0];
				if (bits.length > 1) {
					event.extra = JSON.parse(bits[1]);
				}
				else {
					event.extra = {};
				}
			}
		}

		sortEventExtra(data);

		eventId = data.id;

		const options = {
			identifier: data.identifier,
			groupSize: data.maxGroupSize,
			eventId: eventId,
			image: data.imageURL,
			title: data.title,
			startDate: data.startDate,
			startTime: data.startTime,
			passion: data.passions,
			description: data.description,
			slotsAvailable: data.slotsAvailable,
			youtube: data.extra.youtubeid,
			externalbookinglink: data.extra.externalbookinglink
		}

		if( data.extra.instagramhashtag ) {
			instagramHashTag = data.extra.instagramhashtag
		}

		$('.singleEvent').append( handleTemplate( 'singleEvent', options ) )

		// Event out of stock or has expired
		if( data.slotsAvailable == 0 || data.hasPassed ) {
			$('.event__content-book .btn--primary')
				.addClass('btn--primary-notActive')

				data.slotsAvailable ? $('.event__content-book .btn--primary').text('Fully booked') : $('.event__content-book .btn--primary').text('Expired')
		}

	})

	$('.singleEvent').on('click', '.action-btn', function(e) {
		e.preventDefault()

		$('.book').addClass('book--active')
		$('.book-action').addClass('book-action--active')
	})

	// =================================================
	// Instragram feed
	// =================================================

	instagram( instagramHashTag )

	// =================================================
	// Related Events
	// =================================================

	const populateRandomEvents = []

	for( var i = 0; i < 6; i++ ) {
		populateRandomEvents.push( events[ Math.floor(Math.random() * events.length) ] )
	}

	for( var i = 0; i < populateRandomEvents.length; i++ ) {

		const options = {
			identifier: populateRandomEvents[i].identifier,
			groupSize: populateRandomEvents[i].maxGroupSize,
			eventId: populateRandomEvents[i].id,
			image: populateRandomEvents[i].imageURL,
			title: populateRandomEvents[i].title,
			startDate: populateRandomEvents[i].startDate,
			startTime: populateRandomEvents[i].startTime,
			passion: populateRandomEvents[i].passions,
			description: populateRandomEvents[i].description
		}

		$('.relatedEvents__container').append( handleTemplate( 'eventTile', options ) )
	}

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
				url: "https://bookings.qudini.com/booking-widget/series/" + kxConfig.seriesId + "/event/book",
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
