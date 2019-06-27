import handleTemplate from './handleTemplate'
import slider from './slider'
import getUrlVars from './getUrlVars'

export default function whatson( events ){
	// handleTemplate( 'eventTile', options )

	// =================================================
	// Slider
	// =================================================

	const sliderConfig = {
		lazyLoad: 'ondemand',
		dots: false,
		infinite: false,
		speed: 500,
		fade: false,
		cssEase: 'linear'
	}

	slider( events, '.slider-whatson', sliderConfig, 'homeKv' )


	// =================================================
	// Events
	// =================================================

	let counter = 0
	const passion = getUrlVars()["passions"];

	if( passion ) {
		const eventsFiltered = events.filter( function( event ) {
			return event.extra.passions.includes( passion )
		} )

		renderEventsIntoDom( eventsFiltered )
	} else {
		renderEventsIntoDom( events )
	}

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
