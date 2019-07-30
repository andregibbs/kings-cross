import slider from './slider'

export default function discover( events ) {

	const sliderConfig = {
		lazyLoad: 'ondemand',
		dots: true,
		infinite: false,
		speed: 500,
		fade: false,
		cssEase: 'linear'
	}

	slider( events, '.slider-discover', sliderConfig, 'homeKv' );

	//video

	// $("video").click(function(e){

	// 	// handle click if not Firefox (Firefox supports this feature natively)
	// 	if (typeof InstallTrigger === 'undefined') {
	
	// 		// get click position 
	// 		var clickY = (e.pageY - $(this).offset().top);
	// 		var height = parseFloat( $(this).height() );
	
	// 		// avoids interference with controls
	// 		if (clickY > 0.82*height) return;
	
	// 		// toggles play / pause
	// 		this.paused ? this.play() : this.pause();
	// 	}
	// });

}
