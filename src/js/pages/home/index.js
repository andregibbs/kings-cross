import '../../bootstrap.js'
import 'slick-carousel'

import homeKV from './homeKV';

function Home() {
  // reset scroll
  window.scrollTo(0,0)
  setTimeout(homeKV, 10);

  const mapEl = document.querySelector('.home3DMap')
  const mapSrc = "https://my.matterport.com/show/?m=SmPK9hQkhHi&play=1"

  function createMapFrame() {
    const mapFrame = document.createElement('iframe')
    mapFrame.id = "matterport-frame"
    mapFrame.width = "100%"
    mapFrame.height = "100%"
    mapFrame.frameBorder = "0"
    mapFrame.setAttribute('allowfullscreen', 'xr-spatial-tracking')
    mapFrame.src = mapSrc
    return mapFrame
  }

  document.querySelector('#launch-map').addEventListener('click', () => {
    // show modal
    mapEl.setAttribute('open','')
    mapEl.appendChild(createMapFrame())
  })

  document.querySelector('.home3DMap__close').addEventListener('click', () => {
    // hide modal
    mapEl.removeAttribute('open')
    mapEl.querySelector('#matterport-frame').outerHTML = ""
  })
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Home()
} else {
  document.addEventListener("DOMContentLoaded", Home)
}
