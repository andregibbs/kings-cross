import '../../bootstrap.js'
import 'slick-carousel'
import 'lity'

import KXNav from  '../../components/common/KXNav'
import HOILinkListHoverManager from '../../home-of-innovation/HOILinkListHoverScroll'

function KXtras() {
  new KXNav() // init nav
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
