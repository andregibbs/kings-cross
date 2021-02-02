// This boostrap is used for individual pages js build files
// imported from single page files in src/js/pages/*

/* polyfills */
import 'whatwg-fetch';
require('es6-promise/auto');

/* local jquery */
// required for events data
import $ from 'jquery'
window.$j = $

import 'lity'
import KXNav from './components/common/KXNav'
import KXSurvey from './components/common/kxSurvey'
import FindKX from './components/findKX'
import './util/GATracking.js'

import DevDashboard from './dev/dashboard'

function Bootstrap() {
  new KXNav()
  new KXSurvey()
  new FindKX()
  new DevDashboard()
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Bootstrap()
} else {
  document.addEventListener("DOMContentLoaded", Bootstrap)
}
