import handleTemplate from './handleTemplate'
import instagram from './instagram'
import getUrlVars from './getUrlVars'

export default function singleEvent( events ){
	const isoCurrentDate = new Date();
	let eventId = '';
	const id = getUrlVars()["id"];
	let ticketQuantity = 1
	let instagramHashTag = ''
	let eventDetails = {};

	// =================================================
	// Populating event details from query string
	// =================================================

    $.get("https://bookings.qudini.com/booking-widget/event/series/" + kxConfig.seriesId
    ).success( function( seriesData ) {

    	// get the Integer value for the current series as this is returned by the event API - we need to check below that the event is valid for the series
    	kxConfig.seriesIdAsInt = seriesData.id;

	    $.get("https://bookings.qudini.com/booking-widget/event/eventId/" + id, {
				'timezone': "Europe/London",
				'isoCurrentDate': isoCurrentDate.toISOString()
		}).success( function( data ) {

			console.log( 'Event details: ', data )

			eventDetails = data;


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

			// TODO need to check event is for the correct series

			console.log('xxxxx - ' + data.seriesId + ' ' + kxConfig.seriesId + ' ' + kxConfig.seriesIdAsInt);

			if (data.seriesId == kxConfig.seriesIdAsInt) {

				

				const options = {
					identifier: data.identifier,
					groupSize: data.maxGroupSize,
					eventId: eventId,
					image: data.imageURL ? data.imageURL : 'https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
					title: data.title,
					startDate: moment(data.startDate).format("Do MMMM") ==  moment(Date.now()).format("Do MMMM") ? 'TODAY' : moment(data.startDate).format("Do MMMM") ,
					startTime: data.startTime,
					passion: data.passions,
					description: data.description.replace(data.description.split('. ', 1)[0] + '. ', ''),
					firstSentence: data.description.split('. ', 1)[0],
					slotsAvailable: data.slotsAvailable,
					youtube: data.extra.youtubeid,
					externalbookinglink: data.extra.externalbookinglink
				}

				if( data.extra.instagramhashtag ) {
					instagramHashTag = data.extra.instagramhashtag
				}
				var startTime = moment(data.startISO).utc();
				var bookOptions = {

					startDate: moment(data.startDate).format("dddd Do MMMM YYYY") ==  moment(Date.now()).format("dddd Do MMMM YYYY") ? 'TODAY' : moment(data.startDate).format("dddd Do MMMM YYYY") ,
					startTime: moment(startTime).format('LT'),
					endTime: moment(startTime).add(data.durationMinutes, 'm').format('LT')
		
				};
				$('.section.book').find('.book-action__description').text(bookOptions.startTime + ' - ' + bookOptions.endTime +' | '+ bookOptions.startDate + ' | Samsung KX');
				$('.singleEvent').append( handleTemplate( 'singleEvent', options ) )
				

				

				// Event out of stock or has expired
				if( data.slotsAvailable == 0 || data.hasPassed ) {
					$('.event__content-book .btn--primary')
						.addClass('btn--primary-notActive')

						data.slotsAvailable ? $('.event__content-book .btn--primary').text('Fully booked') : $('.event__content-book .btn--primary').text('Expired')
				}

			}
			else {
				// redirect to whats-on page

				var currentUrlSplitbySlash = window.location.href.split('/');
				window.location.href = currentUrlSplitbySlash.slice(0, currentUrlSplitbySlash.length - 2).join("/") + "/";

			}

		})

	})

	$('.singleEvent').on('click', '.action-btn', function(e) {
		e.preventDefault();

		

		$('.action .action-btn').attr("disabled", true);
		$('.action .action-btn').toggleClass('btn--primary-notActive');
		$('.book').addClass('book--active');
		
		$('.book-action').addClass('book-action--active');
		$('.book').slideDown();
	});

	$('.close').on('click', function(e) {
		e.preventDefault();
		$('.book').slideUp();
		$('.book').removeClass('book--active');
		$('.book-action').removeClass('book-action--active');

		$('.action .action-btn').attr("disabled", false);
		$('.action .action-btn').toggleClass('btn--primary-notActive');

	})

	$('.singleEvent').on('click', '.share__container', function(e) {
		e.preventDefault();
		$('.share__social').toggleClass('share__social--active')
	});

	$('.relatedEvents__header__see').click( function() {
		window.location.href = "/uk/kings-cross/whats-on/";
	})

	// =================================================
	// Instragram feed
	// =================================================

	instagram( instagramHashTag )

	// =================================================
	// Related Events
	// =================================================

// TODO - need to make a decision what to do when less than 6 related events

	const populateRandomEvents = []

	for( var i = 0; i < 4; i++ ) {
		populateRandomEvents.push( events[ Math.floor(Math.random() * events.length) ] )
	}

	for( var i = 0; i < populateRandomEvents.length; i++ ) {

		const options = {
			identifier: populateRandomEvents[i].identifier,
			groupSize: populateRandomEvents[i].maxGroupSize,
			eventId: populateRandomEvents[i].id,
			image: populateRandomEvents[i].imageURL ? populateRandomEvents[i].imageURL : 'https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
			title: populateRandomEvents[i].title,
			startDate: moment(populateRandomEvents[i].startDate).format("Do MMMM") ==  moment(Date.now()).format("Do MMMM") ? 'TODAY' : moment(populateRandomEvents[i].startDate).format("Do MMMM") ,
			startTime: populateRandomEvents[i].startTime,
			passion: populateRandomEvents[i].passions,
			suitables: populateRandomEvents[i].extra.eventtype,
			suitablesName: populateRandomEvents[i].extra.eventtypeName,
			passionColor: populateRandomEvents[i].extra.passionColor,
			description: populateRandomEvents[i].description
		}

		$('.relatedEvents__container').append( handleTemplate( 'eventTile', options ) )
	}

	// =================================================
	// Booking functionality
	// =================================================

	

	

	$('.book__tickets-minus').click(function(e){

		ticketQuantity = parseInt($('.book__tickets-tickets').val())
		if(ticketQuantity - 1 !== 0) {
			ticketQuantity - 1;
			$('.book__tickets-tickets').val( ticketQuantity );
		}
		
	})

	$('.book__tickets-plus').click(function(e){
		ticketQuantity = parseInt($('.book__tickets-tickets').val())
		ticketQuantity + 1;
		
		$('.book__tickets-tickets').val( ticketQuantity );
		
	})

	$('.book__tickets__tc').each(function() {

		$(this).click(function() {
			$(this).find('input').toggleClass('selected');
		})




	});

	function checkFormValidity( formID ) {


		$(formID + ' input').each(function() {
			$(this).off('invalid');
			$(this).bind('invalid', function(e) {
				$(this).toggleClass('invalid');
				if($(this).attr('type') === 'checkbox') {
					$(this).parent().toggleClass('invalid')
				}
			});
		});

		return $(formID)[0].checkValidity();


	}

	$('.book__form-submit').click(function(e){
		e.preventDefault()

		if( checkFormValidity('#book__form') ) {
            const form_name = $(".book__form-name").val();
            const form_surname = $(".book__form-surname").val();
            const form_tel = $(".book__form-tel").val();
			const form_email = $(".book__form-email").val();
			$('.book__form-submit').attr("disabled", true).toggleClass('btn--primary-notActive');
			$('.cm-configurator-loader').show();

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
					$('.cm-configurator-loader').hide();
					$('.book-action').removeClass('book-action--active');
					$('.book--active').css({'background': 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+ eventDetails.imageURL +')', 'background-repeat': 'no-repeat','background-position': 'center center', 'background-size': 'cover'})
					$('.order-reference').text( data.refNumber )
					var orderInfo =	$('.book-action__description').text();
					$('.order__time').text(orderInfo);

					$('.book-confirmation').addClass('book-confirmation--active')

				},
				fail: function (err) {
					$('.book__form-submit').attr("disabled", false);
					$('.cm-configurator-loader').hide();
					console.log(err);
				}
			});
		} else {

		}
	})


}
