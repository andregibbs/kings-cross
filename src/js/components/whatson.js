import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'
import dataPicker from './dataPicker';
var eventsToRender = [];
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function whatson(events) {
	let counter = 0;
	const passion = getUrlVars()["passions"];
	let numberEventsToShow = 24;
	let maxEvents = events.length;

	let getPassions = [];
	let getEventtype = [];
	let eventsToManipulate = events;

	let filterOpen = false;

	// let spantext = document.getElementsByClassName("eventFilter__header__toggle")[0].getElementsByTagName("span")[0];

  // remove initial private events
  events = events.filter((event) => {
    return !event.extra.private
  })


	// =================================================
	// DataPicker and filters
	// =================================================

	if (passion) {
		var passionSwitch = $j('[data-code="' + passion + '"]');
		if (!passionSwitch.hasClass("active")) {
			passionSwitch.addClass("active");
			passionSwitch.find(".label").addClass("label--active");
			passionSwitch.find(".switch-button").addClass("selected");
		}
	}

	function lazyGetEvents(eventsToShow, numberOfEvents) {
		if (eventsToShow.length > 0) {
			$j('.events__showMore').removeClass('noMore');
			$j('.events__noResults').removeClass('active');
			let newEvents = [];
			numberEventsToShow += numberOfEvents;
			for (let i = 0; i < numberEventsToShow; i++) {
				newEvents.push(eventsToShow[i]);
			}

      // filter if there is event is null
      newEvents = newEvents.filter(event => !!event)

      // if all events do not exceed total to show, hide the show more button
      if (newEvents.length < numberEventsToShow) {
        $j('.events__showMore').hide();
      }

			$j('.eventTile').remove();
			renderEventsIntoDom(newEvents);

		} else {
			eventsToManipulate = [];
			$j('.eventTile').remove();
			$j('.events__showMore').addClass('noMore');
			$j('.events__noResults').addClass('active');
			if (!filterOpen) {
				$j('.eventFilter__header__toggle').click();
			}
		}


	}





	// =================================================
	// DataPicker and filters
	// =================================================

	dataPicker()

	$j('.events__showMore').click(function () {
		if (numberEventsToShow + 12 > eventsToManipulate.length) {
			// console.log("Events to show", numberEventsToShow);
			// console.log("Events to manipulate", eventsToManipulate);

			if(passion){
				eventsToManipulate = eventsToManipulate.filter(function (event) {
					return event.extra.passions.includes(passion)
				})
			}

      // remove priavte
      eventsToManipulate = eventsToManipulate.filter((event) => {
        return !event.extra.private
      })


			lazyGetEvents(eventsToManipulate, eventsToManipulate.length - numberEventsToShow );
			$j('.events__showMore').hide();
		} else {
			lazyGetEvents(eventsToManipulate, 12);
		}

	});

	$j('.passions .switch, .suitables .switch').click(function () {
		$j(this)
			.find('.label')
			.toggleClass('label--active')
		$j(this).find('.switch-button')
			.toggleClass('selected')
		$j(this).toggleClass('active')
	});

	$j('.eventFilter__header__toggle').click(function () {
		$j(this).find('a').toggleClass('unfold');

		if (this.getElementsByTagName("a")[0].classList.contains("unfold")) {
			spantext.innerText = "HIDE FILTERS";
			filterOpen = true;
		} else {
			spantext.innerText = "SHOW FILTERS";
			filterOpen = false;
		}

		if ($j('.filters__labels').hasClass('closed')) {

			$j('.filters__labels').slideDown();
			$j('.filters__labels').toggleClass('closed');
			// $j("body,html").animate(
			// 	{
			// 		scrollTop: $j(".eventFilter").offset().top
			// 	},
			// 	800 //speed
			// );

		} else {
			$j('.filters__labels').slideUp();
			$j('.filters__labels').toggleClass('closed');
		}

	});

	$j('.filters__results .btn').click(function () {


		if ($j(this).hasClass('btn--secondary')) {
			resetFilters()
		} else {
			$j("body,html").animate(
				{
					scrollTop: $j(".section.events").offset().top - 100
				},
				400);
		}
		numberEventsToShow = 24;
		$j('.events__showMore').show();



		updateFilters()



		var eventsToRender = events;



		if ($j('#from').val() && $j('#to').val()) {
			eventsToRender = eventsToRender.filter(function (event) {
				return event.startDate >= moment($j('#from').val(), "DD-MM-YYYY").format("MM/DD/YYYY") && event.startDate <= moment($j('#to').val(), "DD-MM-YYYY").format("MM/DD/YYYY");
			});
		} else if ($j('#from').val()) {
			eventsToRender = eventsToRender.filter(function (event) {
				return event.startDate >= moment($j('#from').val(), "DD-MM-YYYY").format("MM/DD/YYYY");
			});
		} else if ($j('#to').val()) {
			eventsToRender = eventsToRender.filter(function (event) {
				return event.startDate <= moment($j('#to').val(), "DD-MM-YYYY").format("MM/DD/YYYY");
			});
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
		$j('.whatsOn__kv > div > h2').addClass('kv__dark__theme')
		$j('.whatsOn__kv').css('background', 'url(https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/passion-header/passion-header-' + passion + '.jpg)');
		var passionName = getPassionName(passion);
		doLog(passionName);
		$j('.whatsOn__kv h2').text(passionName);

		const eventsFiltered = events.filter(function (event) {
			return event.extra.passions.includes(passion)
		})

		lazyGetEvents(eventsFiltered, 0);

	} else {
		$j('.whatsOn__kv').css('background-image', 'url(https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/passion-header/passion-header-generic.jpg)')

    // console.log('pre', events);
		lazyGetEvents(events, 0);
	}

	// =================================================
	// function to update passions and suitables arrays
	// =================================================

	function updateFilters() {

		getPassions = []
		getEventtype = []

		$j('.passions .switch.active').each(function () {
			getPassions.push($j(this).data('code'))
		})

		$j('.suitables .switch.active').each(function () {
			getEventtype.push($j(this).data('code'))
		})

	}

	// =================================================
	// function to reset filters
	// =================================================

	function resetFilters() {

		$j('.passions .switch, .suitables .switch').each(function () {
			$j(this)
				.find('.label')
				.removeClass('label--active')
			$j(this).find('.switch-button')
				.removeClass('selected')
			$j(this).removeClass('active')
		});

		$j('.filters__date__container input').each(function () {
			$j(this).val('');
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

    // console.log('render', allEventsToRender)

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
				startTime: (event.startTime[0] == '0' ? event.startTime.substr(1) : event.startTime),
				passion: event.extra.passions,
				passionColor: event.extra.passionColor,
				suitables: event.extra.eventtype,
				suitablesName: event.extra.eventtypeName,
			}


			$j('.events .events__container').append(handleTemplate('eventTile', options))

			if (counter == 10) {
				counter = 0
			}
		})

	}


}
