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

        journeys: {
            oneToOne: {
                1: screens.calendar,
                2: screens.details,
                3: screens.confirmation,
            },

            support: {
                1: screens.calendar,
                2: screens.details,
                3: screens.confirmation,
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
                this.journeys[cat][1].style.display = "block";

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
            state.nextBtn.dispatchEvent(lock);

            this.navigation.style.display = "";
            this.journeys[this.category][1].style.display = "";

            this.category = "";
            this.active = false;
            this.stage = 0;

        }

    };

    state.nextBtn.addEventListener("unlock", function () {
        if ($(this).data("slot")) {
            console.log($(this).data("slot"));
            this.classList.remove("btn--primary-notActive");
            $(this).data("locked", false)
        }
    })

    state.nextBtn.addEventListener("lock", function () {
        console.log("Next 'Locked'");
        this.classList.add("btn--primary-notActive");
        $(this).data("locked", true)
    })

    state.nextBtn.addEventListener("click", function () {

        if (state.journeys[state.category][state.category] == screens.details) {
            var formValid = true;
            function isValid(el) {
                formValid = true;
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
                    state.nextBtn.dispatchEvent(unlock);
                } else {
                    state.nextBtn.dispatchEvent(lock);
                }
            })
            $('#bookingForm input').filter('[required]').change(function () {
                isValid(this);
                if (formValid) {
                    state.nextBtn.dispatchEvent(unlock);
                } else {
                    state.nextBtn.dispatchEvent(lock);
                }
            })
        }

        if (!$(this).data("locked")) {//Button not locked and not final screen
            state.journeys[state.category][state.stage].style.display = "";
            state.stage++;
            var newScreen = state.journeys[state.category][state.stage];
            newScreen.style.display = "block";
            if (state.journeys[state.category][state.stage] != screens.details) {//If entering final screen
                state.nextBtn.dispatchEvent(lock);
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
            state.nextBtn.dispatchEvent(unlock);
        }
    })

    function detailsScreenHandler() {
        $('#bookingForm input').change(function () {
            var formValid = true;
            $('#bookingForm input').filter('[required]').each(function (i, el) {
                if (el.checkValidity() == false) {
                    formValid = false;
                }
            })
            if (formValid) {
                state.nextBtn.dispatchEvent(unlock);
            } else {
                state.nextBtn.dispatchEvent(lock);
            }
        })

    }

    $("#btn-oneToOne").click(function () { state.startJourney("oneToOne") })
    $("#btn-support").click(function () { state.startJourney("support") })
    $("#btn-repair").click(function () { state.startJourney("repair") })

}