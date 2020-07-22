import slider from '../slider'

import DiscoverExperience from './discoverExperience';
import DiscoverEvents from './discoverEvents';

export default function discover(events) {

  const kvContainer = document.querySelector('.discoverKv')
  const visitKxLink = document.querySelector('.discover__VisitLink')

  // wait for slider ready to add attr
  $j('#discover-kv-slider').on('init', () => {
    kvContainer.setAttribute('ready', '');
  })

  // initialise top slider
  $j('#discover-kv-slider').slick({
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
      speed: 750
  })

  visitKxLink.addEventListener('click', () => {
    const target = document.querySelector('.findkx').getBoundingClientRect();
    $j('html, body').animate({
      scrollTop: window.scrollY + target.y
    }, 800);
  })

  // init discover experience component
  new DiscoverExperience(document.querySelector('.discoverExperience'));
  new DiscoverEvents(document.querySelector('.discoverEvents'))

}