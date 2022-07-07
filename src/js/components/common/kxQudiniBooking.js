/*

Refactored booking.js/kxtras qudini booking flow
No individual booking process included, all controled by args

*/

import calendar from '../calendar'
import checkIMEI from '../../util/CheckIMEI'

export class KXQudiniBooking {

  constructor(){
    ('KXQudiniBooking')
    this.calendar = null // initiate calendar on start with provided booking url

    this.unlockEvent = new CustomEvent("unlock")
    this.lockEvent = new CustomEvent("lock")

    this.elements = {
      main: document.querySelector('.kxQudiniBooking'),
      navigation: document.getElementById("navigation"),
      nextBtn: document.getElementById("next"),
      backBtn: document.getElementById("back"),
      close: document.querySelector('.kxQudiniBooking__close'),
      colorSelector: document.getElementById("color-selector"),
      modelSelector: document.getElementById("model-selector"),
      styleContainer: document.querySelector('.kxQudiniBooking__style'),
      confirmationTitle: document.querySelector('#confirmation-title')
    }

    // Component State
    this.state = {
      active: false,
      stage: 0,
      modelIsSelected: false,
      colorIsSelected: false,
      timeChosen: "",
      deviceChosen: "",
      colorChosen: "",
      deviceNotes: "",
      imei: "",
      imeiValid: true,
      requestInit: false,
      viewport: null
    }

    // booking data
    this.booking = {
      name: null,
      url: null,
      productId: null,
      queueId: null,
      journey: [],
      color: null,
      bookingWorkflowID: null,
    }

    this.populateDeviceData()
    this.setupEventListeners()
    this.configureViewport()
  }

  // Main method to initiate qudini booking
  start({bookingName, bookingURL, bookingProductID, bookingJourney, bookingColor, bookingWorkflowID, bookingTitle}) {
    if (this.state.active && bookingName === this.booking.name) {
      return
    } else if (this.state.active && bookingName != this.booking.name) {
      this.cancelJourney()
      return setTimeout(() => {
        return this.start({bookingName, bookingURL, bookingProductID, bookingJourney, bookingColor})
      }, 1000)
    }

    // new args for setting bookings
    this.booking.name = bookingName // name, replace category
    this.booking.title = bookingTitle
    this.booking.url = bookingURL
    this.booking.productId = bookingProductID
    this.booking.color = bookingColor
    this.booking.queueId = null // replace state.productId
    this.booking.bookingWorkflowID = bookingWorkflowID

    // maybe make optional/changable
    this.booking.journey = bookingJourney || [
      KXQudiniBooking.Screen.calendar,
      KXQudiniBooking.Screen.deviceInfo,
      KXQudiniBooking.Screen.details,
      KXQudiniBooking.Screen.confirmation
    ]

    // calendar, not refactored
    const allEvents = [] // not required
    if (!this.calendar) {
      this.calendar = calendar(bookingURL, "appointment", allEvents);
    }
    // old method of updating calendar dates
    var changeURL = new CustomEvent("changeURL", { detail: { url: bookingURL } });
    KXQudiniBooking.Screen.calendar.dispatchEvent(changeURL);
    this.startJourney()
  }


  // start component after init with options
  startJourney() {
    this.state.active = true // set component to active

    // scroll to component
    let scrollOffset = window.innerWidth > 768 ? 200 : 100
    $j("html, body").animate({ scrollTop: $j('.kxQudiniBooking').offset().top - scrollOffset }, 600);

    // set next button tracking data, replace category with bookingNAme
    this.elements.nextBtn.setAttribute("ga-la", "kings-cross:" + this.booking.name.toLowerCase() + "_next");
    this.elements.nextBtn.setAttribute("ga-ac", "feature");
    this.elements.nextBtn.setAttribute("ga-ca", "microsite");

    this.elements.nextBtn.setAttribute("ga-la", "kings-cross:" + this.booking.name.toLowerCase() + "_next");
    this.elements.nextBtn.setAttribute("data-omni", "uk:kings-cross:support:" + this.booking.name.toLowerCase() + ":next");

    this.elements.backBtn.setAttribute("ga-la", "kings-cross:" + this.booking.name.toLowerCase() + "_back");
    this.elements.backBtn.setAttribute("data-omni", "uk:kings-cross:support:" + this.booking.name.toLowerCase() + ":back");


    if (this.booking.color) {
      this.setBookingStyle(this.booking.color)
    }
    // set form element colors
    // this.nextBtn.classList.add("btn--primary--" + colors[cat]);
    // this.backBtn.classList.add("btn--secondary--" + colors[cat]);
    // screens.calendar.children[0].classList.add(colors[cat]);
    // document.getElementsByClassName("journey")[0].classList.add(colors[cat]);
    // $j(".checkbox").each(function (ind, elm) {
    //     elm.classList.add("checkbox__" + colors[cat]);
    // })

    // show next screen
    const comp = this
    const firstScreen = this.booking.journey[0]
    $j(firstScreen).slideDown(400, function () {
      comp.elements.close.style.visibility = "visible";
      comp.elements.close.style.opacity = 1;
      comp.elements.navigation.style.height = 'auto';
      comp.elements.navigation.style.opacity = 1;
      comp.elements.navigation.style.visibility = "visible";
    })
  }

  setBookingStyle(color) {
    this.elements.styleContainer.innerHTML = ''
    const styleEl = document.createElement('style')
    styleEl.type = 'text/css'

    styleEl.innerHTML = `
    .kxQudiniBooking a,
    .kxQudiniBooking .line,
    .kxQudiniBooking .booking-line {
      color: ${color};
    }
    .kxQudiniBooking #navigation .btn:not(.btn--primary-notActive),
    .kxQudiniBooking #navigation .btn--secondary {
      border-color: ${color};
    }
    .kxQudiniBooking #navigation .btn--primary:not(.btn--primary-notActive) {
      background-color: ${color};
    }
    .kxQudiniBooking #navigation .btn--primary:hover {
      color: white; // make var if needed
    }
    .kxQudiniBooking #navigation .btn:hover {
      color: white;
    }
    .kxQudiniBooking .calendar .calendar__choice {
      border: 3px solid ${color};
    }
    .kxQudiniBooking .calendar .calendar__choice:hover {
      background-color: ${color}; // fix opacity
    }
    .kxQudiniBooking .calendar .calendar--selected {
      background-color: ${color};
    }
    .kxQudiniBooking .calendar .calendar--selected:hover {
      background-color: ${color}; // fix opacity
    }
    .kxQudiniBooking .checkbox__container input:checked ~ .checkbox {
      background-color: ${color};
    }
    .kxQudiniBooking .booking-line {
      background-color: ${color};
    }
    `

    this.elements.styleContainer.appendChild(styleEl)

  }

  // send call to mmake booking
  makeBooking() {
    const comp = this;
    if (!this.state.requestInit) {
      this.state.requestInit = true;

      var name = document.getElementById("name").value;
      var surname = document.getElementById("surname").value;
      var email = document.getElementById("email").value;
      var phone = document.getElementById("tel").value;

      // replace leading 0 with +44
      if (phone[0] === "0") {
        phone = phone.replace(/^0/,"+44")
      }

      var notes = (this.state.deviceChosen ? "Model selected: " + this.state.deviceChosen + "; " : "") + (this.state.colorChosen ? "Colour: " + this.state.colorChosen + "; ": "") + (this.state.imei ? "IMEI: " + this.state.imei : "") + (this.state.deviceNotes ? "; Customer Notes: " + this.state.deviceNotes : "");
      var bookingData = {
        "name": name,
        "surname": surname,
        "email": email,
        "phone": phone,
        "sendSms": true,
        "marketingOptInSMS": true,
        "time": (this.state.timeChosen.indexOf("+01:00") != -1) ? this.state.timeChosen.slice(0, -6) + "Z" : this.state.timeChosen,
        "notes": notes,
        "postCode": ((document.getElementById("kx").checked ? "KX," : "") + (document.getElementById("seuk").checked ? "SEUK," : "") + (document.getElementById("age").checked ? "Over13" : "")).split(",").join(" ")
      };

      this.elements.main.classList.add("progress");
      // sendLock();


      $j.ajax({
        method: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "https://bookings.qudini.com/booking-widget/booker/book",
        data: JSON.stringify(
          {
            'queueId': comp.booking.queueId,//Make dynamic
            'bookingStartTime': bookingData.time,
            'bookingStartTimeString': bookingData.time,
            'firstName': bookingData.name,
            'surname': bookingData.surname,
            'emailAddress': bookingData.email,
            'mobileNumber': bookingData.phone, // has a backend check, has to be a legitimate number
            'notes': bookingData.notes,
            'productId': comp.booking.productId, //Make dynamic
            'bwIdentifier': comp.booking.bookingWorkflowID,
            "marketingOptInSMS": true,
            "sendSms": true,
            'postCode': bookingData.postCode
          }
        ),
        success: function (data) {
          var successMessages = ["success", "ok"];
          comp.elements.main.classList.remove("progress");
          if ((successMessages.indexOf(data ? data.status : "R@ND0M") != -1 || successMessages.indexOf(data.status) != -1) && data.bookingRef) {

            document.getElementById("ref").innerText = data.bookingRef;

            comp.elements.confirmationTitle.innerText = `${comp.booking.title} Confirmation`

            comp.booking.journey[comp.state.stage].style.display = "";
            comp.state.stage++;
            comp.booking.journey[comp.state.stage].style.display = "block";

            comp.elements.nextBtn.innerText = "NEXT";

            comp.elements.navigation.style.height = 0;
            comp.elements.navigation.style.opacity = 0;
            comp.elements.navigation.style.visibility = 'hidden';

            comp.elements.main.classList.remove("progress");

            comp.sendUnlock();

            if (ga) {
              var gaId = (location.host == 'qaweb-shop.samsung.com') ? "UA-101298876-1" : "UA-100137701-12";
              ga("create", gaId, { name: "gtm9999", cookieExpires: "33696000", cookieDomain: "auto" })
              ga("gtm9999.send", { hitType: "event", eventCategory: "microsite", eventAction: "feature", eventLabel: `kings-cross:complete_${comp.booking.name.toLowerCase()}`, dimension22: data.bookingRef });
            }

          } else {
            comp.elements.main.classList.remove("progress");
            sendUnlock();
          }
        },
        fail: function (err) {
          comp.elements.main.classList.remove("progress");
          sendUnlock();
        }
      })
    }
  }

  // INIT populate device selectors with data
  populateDeviceData() {
    // fills model select box with data
    var url = "https://spreadsheets.google.com/feeds/list/1sVUkiE2351zGssyybR27Xb7vck3n5mZZCkZD6pb7zcc/1/public/values?alt=json";
    $j.ajax({
      url: url,
      dataType: "jsonp",
      success: function (data) {
        var devices = [];
        for (var x = 0; x < data.feed.entry.length; x++) {
          var entry = data.feed.entry[x];
          devices.push({
            name: entry.gsx$devicename.$t,
            model: entry.gsx$devicemodel.$t,
            screen: entry.gsx$screen.$t,
            rcamera: entry.gsx$rearcamera.$t,
            fcamera: entry.gsx$frontcamera.$t,
            battery: entry.gsx$battery.$t,
            usb: entry.gsx$usbconnector.$t,
            colors: entry.gsx$colour.$t
          });
        }
        var selectorList = document.getElementById("model-selector");
        var current_device = document.createElement("option");
        current_device.innerText = "Device not listed";
        current_device.value = "Unlisted_device";
        $j(current_device).data("colors", "N/A");
        selectorList.appendChild(current_device);
        for (var device = 0; device < devices.length; device++) {
          current_device = document.createElement("option");
          current_device.innerText = devices[device].name;
          current_device.value = devices[device].model;
          $j(current_device).data("colors", devices[device].colors);
          selectorList.appendChild(current_device);
        }
      },
      error: function (err) {}
    });
  }

  // INIT - setup component events
  // lots of event listeners, not massively refactored
  setupEventListeners() {
    const comp = this
    // the next button is used to listen to events from the calendar
    // thsi instance for when a booking slot has been picked from the calendar
    this.elements.nextBtn.addEventListener("unlock", function () {
      if ($j(this).data("slot")) {
        comp.state.timeChosen = $j(this).data("slot");
        comp.booking.queueId = $j(this).data("queueId");
        var dateObject = new Date(comp.state.timeChosen);
        var timeSlotText = moment(dateObject).format("h:mm A | dddd Do MMMM YYYY") + " | Samsung KX";
        $j(".time-selected").text(timeSlotText);
      }
      this.classList.remove("btn--primary-notActive");
      $j(this).data("locked", false)
    });

    // the next button is locked
    this.elements.nextBtn.addEventListener("lock", function () {
      this.classList.add("btn--primary-notActive");
      $j(this).data("locked", true)
    });

    // next is clicked to progress the component
    this.elements.nextBtn.addEventListener("click", function () {
      // if we are on the details screen
      if (comp.booking.journey[comp.state.stage] == KXQudiniBooking.Screen.details) {
        var formValid = true;
        var isValid = isValid || function (el) {
          if (el.checkValidity() == false) {
            formValid = false;
            if (el.type == "checkbox") {
              el.parentElement.classList.add("warn");
            } else {
              el.classList.add("warn")
            }
          } else if (el.classList.contains("warn") || el.parentElement.classList.contains("warn")) {
            if (el.type == "checkbox") {
              el.parentElement.classList.remove("warn");
            } else {
              el.classList.remove("warn")
            }
          }
        }
        // TODO: tidy validation and validate on any input change
        $j('#details input').filter('[required]').each(function (i, el) {
          isValid(el);
          if (formValid) { comp.sendUnlock(); }
          else { comp.sendLock(); }
        })
        $j('#details input').filter('[required]').change(function () {
          isValid(this);
          comp.sendUnlock();
        })
      }
      const currentScreen = comp.booking.journey[comp.state.stage]
      // Button not locked and not final screen
      if (!$j(this).data("locked") || formValid) {
        // if on details, complete booking
        if (currentScreen == KXQudiniBooking.Screen.details) {
          comp.makeBooking();
        } else {
          // otherwise progress to next screen
          currentScreen.style.display = "";
          comp.state.stage++;
          var newScreen = comp.booking.journey[comp.state.stage];
          newScreen.style.display = "block";

          // dont send lock on initial
          if (newScreen !== KXQudiniBooking.Screen.details) {
            comp.sendLock()
          }
          // if entering details screen update button text

          if (newScreen === KXQudiniBooking.Screen.details) {
            comp.elements.nextBtn.innerText = "BOOK NOW";
            $j(comp.elements).removeAttr("ga-ca");
            $j(comp.elements).removeAttr("ga-ac");
            $j(comp.elements).removeAttr("ga-la");
          }
        }
      }
    })

    // back button is clicked
    this.elements.backBtn.addEventListener("click", function () {
      comp.elements.nextBtn.setAttribute("ga-la", 'kings-cross:navigation_next');
      comp.elements.nextBtn.setAttribute("ga-ac", "feature");
      comp.elements.nextBtn.setAttribute("ga-ca", "microsite");
      if (comp.state.stage <= 0) {
        comp.cancelJourney();
      } else {
        if (comp.booking.journey[comp.state.stage] == KXQudiniBooking.Screen.details) {
          comp.elements.nextBtn.innerText = "NEXT";
        }
        comp.booking.journey[comp.state.stage].style.display = "";
        comp.state.stage--;
        const newScreen = comp.booking.journey[comp.state.stage];
        // TODO: get rid of this, use an attribute to hide
        if (newScreen == KXQudiniBooking.Screen.deviceInfo) {
          newScreen.style.display = "flex";
        } else {
          newScreen.style.display = "block";
        }
        comp.sendUnlock();
      }
    })

    // model dropdown is changed
    $j("#model-selector").change(function () {
      comp.state.colorChosen = "";
      while (comp.elements.childElementCount > 1) {
        comp.elements.colorSelector.removeChild(comp.elements.colorBox.lastChild);
      }
      if (this.selectedIndex != 0) {
        var deviceColors = $j(this).find(":selected").data("colors").split(", ");
        for (var clr = 0; clr < deviceColors.length; clr++) {
          var color = document.createElement("option");
          color.value = deviceColors[clr];
          color.innerText = deviceColors[clr];
          comp.elements.colorSelector.appendChild(color);
        }
      }
      if (this.value == "Unlisted_device") {
        $j("#color-selector").val("N/A");
        comp.state.colorChosen = "N/A";
        comp.state.deviceChosen = "Not Listed";
        comp.validateUnlock();
        return false;
      }
      if (this.selectedIndex != 0) {
        comp.state.deviceChosen = this.children[this.selectedIndex].innerText;
      } else {
        comp.state.deviceChosen = "";
        comp.state.colorChosen = "";
      }
      comp.validateUnlock();
    });

    $j("#color-selector").change(function () {
      if (this.selectedIndex != 0) {
        comp.state.colorChosen = this.options[this.selectedIndex].innerHTML;
      } else {
        comp.state.colorChosen = "";
      }
      comp.validateUnlock();
    });

    $j("#device-notes").bind('input propertychange', function () {
      // set device notes value to state for validation
      comp.state.deviceNotes = this.value
      comp.validateUnlock();
    })

    $j("#imei").change(function () {
      comp.state.imei = this.value;
      comp.state.imeiValid = checkIMEI(this.value);
      if (comp.state.imei && !comp.state.imeiValid) {
        this.classList.add("warn");
      } else {
        if (this.classList.contains("warn")) {
          this.classList.remove("warn");
        }
      }
      comp.validateUnlock();
    })

    $j(".close").click(function () {
      comp.cancelJourney()
    })

    window.addEventListener('resize', function () {
      comp.configureViewport();
    })
  }

  resetState() {
    // revert any state values
    this.state.active = false;
    this.state.stage = 0;
    this.state.modelIsSelected = false;
    this.state.colorIsSelected = false;
    this.state.timeChosen = "";
    this.state.deviceChosen = "";
    this.state.colorChosen = "";
    this.state.deviceNotes = "";
    this.state.imei = "";
    this.state.imeiValid = true;
    this.state.requestInit = false;

    this.booking = {
      name: null,
      url: null,
      productId: null,
      queueId: null,
      journey: [],
      color: null
    }
  }

  cancelJourney() {
    const comp = this // component
    comp.elements.close.style.visibility = "hidden";
    comp.elements.close.style.opacity = 0;

    // component event emitted to capture above
    if (this.onJourneyCancel) {
      this.onJourneyCancel()
    }

    $j(comp.booking.journey[comp.state.stage]).slideUp({
      duration: 400, start: function () {
        comp.elements.navigation.style.visibility = 'hidden';
        $j(comp.elements.navigation).slideUp(75, function () {
          comp.elements.navigation.style.height = 0;
          comp.elements.navigation.style.opacity = 0;
          comp.elements.navigation.style.visibility = 'hidden';
          $j(".checkbox").siblings("input").prop("checked", false);
          $j(".calendar--selected").removeClass("calendar--selected");
          $j("#next").removeData("slot");
          comp.sendLock();
          comp.resetState();
          document.getElementById("details").reset();
          document.getElementById("device-info").reset();
        });
      }, complete: function () {
        comp.elements.navigation.style.display = '';
        comp.elements.nextBtn.innerText = "NEXT";
      }
    });
  }

  // NEXT Button Lock events
  sendUnlock() { this.elements.nextBtn.dispatchEvent(this.unlockEvent) }
  sendLock() { this.elements.nextBtn.dispatchEvent(this.lockEvent) }

  // validate form for component progress
  validateUnlock() {
    // TODO: update this with conditional
    if (state.colorChosen && state.deviceChosen && (state.imeiValid || !state.imei)) {
      state.imei = document.getElementById("imei").value;
      state.deviceNotes = document.getElementById("device-notes").value;
      this.sendUnlock();
    } else {
      this.sendLock();
    }
  }

  configureViewport() {

    if (window.innerWidth <= 768 && this.state.viewport != "mobile") {
      this.elements.modelSelector.innerText = "Model*";
      this.elements.colorSelector.innerText = "Color*";
      this.state.viewport = "mobile";
    } else if (window.innerWidth > 768 && this.state.viewport != "desktop") {
      this.elements.modelSelector.innerText = "Choose Your Model*";
      this.elements.colorSelector.innerText = "Choose Device Colour*";
      this.state.viewport = "desktop";
    }
  }

}

// screen consts
KXQudiniBooking.Screen = {
  calendar: document.getElementById("calendar"),
  deviceInfo: document.getElementById("device-info"),
  details: document.getElementById("details"),
  confirmation: document.getElementById("confirmation")
}

KXQudiniBooking.DefaultScreens = [
  KXQudiniBooking.Screen.calendar,
  KXQudiniBooking.Screen.deviceInfo,
  KXQudiniBooking.Screen.details,
  KXQudiniBooking.Screen.confirmation,
]

KXQudiniBooking.Screens_NoDeviceInfo = [
  KXQudiniBooking.Screen.calendar,
  KXQudiniBooking.Screen.details,
  KXQudiniBooking.Screen.confirmation,
]

export default KXQudiniBooking
