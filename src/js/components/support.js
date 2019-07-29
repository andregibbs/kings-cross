// import customevent from '../polyfill/customevent-polyfill';

export default function support() {
    //console.log("Support module loaded.");

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
        oneToOne: "pink",
        support: "cyan",
        repair: "orange",
    };

    //Main Object

    var state = {
        active: false,
        category: "",
        stage: 0,
        navigation: document.getElementById("navigation"),
        nextBtn: document.getElementById("next"),
        backBtn: document.getElementById("back"),

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
                2: screens.details,
                3: screens.confirmation
            },

            support: {
                1: screens.calendar,
                2: screens.details,
                3: screens.confirmation
            },

            repair: {
                1: screens.deviceInfo,
                2: screens.calendar,
                3: screens.details,
                4: screens.confirmation
            }
        },

        startJourney: function (cat) {
            if (!this.active && ["oneToOne", "support", "repair"].indexOf(cat) != -1) {
                this.active = true;
                this.category = cat;
                this.stage = 1;

                console.log("???");
                $("html, body").animate({ scrollTop: $('.journey').offset().top - 300 }, 600);

                document.getElementById("btn-" + this.category).classList.add("btn--primary-notActive");

                this.nextBtn.classList.add("btn--primary--" + colors[cat])
                this.backBtn.classList.add("btn--secondary--" + colors[cat])
                screens.calendar.children[0].classList.add(colors[cat])
                document.getElementsByClassName("journey")[0].classList.add(colors[cat]);
                $(".checkbox").each(function (ind, elm) {
                    elm.classList.add("checkbox__" + colors[cat]);
                })

                console.log("init successful");

                document.getElementsByClassName("close")[0].style.display = "block";

                switch (this.category) {
                    case "oneToOne":
                        bookingURL = "https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/62711/0";
                        state.productId = "62711";
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

                console.log("Booking URL", bookingURL);

                var changeURL = new CustomEvent("changeURL", {
                    detail: {
                        url: bookingURL
                    }
                });

                var nextScreen = this.journeys[cat][1]
                if (nextScreen == screens.deviceInfo) {
                    $(nextScreen).slideDown({
                        start: function () {
                            $(this).css({
                                display: "block"
                            });
                            //console.log("Start");
                        },
                        complete: function () {
                            state.navigation.style.display = "flex";
                        }
                    });
                } else {
                    $(nextScreen).slideDown(400, function () {
                        state.navigation.style.display = "flex";
                    });
                }

                var sendEvent = sendEvent || function () {
                    setTimeout(function () {
                        if (screens.calendar.getAttribute("ready") == 'true') {
                            screens.calendar.dispatchEvent(changeURL);
                            console.log("Event dispatched.");
                        } else {
                            setTimeout(function () {sendEvent(); console.log("not ready")}, 200);
                        }
                    }, 200);
                };

                sendEvent();





            } else {
                //console.log("")
                this.cancelJourney();
                setTimeout(function () {
                    state.startJourney(cat);
                }, 525);

            }
        },

        cancelJourney: function () {

            $(this.journeys[this.category][this.stage]).slideUp(400, function () {
                $(state.navigation).slideUp(75, function () {
                    state.nextBtn.classList.remove("btn--primary--" + colors[state.category])
                    state.backBtn.classList.remove("btn--secondary--" + colors[state.category])
                    screens.calendar.children[0].classList.remove(colors[state.category]);
                    document.getElementsByClassName("journey")[0].classList.remove(colors[state.category]);
                    $("span.checkbox").each(function (ind, elm) {
                        elm.classList.remove("checkbox__" + colors[state.category]);
                    });
                    ["oneToOne", "support", "repair"].forEach(function (category) {
                        document.getElementById("btn-" + category).classList.remove("btn--primary-notActive");
                    });

                    $(".checkbox").siblings("input").prop("checked", false);
                    $(".calendar--selected").removeClass("calendar--selected");
                    $("#next").removeData("slot");
                    sendLock();

                    state.navigation.style.display = "";

                    clearState();

                    document.getElementById("details").reset();
                    document.getElementById("device-info").reset();
                    document.getElementsByClassName("close")[0].style.display = "";

                    window.history.replaceState({}, document.title, location.protocol + "//" + location.host + location.pathname);
                    // while ($(".calendar__container")[0].lastChild) {
                    //     $(".calendar__container")[0].removeChild($(".calendar__container")[0].lastChild);
                    // }
                });

            });


        },

        makeBooking: function () {
            //console.log("Got here");
            //console.log(state.requestInit);
            if (!state.requestInit) {
                state.requestInit = true;
                //Loading thingy needed HERE

                //Pls

                var name = document.getElementById("name").value;
                var surname = document.getElementById("surname").value;
                var email = document.getElementById("email").value;
                var phone = document.getElementById("tel").value;
                var marketing = document.getElementById("marketing").checked;
                var notes = "Model selected: " + state.deviceChosen + "; Colour: " + state.colorChosen + (state.imei ? "; IMEI: " + state.imei : "") + (state.deviceNotes ? "; Customer Notes: " + state.deviceNotes : "");
                var bookingData = {
                    "name": name,
                    "surname": surname,
                    "email": email,
                    "phone": phone,
                    "sendSms": true,
                    "marketingOptInSMS": marketing,
                    "time": (state.timeChosen.indexOf("+01:00") != -1) ? state.timeChosen.slice(0, -6) + "Z" : state.timeChosen,
                    "notes": notes
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
                            'lastname': bookingData.surname,
                            'emailAddress': bookingData.email,
                            'mobileNumber': bookingData.phone, // has a backend check, has to be a legitimate number
                            'notes': bookingData.notes,
                            'productId': state.productId,//Make dynamic
                            'bwIdentifier': "IZ0LYUJL6B0",
                            "marketingOptInSMS": bookingData.marketing,
                            "sendSms": true,
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
                            state.navigation.style.display = "";
                            sendUnlock();

                        } else {
                            alert("Fail :(");
                            //console.log(data);
                            document.getElementsByClassName("journey")[0].classList.remove("progress");
                            sendUnlock();
                        }
                    },
                    fail: function (err) {
                        document.getElementsByClassName("journey")[0].classList.remove("progress");
                        //console.log(err);
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
                $(current_device).data("colors", "N/A");
                selectorList.appendChild(current_device);


                for (var device = 0; device < devices.length; device++) {
                    current_device = document.createElement("option");
                    current_device.innerText = devices[device].name;
                    current_device.value = devices[device].model;
                    $(current_device).data("colors", devices[device].colors);
                    selectorList.appendChild(current_device);
                }

            },
            error: function (err) {
                ////console.log(err);
            }

        });
    }

    function validateUnlock() {
        //console.log("Validating");

        //console.log("Validating Device Info");
        if (state.colorChosen && state.deviceChosen && (state.imeiValid || !state.imei)) {
            //console.log("UNLOCK sent");
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

        //console.log('%c%s', 'color: #f2ceb6', "Tis logged");

        if (window.innerWidth <= 768 && viewport != "mobile") {
            //console.log("Still mobile");
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
            //console.log("Last digit correct");
            return true;
        } else {
            //console.log("Last digit false");
            return false;
        }

    }

    state.nextBtn.addEventListener("unlock", function () {
        // if ($(this).data("slot")) {
        if ($(this).data("slot")) {
            //console.log($(this).data("slot"));
            state.timeChosen = $(this).data("slot");
            state.queueId = $(this).data("queueId");
            //console.log($(this).data());
            //console.log(state.timeChosen, state.queueId);
            var dateObject = new Date(state.timeChosen);
            var timeSlotText = moment(dateObject).format("h:mm A | dddd Do YYYY") + " | Samsung KX";
            $(".time-selected").text(timeSlotText);
        }

        this.classList.remove("btn--primary-notActive");
        $(this).data("locked", false)
        //console.log("next unlocked")
        // }
    });

    state.nextBtn.addEventListener("lock", function () {
        //console.log("Next 'Locked'");
        this.classList.add("btn--primary-notActive");
        $(this).data("locked", true)
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
            $('#details input').filter('[required]').each(function (i, el) {
                isValid(el);
                if (formValid) {
                    sendUnlock();
                } else {
                    sendLock();
                }
            })
            $('#details input').filter('[required]').change(function () {
                isValid(this);
                sendUnlock();
            })
        }

        if (!$(this).data("locked") || formValid) {//Button not locked and not final screen
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
                }
            }
        }



    })
    //Back: if current screen is Confirmation, change Next/Book to Next

    state.backBtn.addEventListener("click", function () {
        if (state.stage <= 1) {
            state.cancelJourney();
        } else {
            //console.log(state.journeys[state.category][state.stage], screens.details)
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

    $("#model-selector").change(function () {

        state.colorChosen = "";

        while (colorBox.childElementCount > 1) {
            colorBox.removeChild(colorBox.lastChild);
        }

        if (this.selectedIndex != 0) {
            var deviceColors = $(this).find(":selected").data("colors").split(", ");
            for (var clr = 0; clr < deviceColors.length; clr++) {
                var color = document.createElement("option");
                color.value = deviceColors[clr];
                color.innerText = deviceColors[clr];
                colorBox.appendChild(color);
            }
        }


        if (this.value == "Unlisted_device") {
            $("#color-selector").val("N/A");
            state.colorChosen = "N/A";
            sendUnlock();
            return false;
        }

        //console.log(this.selectedIndex);

        if (this.selectedIndex != 0) {
            state.deviceChosen = this.children[this.selectedIndex].innerText;
        } else {
            state.deviceChosen = "";
            state.colorChosen = "";
        }

        validateUnlock();

    });

    $("#color-selector").change(function () {
        if (this.selectedIndex != 0) {
            state.colorChosen = this.options[this.selectedIndex].innerHTML;
        } else {
            state.colorChosen = "";
        }
        validateUnlock();
    });

    $("#imei").change(function () {
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
    $("#btn-oneToOne").click(function () { state.startJourney("oneToOne") })
    $("#btn-support").click(function () { state.startJourney("support") })
    $("#btn-repair").click(function () { state.startJourney("repair") })
    $(".close").click(function () { state.cancelJourney() })

    handleResize();

}