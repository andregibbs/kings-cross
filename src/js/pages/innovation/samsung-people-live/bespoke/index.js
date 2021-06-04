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
const DESKTOP_POSTER = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/bespoke/Neo_KV_D.jpg'
const MOBILE_POSTER = 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/bespoke/Neo_kv_M.jpg'

let SCHEDULE = [
  {
    liveDate: [2021,6,8,15,0],
    endDate: [2021,6,8,15,30],
    showID: 'obbLfll5x0D97hIhuQBR',
    title: 'Tuesday 8th June - 3PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER,
    test: true
  },
  {
    liveDate: [2021,6,9,17,0],
    endDate: [2021,6,9,17,30],
    showID: 'srT0J0ztKyuOV1Lwra19',
    title: 'Wednesday 9th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,12,17,0],
    endDate: [2021,6,12,17,30],
    showID: '0O3kEnVDX0tLBSupFSSl',
    title: 'Saturday 12th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,13,17,0],
    endDate: [2021,6,13,17,30],
    showID: '4K3i6vFjC3wFgl5wLpMz',
    title: 'Sunday 13th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,16,17,0],
    endDate: [2021,6,16,17,30],
    showID: 'BXDZMcVV8sjNjS3ZHMPk',
    title: 'Wednesday 16th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,19,17,0],
    endDate: [2021,6,19,17,30],
    showID: 'xvT8mGI6xBtZPR19ypbx',
    title: 'Saturday 19th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,20,17,0],
    endDate: [2021,6,20,17,30],
    showID: 'qk3qX9zAxVYz6qlEqZXf',
    title: 'Sunday 20th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,23,17,0],
    endDate: [2021,6,23,17,30],
    showID: '6RrErGR8ofbvu4y1R7Da',
    title: 'Wednesday 23rd June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,26,17,0],
    endDate: [2021,6,26,17,30],
    showID: '7x4jluWSBMgLpZKod6i1',
    title: 'Saturday 26th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,27,17,0],
    endDate: [2021,6,27,17,30],
    showID: 'F1R1W8IXxhQk6Udm0TLv',
    title: 'Sunday 27th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,6,30,17,0],
    endDate: [2021,6,30,17,30],
    showID: 'fszbWAGZdS0gcdzMcSq0',
    title: 'Wednesday 30th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,7,3,17,0],
    endDate: [2021,7,3,17,30],
    showID: 'XoSW6W8GgddS9UgPczeO',
    title: 'Saturday 3rd June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,7,4,17,0],
    endDate: [2021,7,4,17,30],
    showID: 'vPALqLOQVErfEowO769h',
    title: 'Sunday 4th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,7,7,17,0],
    endDate: [2021,7,7,17,30],
    showID: 'CNPIrGCbtdKmO8QJSeHw',
    title: 'Wednesday 7th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,7,10,17,0],
    endDate: [2021,7,10,17,30],
    showID: 'SAbVuzMBv88EQPBTNWOj',
    title: 'Saturday 10th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  },
  {
    liveDate: [2021,7,11,17,0],
    endDate: [2021,7,11,17,30],
    showID: 'AZBe8j5Zp3eLd7Bam4jT',
    title: 'Saturday 11th June - 7PM',
    poster: DESKTOP_POSTER,
    mobile_poster: MOBILE_POSTER
  }
]

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
      poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/Samsung_People_KV_slimmer.jpg',
      mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
    }))
  }

  renderHeader(currentShow, nextShow) {

    let showData = Object.assign({}, currentShow)

    // if current show has ended, set title data to show the next stream
    if (currentShow.ended && nextShow) {
      showData.title = nextShow.title
      showData.poster = nextShow.poster
      showData.mobile_poster = nextShow.mobile_poster
      showData.cta = `<span>Watch Previous Stream:</span> ${currentShow.title}`
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
    new HoiBambuser(document.querySelector('.hoiBambuser'))
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

      if (currentShow.ended && nextShow) {
        this.renderCountdown(nextShow)
      } else if (!currentShow.ended) {
        this.renderCountdown(currentShow)
      } else {
        this.countdown = false
        countdownTarget.innerHTML = ''
      }
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
      "title": "Samsung People Live: New Galaxy Book Range",
      "start": madeDate,
      "description": "Join our Samsung People Live at Samsung KX to learn more about our amazing new products, the Galaxy S21 Ultra 5G, Galaxy Buds Pro and Galaxy SmartTag",
      "address": window.location.href,
      "duration": 60
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
