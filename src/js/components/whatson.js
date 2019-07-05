import '../librarys/jquery-ui-1.12.1.custom/jquery-ui.min.js'

import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'
import dataPicker from './dataPicker'

export default function whatson( events ){

	let counter = 0
	const passion = getUrlVars()["passions"];
	const eventsToManipulate = events

	let getPassions = []
	let getSuitables = []

	// =================================================
	// DataPicker and filters
	// =================================================

	dataPicker()

	$('.passions .label, .suitables .label').click( function() {
		$(this)
		.toggleClass('label--active')
		.find('.checkmark')
		.toggleClass('checkmark--active')
	})

	$('.filters__results .btn').click( function() {

		updateFilters()

		var eventsToRender = eventsToManipulate


		if ( $('#from').val() && $('#to').val() ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				return event.startDate > $('#from').val() && event.startDate < $('#to').val()
			})
		}


		if ( getPassions.length ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				if( event.extra.passions ) {
					return event.extra.passions.filter(passion => getPassions.includes(passion)).length > 0
				}
			} )
		}

		if ( getSuitables.length ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				if( event.extra.suitables ) {
					return event.extra.suitables.filter(suitable => getSuitables.includes(suitable)).length > 0
				}
			} )
		}

		$('.eventTile').remove()
		renderEventsIntoDom( eventsToRender )

	})

	$('.toggleSuitables').click( function() {
		$('.suitables').toggleClass('suitables--active')
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
	// function to update passions and suitables arrays
	// =================================================

	function updateFilters() {

		getPassions = []
		getSuitables = []

		$('.passions .label--active').each( function() {
			getPassions.push( $(this).data('code') )
		})

		$('.suitables .label--active').each( function() {
			getSuitables.push( $(this).data('code') )
		})

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
				passion: event.extra.passions,
				suitables: event.extra.suitables
			}

			$('.events .events__container').append( handleTemplate( 'eventTile', options ) )

			if ( counter == 10 ) {
				counter = 0
			}
		})
	}


}
