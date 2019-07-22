export default function bookingRefFetcher() {
    const isoCurrentDate = new Date();

    history.replaceState({ "reloadNeeded": false, "ref": "", "screen": 0 }, "My Bookings | Samsung King's Cross | Samsung UK", "");

    let ui = {
        'inputScreen': document.getElementById("booking-input"),
        'bookingScreen': document.getElementById("user-info"),
        'refButton': document.getElementById("eventFetcher"),
        'bookingField': document.getElementById("bookingRef")
    };

    let loading = {
        display: function () {
            $(".loading").each(function () { this.style.display = "block" });
        },
        done: function () {
            $(".loading").each(function () { this.style.display = "" });
        }
    }

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

    ui.refButton.addEventListener("click", function () {
        let ref = document.getElementById("bookingRef").value;
        loading.display();
        $.get("https://bookings.qudini.com/booking-widget/event/attendee/" + ref)
            .success(function (bookingData) {
                loading.done();
                console.log(bookingData);

                $.get('https://bookings.qudini.com/booking-widget/event/event/' + bookingData.eventId + '', {
                    'timezone': "Europe/London",
                    'isoCurrentDate': isoCurrentDate.toISOString()
                }).success(function (eventData) {
                    console.log('Event details: ', eventData)
                    console.log('param =', getParam("ref"));
                    if (!getParam("ref")) {
                        history.pushState({ "reloadNeeded": false, "ref": ui.bookingField.value, "screen": 1 }, eventData.title + " | Samsung King's Cross | Samsung UK", "?ref=" + bookingData.refNumber)
                    }

                    eventDisplay.date.innerText = moment(eventData.startDate).format("Do MMMM") + " | " + moment(eventData.startTime, ["h:mm A"]).format("HH:mm") + " - " + moment(eventData.startTime, ["h:mm A"]).add(eventData.durationMinutes, "minutes").format("HH:mm");
                    eventDisplay.title.innerText = eventData.title;
                    eventDisplay.img.src = eventData.bannerImageURL;

                    userDisplay.reference.innerText = bookingData.refNumber;
                    userDisplay.quantity.innerText = bookingData.groupSize;
                    userDisplay.name.innerText = bookingData.firstName + " " + bookingData.lastName;
                    userDisplay.email.innerText = bookingData.email;
                    userDisplay.tel.innerText = bookingData.mobileNumber;

                    if (eventData.locationName != "") {
                        eventDisplay.zone.style.display = "block";
                        eventDisplay.zone.innerText = eventData.locationName;
                    } else {
                        eventDisplay.zone.style.display = "";
                    }

                    ui.inputScreen.style.display = "none";
                    ui.bookingScreen.style.display = "block";


                    if(bookingData.status == "CANCELLED"){
                        showCancelled(eventData);
                    }

                    document.getElementById("cancel").addEventListener("click", function () {
                        document.getElementById("cancel-popup").style.display = "block";
                    })

                    $("#cancel-back, .close, .pop-up").click(function (e) {
                        if (e.target !== document.getElementsByClassName("pop-up__body")[0] && e.target.parentNode !== document.getElementsByClassName("pop-up__body")[0] || e.target.classList.contains("close")) {
                            document.getElementById("cancel-popup").style.display = "";
                        }
                    })

                    document.getElementById("cancel-confirm").addEventListener("click", function () {
                        document.getElementById("cancel-popup").style.display = "";
                        loading.display();
                        $.get("https://bookings.qudini.com/booking-widget/event/cancel/" + ref)
                            .success(function () {

                                loading.done();

                                showCancelled(eventData);

                            })
                            .fail(function (err) {
                                loading.done();
                                console.log(err);
                            })
                    })

                });

            })
            .fail(function (err) {
                console.log(err);
                loading.done();
                ui.bookingField.classList.add("warn");
            })


    })

    ui.bookingField.addEventListener("change", function () {
        if (this.classList.contains("warn")) {
            this.classList.remove("warn"); ``
        }
    })

    function getParam(param) {
        var pageURL = window.location.search.substring(1);
        var URLVariables = pageURL.split('&');
        for (var i = 0; i < URLVariables.length; i++) {
            var queryString = URLVariables[i].split('=');
            if (queryString[0] == param) {
                return queryString[1];
            }
        }
    }

    if (getParam("ref")) {
        ui.bookingField.value = getParam("ref");
        ui.refButton.dispatchEvent(new Event("click"));
    }

    window.onpopstate = function (event) {
        console.log(event);
        if (event.state != null) {
            if (event.state.screen == 0) {
                ui.inputScreen.style.display = "block";
                ui.bookingScreen.style.display = "none";
                console.log("back");
            } else if (event.state.screen == 1 && !event.state.reloadNeeded) {
                ui.inputScreen.style.display = "none";
                ui.bookingScreen.style.display = "block";
                console.log("forward");
            }
        }
    };

    function showCancelled(eventData) {
        $(".line--vertical, .request__info p, .request__info a, #date, #title, .request__event").hide();
        $(".request__info h3").html("Booking cancelled<br>" + eventData.title)
        $(".request__info").css("justify-content", "center");
        $(".request__summary__content").append('<p class="fz18 request__cancel">You booking has been cancelled.</p><br><p class="fz18">Thanks for letting us know. If you would like to come to a different KX event go to the <a class="fz18" href="//www.samsung.com/uk/explore/kings-cross/whats-on">What’s on</a> page or browse the upcoming events below.</p>');
    }

}