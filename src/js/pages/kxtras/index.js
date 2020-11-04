import '../../bootstrap.js'
import 'slick-carousel'

import HOILinkListHoverManager from '../../home-of-innovation/HOILinkListHoverScroll'

function KXtras() {
  new HOILinkListHoverManager() // init link list manager for hoiLists
  
  $j('.KXtras__carousel').slick({
    dots: true
  })
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KXtras()
} else {
  document.addEventListener("DOMContentLoaded", KXtras)
}
