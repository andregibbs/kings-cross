/* Home Of Innovation JS Entry */

import HOIGallery from './hoiGallery';
import HOIShare from './hoiShare';
import HOIMediaVideo from './hoiMediaVideo';
import sidedrawer from '../components/sidedrawer';
import { createYoutubeInstance, loadYoutubeAPI } from './utils';

import nav from '../components/nav';

function init() {

  const galleries = [].slice.call(document.querySelectorAll('.hoiGallery'))
  const youtubeMedias = [].slice.call(document.querySelectorAll('.hoiMedia--youtube'))
  const videoMedias = [].slice.call(document.querySelectorAll('.hoiMedia--video'))

  // init nav
  nav();

  // could make this conditional depending on wether there is youtube content on the page
  loadYoutubeAPI()
    .then(() => {

      new HOIShare();

      // initialze HOIGalleries
      galleries.forEach((gallery) => {
        new HOIGallery(gallery)
      })

      videoMedias.forEach((videoEl) => {
        new HOIMediaVideo(videoEl)
      })

      // init youtube instances
      youtubeMedias.forEach((element) => {
        createYoutubeInstance(element)
      })
    })

}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
