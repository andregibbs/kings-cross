/* Home Of Innovation JS Entry */

import HOIGallery from './hoiGallery';
import HOIShare from './hoiShare';
import sidedrawer from '../components/sidedrawer';
import { createYoutubeInstance, loadYoutubeAPI } from './utils';

import nav from '../components/nav';

function init() {

  const galleries = document.querySelectorAll('.hoiGallery')
  const youtubeMedias = document.querySelectorAll('.hoiMedia--youtube')

  // init nav
  nav();
  // init mobile nav
  sidedrawer();

  // could make this conditional depending on wether there is youtube content on the page
  loadYoutubeAPI()
    .then(() => {

      new HOIShare();

      // initialze HOIGalleries
      galleries.forEach((gallery) => {
        new HOIGallery(gallery)
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
