import '../librarys/jquery-ui-1.12.1.custom/jquery-ui.min.js'
import handleTemplate from './handleTemplate'
import getUrlVars from './getUrlVars'
import dataPicker from './dataPicker';
var eventsToRender = [];

export default function whatson( events ){

	let counter = 0;
	const passion = getUrlVars()["passions"];
	let numberEventsToShow = 30;
	let maxEvents = events.length;

	let getPassions = [];
	let getEventtype = [];
	var eventsToManipulate = events;

// =================================================
// DataPicker and filters
// =================================================

function lazyGetEvents(eventsToShow, numberOfEvents) {
	if(eventsToShow.length > 0) {
		$('.events__showMore').removeClass('noMore');
		$('.events__noResults').removeClass('active');
		let newEvents = [];
	numberEventsToShow += numberOfEvents;
	for(let i=0; i < numberEventsToShow; i++) {
		newEvents.push(eventsToShow[i]);
	}
	
	$('.eventTile').remove();
	renderEventsIntoDom( newEvents );

	} else {
		eventsToManipulate = [];
		$('.eventTile').remove();
		$('.events__showMore').addClass('noMore');
		$('.events__noResults').addClass('active');
	}
	

}



	

	// =================================================
	// DataPicker and filters
	// =================================================

	dataPicker()

	$('.events__showMore').click( function() {
		lazyGetEvents(eventsToManipulate, 4);
		if(numberEventsToShow + 4 > eventsToManipulate.length) {
			$('.events__showMore').addClass('noMore');
		}
		
	});

	$('.passions .switch, .suitables .switch').click( function() {
		$(this)
		.find('.label')
		.toggleClass('label--active')
		$(this).find('.switch-button')
		.toggleClass('selected')
		$(this).toggleClass('active')
	});

	$('.eventFilter__header__toggle').click( function() {

		$(this).find('a').toggleClass('unfold');
		if($('.filters__labels').hasClass('closed')) {
			
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

	$('.filters__results .btn').click( function() {


		if($(this).hasClass('btn--secondary')) {
			resetFilters()
		}

		updateFilters()

		var eventsToRender = events;



		if ( $('#from').val() && $('#to').val() ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				return event.startDate > moment($('#from').val(), "DD-MM-YYYY").format("MM/DD/YYYY") && event.startDate < moment($('#to').val(), "DD-MM-YYYY").format("MM/DD/YYYY") 
			})
		}


		if ( getPassions.length ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				if( event.extra.passions ) {
					return event.extra.passions.filter(passion => getPassions.includes(passion)).length > 0
				}
			} )
		}

		if ( getEventtype.length ) {
			eventsToRender = eventsToRender.filter( function( event ) {
				if( event.extra.eventtype ) {
					return event.extra.eventtype.filter(eventtype => getEventtype.includes(eventtype)).length > 0
				}
			} )
		}

		eventsToManipulate = eventsToRender;



		lazyGetEvents(eventsToRender, 0);
		

	})



	// =================================================
	// Events
	// =================================================

	if( passion ) {

		$('.passionImg')
			.find('img').attr('src', `/content/dam/samsung/uk/kings-cross/passion-header/passion-header-${passion}.jpg`)
			.addClass('op0--fade')

		const eventsFiltered = events.filter( function( event ) {
			return event.extra.passions.includes( passion )
		} )

		lazyGetEvents( eventsFiltered, 0 );

	} else {


		$('.passionImg')
			.find('img')
			.attr('src', `https://images.samsung.com/is/image/samsung/p5/uk/kings-cross/KX-whats-on-KV.jpg`)
			.addClass('op0--fade')

		lazyGetEvents( events, 0 )
	}

	// =================================================
	// function to update passions and suitables arrays
	// =================================================

	function updateFilters() {

		getPassions = []
		getEventtype = []

		$('.passions .switch.active').each( function() {
			getPassions.push( $(this).data('code') )
		})

		$('.suitables .switch.active').each( function() {
			getEventtype.push( $(this).data('code') )
		})

	}

	// =================================================
	// function to reset filters
	// =================================================

	function resetFilters() {

		$('.passions .switch, .suitables .switch').each( function() {
			$(this)
			.find('.label')
			.removeClass('label--active')
			$(this).find('.switch-button')
			.removeClass('selected')
			$(this).removeClass('active')
		});

		$('.filters__date__container input').each(function() {
			$(this).val('');
		})

	}

	// =================================================
	// Function to render only the events
	// Accepts the events as parameter
	// =================================================

	function renderEventsIntoDom( allEventsToRender ) {

		allEventsToRender.forEach( function( event, index ) {

			counter++

			
			const options = {
				identifier: event.identifier,
				eventId: event.id,
				image: event.imageURL ? event.imageURL : 'https://images.unsplash.com/photo-1560983719-c116f744352d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80',
				title: event.title,
				startDate: moment(event.startDate).format("Do MMMM") ==  moment(Date.now()).format("Do MMMM") ? 'TODAY' : moment(event.startDate).format("Do MMMM") ,
				startTime: event.startTime,
				passion: event.extra.passions,
				passionColor: event.extra.passionColor,
				suitables: event.extra.eventtype,
				suitablesName: event.extra.eventtypeName,
			}

			
			$('.events .events__container').append( handleTemplate( 'eventTile', options ) )

			if ( counter == 10 ) {
				counter = 0
			}
		})
		
	}


}
