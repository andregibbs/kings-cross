/* Home Of Innovation JS Entry */

require('es6-promise/auto');
import 'whatwg-fetch';

// import jquery scoped to project
import $ from 'jquery'
import 'slick-carousel'
import 'lity'

// loading via html tags caused the slick initialization to vanish
// multiple jquery versions loaded
// use $j to avoid external conflicts
window.$j = $

import HOIGallery from './hoiGallery';
import HOIShare from './hoiShare';
import HOIMediaVideo from './hoiMediaVideo';
import HOIDynamicLinkList from './hoiDynamicLinkList';
import HOIDynamicGroupLand from './hoiDynamicGroupLand';
import sidedrawer from '../components/sidedrawer';
import { createYoutubeInstance, loadYoutubeAPI } from './utils';

import FindKX from '../components/findKX';

import nav from '../components/nav';

function init() {

  const galleries = [].slice.call(document.querySelectorAll('.hoiGallery'))
  const youtubeMedias = [].slice.call(document.querySelectorAll('.hoiMedia--youtube'))
  const videoMedias = [].slice.call(document.querySelectorAll('.hoiMedia--video'))
  const dynamicLinkLists = [].slice.call(document.querySelectorAll('.hoiLinkList[dynamic]'))
  const dynamicGroupLand = [].slice.call(document.querySelectorAll('.hoiGroupLand__Container[dynamic]'))

  // init nav
  nav();

  // could make this conditional depending on wether there is youtube content on the page
  loadYoutubeAPI()
    .then(() => {

      // init sharing
      new HOIShare();

      // fetch dynamic opening times
      new FindKX()

      // initialze HOIGalleries
      galleries.forEach((gallery) => {
        new HOIGallery(gallery)
      })

      // init videos
      videoMedias.forEach((videoEl) => {
        new HOIMediaVideo(videoEl)
      })

      // init youtube instances
      youtubeMedias.forEach((element) => {
        createYoutubeInstance(element)
      })

      // dynamic LinkList components
      dynamicLinkLists.forEach((element) => {
        new HOIDynamicLinkList(element)
      })

      // dynamic GroupLanding components
      dynamicGroupLand.forEach(element => {
        new HOIDynamicGroupLand(element)
      })

    })

}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
