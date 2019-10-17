import slider from './slider'

// export default function discover( events ) {

// 	const sliderConfig = {
// 		lazyLoad: 'ondemand',
// 		dots: true,
// 		infinite: false,
// 		speed: 500,
// 		fade: false,
// 		cssEase: 'linear'
// 	}

// 	slider( events, '.slider-discover', sliderConfig, 'homeKv' );

// 	window.$( document ).ready(function() {
// 		setTimeout(function(){
// 			if(window.location.hash == "#whitepaper") {
// 				$("#slick-slide01").click();
// 			}
// 		},300);
// 	});

	

// 	//video

// 	// $("video").click(function(e){

// 	// 	// handle click if not Firefox (Firefox supports this feature natively)
// 	// 	if (typeof InstallTrigger === 'undefined') {
	
// 	// 		// get click position 
// 	// 		var clickY = (e.pageY - $(this).offset().top);
// 	// 		var height = parseFloat( $(this).height() );
	
// 	// 		// avoids interference with controls
// 	// 		if (clickY > 0.82*height) return;
	
// 	// 		// toggles play / pause
// 	// 		this.paused ? this.play() : this.pause();
// 	// 	}
// 	// });

// }






export default function discover( events ) {

	const sliderConfig = {
		lazyLoad: 'ondemand',
		slidesToShow: 3,
		infinite: true,
		centerMode: true,
		slidesToScroll: 1,
		initialSlide: indexToGet,
		dots: false,
		focusOnSelect: true,
		  prevArrow: false,
		  nextArrow: false
	}

	slider( events, '.slider-discover', sliderConfig, 'homeKv' );
	var indexToGet = $('.slider .slick-slide').index( $('#center_on_me') );
	window.$( document ).ready(function() {
		setTimeout(function(){
			if(window.location.hash == "#whitepaper") {
				$("#slick-slide01").click();
			}
		},300);
	});


}