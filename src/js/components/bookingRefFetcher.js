export default function bookingRefFetcher() {
    const isoCurrentDate = new Date();


    document.getElementById("eventFetcher").addEventListener("click", function () {
        let ref = document.getElementById("bookingRef").value;

        $.get("https://bookings.qudini.com/booking-widget/event/attendee/" + ref)
            .success((bookingData) => {

                console.log(bookingData);

                $.get('https://bookings.qudini.com/booking-widget/event/event/' + bookingData.eventId + '', {
                    'timezone': "Europe/London",
                    'isoCurrentDate': isoCurrentDate.toISOString()
                }).success(function (eventData) {
                    console.log('Event details: ', eventData)
                    document.getElementById("event-img").src = eventData.imageURL;
                    document.getElementById("greetings").innerText = "Welcome " + bookingData.firstName + " " + bookingData.lastName;
                    document.getElementById("title").innerText = eventData.title;
                    document.getElementById("date").innerText = eventData.startDate;
                    document.getElementById("time").innerText = eventData.startTime;
                    document.getElementById("user-info").style.display="block";

                    document.getElementById("cancel").addEventListener("click", ()=>{
                        $.get("https://bookings.qudini.com/booking-widget/event/cancel/" + ref)
                            .success(()=>{
                                document.getElementById("cancelled").style.display = "inline-block";
                            })
                    })
                });

            })
            .fail((err) => {
                console.log(err);
            })


    })
}