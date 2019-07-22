export default function bookingRefFetcher() {
    const isoCurrentDate = new Date();

    let inputScreen = document.getElementById("booking-input");
    let bookingScreen = document.getElementById("user-info");

    let userDisplay = {
        'reference': document.getElementById("booking-ref"),
        'quantity': document.getElementById("quantity"),
        'name': document.getElementById("name"),
        'email': document.getElementById("email"),
        'tel': document.getElementById("tel")
    };

    let eventDisplay = {
        'date': document.getElementById("date"),
        'title': document.getElementById("title"),
        'img': document.getElementById("event-img"),
        'zone': document.getElementById("zone")
    };

    document.getElementById("eventFetcher").addEventListener("click", function () {
        let ref = document.getElementById("bookingRef").value;

        $.get("https://bookings.qudini.com/booking-widget/event/attendee/" + ref)
            .success((bookingData) => {

                console.log(bookingData);


                $.get('https://bookings.qudini.com/booking-widget/event/event/' + bookingData.eventId + '', {
                    'timezone': "Europe/London",
                    'isoCurrentDate': isoCurrentDate.toISOString()
                }).success(function (eventData) {
                    console.log('Event zzz: ', eventData)

                    eventDisplay.date.innerText = moment(eventData.startDate).format("Do MMMM") + " | " + moment(eventData.startTime, ["h:mm A"]).format("HH:mm") + " - " + moment(eventData.startTime, ["h:mm A"]).add(eventData.durationMinutes, eventData.durationUnit.toLowerCase()).format("HH:mm");
                    eventDisplay.title.innerText = eventData.title;
                    eventDisplay.img.src = eventData.bannerImageURL;

                    userDisplay.reference.innerText = bookingData.refNumber;
                    userDisplay.quantity.innerText = bookingData.groupSize;
                    userDisplay.name.innerText = bookingData.firstName + " " + bookingData.lastName;
                    userDisplay.email.innerText = bookingData.email;
                    userDisplay.tel.innerText = bookingData.mobileNumber;
                    
                    if(eventData.locationName != ""){
                        eventDisplay.zone.style.display = "block";
                        eventDisplay.zone.innerText = eventData.locationName;
                    }
                    
                    inputScreen.style.display = "none";
                    bookingScreen.style.display = "block";

                    document.getElementById("cancel").addEventListener("click", function () {
                        document.getElementById("cancel-popup").style.display = "block";
                    })

                    $("#cancel-back, .close").click(function () {
                        document.getElementById("cancel-popup").style.display = "";
                    })

                    document.getElementById("cancel-confirm").addEventListener("click", function () {
                        document.getElementById("cancel-popup").style.display = "";
                        document.getElementById("load-screen").style.display = "block";
                        $.get("https://bookings.qudini.com/booking-widget/event/cancel/" + ref)
                            .success(() => {

                                document.getElementById("load-screen").style.display = "none";

                                $(".line--vertical, .request__info p, .request__info a, #date, #title").hide();
                                $(".request__info h3").html("Booking cancelled<br>"+eventData.title)
                                $(".request__summary__content").append('<p class="fz18 request__cancel">You booking has been cancelled.</p><p class="fz18">Thanks for letting us know. If you would like to come to a different KX event go to the What’s on page or browse the upcoming events below.</p>');

                            })
                    })

                });

            })
            .fail((err) => {
                console.log(err);
            })


    })
}