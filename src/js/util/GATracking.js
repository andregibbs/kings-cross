const LIVE_TRACKING_ID = "UA-100137701-12"
const QA_TRACKING_ID = "UA-100137701-12" // "UA-101298876-1" //  qa tracking - currently unaccessible
const TRACKING_ID = location.host == "www.samsung.com" ? LIVE_TRACKING_ID : QA_TRACKING_ID
import KXEnv from './KXEnv'

let trackingInitiated = false;

if (typeof ga !== "undefined" && !trackingInitiated && !KXEnv.local) {
  // console.log('ga created', TRACKING_ID)
  trackingInitiated = true
  ga("create", TRACKING_ID, { cookieExpires: "33696000", cookieDomain: "auto" });
  trackScroll()
}

function trackScroll() {

  const segmentPercentage = 25 // trigger after each %
  let lastSegment, orientation, windowWidth, windowHeight, pageHeight

  function updateHeights() {
    // not needed at the moment, could be sent to ga for extra detail if not already captured
    // orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
    // windowWidth = window.innerWidth
    windowHeight = window.innerHeight
    pageHeight = document.body.scrollHeight
  }

  function checkScroll() {
    const position = window.scrollY
    const percent = Math.floor((position / (pageHeight - windowHeight)) * 100)
    let currentSegment = percent - (percent % 25)
    if (lastSegment != currentSegment) {
      lastSegment = currentSegment
      trackEvent('Scroll Event', 'Scroll Percentage', 'Update', {
        eventValue: currentSegment
      })
    }
  }

  updateHeights()
  window.addEventListener('scroll', checkScroll)
  window.addEventListener("orientationchange", updateHeights);
  window.addEventListener("resize", updateHeights);

}

export function trackEvent(category, action, label, customKeys) {
  // thought you could attach custom object keys in customKeys args
  // ga may only accept and object with the key { eventValue: [[integer]] )
  const dataLayer = window.dataLayer || window.uk_dataLayer || []

  // check for dataLayer and argss
  if (dataLayer && !!action && !!category) {

    let trackObj = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    }

    if (!!customKeys) {
      Object.assign(trackObj, customKeys)
    }

    if (typeof ga !== "undefined" && !KXEnv.local) {
      console.log('ga', trackObj)
      ga("send", trackObj);
    }

    // disabled until tested
    if (KXEnv.local) {
      console.log('trackObj', trackObj)
    }
    // dataLayer.push(trackObj)

  }
}
