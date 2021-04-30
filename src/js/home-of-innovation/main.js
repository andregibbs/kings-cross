/* Home Of Innovation JS Entry */

require('es6-promise/auto');
import 'whatwg-fetch';

// import jquery scoped to project
import $ from 'jquery'
import 'slick-carousel'
import 'lity'
import lottie from 'lottie-web'

// loading via html tags caused the slick initialization to vanish
// multiple jquery versions loaded
// use $j to avoid external conflicts
window.$j = $
window.lottie = lottie

import HOIGallery from './hoiGallery';
import HOIShare from './hoiShare';
import HOIMediaVideo from './hoiMediaVideo';
import HOIBambuser from './hoiBambuser';
import HOIYoutubeLiveChat from './hoiYoutubeLiveChat'
import HOIDynamicLinkList from './hoiDynamicLinkList';
import HOIDynamicGroupLand from './hoiDynamicGroupLand';
import HOILinkListHoverManager from './hoiLinkListHoverScroll'
import HOIAddToCalendar from './hoiAddToCalendar'
import { createYoutubeInstance, loadYoutubeAPI } from './utils';
import '../util/GATracking.js'

import FindKX from '../components/findKX';
import KXNav from '../components/common/kxNav'
import KXSurvey from '../components/common/kxSurvey'

function init() {

  const galleries = [].slice.call(document.querySelectorAll('.hoiGallery'))
  const youtubeMedias = [].slice.call(document.querySelectorAll('.hoiMedia--youtube'))
  const videoMedias = [].slice.call(document.querySelectorAll('.hoiMedia--video'))
  const bambuserComponents = [].slice.call(document.querySelectorAll('.hoiBambuser'))
  const dynamicLinkLists = [].slice.call(document.querySelectorAll('.hoiLinkList[dynamic]'))
  const dynamicGroupLand = [].slice.call(document.querySelectorAll('.hoiGroupLand__Container[dynamic]'))
  const addToCalendarComponents = [].slice.call(document.querySelectorAll('.hoiAddToCalendar'))

  // could make this conditional depending on wether there is youtube content on the page
  loadYoutubeAPI()
    .then(() => {

      // init hoi search (will be present in either nav or in page with a component)
      new KXNav()

      // init surveys
      new KXSurvey();

      // init sharing
      HOIShare();

      // init live chats
      HOIYoutubeLiveChat()

      // fetch dynamic opening times
      // new FindKX()

      new HOILinkListHoverManager()

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

      bambuserComponents.forEach((element) => {
        new HOIBambuser(element)
      })

      // dynamic LinkList components
      dynamicLinkLists.forEach((element) => {
        new HOIDynamicLinkList(element)
      })

      // dynamic GroupLanding components
      dynamicGroupLand.forEach(element => {
        new HOIDynamicGroupLand(element)
      })

      // add to calendar
      addToCalendarComponents.forEach(element => {
        new HOIAddToCalendar(element)
      })

    })

}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
