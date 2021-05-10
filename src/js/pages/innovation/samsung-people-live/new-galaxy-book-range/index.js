import '../../../../bootstrap.js'

import { DateTime, Interval } from 'luxon';
import getParam from '../../../../../js/components/getParam'

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

const SCHEDULE = [
  // {
  //   liveDate: [2021,1,27,16,0],
  //   endDate: [2021,1,27,17,0],
  //   showID: '1JySqY77y0inrbcvMsi5',
  //   title: 'Wednesday 27th Jan - 4PM',
  //   poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/Samsung_People_KV_slimmer.jpg',
  //   mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  // },
  {
    liveDate: [2021,5,10,18,30],
    endDate: [2021,5,10,19,30],
    showID: 'bvrAXXf47M4CcLttvBAQ',
    reminderDate: "May 10, 2021 18:30",
    title: 'Monday 10th May - 6.30PM',
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/Samsung_People_KV_2.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,5,12,18,30],
    endDate: [2021,5,12,19,30],
    showID: 'gddP9JrzwxtO5s2XdJ8M',
    title: 'Wednesday 12th Jan - 6.30PM',
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/Samsung_People_KV_2.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
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

    this.pageInitiateTime = DateTime.local()
    this.currentShow = false
    this.nextShow = false
    this.countdown = false
    this.update()

    // debug for now, change for countdown / update method
    this.updateInterval = setInterval(() => {
      this.update()
      if (this.countdown) {
        this.countdown.update(this.getCurrentTime())
      }
    }, 1000)

    HOIShare()

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

    // console.log({currentShow, nextShow})

    // return;

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

      this.renderAddToCalendar(currentShow)


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

  renderAddToCalendar(showData) {

    const templateData = {
      "title": "Samsung People Live: New Galaxy Book Range",
      "start": showData.reminderDate,
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
    // if date param exists (format YYYY/MM/DD/HH/SS)
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

    // if (nextShow) {
    //   let nextShowTime = DateTime.local(...nextShow.liveDate).setZone("GMT")
    //   // if the next show starts within 30 mins, use as current
    //   if (Interval.fromDateTimes(currentTime, nextShowTime).length('minutes') < 30) {
    //     currentShow = nextShow
    //   }
    // }

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
