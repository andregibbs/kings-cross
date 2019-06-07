export default {

	init() {
		const seriesID = 'W3DMW9HUAYM'
		const liveSeriesID = 'EAKJZBQWQAH'
		const apiUrl = 'https://bookings.qudini.com/booking-widget/event/events/'
		const isoCurrentDate = new Date();


		$.get( apiUrl + seriesID, {
			'timezone': "Europe/London",
			'isoCurrentDate': isoCurrentDate.toISOString()
		}).success( function( data ) {
			console.log( data )
		})
	}

}
