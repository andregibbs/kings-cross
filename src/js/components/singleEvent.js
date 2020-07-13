import handleTemplate from "./handleTemplate";
import instagram from "./instagram";
import upcomingEvents from "./upcomingEvents";
import getUrlVars from "./getUrlVars";
import createDropDown from "./createDropDown";
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function singleEvent(events) {
  const isoCurrentDate = new Date();
  let eventId = "";
  const id = getUrlVars()["id"];
  let ticketQuantity = 1;
  let instagramHashTag = "";
  let eventDetails = {};
  let eventTimes = [];
  let topicId = null;


  console.log('aaaaa', kxConfig, window.kxConfig)

  // =================================================
  // Populating event details from query string
  // =================================================

  $j.get({
    url: "https://bookings.qudini.com/booking-widget/event/series/" + kxConfig.seriesId,
    success: seriesReceived
  });

  function seriesReceived(seriesData) {
      // get the Integer value for the current series as this is returned by the event API - we need to check below that the event is valid for the series
    kxConfig.seriesIdAsInt = seriesData.id;
    $j.get({
      url: "https://bookings.qudini.com/booking-widget/event/eventId/" + id,
      data: {
        timezone: "Europe/London",
        isoCurrentDate: isoCurrentDate.toISOString()
      },
      success: eventReceived
    })
  }

  function eventReceived(data) {
    eventDetails = data;

    topicId = data.topic.id;

    function sortEventExtra(event) {
      if (event.description) {
        var bits = event.description.split("||");

        event.description = bits[0];
        if (bits.length > 1) {
          bits[1] = bits[1].replace(/"/gi, '"').replace(/"/gi, '"');
          event.extra = JSON.parse(bits[1]);
        } else {
          event.extra = {};
        }
      }
    }

    //simple percentage calculation
    function per(current, orig) { return (current/orig*100) }
    //if limited, return true
    function limited(percentage) { return percentage < 30 && percentage > 0 ? true : false; }

    sortEventExtra(data);

    eventId = data.id;
    console.log(data.seriesId, kxConfig.seriesIdAsInt)
    if (data.seriesId == kxConfig.seriesIdAsInt) {
      const options = {
        identifier: data.identifier,
        groupSize: data.maxGroupSize,
        eventId: eventId,
        reoccurring: data.topic.id !== 212 ? true : false,
        image: data.bannerImageURL
          ? data.bannerImageURL
          : "https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
        title: data.title,
        startDate:
          moment(data.startDate).format("Do MMMM") ==
            moment(Date.now()).format("Do MMMM")
            ? "TODAY"
            : moment(data.startDate).format("Do MMMM"),
        startTime: (data.startTime[0] == '0' ? data.startTime.substr(1) : data.startTime),
        endTime: moment(data.startISO).utc().add(data.durationMinutes, 'minutes').format("LT"),
        passion: data.passions,
        // description: data.description.split(/(\.\s)/gm, 2).length > 1 ? data.description.replace(
        //   data.description.split(/(\.\s)/gm, 2)[0] + ". ",
        //   ""
        // ) : '',
        // firstSentence: data.description.split(/(\.\s)/gm, 1)[0].replace(/(\r\n|\n|\r)/gm, '<br>') + ".",
        description: data.description,
        firstSentence: "",
        maxReservations: data.maxReservations,
        slotsAvailable: data.slotsAvailable,
        limitedAvailability: limited(per(data.slotsAvailable, data.maxReservations)) && !data.hasPassed ? "limited tickets remaining" : "",
        //TEST BELOW
        // limitedAvailability: limited(per(29, 100)) ? "limited tickets remaining" : "",
        youtube: data.extra.youtubeid,
        externalbookinglink: data.extra.externalbookinglink,
        sponsor: "" || data.extra.sponsor
      };

      if (options.sponsor == "timeout") {

      } else if (options.sponsor == "guardian") {

      } else {


      }

      if (data.extra.instagramhashtag) {
        instagramHashTag = data.extra.instagramhashtag;
      }
      var startTime = moment(data.startISO).utc();
      var bookOptions = {
        startDate:
          moment(data.startDate).format("dddd Do MMMM YYYY") ==
            moment(Date.now()).format("dddd Do MMMM YYYY")
            ? "TODAY"
            : moment(data.startDate).format("dddd Do MMMM YYYY"),
        startTime: moment(startTime).format("LT"),
        endTime: moment(startTime)
          .add(data.durationMinutes, "m")
          .format("LT"),
        maxGroupSize: data.maxGroupSize,
        slotsAvailable: data.slotsAvailable
      };
      $j(".section.book")
        .find(".book-action__description")
        .text(
          bookOptions.startTime +
          " - " +
          bookOptions.endTime +
          " | " +
          bookOptions.startDate +
          " | Samsung KX"
        );
      $j(".book__tickets-tickets").attr({
        "max": bookOptions.maxGroupSize,
        "min": 1
      });
      $j(".book__tickets-tickets").change(function (e) {
        if (this.value > bookOptions.maxGroupSize || this.value > bookOptions.slotsAvailable) {
          this.classList.add("flash");
          setTimeout(function () {
            $j(".book__tickets-tickets").removeClass("flash");
          }, 500);
          doLog(bookOptions.maxGroupSize, bookOptions.slotsAvailable);
          this.value = Math.min.apply(null, [bookOptions.maxGroupSize, bookOptions.slotsAvailable]);
        }
      });
      doLog(options);
      $j(".singleEvent").append(handleTemplate("singleEvent", options));

      $j(".tile-desc--long").html($j(".tile-desc--long").html().split(/(\r\n|\n|\r)/gm).filter(a => a.length > 1).join('<br><br>'));
      // $j(".tile-desc--long").html($j(".tile-desc--long").html().split(/(\r\n|\n|\r)/gm).join('<br>'));

      // SPONSORS
      // If sponsor recognised, replace text with image
      if (options.sponsor) {
        var sponsorContainer = document.getElementById("sponsor");
        // var sponsorContainerMobile = document.getElementById("sponsor-mobile");
        switch (options.sponsor.toLowerCase()) {
          case "timeout":
            var sponsorImg = new Image();
            sponsorImg.src = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/external-logos/timeout.png';
            sponsorContainer.innerHTML = "";
            sponsorContainer.appendChild(sponsorImg);
            // var mobileImg = sponsorImg.cloneNode();
            // sponsorContainerMobile.innerHTML = "";
            // sponsorContainerMobile.appendChild(mobileImg);
            break;
          case "guardian":
            var sponsorImg = new Image();
            sponsorImg.src = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/external-logos/guardian_v2-white.png';
            sponsorContainer.innerHTML = "";
            sponsorContainer.appendChild(sponsorImg);
            // var mobileImg = sponsorImg.cloneNode();
            // sponsorContainerMobile.innerHTML = "";
            // sponsorContainerMobile.appendChild(mobileImg);
            break;
          default:
            break;
        }
      }


      // Event out of stock or has expired
      if (data.slotsAvailable == 0 || data.hasPassed) {
        $j(".event__content-book .btn--primary").addClass(
          "btn--primary-notActive"
        );

        if (data.hasPassed) {
          $j(".event__content-book .btn--primary").text("Expired")
        } else {
          $j(".event__content-book .btn--primary").text("Fully booked").addClass('fully-booked')
          $j(".btn--secondary.event-popup").css('display', 'flex')
          $j(".event-sold-out").css('display', 'block')
          $j(".limited.action").hide();
        }
      }
      // =================================================
      // Related Events
      // =================================================

      upcomingEvents(events, topicId, eventDetails);

      // =================================================
      // Find reocurring Events
      // =================================================

      eventTimes = events.filter(x => x.topic.id === topicId);

      doLog(eventTimes);
      var dates = {};
      //get all dates
      eventTimes.forEach(date => {
        if (!dates[date.startDate]) {
          dates[date.startDate] = [];
        }
      });
      //fill date objects
      eventTimes.forEach(event => {
        dates[event.startDate].push(event);
      });
      doLog(dates);
      //insert date options
      for (var date in dates) {
        $j("#date__options").append(
          new Option(moment(date).format("ddd D MMM"), date)
        );
      }
      createDropDown("#date__options");
      //watch for changes of select and build time slots based off of it
      updateTimes(dates, dates[0]);
      $j(".styledSelect").on("DOMNodeInserted", function (e) {
        $j(".change__form-submit").attr("disabled", true);
        $j(".change__form-submit").addClass("btn--primary-notActive");

        setTimeout(function () {


          updateTimes(dates, e.target.attributes.rel.value);
        }, 200);
      });

      function updateTimes(dates, currentDate) {
        doLog('current date', currentDate);
        var times = null;
        var currentSelection = $j(".styledSelect").attr("rel");
        if (!currentDate) {
          times = dates[currentSelection];
        } else {
          times = dates[currentDate];
        }
        $j(".change__times").empty();
        times.forEach(event => {
          var slots =
            event.slotsAvailable !== 0 ? "Available" : "Unavailable";

          var formattedStartTime = (event.startTime[0] == '0' ? event.startTime.substr(1) : event.startTime)

          var html =
            '<div class="change__time time ' +
            slots +
            '"data-id="' + event.id + '" data-link="' + event.extra.externalbookinglink + '" >' +
            '<h4 class="time__int">' +
            formattedStartTime +
            '</h4><span class="time__available">' +
            slots +
            " </span></div>";
          doLog(html);
          $j(".change__times").append(html);

          // if (event.slotsAvailable) {
          //   $j(".tile-desc.event-sold-out").css('display', 'block')
          // } else {
          //   $j(".tile-desc.event-sold-out").css('display', 'block')
          // }
        });
      }
    } else {
      // redirect to whats-on page
      var currentUrlSplitbySlash = window.location.href.split("/");
      window.location.href =
        currentUrlSplitbySlash
          .slice(0, currentUrlSplitbySlash.length - 2)
          .join("/") + "/";
    }
  }




  // Events

  $j(".singleEvent").on("click", ".action-btn", function (e) {
    e.preventDefault();



    $j(".action .action-btn").attr("disabled", true);
    $j(".action .action-btn:not(.fully-booked)").toggleClass("btn--primary-notActive");
    $j(".book").addClass("book--active");
    $j('.book__form__footer__error').css('opacity', 0);
    if ($j(this).hasClass("changeTime")) {
      $j(".change").addClass("change--active");
    } else {
      var title = $j(".singleEvent .tile_container .event__header-title").text();
      title = title.replace(/ /g, "-");
      var gaLa = $j('.book-action .book__form-submit').attr('ga-la');
      gaLa = gaLa.replace('[[ title ]]', title);
      $j('.book-action .book__form-submit').attr('ga-la', gaLa);
      var dataOmni = $j('.book-action .book__form-submit').attr('data-omni');
      dataOmni = dataOmni.replace('[[ title ]]', title);
      $j('.book-action .book__form-submit').attr('data-omni', dataOmni);
      $j(".book-action").addClass("book-action--active");
    }

    $j(".book").slideDown({
      complete: function () {
        $j(".close, .change__close").css({"visibility": "visible","opacity": 1});
      }
    });
    $j("body,html").animate(
      {
        scrollTop: $j(".book").offset().top - 40
      },
      800 //speed
    );

  });

  $j(".close, .change__close").on("click", function (e) {
    e.preventDefault();
    $j(".book").slideUp({
      complete: function () {
        $j(".close, .change__close").css({"visibility": "hidden","opacity": 0});
      }
    });
    $j(".book").removeClass("book--active");
    $j(".change").removeClass("change--active");
    $j(".book-action").removeClass("book-action--active");
    $j(".book-confirmation").removeClass("book-confirmation--active");
    $j("#book__form").trigger("reset");
    $j(".book__tickets__tc").each(function () {
      $j(this)
        .find("input")
        .removeClass("selected");
    });
    $j(".book").css("background", "");
    $j(".book__form-submit")
      .attr("disabled", false)
      .removeClass("btn--primary-notActive");

    $j(".action .action-btn").attr("disabled", false);
    $j(".action .action-btn:not(.fully-booked)").toggleClass("btn--primary-notActive");
  });

  $j(".singleEvent").on("click", ".share__container", function (e) {
    e.preventDefault();
    $j(".share__social").toggleClass("share__social--active");
    $j(this).toggleClass("share__container--active");
  });



  // =================================================
  // Instragram feed
  // =================================================

  //instagram(instagramHashTag);

  // =================================================
  // Related Events
  // =================================================

  // TODO - need to make a decision what to do when less than 6 related events

  // =================================================
  // Booking functionality
  // =================================================

  $j(".book").on("click", ".change__time", function () {
    //only one can be selected
    $j(".change__form-submit").attr("disabled", false);
    $j(".change__form-submit").removeClass("btn--primary-notActive");
    $j(".change__time").each(function () {
      $j(this).removeClass("selected");

    });


    if ($j(this).hasClass('Available')) {

      $j(this).addClass("selected");
    } else {
      $j('.change__form-submit').addClass('btn--primary-notActive')

    }
  });

  $j(".book").on("click", ".change__form-submit", function () {
    //get the event we need to populate

    eventId = $j('.change__time.selected').data('id');

    doLog(eventDetails.extra.externalbookinglink);
    if (eventDetails.extra.externalbookinglink && $j('.change__time.selected').data('link')) {
      window.open($j('.change__time.selected').data('link'), '_blank');
      return;
    } else {

      events.forEach(data => {
        if (data.id === eventId) {

          var startTime = moment(data.startISO).utc();
          var bookOptions = {
            startDate: (moment(data.startDate).format("dddd Do MMMM YYYY") == moment(Date.now()).format("dddd Do MMMM YYYY")) ? "TODAY" : moment(data.startDate).format("dddd Do MMMM YYYY"),
            startTime: moment(startTime).format("LT"),
            endTime: moment(startTime)
              .add(data.durationMinutes, "m")
              .format("LT"),
            maxGroupSize: data.maxGroupSize,
            slotsAvailable: data.slotsAvailable
          };
          $j(".section.book")
            .find(".book-action__description")
            .text(
              bookOptions.startTime +
              " - " +
              bookOptions.endTime +
              " | " +
              bookOptions.startDate +
              " | Samsung KX"
            );
          $j(".book__tickets-tickets").attr({
            "max": bookOptions.maxGroupSize,
            "min": 1
          });

          $j(".book__tickets-tickets").change(function (e) {

            if (this.value > bookOptions.maxGroupSize || this.value > bookOptions.slotsAvailable) {
              this.classList.add("flash");
              setTimeout(function () {
                $j(".book__tickets-tickets").removeClass("flash");
              }, 500);

              this.value = Math.min.apply(null, [bookOptions.maxGroupSize, bookOptions.slotsAvailable]);
            }
          });

          $j(".change").removeClass("change--active");
          $j(".book-action").addClass("book-action--active");

        }
      });

    }
  });

  $j(".book__tickets-minus").click(function (e) {
    ticketQuantity = parseInt($j(".book__tickets-tickets").val());
    if (ticketQuantity - 1 !== 0) {
      ticketQuantity -= 1;
      $j(".book__tickets-tickets").val(ticketQuantity);
    }
  });

  $j(".book__tickets-plus").click(function (e) {
    ticketQuantity = parseInt($j(".book__tickets-tickets").val());
    if (eventDetails.maxGroupSize !== ticketQuantity) {

      ticketQuantity += 1;

      doLog(eventDetails.maxGroupSize, ticketQuantity);

      $j(".book__tickets-tickets").val(ticketQuantity);

    }

  });

  // update ticketQuantity on change
  $j(".book__tickets-tickets").on('change', function (e) {
    ticketQuantity = this.value
    if (ticketQuantity > eventDetails.maxGroupSize) {
      $j(".book__tickets-tickets").val(eventDetails.maxGroupSize)
    } else if (ticketQuantity <= 0) {
      $j(".book__tickets-tickets").val(1)
    }
  });

  $j(".book__tickets__tc").each(function () {
    var $this = $j(this);

    $this.find("input").bind("change", function () {
      $j(this).toggleClass("selected");
    });

    $j(this).click(function () {
      if (
        $j(this)
          .find("input")
          .hasClass("selected")
      ) {
        $j(this)
          .find("input")
          .click();
      } else {
        $j(this)
          .find("input")
          .click();
      }
    });
  });

  function checkFormValidity(formID) {
    $j(formID + " input").each(function () {
      $j(this).off("invalid");
      $j('.book__form__footer__error').css('opacity', 0);
      $j(this).removeClass("invalid");
      if ($j(this).attr("type") === "checkbox") {
        $j(this)
          .parent()
          .removeClass("invalid");
      }
      $j(this).bind("invalid", function (e) {
        $j(this).addClass("invalid");
        $j('.book__form__footer__error').css('opacity', 1);
        if ($j(this).attr("type") === "checkbox") {
          $j(this)
            .parent()
            .addClass("invalid");
        }
      });
    });

    return $j(formID)[0].checkValidity();
  }

  $j(".book__form-submit").click(function (e) {
    e.preventDefault();

    if (checkFormValidity("#book__form")) {
      const form_name = $j(".book__form-name").val();
      const form_surname = $j(".book__form-surname").val();
      const form_tel = $j(".book__form-tel").val();
      const form_email = $j(".book__form-email").val();
      $j(".book__form-submit")
        .attr("disabled", true)
        .toggleClass("btn--primary-notActive");
      $j(".cm-configurator-loader").show();

      $j.ajax({
        type: "POST",
        url: "https://bookings.qudini.com/booking-widget/series/" + kxConfig.seriesId + "/event/book",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          firstName: form_name,
          lastName: form_surname,
          email: form_email,
          groupSize: ticketQuantity,
          mobileNumber: form_tel,
          subscribed: true,
          eventId: eventId,
          timezone: "Europe/London",
          postcode: ((document.getElementById("tc1").checked ? "KX," : "") + (document.getElementById("tc3").checked ? "SEUK," : "") + (document.getElementById("tc2").checked ? "Over13" : "")).split(",").join(" ")
        }),
        success: function (data) {
          $j(".cm-configurator-loader").hide();
          $j(".book-action").removeClass("book-action--active");
          $j(".book--active").css({
            background:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
              eventDetails.bannerImageURL +
              ")",
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover"
          });
          $j(".order-reference").text(data.refNumber);
          var orderInfo = $j(".book-action__description").text();
          $j(".order__time").text(orderInfo);

          // send booking reference to ga
          if (typeof ga !== "undefined") {
            var gaId = (location.host == 'qaweb-shop.samsung.com') ? "UA-101298876-1" : "UA-100137701-12";
            ga("create", gaId, { name: "gtm9999", cookieExpires: "33696000", cookieDomain: "auto" })
            ga("gtm9999.send", { hitType: "event", eventCategory: "microsite", eventAction: "feature", eventLabel: "kings-cross:event_get-tickets", dimension22: data.refNumber });
          }

          $j(".book-confirmation").addClass("book-confirmation--active");
        },
        fail: function (err) {
          $j(".book__form-submit").attr("disabled", false);
          $j(".cm-configurator-loader").hide();
          doLog(err);
        }
      });
    } else {
    }
  });
}
