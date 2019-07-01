export default function bookingRefFetcher() {
    const isoCurrentDate = new Date();


    document.getElementById("eventFetcher").addEventListener("click", function () {
        let ref = document.getElementById("bookingRef").value;

        $.get("https://bookings.qudini.com/booking-widget/event/attendee/" + ref)
            .success((data) => {

                console.log(data);

                $.get('https://bookings.qudini.com/booking-widget/event/event/' + data.eventId + '', {
                    'timezone': "Europe/London",
                    'isoCurrentDate': isoCurrentDate.toISOString()
                }).success(function (data) {

                    console.log('Event details: ', data)
                });

            })
            .fail((err) => {
                console.log(err);
            })


    })
}