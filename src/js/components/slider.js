import handleTemplate from './handleTemplate'

export default function slider( data, element, sliderConfig, templateToRender ){

	// You can add your custom slick options, renders, behavior bellow by mathing $element parameter
	if( element == '.upComing' ) {

		$('.slider-today').slick( sliderConfig )
		$('.slider-futured').slick( sliderConfig )

		// Gets Data and populates slick container with items
		data.todayEvents.forEach( (item, index) => {
			// Get info from data and populates handlebars template with it
			const handlebarsData = {
				identifier: item.identifier,
				eventId: item.id,
				image: item.imageURL,
				title: item.title,
				startDate: item.startDate,
				startTime: item.startTime,
				passion: item.passions
			}

			// Limits the loop to 6 elements ( 5 = 6 )
			if ( index <= 5 ) {
				$('.slider-today').slick('slickAdd', handleTemplate( templateToRender, handlebarsData));
			}

		});
		// Gets Data and populates slick container with items
		data.monthPromotedEvents.forEach( (item, index) => {
			// Get info from data and populates handlebars template with it
			const handlebarsData = {
				identifier: item.identifier,
				eventId: item.id,
				image: item.imageURL,
				title: item.title,
				startDate: item.startDate,
				// startTime: item.startTime,
				startTime: (item.startTime[0] == '0' ?  item.startTime.substr(1) : item.startTime),
				passion: item.passions
			}

			// Limits the loop to 6 elements ( 5 = 6 )
			if ( index <= 5 ) {
				$('.slider-futured').slick('slickAdd', handleTemplate( templateToRender, handlebarsData));
			}
		});

		$('.header-click').click(function(){
			let getSlider = $(this).data('slider')

			$('.header-click').removeClass('header--active')
			$(this).addClass('header--active')

			$('.upComing__sliders .slider-item').hide().slick('destroy')
			$('.upComing__sliders .slider-'+getSlider+'').show().slick(sliderConfig)
		})

	} else if( element == '.slider-discover-alt' || element == '.slider-discover' || element == '.slider-discover-recently' || element == '.slider-discover-recently-descriptions') {
		$(element).slick( sliderConfig )

	} else if( templateToRender === 'experience' ) {

		$(element).slick( sliderConfig )

	} else {
		$(element).slick( sliderConfig )
		fetchSlickData()
	}

	function fetchSlickData(){
		// Gets Data and populates slick container with items
		data.forEach( item => {
			// Get info from data and populates handlebars template with it
			const handlebarsData = {
				identifier: item.identifier,
				eventId: item.id,
				image: item.imageURL,
				title: item.title,
				startDate: item.startDate,
				startTime: item.startTime,
				passion: item.passions
			}

			$(element).slick('slickAdd', handleTemplate( templateToRender, handlebarsData ));
		});
	}

}