import slider from './slider'

export default function school(events){
    const sliderConfig = {
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        infinite: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToScroll: 1,
        initialSlide: 0,
        dots: false,
        focusOnSelect: true,
        prevArrow: false,
        nextArrow: false,
        speed: 1000
    }

    slider(events, '.slider-discover', sliderConfig, 'homeKv');
}

