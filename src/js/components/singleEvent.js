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
