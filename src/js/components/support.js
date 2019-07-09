export default function support() {

    console.log("Support module loaded.");

    var unlock = new CustomEvent("unlock");
    var lock = new CustomEvent("lock");

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
        imei: "",//FILL ME IN CODE PLS


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

                this.nextBtn.classList.add("btn--primary--" + colors[cat])
                this.backBtn.classList.add("btn--secondary--" + colors[cat])
                screens.calendar.children[0].classList.add(colors[cat])
                document.getElementsByClassName("journey")[0].classList.add(colors[cat]);
                $(".checkbox").each(function (ind, elm) {
                    elm.classList.add("checkbox__" + colors[cat]);
                })

                this.navigation.style.display = "flex";
                var nextScreen = this.journeys[cat][1]
                nextScreen == screens.deviceInfo ? nextScreen.style.display = "flex" : nextScreen.style.display = "block";

            } else {
                console.error("A journey is already activated.")
            };
        },

        cancelJourney: function () {
            this.nextBtn.classList.remove("btn--primary--" + colors[this.category])
            this.backBtn.classList.remove("btn--secondary--" + colors[this.category])
            screens.calendar.children[0].classList.remove(colors[this.category]);
            document.getElementsByClassName("journey")[0].classList.remove(colors[this.category]);
            $(".checkbox").each(function (ind, elm) {
                elm.classList.remove("checkbox__" + colors[this.category]);
            })

            $(".checkbox").siblings("input").prop("checked", false);
            $(".calendar--selected").removeClass("calendar--selected");
            $("#next").removeData("slot");
            sendLock();

            this.navigation.style.display = "";
            this.journeys[this.category][1].style.display = "";

            this.category = "";
            this.active = false;
            this.stage = 0;

        }

    };

    state.nextBtn.addEventListener("unlock", function () {
        // if ($(this).data("slot")) {
        console.log($(this).data("slot"));
        state.timeChosen = $(this).data("slot");
        this.classList.remove("btn--primary-notActive");
        $(this).data("locked", false)
        console.log("next unlocked")
        // }
    })

    state.nextBtn.addEventListener("lock", function () {
        console.log("Next 'Locked'");
        this.classList.add("btn--primary-notActive");
        $(this).data("locked", true)
    })

    state.nextBtn.addEventListener("click", function () {

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
            $('#bookingForm input').filter('[required]').each(function (i, el) {
                isValid(el);
                if (formValid) {
                    sendUnlock();
                } else {
                    sendLock();
                }
            })
            $('#bookingForm input').filter('[required]').change(function () {
                isValid(this);
                sendUnlock();
            })
        }

        if (!$(this).data("locked") || formValid) {//Button not locked and not final screen
            if (state.journeys[state.category][state.stage] == screens.details) {
                console.log("IM HERE");
                var requestInit = requestInit || false;

                if (!requestInit) {
                    requestInit = true;
                    //Loading thingy needed HERE

                    //Pls

                    var name = document.getElementById("name").value;
                    var surname = document.getElementById("surname").value;
                    var email = document.getElementById("email").value;
                    var phone = document.getElementById("tel").value;
                    var notes = "Model selected: " + state.deviceChosen + "; Colour: " + state.deviceColor + "; IMEI: " + state.imei + "; Customer Notes: " + state.deviceNotes;
                    var bookingData = {
                        "name": name,
                        "surname": surname,
                        "email": email,
                        "phone": phone,
                        "time": (state.timeChosen.indexOf("+01:00") != -1) ? state.timeChosen.slice(0, -6) + "Z" : state.timeChosen,
                        "notes": notes
                    };
                    //bookingData example: 
                    //{'name': 'John', 'surename': 'Smith', 'email': 'j.s@js.com', 'number': '07000000000', 'time': new Date(), 'notes': 'Pls fix my fone, fanks'};        
                    //console.log(bookingData.phone);

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
                                'email': bookingData.email,
                                'phone': bookingData.phone, // has a backend check, has to be a legitimate number
                                'notes': bookingData.notes,
                                'productId': state.productId,//Make dynamic
                                'bwIdentifier': "IZ0LYUJL6B0",
                                "sendSms": true
                            }
                        ),
                        success: function (data) {
                            $("#error-popup").hide();
                            //console.log(data);
                            var successMessages = ["success", "ok"];
                            if ((successMessages.indexOf(data.data ? data.data.status : "R@ND0M") != -1 || successMessages.indexOf(data.status) != -1) && data.data.bookingRef) {
                                // _this.steps++;
                                // _this.renderTemplate();
                                // $(".booking-summary-bookingref").text(data.data.bookingRef);
                                // $(".booking-summary-name").text(storeName);
                                // $(".booking-summary-address").text(storeAddress);
                                // $(".booking-summary-subject").text(_this.activeItems[0].innerText);
                                // $(".booking-summary-telephone").text($('.sl-appointment-start').data("phone"));

                                alert("Success!");
                                console.log(data);

                            } else {
                                alert("Fail :(");
                                console.log(data);
                            }
                        },
                        fail: function (err) {
                            console.log(err);
                        }
                    })
                }

            }
            state.journeys[state.category][state.stage].style.display = "";
            state.stage++;
            var newScreen = state.journeys[state.category][state.stage];
            newScreen.style.display = "block";
            if (state.journeys[state.category][state.stage] != screens.details) {//If entering final screen
                sendLock();
            }

            if (newScreen == screens.details) {
                state.nextBtn.innerText = "BOOK NOW";
            } else if (newScreen == screens.confirmation) {
                state.nextBtn.innerText = "NEXT";
                state.navigation.style.display = "";
            }
        }



    })
    //Back: if current screen is Confirmation, change Next/Book to Next
    state.backBtn.addEventListener("click", function () {
        if (state.stage <= 1) {
            state.cancelJourney();
        } else {
            console.log(state.journeys[state.category][state.stage], screens.details)
            if (state.journeys[state.category][state.stage] == screens.details) {
                state.nextBtn.innerText = "NEXT";
            }
            state.journeys[state.category][state.stage].style.display = "";
            state.stage--;
            var newScreen = state.journeys[state.category][state.stage];
            newScreen.style.display = "block";
            sendUnlock();
        }
    })

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
                //console.log(err);
            }

        });
    }

    var colorBox = document.getElementById("color-selector");

    initDeviceGrabs();
    $("#btn-oneToOne").click(function () { state.startJourney("oneToOne") })
    $("#btn-support").click(function () { state.startJourney("support") })
    $("#btn-repair").click(function () { state.startJourney("repair") })

    $("#model-selector").change(function () {
        if (this.selectedIndex != 0) {
            state.modelIsSelected = true;
            state.deviceChosen = this.children[this.selectedIndex].innerText;
            validateUnlock();
        } else {
            state.modelIsSelected = false;
            validateUnlock();
        }


        while (colorBox.childElementCount > 1) {
            colorBox.removeChild(colorBox.lastChild);
        }

        var deviceColors = $(this).find(":selected").data("colors").split(", ");

        for (var clr = 0; clr < deviceColors.length; clr++) {
            var color = document.createElement("option");
            color.value = deviceColors[clr];
            color.innerText = deviceColors[clr];
            colorBox.appendChild(color);
        }

        if (this.value == "Unlisted_device") {
            $("#color-selector").val("N/A");
            validateUnlock();
        }


    });

    $("#color-selector").change(function () {
        if (this.selectedIndex != 0) {
            state.colorIsSelected = true;
            state.colorChosen = this.options[this.selectedIndex].innerHTML;
            validateUnlock();
        } else {
            state.colorIsSelected = false;
            validateUnlock();
        }
    });

    function sendUnlock() {
        state.nextBtn.dispatchEvent(unlock);
    }
    function sendLock() {
        state.nextBtn.dispatchEvent(lock);
    }

    function validateUnlock() {
        console.log("Validating");

        switch (state.journeys[state.category][state.stage]) {
            case screens.deviceInfo:
                console.log("Validating Device Info");
                if (state.colorChosen && state.deviceChosen) {
                    console.log("UNLOCK sent");
                    state.imei = document.getElementById("imei").value;
                    state.deviceNotes = document.getElementById("device-notes").value;
                    sendUnlock();
                }
                break;

            case screens.calendar:
                if ($(state.nextBtn).data("slot")) {
                    sendUnlock();
                }
                break;

        }
    }

}