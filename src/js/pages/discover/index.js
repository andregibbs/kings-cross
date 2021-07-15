import '../../bootstrap.js'
import 'slick-carousel'

import DiscoverExperience from './discoverExperience';
// import DiscoverEvents from './discoverEvents';
import DiscoverCommunity from './discoverCommunity';

function Discover() {

  // import slider from '../slider'
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
      // prevArrow: false,
      // nextArrow: false,
      speed: 750,
      variableWidth: true,
      autoplay: true,
      autoplaySpeed: 6000,
  })

  visitKxLink.addEventListener('click', () => {
    const target = document.querySelector('.findkx').getBoundingClientRect();
    $j('html, body').animate({
      scrollTop: window.scrollY + target.y
    }, 800);
  })

  // init discover experience component
  new DiscoverExperience(document.querySelector('.discoverExperience'));
  new DiscoverCommunity()
  // new DiscoverEvents(document.querySelector('.discoverEvents'))

  // F1
  const openF1Times = document.querySelector('#open-f1-times')
  const closeF1Times = document.querySelector('#close-f1-times')
  const f1TimesEl = document.querySelector('.whatsOn__f1')
  function showF1Table() {
    openF1Times.setAttribute('active', '')
    // get table height to animate container
    const f1TableHeight = document.querySelector('#f1-wrap').offsetHeight
    // set active and height
    f1TimesEl.setAttribute('active', '')
    f1TimesEl.style.height = `${f1TableHeight}px`
  }
  function hideF1Table() {
    openF1Times.removeAttribute('active')
    f1TimesEl.removeAttribute('active')
    f1TimesEl.style.height = `0`
  }
  function f1IsActive() {
    return f1TimesEl.getAttribute('active') !== null
  }
  // handle f1 open/close
  closeF1Times.addEventListener('click', hideF1Table)
  // f1 times open
  openF1Times.addEventListener('click', () => {
    // close any qudini booking before opening f1
    let openDelay = 0
    // if already active, close
    if (f1IsActive()) {
      return hideF1Table()
    }
    // scroll to table
    setTimeout(() => {
      $j("html, body").animate({ scrollTop: $j('#f1-wrap').offset().top - 150 }, 600);
      showF1Table()
    }, openDelay)
  })

  // F1 Terms
  const f1TermsLaunch = document.querySelector('#f1-terms-launch')
  const f1TermsClose = document.querySelector('#f1-terms-close')
  const f1TermsContainer = document.querySelector('#f1-terms-container')
  const f1TermsEl = document.querySelector('.f1Terms')
  const f1TermsBody = document.querySelector('.f1Terms__body')
  f1TermsLaunch.addEventListener('click', () => {
    const termsState = !!f1TermsContainer.getAttribute('active')
    if (termsState) {
      f1TermsContainer.removeAttribute('active')
    } else {
      f1TermsContainer.setAttribute('active', '')
    }
  })
  f1TermsClose.addEventListener('click', () => {
    f1TermsContainer.removeAttribute('active')
  })
  f1TermsEl.addEventListener('click', () => {
    f1TermsContainer.removeAttribute('active')
  })
  f1TermsBody.addEventListener('click', e => {
    e.stopPropagation()
  })
  // delay resize listener to avoid initial resize event
  setTimeout(() => {
    window.addEventListener('resize', () => {
      if (openF1Times.getAttribute('active') != null) {
        showF1Table()
      }
    })
  }, 1000)

  // if ie
  if (window.document.documentMode) {
    // set attribute to apply ie styles
    document.querySelector('.discoverCommunity').setAttribute('ie','')
    document.querySelector('.discoverKv').setAttribute('ie','')
  }

}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Discover()
} else {
  document.addEventListener("DOMContentLoaded", Discover)
}
