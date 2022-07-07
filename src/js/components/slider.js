import handleTemplate from './handleTemplate'

export default function slider( data, element, sliderConfig, templateToRender ){

	// You can add your custom slick options, renders, behavior bellow by mathing $element parameter
	if( element == '.upComing' ) {

		$j('.slider-today').slick( sliderConfig )
		$j('.slider-futured').slick( sliderConfig )

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
				$j('.slider-today').slick('slickAdd', handleTemplate( templateToRender, handlebarsData));
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
				$j('.slider-futured').slick('slickAdd', handleTemplate( templateToRender, handlebarsData));
			}
		});

		$j('.header-click').click(function(){
			let getSlider = $j(this).data('slider')

			$j('.header-click').removeClass('header--active')
			$j(this).addClass('header--active')

			$j('.upComing__sliders .slider-item').hide().slick('destroy')
			$j('.upComing__sliders .slider-'+getSlider+'').show().slick(sliderConfig)
		})

	} else if( element == '.slider-discover-alt' || element == '.slider-discover' || element == '.slider-discover-recently' || element == '.slider-discover-recently-descriptions') {
		$j(element).slick( sliderConfig )

	} else if( templateToRender === 'experience' ) {

		$j(element).slick( sliderConfig )

	} else {
		$j(element).slick( sliderConfig )
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

			$j(element).slick('slickAdd', handleTemplate( templateToRender, handlebarsData ));
		});
	}

}
