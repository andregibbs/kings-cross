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
                    console.log('Event details: ', eventData)

                    eventDisplay.date.innerText = moment(eventData.startDate).format("Do MMMM") + " | " + moment(eventData.startTime, ["h:mm A"]).format("HH:mm") + " - " + moment(eventData.startTime, ["h:mm A"]).add(eventData.durationMinutes, eventData.durationUnit.toLowerCase()).format("HH:mm");
                    eventDisplay.title.innerText = eventData.title;
                    eventDisplay.img.src = eventData.bannerImageURL;

                    userDisplay.reference.innerText = bookingData.refNumber;
                    userDisplay.quantity.innerText = bookingData.groupSize;
                    userDisplay.name.innerText = bookingData.firstName + " " + bookingData.lastName;
                    userDisplay.email.innerText = bookingData.email;
                    userDisplay.tel.innerText = bookingData.mobileNumber;

                    inputScreen.style.display = "none";
                    bookingScreen.style.display="block";

                    document.getElementById("cancel").addEventListener("click", function(){
                        document.getElementById("cancel-popup").style.display = "block";
                    })
                    
                    $("#cancel-back, .close").click(function(){
                        document.getElementById("cancel-popup").style.display = "";
                    })

                    document.getElementById("cancel-confirm").addEventListener("click", function(){
                        document.getElementById("cancel-popup").style.display = "";
                        
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