import '../../bootstrap.js'
import whatson from '../../components/whatson';
import fetchData from '../../util/Events';

// const Handlebars = require("hbsfy/runtime");
// import HandlebarsHelpers from '../../../templates/helpers/handlebarsHelpers';
// HandlebarsHelpers.register(Handlebars)

function KX_WhatsOn() {
  // existing whasts on page script
  fetchData(whatson);
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KX_WhatsOn()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
