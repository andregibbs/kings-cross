import '../../bootstrap.js';
import KXNav from  '../../components/common/KXNav'

function init() {
  console.log('init')
  new KXNav() // new nav
}


if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
