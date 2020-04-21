/* Home Of Innovation JS Entry */

import HOIGallery from './hoiGallery';

function loadYoutubeAPI() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  return new Promise(function(resolve, reject) {
    window.onYouTubeIframeAPIReady = () => {
      // youtube api ready
      resolve()
    }

  });
}

document.addEventListener('DOMContentLoaded', () => {

  const galleries = document.querySelectorAll('.hoiGallery')

  // could make this conditional depending on wether there is youtube content
  loadYoutubeAPI()
    .then(() => {
      // initialze HOIGalleries
      galleries.forEach((gallery) => {
        new HOIGallery(gallery)
      })
    })

}, false);
