const LIVE_TRACKING_ID = "UA-100137701-12"
const QA_TRACKING_ID = "UA-100137701-12" // "UA-101298876-1" //  qa tracking - currently unaccessible
const TRACKING_ID = location.host == "www.samsung.com" ? LIVE_TRACKING_ID : QA_TRACKING_ID

if (typeof ga !== "undefined") {
  // console.log('ga created', TRACKING_ID)
  ga("create", TRACKING_ID, { cookieExpires: "33696000", cookieDomain: "auto" });
}

export function trackEvent(category, action, label, customKeys) {

  const dataLayer = window.dataLayer || window.uk_dataLayer || []
  // console.log(dataLayer, window.uk_dataLayer, TRACKING_ID)

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

    if (typeof ga !== "undefined") {
      // console.log('ga', trackObj)
      ga("send", trackObj);
    }

    // disabled until tested
    // console.log('trackObj', trackObj)
    // dataLayer.push(trackObj)

  }

}
