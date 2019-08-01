import '../librarys/jquery-ui-1.12.1.custom/jquery-ui.min.js'
import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'
import dataPicker from './dataPicker';
var eventsToRender = [];

export default function whatson(events) {

	let counter = 0;
	const passion = getUrlVars()["passions"];
	let numberEventsToShow = 30;
	let maxEvents = events.length;

	let getPassions = [];
	let getEventtype = [];
	let eventsToManipulate = events;

	let filterOpen = false;

	let spantext = document.getElementsByClassName("eventFilter__header__toggle")[0].getElementsByTagName("span")[0];

	// =================================================
	// DataPicker and filters
	// =================================================

	if (passion) {
		var passionSwitch = $('[data-code="' + passion + '"]');
		if (!passionSwitch.hasClass("active")) {
			passionSwitch.addClass("active");
			passionSwitch.find(".label").addClass("label--active");
			passionSwitch.find(".switch-button").addClass("selected");
		}
	}

	function lazyGetEvents(eventsToShow, numberOfEvents) {
		if (eventsToShow.length > 0) {
			$('.events__showMore').removeClass('noMore');
			$('.events__noResults').removeClass('active');
			let newEvents = [];
			numberEventsToShow += numberOfEvents;
			for (let i = 0; i < numberEventsToShow; i++) {
				newEvents.push(eventsToShow[i]);
			}

			$('.eventTile').remove();
			renderEventsIntoDom(newEvents);

		} else {
			eventsToManipulate = [];
			$('.eventTile').remove();
			$('.events__showMore').addClass('noMore');
			$('.events__noResults').addClass('active');
			if (!filterOpen) {
				$('.eventFilter__header__toggle').click();
			}
		}


	}





	// =================================================
	// DataPicker and filters
	// =================================================

	dataPicker()

	$('.events__showMore').click(function () {
		lazyGetEvents(eventsToManipulate, 4);
		if (numberEventsToShow + 4 > eventsToManipulate.length) {
			// $('.events__showMore').addClass('noMore');
			$('.events__showMore').hide();
		}

	});

	$('.passions .switch, .suitables .switch').click(function () {
		$(this)
			.find('.label')
			.toggleClass('label--active')
		$(this).find('.switch-button')
			.toggleClass('selected')
		$(this).toggleClass('active')
	});

	$('.eventFilter__header__toggle').click(function () {
		$(this).find('a').toggleClass('unfold');

		if (this.getElementsByTagName("a")[0].classList.contains("unfold")) {
			spantext.innerText = "HIDE FILTERS";
			filterOpen = true;
		} else {
			spantext.innerText = "SHOW FILTERS";
			filterOpen = false;
		}

		if ($('.filters__labels').hasClass('closed')) {

			$('.filters__labels').slideDown();
			$('.filters__labels').toggleClass('closed');
			$("body,html").animate(
				{
					scrollTop: $(".eventFilter").offset().top
				},
				800 //speed
			);

		} else {
			$('.filters__labels').slideUp();
			$('.filters__labels').toggleClass('closed');
		}

	});

	$('.filters__results .btn').click(function () {


		if ($(this).hasClass('btn--secondary')) {
			resetFilters()
		}

		updateFilters()

		var eventsToRender = events;



		if ($('#from').val() && $('#to').val()) {
			eventsToRender = eventsToRender.filter(function (event) {
				return event.startDate >= moment($('#from').val(), "DD-MM-YYYY").format("MM/DD/YYYY") && event.startDate <= moment($('#to').val(), "DD-MM-YYYY").format("MM/DD/YYYY")
			})
		}


		if (getPassions.length) {
			eventsToRender = eventsToRender.filter(function (event) {
				if (event.extra.passions) {
					return event.extra.passions.filter(passion => getPassions.includes(passion)).length > 0
				}
			})
		}

		if (getEventtype.length) {
			eventsToRender = eventsToRender.filter(function (event) {
				if (event.extra.eventtype) {
					return event.extra.eventtype.filter(eventtype => getEventtype.includes(eventtype)).length > 0
				}
			})
		}

		eventsToManipulate = eventsToRender;



		lazyGetEvents(eventsToRender, 0);


	})



	// =================================================
	// Events
	// =================================================

	if (passion) {

		$('.whatsOn__kv').css('background','url(/content/dam/samsung/uk/explore/kings-cross/passion-header/passion-header-'+passion+'.jpg)');
		var passionName = getPassionName(passion);
		//console.log(passionName);
		$('.whatsOn__kv h2').text(passionName);

		const eventsFiltered = events.filter(function (event) {
			return event.extra.passions.includes(passion)
		})

		lazyGetEvents(eventsFiltered, 0);

	} else {


			$('.whatsOn__kv').css('background','url(/content/dam/samsung/uk/explore/kings-cross/passion-header/passion-header-generic.jpg)')

		lazyGetEvents(events, 0)
	}

	// =================================================
	// function to update passions and suitables arrays
	// =================================================

	function updateFilters() {

		getPassions = []
		getEventtype = []

		$('.passions .switch.active').each(function () {
			getPassions.push($(this).data('code'))
		})

		$('.suitables .switch.active').each(function () {
			getEventtype.push($(this).data('code'))
		})

	}

	// =================================================
	// function to reset filters
	// =================================================

	function resetFilters() {

		$('.passions .switch, .suitables .switch').each(function () {
			$(this)
				.find('.label')
				.removeClass('label--active')
			$(this).find('.switch-button')
				.removeClass('selected')
			$(this).removeClass('active')
		});

		$('.filters__date__container input').each(function () {
			$(this).val('');
		})

	}

	// =================================================
	// function to get passion point name
	// =================================================

	function getPassionName(code) {
		var name = '';
		for (var i = 0; i < kxConfig.passions.length; i++) {

			if (kxConfig.passions[i].code == code) {

				name = kxConfig.passions[i].name;

			}
		}
		return name;
	}

	// =================================================
	// Function to render only the events
	// Accepts the events as parameter
	// =================================================

	function renderEventsIntoDom(allEventsToRender) {

		// filter empty events
		allEventsToRender = allEventsToRender.filter(Boolean)

		allEventsToRender.forEach(function (event, index) {

			counter++

			const options = {
				identifier: event.identifier,
				eventId: event.id,
				image: event.imageURL ? event.imageURL : 'https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
				title: event.title,
				startDate: moment(event.startDate).format("Do MMMM") == moment(Date.now()).format("Do MMMM") ? 'TODAY' : moment(event.startDate).format("Do MMMM"),
				// startTime: event.startTime,
				startTime: (event.startTime[0] == '0' ?  event.startTime.substr(1) : event.startTime),
				passion: event.extra.passions,
				passionColor: event.extra.passionColor,
				suitables: event.extra.eventtype,
				suitablesName: event.extra.eventtypeName,
			}


			$('.events .events__container').append(handleTemplate('eventTile', options))

			if (counter == 10) {
				counter = 0
			}
		})

	}


}
