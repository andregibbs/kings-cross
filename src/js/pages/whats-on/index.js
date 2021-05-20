import '../../bootstrap.js'
import whatson from '../../components/whatson';
import fetchData from '../../util/Events';

import KXQudiniBooking from '../../components/common/kxQudiniBooking'

// const Handlebars = require("hbsfy/runtime");
// import HandlebarsHelpers from '../../../templates/helpers/handlebarsHelpers';
// HandlebarsHelpers.register(Handlebars)

function KX_WhatsOn() {
  // existing whasts on page script
  fetchData(whatson);

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
    // hide f1 table before showing calendar
    let startDelay = 0
    if (f1IsActive()) {
      hideF1Table()
      startDelay = 600
    }
    // delay qudini open if f1 active
    setTimeout(() => {
      qudiniBooking.start(QudiniFlow.workspace)
      launchWorkspace.setAttribute('active','')
    }, startDelay)
  })

  // F1
  const openF1Times = document.querySelector('#open-f1-times')
  const closeF1Times = document.querySelector('#close-f1-times')
  const f1TimesEl = document.querySelector('.whatsOn__f1')
  function showF1Table() {
    openF1Times.setAttribute('active', '')
    // get table height to animate container
    const f1TableHeight = document.querySelector('#f1-wrap').offsetHeight
    // set active and height
    f1TimesEl.setAttribute('active', '')
    f1TimesEl.style.height = `${f1TableHeight}px`
  }
  function hideF1Table() {
    openF1Times.removeAttribute('active')
    f1TimesEl.removeAttribute('active')
    f1TimesEl.style.height = `0`
  }
  function f1IsActive() {
    return f1TimesEl.getAttribute('active') !== null
  }
  // handle f1 open/close
  closeF1Times.addEventListener('click', hideF1Table)
  // f1 times open
  openF1Times.addEventListener('click', () => {
    // close any qudini booking before opening f1
    let openDelay = 0
    if (qudiniBooking.state.active) {
      qudiniBooking.cancelJourney()
      openDelay = 600;
    }
    // if already active, close
    if (f1IsActive()) {
      return hideF1Table()
    }
    // scroll to table
    setTimeout(() => {
      $j("html, body").animate({ scrollTop: $j('#f1-wrap').offset().top - 150 }, 600);
      showF1Table()
    }, openDelay)
  })

  // delay resize listener to avoid initial resize event
  setTimeout(() => {
    window.addEventListener('resize', () => {
      showF1Table()
    })
  }, 1000)
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KX_WhatsOn()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
