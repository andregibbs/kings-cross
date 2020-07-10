// import customevent from '../polyfill/customevent-polyfill';
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function support() {
    doLog("Support module loaded.");

    // customevent();

    var bookingURL = "";

    var unlock = new CustomEvent("unlock");
    var lock = new CustomEvent("lock");

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var viewport = "";

    var screens = {
        calendar: document.getElementById("calendar"),
        deviceInfo: document.getElementById("device-info"),
        details: document.getElementById("details"),
        confirmation: document.getElementById("confirmation")
    };

    var colors = {
        oneToOne: "coral",
        support: "cyan",
        repair: "orange",
    };

    var oneToOneVars = {
      maxLength: 30,
      placeholder: 'What do you need help with?* (30 characters minimum length)',
      header(inputLength) {
        let remaining = Math.max(oneToOneVars.maxLength - inputLength, 0)

        return `What do you need help with?${remaining > 0 ? `* (30 characters minimum length, ${remaining} remaining)` : ''}`
      }
    }

    //Main Object

    var state = {
        active: false,
        category: "",
        stage: 0,
        navigation: document.getElementById("navigation"),
        nextBtn: document.getElementById("next"),
        backBtn: document.getElementById("back"),
        close: document.getElementsByClassName("close")[0],

        modelIsSelected: false,
        colorIsSelected: false,

        productId: "62764",
        queueId: "7885",

        timeChosen: "",

        deviceChosen: "",
        colorChosen: "",
        deviceNotes: "",
        finalNotes: "",
        imei: "",
        imeiValid: true,

        requestInit: false,

        journeys: {
            oneToOne: {
                1: screens.calendar,
                2: screens.deviceInfo,
                3: screens.details,
                4: screens.confirmation
            },

            support: {
                1: screens.calendar,
                2: screens.deviceInfo,
                3: screens.details,
                4: screens.confirmation
            },

            repair: {
                1: screens.calendar,
                2: screens.deviceInfo,
                3: screens.details,
                4: screens.confirmation
            }
        },

        startJourney: function (cat) {
            if (!this.active && ["oneToOne", "support", "repair"].indexOf(cat) != -1) {
                this.active = true;
                this.category = cat;
                this.stage = 1;

                doLog("???");
                $j("html, body").animate({ scrollTop: $j('.journey').offset().top - 300 }, 600);

                document.getElementById("btn-" + this.category).classList.add("btn--primary-notActive");

                this.nextBtn.setAttribute("ga-la", "kings-cross:" + this.category.toLowerCase() + "_next");
                this.nextBtn.setAttribute("ga-ac", "feature");
                this.nextBtn.setAttribute("ga-ca", "microsite");

                this.nextBtn.setAttribute("ga-la", "kings-cross:" + this.category.toLowerCase() + "_next");
                this.nextBtn.setAttribute("data-omni", "uk:kings-cross:support:" + this.category.toLowerCase() + ":next");

                this.backBtn.setAttribute("ga-la", "kings-cross:" + this.category.toLowerCase() + "_back");
                this.backBtn.setAttribute("data-omni", "uk:kings-cross:support:" + this.category.toLowerCase() + ":back");

                this.nextBtn.classList.add("btn--primary--" + colors[cat]);
                this.backBtn.classList.add("btn--secondary--" + colors[cat]);
                screens.calendar.children[0].classList.add(colors[cat]);
                document.getElementsByClassName("journey")[0].classList.add(colors[cat]);
                $j(".checkbox").each(function (ind, elm) {
                    elm.classList.add("checkbox__" + colors[cat]);
                })

                // hide 121 description if visible
                // $j('#one-to-one-description').slideUp();

                doLog("init successful");

                switch (this.category) {
                    case "oneToOne":
                      bookingURL = "https://bookings.qudini.com/booking-widget/booker/slots/87J4665QG8U/4492/66526/0"
                      state.productId = "66526";
                      // one to one specific elements (these are reverted in cancelJourney)
                      // todo; maybe combine visiblity changes into a single class
                      $j('#one-to-one-description').slideDown(); // show 121 description
                      $j('#one-to-one-policy').addClass('visible'); // show 121 policy (hides default policy)
                      $j('#imei-row').hide(); // hide imei field
                      $j("#device-notes").attr('placeholder', oneToOneVars.placeholder) // set notes placholder text
                      $j("#oneToOne-device-notes-header").show(); // show device notes header
                      $j("#confirmation").addClass('confirmation-121') // add class to confirmation to adjust content
                      break;

                    case "support":
                        bookingURL = "https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/37437/0";
                        state.productId = "37437";
                        break;

                    case "repair":
                        bookingURL = "https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/62764/0";
                        state.productId = "62764";
                        break;
                    default:
                        console.error("Incorrect category");
                        return;
                }

                doLog("Booking URL", bookingURL);

                var changeURL = new CustomEvent("changeURL", {
                    detail: {
                        url: bookingURL
                    }
                });

                state.navigation.style.visibility = 'visible';

                var nextScreen = this.journeys[cat][1];
                if (nextScreen == screens.deviceInfo) {
                    $j(nextScreen).slideDown({
                        start: function () {
                            $j(this).css({
                                display: "block"
                            });
                            doLog("Start");
                        },
                        complete: function () {
                            // state.navigation.style.display = "flex";
                            state.navigation.style.opacity = 1;
                            state.navigation.style.height = 'auto';
                            state.navigation.style.visibility = "visible";

                            state.close.style.visibility = "visible";
                            state.close.style.opacity = 1;
                        }
                    });
                } else {
                    $j(nextScreen).slideDown(400, function () {
                        state.close.style.visibility = "visible";
                        state.close.style.opacity = 1;

                        state.navigation.style.height = 'auto';
                        state.navigation.style.opacity = 1;
                        state.navigation.style.visibility = "visible";
                    });
                }

                var sendEvent = sendEvent || function () {
                    setTimeout(function () {
                        if (screens.calendar.getAttribute("ready") == 'true') {
                            screens.calendar.dispatchEvent(changeURL);
                            doLog("Event dispatched.");
                        } else {
                            setTimeout(function () {
                                sendEvent();
                                doLog("not ready")
                            }, 200);
                        }
                    }, 200);
                };

                sendEvent();





            } else {
                doLog("")
                this.cancelJourney();
                setTimeout(function () {
                    state.startJourney(cat);
                }, 525);

            }
        },

        cancelJourney: function () {
            state.close.style.visibility = "hidden";
            state.close.style.opacity = 0;

            $j(this.journeys[this.category][this.stage]).slideUp({
                duration: 400, start: function () {
                    state.navigation.style.visibility = 'hidden';

                    $j(state.navigation).slideUp(75, function () {
                        state.navigation.style.height = 0;
                        state.navigation.style.opacity = 0;
                        state.navigation.style.visibility = 'hidden';

                        state.nextBtn.classList.remove("btn--primary--" + colors[state.category]);
                        state.backBtn.classList.remove("btn--secondary--" + colors[state.category]);
                        state.nextBtn.setAttribute("ga-la", "kings-cross:navigation_next");

                        state.nextBtn.setAttribute("ga-ac", "feature");
                        state.nextBtn.setAttribute("ga-ca", "microsite");


                        state.nextBtn.setAttribute("data-omni", "uk:kings-cross:support:navigation:next");

                        state.backBtn.setAttribute("ga-la", "kings-cross:navigation_back");
                        state.backBtn.setAttribute("data-omni", "uk:kings-cross:support:navigation:back");


                        screens.calendar.children[0].classList.remove(colors[state.category]);
                        document.getElementsByClassName("journey")[0].classList.remove(colors[state.category]);
                        $j("span.checkbox").each(function (ind, elm) {
                            elm.classList.remove("checkbox__" + colors[state.category]);
                        });
                        ["oneToOne", "support", "repair"].forEach(function (category) {
                            document.getElementById("btn-" + category).classList.remove("btn--primary-notActive");
                        });

                        $j(".checkbox").siblings("input").prop("checked", false);
                        $j(".calendar--selected").removeClass("calendar--selected");
                        $j("#next").removeData("slot");
                        sendLock();

                        // one to one specific elements
                        $j('#one-to-one-description').slideUp(); // hide 121 description
                        $j('#one-to-one-policy').removeClass('visible'); // hide one-to-one policy (makes default policy visible)
                        $j('#imei-row').show(); // show imei row
                        $j("#device-notes").attr('placeholder', 'Additional Information (Optional)') // reset device notes placholder
                        $j("#oneToOne-device-notes-header").hide() //hide device notes header
                        $j("#confirmation").removeClass('confirmation-121') // remove class toggling the 121 details

                        clearState();

                        document.getElementById("details").reset();
                        document.getElementById("device-info").reset();

                        window.history.replaceState({}, document.title, location.protocol + "//" + location.host + location.pathname);
                        // while ($j(".calendar__container")[0].lastChild) {
                        //     $j(".calendar__container")[0].removeChild($j(".calendar__container")[0].lastChild);
                        // }
                    });

                }, complete: function () {
                    state.navigation.style.display = '';
                    state.nextBtn.innerText = "NEXT";
                }
            });


        },

        makeBooking: function () {
            doLog("Got here");
            doLog(state.requestInit);
            if (!state.requestInit) {
                state.requestInit = true;
                //Loading thingy needed HERE

                //Pls

                var name = document.getElementById("name").value;
                var surname = document.getElementById("surname").value;
                var email = document.getElementById("email").value;
                var phone = document.getElementById("tel").value;
                var notes = (state.deviceChosen ? "Model selected: " + state.deviceChosen + "; " : "") + (state.colorChosen ? "Colour: " + state.colorChosen + "; ": "") + (state.imei ? "IMEI: " + state.imei : "") + (state.deviceNotes ? "; Customer Notes: " + state.deviceNotes : "");
                var bookingData = {
                    "name": name,
                    "surname": surname,
                    "email": email,
                    "phone": phone,
                    "sendSms": true,
                    "marketingOptInSMS": true,
                    "time": (state.timeChosen.indexOf("+01:00") != -1) ? state.timeChosen.slice(0, -6) + "Z" : state.timeChosen,
                    "notes": notes,
                    "postCode": ((document.getElementById("kx").checked ? "KX," : "") + (document.getElementById("seuk").checked ? "SEUK," : "") + (document.getElementById("age").checked ? "Over13" : "")).split(",").join(" ")
                };

                document.getElementsByClassName("journey")[0].classList.add("progress");
                sendLock();

                $.ajax({
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "https://bookings.qudini.com/booking-widget/booker/book",
                    data: JSON.stringify(
                        {
                            'queueId': state.queueId,//Make dynamic
                            'bookingStartTime': bookingData.time,
                            'bookingStartTimeString': bookingData.time,
                            'firstName': bookingData.name,
                            'surname': bookingData.surname,
                            'emailAddress': bookingData.email,
                            'mobileNumber': bookingData.phone, // has a backend check, has to be a legitimate number
                            'notes': bookingData.notes,
                            'productId': state.productId,//Make dynamic
                            'bwIdentifier': "IZ0LYUJL6B0",
                            "marketingOptInSMS": true,
                            "sendSms": true,
                            'postCode': bookingData.postCode
                        }
                    ),
                    success: function (data) {
                        var successMessages = ["success", "ok"];
                        document.getElementsByClassName("journey")[0].classList.remove("progress");
                        if ((successMessages.indexOf(data ? data.status : "R@ND0M") != -1 || successMessages.indexOf(data.status) != -1) && data.bookingRef) {
                            document.getElementById("ref").innerText = data.bookingRef;

                            state.journeys[state.category][state.stage].style.display = "";
                            state.stage++;
                            state.journeys[state.category][state.stage].style.display = "block";

                            state.nextBtn.innerText = "NEXT";

                            state.navigation.style.height = 0;
                            state.navigation.style.opacity = 0;
                            state.navigation.style.visibility = 'hidden';

                            sendUnlock();

                            if (ga) {
                                var gaId = (location.host == 'qaweb-shop.samsung.com') ? "UA-101298876-1" : "UA-100137701-12";
                                ga("create", gaId, { name: "gtm9999", cookieExpires: "33696000", cookieDomain: "auto" })
                                ga("gtm9999.send", { hitType: "event", eventCategory: "microsite", eventAction: "feature", eventLabel: `kings-cross:complete_${state.category.toLowerCase()}`, dimension22: data.bookingRef });
                            }

                        } else {
                            alert("Fail :(");
                            doLog(data);
                            document.getElementsByClassName("journey")[0].classList.remove("progress");
                            sendUnlock();
                        }
                    },
                    fail: function (err) {
                        document.getElementsByClassName("journey")[0].classList.remove("progress");
                        doLog(err);
                        sendUnlock();
                    }
                })
            }
        }

    };

    //Main Object end

    var colorBox = document.getElementById("color-selector");

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

    function initDeviceGrabs() {
        var url = "https://spreadsheets.google.com/feeds/list/1sVUkiE2351zGssyybR27Xb7vck3n5mZZCkZD6pb7zcc/1/public/values?alt=json";
        $.ajax({
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
            error: function (err) {
                //doLog(err);
            }

        });
    }

    function validateUnlock() {
        doLog("Validating");

        // 121 Specific validation,
        // if category is 121 & device notes length is less than 30
        if (state.category == 'oneToOne' && state.deviceNotes.length < oneToOneVars.maxLength) {
          return sendLock();
        }

        doLog("Validating Device Info");
        if (state.colorChosen && state.deviceChosen && (state.imeiValid || !state.imei)) {
            doLog("UNLOCK sent");
            state.imei = document.getElementById("imei").value;
            state.deviceNotes = document.getElementById("device-notes").value;
            sendUnlock();
        } else {
            sendLock();
        }

    }

    function sendUnlock() {
        state.nextBtn.dispatchEvent(unlock);
    }

    function sendLock() {
        state.nextBtn.dispatchEvent(lock);
    }

    function handleResize() {

        if (window.innerWidth <= 768 && viewport != "mobile") {
            doLog("Still mobile");
            document.getElementById("model-selector").children[0].innerText = "Model*";
            document.getElementById("color-selector").children[0].innerText = "Color*";
            viewport = "mobile";
        } else if (window.innerWidth > 768 && viewport != "desktop") {
            document.getElementById("model-selector").children[0].innerText = "Choose Your Model*";
            document.getElementById("color-selector").children[0].innerText = "Choose Device Colour*";
            viewport = "desktop";
        }
    }

    function clearState() {
        state.active = false;
        state.category = "";
        state.stage = 0;
        state.modelIsSelected = false;
        state.colorIsSelected = false;
        state.timeChosen = "";
        state.deviceChosen = "";
        state.colorChosen = "";
        state.deviceNotes = "";
        state.finalNotes = "";
        state.imei = "";
        state.requestInit = false;

    }

    function checkIMEI(imei) {
        var reg = /^\d{15}$/;

        if (!reg.test(imei)) {
            return false;
        }

        var sumOfFourteen = 0;

        for (var i = 0; i < imei.length - 1; i++) {

            if ((i + 1) % 2 == 0) {

                if (imei[i] * 2 > 9) {
                    var tempDigit = (parseInt(imei[i]) * 2).toString();
                    sumOfFourteen += parseInt(tempDigit[0]) + parseInt(tempDigit[1]);
                } else {
                    sumOfFourteen += parseInt(imei[i]) * 2;
                }

            } else {
                sumOfFourteen += parseInt(imei[i]);
            }

        }

        if (imei[imei.length - 1] == (Math.ceil(sumOfFourteen / 10) * 10 - sumOfFourteen)) {
            doLog("Last digit correct");
            return true;
        } else {
            doLog("Last digit false");
            return false;
        }

    }

    state.nextBtn.addEventListener("unlock", function () {
        // if ($j(this).data("slot")) {
        if ($j(this).data("slot")) {
            doLog($j(this).data("slot"));
            state.timeChosen = $j(this).data("slot");
            state.queueId = $j(this).data("queueId");
            doLog($j(this).data());
            doLog(state.timeChosen, state.queueId);
            var dateObject = new Date(state.timeChosen);
            var timeSlotText = moment(dateObject).format("h:mm A | dddd Do MMMM YYYY") + " | Samsung KX";
            $j(".time-selected").text(timeSlotText);
        }

        this.classList.remove("btn--primary-notActive");
        $j(this).data("locked", false)
        doLog("next unlocked")
        // }
    });

    state.nextBtn.addEventListener("lock", function () {
        doLog("Next 'Locked'");
        this.classList.add("btn--primary-notActive");
        $j(this).data("locked", true)
    });

    state.nextBtn.addEventListener("click", function () {

        if (state.journeys[state.category][state.stage + 1] == screens.calendar) {
            console.log("TRUE");
            var changeURL = new CustomEvent("changeURL", {
                detail: {
                    url: bookingURL
                }
            });

            screens.calendar.dispatchEvent(changeURL);
        }

        if (state.journeys[state.category][state.stage] == screens.details) {
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
            $j('#details input').filter('[required]').each(function (i, el) {
                isValid(el);
                if (formValid) {
                    sendUnlock();
                } else {
                    sendLock();
                }
            })
            $j('#details input').filter('[required]').change(function () {
                isValid(this);
                sendUnlock();
            })
        }

        if (!$j(this).data("locked") || formValid) {//Button not locked and not final screen
            if (state.journeys[state.category][state.stage] == screens.details) {
                state.makeBooking();

            } else {
                state.journeys[state.category][state.stage].style.display = "";
                state.stage++;
                var newScreen = state.journeys[state.category][state.stage];
                newScreen.style.display = "block";

                if (state.journeys[state.category][state.stage] != screens.details) {//If entering final screen
                    sendLock();
                }

                if (newScreen == screens.details) {
                    state.nextBtn.innerText = "BOOK NOW";
                    $j(state.nextBtn).removeAttr("ga-ca");
                    $j(state.nextBtn).removeAttr("ga-ac");
                    $j(state.nextBtn).removeAttr("ga-la");
                }
            }
        }
    })
    //Back: if current screen is Confirmation, change Next/Book to Next

    state.backBtn.addEventListener("click", function () {
        state.nextBtn.setAttribute("ga-la", 'kings-cross:navigation_next');
        state.nextBtn.setAttribute("ga-ac", "feature");
        state.nextBtn.setAttribute("ga-ca", "microsite");

        if (state.stage <= 1) {
            state.cancelJourney();
        } else {
            doLog(state.journeys[state.category][state.stage], screens.details)
            if (state.journeys[state.category][state.stage] == screens.details) {
                state.nextBtn.innerText = "NEXT";
            }
            state.journeys[state.category][state.stage].style.display = "";
            state.stage--;
            var newScreen = state.journeys[state.category][state.stage];
            if (newScreen == screens.deviceInfo) {
                newScreen.style.display = "flex";
            } else {
                newScreen.style.display = "block";
            }
            sendUnlock();
        }
    })

    $j("#model-selector").change(function () {

        state.colorChosen = "";

        while (colorBox.childElementCount > 1) {
            colorBox.removeChild(colorBox.lastChild);
        }

        if (this.selectedIndex != 0) {
            var deviceColors = $j(this).find(":selected").data("colors").split(", ");
            for (var clr = 0; clr < deviceColors.length; clr++) {
                var color = document.createElement("option");
                color.value = deviceColors[clr];
                color.innerText = deviceColors[clr];
                colorBox.appendChild(color);
            }
        }


        if (this.value == "Unlisted_device") {
            $j("#color-selector").val("N/A");
            state.colorChosen = "N/A";
            state.deviceChosen = "Not Listed";
            validateUnlock();
            return false;
        }

        doLog(this.selectedIndex);

        if (this.selectedIndex != 0) {
            state.deviceChosen = this.children[this.selectedIndex].innerText;
        } else {
            state.deviceChosen = "";
            state.colorChosen = "";
        }

        validateUnlock();

    });

    $j("#color-selector").change(function () {
        if (this.selectedIndex != 0) {
            state.colorChosen = this.options[this.selectedIndex].innerHTML;
        } else {
            state.colorChosen = "";
        }
        validateUnlock();
    });

    $j("#device-notes").bind('input propertychange', function () {
        // set text for 121 device notes header (only visible on 121)
        $j("#oneToOne-device-notes-header").text(oneToOneVars.header(this.value.length))
        // set device notes value to state for validation
        state.deviceNotes = this.value
        validateUnlock();
    })

    $j("#imei").change(function () {
        state.imei = this.value;
        state.imeiValid = checkIMEI(this.value);
        if (state.imei && !state.imeiValid) {
            this.classList.add("warn");
        } else {
            if (this.classList.contains("warn")) {
                this.classList.remove("warn");
            }
        }
        validateUnlock();
    })

    window.addEventListener('resize', function () {
        handleResize();
    })

    switch (getParam("journey")) {
        case "one-to-one":
            setTimeout(function () { state.startJourney("oneToOne"); }, 300);
            break;
        case "support":
            setTimeout(function () { state.startJourney("support"); }, 300);
            break;
        case "repair":
            setTimeout(function () { state.startJourney("repair"); }, 300);
            break;
        default:
            break;
    }

    initDeviceGrabs();
    $j("#btn-oneToOne").click(function () { state.startJourney("oneToOne") })
    $j("#btn-support").click(function () { state.startJourney("support") })
    $j("#btn-repair").click(function () { state.startJourney("repair") })
    $j(".close").click(function () { state.cancelJourney() })

    handleResize();



}
