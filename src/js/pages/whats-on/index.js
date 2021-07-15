import '../../bootstrap.js'
// import whatson from '../../components/whatson';
// import fetchData from '../../util/Events';

import QudiniEvents from '../../components/qudiniEvents';

import KXQudiniBooking from '../../components/common/kxQudiniBooking'

// const Handlebars = require("hbsfy/runtime");
// import HandlebarsHelpers from '../../../templates/helpers/handlebarsHelpers';
// HandlebarsHelpers.register(Handlebars)

function KX_WhatsOn() {
  // existing whasts on page script
  // fetchData(whatson);

  const qudiniEvents = new QudiniEvents()

  const qudiniBooking = new KXQudiniBooking() // start single instance, update with .start()

  const QudiniFlow = {
    workspace: {
      bookingName: 'workspace',
      bookingTitle: 'Hot Desk Booking',
      bookingURL: 'https://bookings.qudini.com/booking-widget/booker/slots/7AVF4H59LMX/4375/68910/0',
      bookingProductID: '68910',
      bookingWorkflowID: '7AVF4H59LMX',
      bookingJourney: KXQudiniBooking.Screens_NoDeviceInfo,
      bookingColor: '#FFBC4B'
    }
  }

  // Qudini Events scroll
  qudiniEvents.onEventTypeChange = (eventType) => {
    const target = document.querySelector('.whatsOn__visit').offsetTop
    if (eventType === 'alwayson') {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    }
  }

  // WORKSPACE
  const launchWorkspace = document.querySelector('#launch-workspace')
  // remove any active buttons after qudini booking cancel
  qudiniBooking.onJourneyCancel = () => {
    [launchWorkspace].forEach(el => {
      el.removeAttribute('active')
    })
  }
  // booking flow launch
  launchWorkspace.addEventListener('click', () => {
    // close qudini if already open
    if (launchWorkspace.getAttribute('active') !== null) {
      launchWorkspace.removeAttribute('active')
      return qudiniBooking.cancelJourney()
    }
    // // hide f1 table before showing calendar
    let startDelay = 0
    // if (f1IsActive()) {
    //   hideF1Table()
    //   startDelay = 600
    // }
    // delay qudini open if f1 active
    setTimeout(() => {
      qudiniBooking.start(QudiniFlow.workspace)
      launchWorkspace.setAttribute('active','')
    }, startDelay)
  })

}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KX_WhatsOn()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
