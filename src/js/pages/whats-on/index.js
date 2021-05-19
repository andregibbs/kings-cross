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

  // fetchData(data => {
  //   console.log('whatson', data)
  // })

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

  const launchWorkspace = document.querySelector('#launch-workspace')
  // remove any active buttons after cancel
  qudiniBooking.onJourneyCancel = () => {
    [launchWorkspace].forEach(el => {
      el.removeAttribute('active')
    })
  }
  // booking flow launch
  launchWorkspace.addEventListener('click', () => {
    qudiniBooking.start(QudiniFlow.workspace)
    launchWorkspace.setAttribute('active','')
  })
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KX_WhatsOn()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
