import '../librarys/jquery-ui-1.12.1.custom/jquery-ui.min.js'

import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'

export default function whatson( events ){
	// handleTemplate( 'eventTile', options )

	let counter = 0
	const eventsToManipulate = events;
	const passion = getUrlVars()["passions"];

	// =================================================
	// DataPicker and filters
	// =================================================
	function dataPicker() {
		var dateFormat = "mm/dd/yy",
		  from = $( "#from" )
			.datepicker({
			  defaultDate: "+1w",
			  changeMonth: true,
			  numberOfMonths: 3
			})
			.on( "change", function() {
			  to.datepicker( "option", "minDate", getDate( this ) );
			}),
		  to = $( "#to" ).datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 3
		  })
		  .on( "change", function() {
			from.datepicker( "option", "maxDate", getDate( this ) );
		  });

		function getDate( element ) {
		  var date;
		  try {
			date = $.datepicker.parseDate( dateFormat, element.value );
		  } catch( error ) {
			date = null;
		  }

		  return date;
		}
	  }

	  dataPicker()

	$('.filters__category-items .label').click( function() {
		$(this)
		.toggleClass('label--active')
		.find('.checkmark')
		.toggleClass('checkmark--active')
	})

	$('.filters__results .btn').click( function() {
		let getLabels = []

		$('.label--active').each( function() {
			getLabels.push( $(this).data('code') )
		})

		const eventsFiltered = eventsToManipulate.filter( function( event, index ) {
			return Array.prototype.includes.apply(event.extra.passions, getLabels)
		} )

		if( eventsFiltered.length ) {
			$('.eventTile').remove()
			renderEventsIntoDom( eventsFiltered )
		}
	})

	// =================================================
	// Events
	// =================================================

	if( passion ) {

		$('.passionImg')
			.find('h1')
			.text( passion )

		$('.passionImg')
			.find('img')
			.attr('src', `/content/dam/samsung/uk/kings-cross/passion-header/passion-header-${passion}.jpg`)
			.addClass('op0--fade')

		const eventsFiltered = events.filter( function( event ) {
			return event.extra.passions.includes( passion )
		} )

		renderEventsIntoDom( eventsFiltered )
	} else {

		$('.passionImg')
			.find('h1')
			.text( "GIVE ME COPY" )

		$('.passionImg')
			.find('img')
			.attr('src', `/content/dam/samsung/uk/kings-cross/passion-header/passion-header-generic.jpg`)
			.addClass('op0--fade')

		renderEventsIntoDom( events )
	}

	// =================================================
	// Function to render only the events
	// Accepts the events as parameter
	// =================================================

	function renderEventsIntoDom( eventsToRender ) {

		eventsToRender.forEach( function( event, index ) {

			counter++

			console.log( counter )

			const options = {
				identifier: event.identifier,
				eventId: event.id,
				image: event.imageURL,
				title: event.title,
				startDate: event.startDate,
				startTime: event.startTime,
				passion: event.extra.passions
			}

			$('.events .events__container').append( handleTemplate( 'eventTile', options ) )

			if ( counter == 10 ) {
				counter = 0
			}
		})
	}


}
