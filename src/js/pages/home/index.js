import '../../bootstrap.js'
import 'slick-carousel'

function KXtras() {
  new HOILinkListHoverManager() // init link list manager for hoiLists

  // fetchData(function (allEvents) {
  calendar("https://bookings.qudini.com/booking-widget/booker/slots/IZ0LYUJL6B0/4375/68391/0", "appointment");
  // });

  const supportBooking = support()

  document.querySelector('#booking-launch').addEventListener('click', () => {
    supportBooking.startJourney("oneToOne")
  })

  $j('.KXtras__carousel').slick({
    dots: true
  })
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  KXtras()
} else {
  document.addEventListener("DOMContentLoaded", KXtras)
}
