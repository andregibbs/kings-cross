import upcomingEvents from "./upcomingEvents";
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();


export default function bookingRefFetcher(AllEvents) {
    const isoCurrentDate = new Date();

    history.replaceState({ "reloadNeeded": false, "ref": "", "screen": 0 }, "My Bookings | Samsung King's Cross | Samsung UK", "");

    let ui = {
        'inputScreen': document.getElementById("booking-input"),
        'bookingScreen': document.getElementById("user-info"),
        'refButton': document.getElementById("eventFetcher"),
        'bookingField': document.getElementById("bookingRef")
    };

    let loading = {
        display: function (n) {
            document.getElementsByClassName("loading")[n - 1].style.display = "block";
        },
        done: function (n) {
            document.getElementsByClassName("loading")[n - 1].style.display = "";
        }
    };

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

    let bookingData;
    let ref = getParam("ref")

    console.log('aaaaa')
    ui.refButton.addEventListener("click", function () {
      document.getElementById("bookingRef").value;
      loading.display(1);

      $j.get({
        url:"https://bookings.qudini.com/booking-widget/event/attendee/" + ref,
        success: bookingReceived
      }).fail(function (err) {
          doLog(err);
          loading.done(1);
          ui.bookingField.classList.add("warn");
          document.getElementsByClassName("bookings__inner__invalid")[0].style.opacity = "1";
      });
    });

    ui.bookingField.addEventListener("change", function () {
      if (this.classList.contains("warn")) {
        this.classList.remove("warn");
        document.getElementsByClassName("bookings__inner__invalid")[0].style.opacity = "0";
      }
    });

    function bookingReceived(_bookingData) {
      loading.done(1);
      doLog(bookingData);
      bookingData = _bookingData

      $j.get({
        url: 'https://bookings.qudini.com/booking-widget/event/event/' + bookingData.eventId + '',
        data: {
          'timezone': "Europe/London",
          'isoCurrentDate': isoCurrentDate.toISOString()
        },
        success: eventReceived
      })
    }

    function eventReceived(eventData) {
        doLog('Event details: ', eventData);
        doLog('param =', getParam("ref"));
        if (!getParam("ref")) {
            history.pushState({ "reloadNeeded": false, "ref": ui.bookingField.value, "screen": 1 }, eventData.title + " | Samsung King's Cross | Samsung UK", "?ref=" + bookingData.refNumber);
        }

        eventDisplay.date.innerText = moment(eventData.startDate).format("Do MMMM") + " | " + moment(eventData.startTime, ["h:mm A"]).format("HH:mm") + " - " + moment(eventData.startTime, ["h:mm A"]).add(eventData.durationMinutes, "minutes").format("HH:mm");
        eventDisplay.title.innerText = eventData.title;
        eventDisplay.img.style.backgroundImage = eventData.bannerImageURL ? 'url('+eventData.bannerImageURL+')' : 'url('+eventData.imageURL+')';

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


        if (bookingData.status == "CANCELLED") {
            showCancelled(eventData);
        }

        if (bookingData.firstName.indexOf("**REMOVED") != -1){
            showCancelled(eventData);
        }

        document.getElementById("cancel").addEventListener("click", function () {
            document.getElementById("cancel-popup").style.display = "block";
        });

        $j("#cancel-back, .close, .pop-up").click(function (e) {
            if (e.target !== document.getElementsByClassName("pop-up__body")[0] && e.target.parentNode !== document.getElementsByClassName("pop-up__body")[0] || e.target.classList.contains("close")) {
                document.getElementById("cancel-popup").style.display = "";
            }
        });

        document.getElementById("upcoming").style.display = "block";
        upcomingEvents(AllEvents, eventData.topic.id);

        document.getElementById("cancel-confirm").addEventListener("click", function () {
          document.getElementById("cancel-popup").style.display = "";
          loading.display(2);
          $j.get({
            url: "https://bookings.qudini.com/booking-widget/event/cancel/" + ref,
            success: function () {
              loading.done(2);
              showCancelled(eventData);
            }
          }).fail(function (err) {
            loading.done(2);
            doLog(err);
          });
        });

    }

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
        doLog(event);
        if (event.state != null) {
            if (event.state.screen == 0) {
                ui.inputScreen.style.display = "block";
                ui.bookingScreen.style.display = "none";
                document.getElementById("upcoming").style.display = "";
                doLog("back");
            } else if (event.state.screen == 1 && !event.state.reloadNeeded) {
                ui.inputScreen.style.display = "none";
                ui.bookingScreen.style.display = "block";
                document.getElementById("upcoming").style.display = "block";
                doLog("forward");
            }
        }
    };

    function showCancelled(eventData) {
        $j(".line--vertical, .request__info p, .request__info a, #date, #title, .request__event").hide();
        $j(".request__info h3").html("Booking cancelled<br>" + eventData.title);
        $j(".request__info").css("justify-content", "center");
        $j(".request__summary__content").append('<p class="fz18 request__cancel">Your booking has been cancelled.</p><br><p class="fz18">Thanks for letting us know. If you would like to come to a different Samsung KX event go to the <a ga-ca="microsite" ga-ac="feature" ga-la="kings-cross:your-booking-has-been-cancelled_whats on" data-omni-type="microsite" data-omni="uk:kings-cross:whats-on" style="font-size: 1em;" href="//www.samsung.com/uk/explore/kings-cross/whats-on">What’s on</a> page or browse the upcoming events below.</p><br/><a href="./"><button class="button btn btn--primary">Search for another event</button></a>');
        $j(".relatedEvents__header__see").click(function() {
            window.location.href = "/uk/explore/kings-cross/whats-on/";
          });
    }

}
