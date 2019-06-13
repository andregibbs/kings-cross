import handleTemplate from './handleTemplate'

export default function whatson( events ){
	// handleTemplate( 'eventTile', options )

	events.forEach( function( event, index ) {

		const options = {
			identifier: event.identifier,
			eventId: event.id,
			image: event.imageURL,
			title: event.title,
			startDate: event.startDate,
			startTime: event.startTime,
			passion: event.passions
		}

		if ( index <= 10 ) {
			$('.events .events__container').append( handleTemplate( 'eventTile', options ) )
		} else {
			return
		}
	})

}
