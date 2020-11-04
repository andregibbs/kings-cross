/* polyfills */
import 'whatwg-fetch';
require('es6-promise/auto');

/* local jquery */
// required for events data
import $ from 'jquery'
window.$j = $

import 'lity'
import KXNav from  './components/common/KXNav'


function Bootstrap() {
  new KXNav()
}


if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Bootstrap()
} else {
  document.addEventListener("DOMContentLoaded", Bootstrap)
}
