// Live Stream v4

import '../../../../bootstrap.js'

import { DateTime, Interval } from 'luxon';
import getParam from '../../../../../js/components/getParam'
import KXEnv from '../../../../../js/util/KXEnv'

const Handlebars = require("hbsfy/runtime");
// Handlebars.registerPartial('playIcon', require('../../../../templates/partials/svg/play.hbs'))
import HandlebarsHelpers from '../../../../../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)

import HoiBambuser from '../../../../home-of-innovation/HoiBambuser';
const template = require('../../../../../templates/partials/home-of-innovation/hoiBambuser.hbs');
const templateTarget = document.querySelector('#bambuser-target')
// const titleTarget = document.querySelector('#title-target h1')

import KXCountdown from '../../../../../js/components/common/kxCountdown';
const countdownTarget = document.querySelector('#countdown-target')

import HOIShare from '../../../../home-of-innovation/hoiShare';

import HOIAddToCalendar from '../../../../home-of-innovation/hoiAddToCalendar'
const hoiAddToCalendarTemplate = require('../../../../../templates/partials/home-of-innovation/hoiAddToCalendar.hbs');
const calendarTarget = document.querySelector('#hoi-add-to-calendar-target')

const debugTemplate = require('../../../../../templates/partials/components/samsung-live/debug.hbs')

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// KV IMAGES
const DESKTOP_POSTER = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/d_kv.jpg'
const MOBILE_POSTER = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/m_kv.jpg'

const STEAM_DURATION = 30 // mins

// replace this obj with one of the other streams when they need switching
let SCHEDULE = [
  {
    cta: "Join The Live Stream",
    htmlTitles: "<h1>Galaxy Z Fold3 | Z Flip3:</h1><p><strong>up close and personal with <img src=\"https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/tech-chap-black.png\"/></strong></p><h2>Join us live at 6pm on Thurs 19th Aug</h2><p>Watch The Tech Chap put the new Galaxy Z Fold3 and Z Flip3 to the test live from Samsung KX. Join us to take advantage of an exclusive offer*.</p>",
    liveDate: [2021,8,19,18,0],
    endDate: [2021,8,19,18,30],
    showID: 'SCchjSiois0vyyxIKI5G',
    title: 'Thursday 19th August - 6PM',
    duration: '30 mins',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER,
    alt: 'S Pen & Samsung Fold 3 standing unfolded on a white background next to Samsung Flip 3 displaying a message on the front screen'
  }
]

const SECOND_STREAM = {
  htmlTitles: "<h1>Galaxy Z Fold3:</h1><h2>up close and personal at Samsung KX</h2><p>Join us live at 6pm on Weds 25th Aug</p>",
  liveDate: [2021,8,25,18,0],
  endDate: [2021,8,25,18,30],
  showID: 'dn5OP3AKOXv9WFuAvobK',
  title: 'Wednesday 25th August - 6PM',
  duration: '30 mins',
  poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/fold_2.jpg',
  mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/fold.jpg',
  cta: `Join The Live Stream`,
  alt: 'Close up of Samsung Galaxy Z Fold3 5G camera lens and flashlight with a red \'live\' icon in the top left corner'
}

const THIRD_STREAM = {
  htmlTitles: "<h1>Galaxy Z Flip3:</h1><h2>up close and personal at Samsung KX</h2><p>Join us live at 7pm on Weds 25th Aug</p>",
  liveDate: [2021,8,25,19,0],
  endDate: [2021,8,25,19,30],
  showID: 'I0cfX2SQ7ucDLYXWIUsb',
  title: 'Wednesday 25th August - 7PM',
  duration: '30 mins',
  poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/flip_2.jpg',
  mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/galaxy-unpacked/flip.jpg',
  cta: `Join The Live Stream`,
  alt: 'Samsung Z Flip 3 front camera & display screen showing a woman taking a selfie and a red \'live\' icon in the top left corner'
}

class SamsungLive {

  constructor () {

    // luxon & bambuser not supported on IE
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) {
      this.renderUnsupportedHeader()
      return
    }

    // filter test events if live
    if (KXEnv.live) {
      SCHEDULE = SCHEDULE.filter(event => !event.test)
    }

    this.pageInitiateTime = DateTime.local()
    this.currentShow = false
    this.nextShow = false
    this.countdown = false
    this.update()

    // for countdown / update method
    this.updateInterval = setInterval(() => {
      this.update()
      if (this.countdown) {
        this.countdown.update(this.getCurrentTime())
      }
    }, 1000)

    const debugMode = getParam('debug') || false
    if (debugMode) {
      this.renderDebugMenu()
    }

    this.renderSecondShow()
    this.renderThirdShow()

    HOIShare()

  }

  renderDebugMenu() {

    function linkString(date) {
      return `${window.location.pathname}?debug=true&date=${date.toFormat('yyyy-L-d-HH-m')}`
    }
    const shows = SCHEDULE.map((show) => {
      const showDate = DateTime.local(...show.liveDate)
      const showEndDate = DateTime.local(...show.endDate)
      show.readableStart = showDate.toFormat('ccc d LLL yyyy - HH:mm')
      show.readableEnd = showEndDate.toFormat('ccc d LLL yyyy - HH:mm')
      show.links = {}
      show.links.liveminus30 = linkString(showDate.minus({minutes: 30}))
      show.links.liveminus5 = linkString(showDate.minus({minutes: 5}))
      show.links.live = linkString(showDate)
      show.links.endminus5 = linkString(showEndDate.minus({minutes: 5}))
      show.links.end = linkString(showEndDate)
      return show
    })

    document.body.insertAdjacentHTML('beforeend', debugTemplate({
      reset: `${window.location.pathname}?debug=true`,
      trueTime: DateTime.local().toFormat('ccc d LLL yyyy - HH:mm'),
      pageTime: this.getCurrentTime().toFormat('ccc d LLL yyyy - HH:mm'),
      shows
    }))

  }

  renderUnsupportedHeader() {
    templateTarget.insertAdjacentHTML('beforeend', template({
      unsupported: true,
      title: 'Sorry this browser is currently unsupported',
      htmlTitles: "<h1>Unsupported Browser</h1><p>Sorry, your browser does not support Live Streaming.<br/>Please update your browser or use Microsoft Edge or Google Chrome</p>",
      poster: DESKTOP_POSTER,
      mobile_poster: MOBILE_POSTER
    }))
  }

  renderSecondShow() {
    const secondStreamTarget = document.querySelector('#bambuser-target-2')
    secondStreamTarget.insertAdjacentHTML('beforeend', template(SECOND_STREAM))
    // init class
    new HoiBambuser(document.querySelector('#bambuser-target-2 .hoiBambuser'))
  }

  renderThirdShow() {
    const thirdStream = document.querySelector('#bambuser-target-3')
    thirdStream.insertAdjacentHTML('beforeend', template(THIRD_STREAM))
    // init class
    new HoiBambuser(document.querySelector('#bambuser-target-3 .hoiBambuser'))
  }

  renderHeader(currentShow, nextShow) {

    let showData = Object.assign({}, currentShow)

    // if current show has ended, set title data to show the next stream
    if (currentShow.ended && nextShow) {
      showData.title = nextShow.title
      showData.poster = nextShow.poster
      showData.mobile_poster = nextShow.mobile_poster
      // showData.cta = `<span>Watch Previous Stream:</span> ${currentShow.title}`
      // showData.cta = `Replay Live Demo`
      // showData.nextStreamCopy = `Next Live Stream on Bespoke Fridges<br>`
      showData.duration = `${STEAM_DURATION} mins`
    } else if (nextShow.soon) {
      // if next show is soon, show that instead
      showData = nextShow
    }

    if (!nextShow) {
      showData.lastShow = true
    }

    // clear element
    templateTarget.innerHTML = ""
    // render template
    templateTarget.insertAdjacentHTML('beforeend', template(showData))
    // init class
    new HoiBambuser(document.querySelector('#bambuser-target .hoiBambuser'))
  }

  update() {
    // get shows based on current time
    let { currentShow, nextShow } = this.getShows()

    // if no current show but a next, use next for kv
    if (nextShow && !currentShow) {
      currentShow = nextShow
    }

    // if current show or live/ended status has changed
    // have to compare with object strings?
    if (
      JSON.stringify(this.currentShow) !== JSON.stringify(currentShow)
    ) {

      this.currentShow = JSON.parse(JSON.stringify(currentShow))
      this.renderHeader(currentShow, nextShow)
      this.renderAddToCalendar(nextShow, currentShow)

      // if (currentShow.ended && nextShow) {
      //   this.renderCountdown(nextShow)
      // } else if (!currentShow.ended) {
      //   this.renderCountdown(currentShow)
      // } else {
      //   this.countdown = false
      //   countdownTarget.innerHTML = ''
      // }
    }

    if (this.currentShow.live) {
      countdownTarget.setAttribute('hidden','')
    } else {
      countdownTarget.removeAttribute('hidden')
    }

    // if next show has changed
    if (this.nextShow !== nextShow) {
      this.nextShow = nextShow
      if (nextShow) {
        // this.renderCountdown(nextShow)
      } else {
        // nothing more to show from schedule
        // this.countdown = false
        // countdownTarget.innerHTML = ''
        // clearInterval(this.updateInterval)
      }
    }

  }

  renderAddToCalendar(nextShow, currentShow) {
    let showData = nextShow || currentShow
    if (!showData || showData.ended || showData.live) {
      return
    }
    // construct reminder date from live date
    const month = MONTHS[showData.liveDate[1]-1]
    const day = showData.liveDate[2]
    const year = showData.liveDate[0]
    const hour = showData.liveDate[3]
    const minute = ("00" + showData.liveDate[4]).substr(-2,2)
    const madeDate = `${month} ${day}, ${year} ${hour}:${minute}`

    const templateData = {
      "title": "Samsung People Live: Bespoke",
      "start": madeDate,
      "description": "Join our live broadcast to see a demonstration of the brand new Bespoke fridge, along with an interactive Q&A session with our product experts.",
      "address": window.location.href,
      "duration": STEAM_DURATION
    }
    calendarTarget.innerHTML = ''
    calendarTarget.insertAdjacentHTML('beforeend', hoiAddToCalendarTemplate(templateData))
    new HOIAddToCalendar(calendarTarget.querySelector('.hoiAddToCalendar'))
  }

  renderCountdown(nextShow) {
    this.countdown = new KXCountdown(countdownTarget, nextShow.liveDate, this.getCurrentTime())
  }

  getCurrentTime() {
    const now = DateTime.local()
    // if date param exists (format ?date=YYYY-MM-DD-HH-SS ?date=2021-05-12-17-45)
    let manualDate = getParam('date') || false
    if (manualDate) {
      manualDate = manualDate.split('-')
      manualDate = manualDate.map(x => parseInt(x, 10))
      manualDate = DateTime.local(...manualDate)
      // calculate difference between page start and now
      let delta = now - this.pageInitiateTime
      // add delta to the manual date for updated custom time
      return manualDate.plus(delta)
    } else {
      // return current time
      return DateTime.local()
    }
  }

  generateShowStates(showData) {
    const now = this.getCurrentTime()
    const start = DateTime.local(...showData.liveDate).setZone("GMT");
    const end = DateTime.local(...showData.endDate).setZone("GMT");
    const afterLive = now > start
    const beforeEnd = now < end
    const afterEnd = now > end
    const soon = Interval.fromDateTimes(now, start).length('minutes') < 30
    // const showStatus = {
    //   live: afterLive && beforeEnd,
    //   ended: afterEnd,
    //   soon: soon
    // }
    showData.live = afterLive && beforeEnd,
    showData.ended = afterEnd
    showData.soon = soon
    return showData
  }

  getShows() {
    const currentTime = this.getCurrentTime()
    let nextShow = SCHEDULE.find(item => {
      const itemTime = DateTime.local(...item.liveDate).setZone("GMT")
      if (Interval.fromDateTimes(currentTime, itemTime).length('minutes') < 30) {
        return false
      }
      return itemTime > currentTime
    }) || false
    // current show is one previous to next or the last in schedule
    let currentShow = nextShow ? SCHEDULE[SCHEDULE.indexOf(nextShow) - 1] : SCHEDULE[SCHEDULE.length - 1]

    // if there is a next show
    if (nextShow) {
      let nextShowTime = DateTime.local(...nextShow.liveDate).setZone("GMT")
      // if the next show starts within 30 mins, use as current
      if (Interval.fromDateTimes(currentTime, nextShowTime).length('minutes') < 30) {
        currentShow = nextShow
      }
    }

    if (!currentShow) {
      currentShow = nextShow
    }

    currentShow = this.generateShowStates(currentShow)
    if (nextShow) {
      nextShow = this.generateShowStates(nextShow)
    }

    return {currentShow, nextShow}
  }



}

new SamsungLive
