/* Home Of Innovation JS Entry */

import HOIGallery from './hoiGallery';
import { createYoutubeInstance, loadYoutubeAPI } from './utils';


document.addEventListener('DOMContentLoaded', () => {

  const galleries = document.querySelectorAll('.hoiGallery')
  const youtubeMedias = document.querySelectorAll('.hoiMedia--youtube')

  // could make this conditional depending on wether there is youtube content on the page
  loadYoutubeAPI()
    .then(() => {
      // initialze HOIGalleries
      galleries.forEach((gallery) => {
        new HOIGallery(gallery)
      })

      youtubeMedias.forEach((element) => {
        createYoutubeInstance(element)
      })
    })

}, false);
