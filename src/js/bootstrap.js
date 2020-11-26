// This boostrap is used for individual pages js build files
// imported from single page files in src/js/pages/*

/* polyfills */
import 'whatwg-fetch';
require('es6-promise/auto');

/* Handlebars */
const Handlebars = require("hbsfy/runtime");
import HandlebarsHelpers from '../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)


/* local jquery */
// required for events data
import $ from 'jquery'
window.$j = $

import 'lity'
import KXNav from './components/common/KXNav'
import KXSurvey from './components/common/kxSurvey'

function Bootstrap() {
  new KXNav()
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Bootstrap()
} else {
  document.addEventListener("DOMContentLoaded", Bootstrap)
}
