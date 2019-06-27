import slider from './slider'

export default function discover( events ) {

	const sliderConfig = {
		lazyLoad: 'ondemand',
		dots: false,
		infinite: false,
		speed: 500,
		fade: false,
		cssEase: 'linear'
	}

	slider( events, '.slider-discover', sliderConfig, 'homeKv' )

}
