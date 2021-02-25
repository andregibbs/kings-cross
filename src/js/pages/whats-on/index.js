import '../../bootstrap.js'
import whatson from '../../components/whatson';
import fetchData from '../../util/Events';

function KX_WhatsOn() {
  // existing whasts on page script
  fetchData(whatson);
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KX_WhatsOn()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
