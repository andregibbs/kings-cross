import handleTemplate from "./handleTemplate";
import instagram from "./instagram";
import upcomingEvents from "./upcomingEvents";
import getUrlVars from "./getUrlVars";
import createDropDown from "./createDropDown";

export default function singleEvent(events) {
  const isoCurrentDate = new Date();
  let eventId = "";
  const id = getUrlVars()["id"];
  let ticketQuantity = 1;
  let instagramHashTag = "";
  let eventDetails = {};
  let eventTimes = [];
  let topicId = null;

  // =================================================
  // Populating event details from query string
  // =================================================

  $.get(
    "https://bookings.qudini.com/booking-widget/event/series/" +
    kxConfig.seriesId
  ).success(function (seriesData) {
    // get the Integer value for the current series as this is returned by the event API - we need to check below that the event is valid for the series
    kxConfig.seriesIdAsInt = seriesData.id;

    $.get("https://bookings.qudini.com/booking-widget/event/eventId/" + id, {
      timezone: "Europe/London",
      isoCurrentDate: isoCurrentDate.toISOString()
    }).success(function (data) {
      eventDetails = data;

      topicId = data.topic.id;

      function sortEventExtra(event) {
        if (event.description) {
          var bits = event.description.split("||");

          event.description = bits[0];
          if (bits.length > 1) {
            event.extra = JSON.parse(bits[1]);
          } else {
            event.extra = {};
          }
        }
      }

      sortEventExtra(data);

      eventId = data.id;

      // TODO need to check event is for the correct series

      //console.log(
      //   "xxxxx - " +
      //     data.seriesId +
      //     " " +
      //     kxConfig.seriesId +
      //     " " +
      //     kxConfig.seriesIdAsInt
      // );

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
          passion: data.passions,
          description: data.description.split(". ", 2).length > 1 ? data.description.replace(
            data.description.split(". ", 2)[0] + ". ",
            ""
          ) : '',
          firstSentence: data.description.split(". ", 1)[0].replace(/(\r\n|\n|\r)/gm, '<br>') + ".",
          maxReservations: data.maxReservations,
          slotsAvailable: data.slotsAvailable,
          youtube: data.extra.youtubeid,
          externalbookinglink: data.extra.externalbookinglink
        };

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
        $(".section.book")
          .find(".book-action__description")
          .text(
            bookOptions.startTime +
            " - " +
            bookOptions.endTime +
            " | " +
            bookOptions.startDate +
            " | Samsung KX"
          );
        $(".book__tickets-tickets").attr({
          "max": bookOptions.maxGroupSize,
          "min": 1
        });
        $(".book__tickets-tickets").change(function (e) {
          if(this.value > bookOptions.maxGroupSize || this.value > bookOptions.slotsAvailable){
            this.classList.add("flash");
            setTimeout(function(){
              $(".book__tickets-tickets").removeClass("flash");
            }, 500);
            //console.log(bookOptions.maxGroupSize, bookOptions.slotsAvailable);
            this.value = Math.min.apply(null, [bookOptions.maxGroupSize, bookOptions.slotsAvailable]);
          }
        });
        //console.log(options);
        $(".singleEvent").append(handleTemplate("singleEvent", options));

        // Event out of stock or has expired
        if (data.slotsAvailable == 0 || data.hasPassed) {
          $(".event__content-book .btn--primary").addClass(
            "btn--primary-notActive"
          );

          if (data.hasPassed) {
            $(".event__content-book .btn--primary").text("Expired")
          } else {
            $(".event__content-book .btn--primary").text("Fully booked")
          }
        }
        // =================================================
        // Related Events
        // =================================================

        upcomingEvents(events, topicId);

        // =================================================
        // Find reocurring Events
        // =================================================

        eventTimes = events.filter(x => x.topic.id === topicId);

        //console.log(eventTimes);
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
        //console.log(dates);
        //insert date options
        for (var date in dates) {
          $("#date__options").append(
            new Option(moment(date).format("ddd D MMM"), date)
          );
        }
        createDropDown("#date__options");
        //watch for changes of select and build time slots based off of it
        updateTimes(dates, dates[0]);
        $(".styledSelect").on("DOMNodeInserted", function (e) {
          $(".change__form-submit").attr("disabled", true);
          $(".change__form-submit").addClass("btn--primary-notActive");

          setTimeout(function () {


            updateTimes(dates, e.target.attributes.rel.value);
          }, 200);
        });

        function updateTimes(dates, currentDate) {
          //console.log('current date', currentDate);
          var times = null;
          var currentSelection = $(".styledSelect").attr("rel");
          if (!currentDate) {
            times = dates[currentSelection];
          } else {
            times = dates[currentDate];
          }

          times.forEach(event => {
            var slots =
              event.slotsAvailable !== 0 ? "Available" : "Unavailable";

            var formattedStartTime = (event.startTime[0] == '0' ? event.startTime.substr(1) : event.startTime)

            var html =
              '<div class="change__time time ' +
              slots +
              '"data-id="' + event.id + '">' +
              '<h4 class="time__int">' +
              formattedStartTime +
              '</h4><span class="time__available">' +
              slots +
              " </span></div>";
            //console.log(html);
            $(".change__times").empty();
            $(".change__times").append(html);
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
    });
  });

  $(".singleEvent").on("click", ".action-btn", function (e) {
    e.preventDefault();

    $(".action .action-btn").attr("disabled", true);
    $(".action .action-btn").toggleClass("btn--primary-notActive");
    $(".book").addClass("book--active");
    $('.book__form__footer__error').css('opacity', 0);
    if ($(this).hasClass("changeTime")) {
      $(".change").addClass("change--active");
    } else {
      $(".book-action").addClass("book-action--active");
    }

    $(".book").slideDown();
    $("body,html").animate(
      {
        scrollTop: $(".book").offset().top - 40
      },
      800 //speed
    );

  });

  $(".close, .change__close").on("click", function (e) {
    e.preventDefault();
    $(".book").slideUp();
    $(".book").removeClass("book--active");
    $(".change").removeClass("change--active");
    $(".book-action").removeClass("book-action--active");
    $(".book-confirmation").removeClass("book-confirmation--active");
    $("#book__form").trigger("reset");
    $(".book__tickets__tc").each(function () {
      $(this)
        .find("input")
        .removeClass("selected");
    });
    $(".book").css("background", "");
    $(".book__form-submit")
      .attr("disabled", false)
      .removeClass("btn--primary-notActive");

    $(".action .action-btn").attr("disabled", false);
    $(".action .action-btn").toggleClass("btn--primary-notActive");
  });

  $(".singleEvent").on("click", ".share__container", function (e) {
    e.preventDefault();
    $(".share__social").toggleClass("share__social--active");
    $(this).toggleClass("share__container--active");
  });



  // =================================================
  // Instragram feed
  // =================================================

  instagram(instagramHashTag);

  // =================================================
  // Related Events
  // =================================================

  // TODO - need to make a decision what to do when less than 6 related events

  // =================================================
  // Booking functionality
  // =================================================

  $(".book").on("click", ".change__time", function () {
    //only one can be selected
    $(".change__form-submit").attr("disabled", false);
    $(".change__form-submit").removeClass("btn--primary-notActive");
    $(".change__time").each(function () {
      $(this).removeClass("selected");
    });
    $(this).addClass("selected");
  });

  $(".book").on("click", ".change__form-submit", function () {
    //get the event we need to populate
    eventId = $('.change__time.selected').data('id');

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
        $(".section.book")
          .find(".book-action__description")
          .text(
            bookOptions.startTime +
            " - " +
            bookOptions.endTime +
            " | " +
            bookOptions.startDate +
            " | Samsung KX"
          );
        $(".book__tickets-tickets").attr({
          "max": bookOptions.maxGroupSize,
          "min": 1
        });

        $(".book__tickets-tickets").change(function (e) {

          if(this.value > bookOptions.maxGroupSize || this.value > bookOptions.slotsAvailable){
            this.classList.add("flash");
            setTimeout(function(){
              $(".book__tickets-tickets").removeClass("flash");
            }, 500);
            console.log(bookOptions.maxGroupSize, bookOptions.slotsAvailable);
            this.value = Math.min.apply(null, [bookOptions.maxGroupSize, bookOptions.slotsAvailable]);
          }
        });

        $(".change").removeClass("change--active");
        $(".book-action").addClass("book-action--active");

      }
    });
  });

  $(".book__tickets-minus").click(function (e) {
    ticketQuantity = parseInt($(".book__tickets-tickets").val());
    if (ticketQuantity - 1 !== 0) {
      ticketQuantity -= 1;
      $(".book__tickets-tickets").val(ticketQuantity);
    }
  });

  $(".book__tickets-plus").click(function (e) {
    ticketQuantity = parseInt($(".book__tickets-tickets").val());
    if (eventDetails.maxGroupSize !== ticketQuantity) {

      ticketQuantity += 1;

      //console.log(eventDetails.maxGroupSize, ticketQuantity);

      $(".book__tickets-tickets").val(ticketQuantity);

    }

  });

  // update ticketQuantity on change
  $(".book__tickets-tickets").on('change', function (e) {
    ticketQuantity = this.value
    if (ticketQuantity > eventDetails.maxGroupSize) {
      $(".book__tickets-tickets").val(eventDetails.maxGroupSize)
    } else if (ticketQuantity <= 0) {
      $(".book__tickets-tickets").val(1)
    }
  });

  $(".book__tickets__tc").each(function () {
    var $this = $(this);

    $this.find("input").bind("change", function () {
      $(this).toggleClass("selected");
    });

    $(this).click(function () {
      if (
        $(this)
          .find("input")
          .hasClass("selected")
      ) {
        $(this)
          .find("input")
          .click();
      } else {
        $(this)
          .find("input")
          .click();
      }
    });
  });

  function checkFormValidity(formID) {
    $(formID + " input").each(function () {
      $(this).off("invalid");
      $('.book__form__footer__error').css('opacity', 0);
      $(this).removeClass("invalid");
      if ($(this).attr("type") === "checkbox") {
        $(this)
          .parent()
          .removeClass("invalid");
      }
      $(this).bind("invalid", function (e) {
        $(this).addClass("invalid");
        $('.book__form__footer__error').css('opacity', 1);
        if ($(this).attr("type") === "checkbox") {
          $(this)
            .parent()
            .addClass("invalid");
        }
      });
    });

    return $(formID)[0].checkValidity();
  }

  $(".book__form-submit").click(function (e) {
    e.preventDefault();

    if (checkFormValidity("#book__form")) {
      const form_name = $(".book__form-name").val();
      const form_surname = $(".book__form-surname").val();
      const form_tel = $(".book__form-tel").val();
      const form_email = $(".book__form-email").val();
      $(".book__form-submit")
        .attr("disabled", true)
        .toggleClass("btn--primary-notActive");
      $(".cm-configurator-loader").show();

      $.ajax({
        type: "POST",
        url:
          "https://bookings.qudini.com/booking-widget/series/" +
          kxConfig.seriesId +
          "/event/book",
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
          timezone: "Europe/London"
        }),
        success: function (data) {
          $(".cm-configurator-loader").hide();
          $(".book-action").removeClass("book-action--active");
          $(".book--active").css({
            background:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
              eventDetails.imageURL +
              ")",
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover"
          });
          $(".order-reference").text(data.refNumber);
          var orderInfo = $(".book-action__description").text();
          $(".order__time").text(orderInfo);

          // send booking reference to ga
          if (ga) {
            var gaId= (location.host == 'qaweb-shop.samsung.com')? "UA-101298876-1":"UA-100137701-12";
            ga("create", gaId, {name: "gtm9999", cookieExpires: "33696000", cookieDomain: "auto"})
            ga("gtm9999.send", {hitType: "event", eventCategory: "microsite", eventAction: "feature", eventLabel: "kings-cross:event_get-tickets", dimension22: data.refNumber});
          }

          $(".book-confirmation").addClass("book-confirmation--active");
        },
        fail: function (err) {
          $(".book__form-submit").attr("disabled", false);
          $(".cm-configurator-loader").hide();
          //console.log(err);
        }
      });
    } else {
    }
  });
}
