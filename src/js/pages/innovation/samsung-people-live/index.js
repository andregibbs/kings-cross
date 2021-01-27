import '../../../bootstrap.js'

import { DateTime, Interval } from 'luxon';
import getParam from '../../../../js/components/getParam'

const Handlebars = require("hbsfy/runtime");
// Handlebars.registerPartial('home-of-innovation/hoiBambuser', require('../../../../templates/partials/home-of-innovation/hoiBambuser.hbs'))
import HandlebarsHelpers from '../../../../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)

import HoiBambuser from '../../../../js/home-of-innovation/HoiBambuser';
const template = require('../../../../templates/partials/home-of-innovation/hoiBambuser.hbs');
const templateTarget = document.querySelector('#bambuser-target')
// const titleTarget = document.querySelector('#title-target h1')

import KXCountdown from '../../../../js/components/common/kxCountdown';
const countdownTarget = document.querySelector('#countdown-target')


const SCHEDULE = [
  {
    liveDate: [2021,1,27,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Wednesday 27th Jan - 4PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,1,29,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Friday 29th Jan - 4PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,1,29,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Friday 29th Jan - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,1,30,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Saturday 30th Jan - 4PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,1,30,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Saturday 30th Jan - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,1,31,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Sunday 31st Jan - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,2,1,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Monday 1st Feb - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,2,2,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Tuesday 2nd Feb - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,2,3,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Wednesday 3rd Feb - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,2,4,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Thursday 4th Feb - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  },
  {
    liveDate: [2021,2,5,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'Friday 5th Feb - 6PM',
    cta: "Watch live demo",
    poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv.jpg',
    mobile_poster: 'https://images.samsung.com/is/image/samsung/assets/uk/explore/kings-cross/samsung-people-live/kv-mob-v2.jpg'
  }
]

class SamsungLive {

  constructor () {
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

  }

  renderHeader() {
    // clear element
    templateTarget.innerHTML = ""
    // render template
    templateTarget.insertAdjacentHTML('beforeend', template(this.currentShow))
    // init class
    new HoiBambuser(document.querySelector('.hoiBambuser'))
    // update title
    // titleTarget.innerText = this.currentShow.title
  }

  update() {
    // get shows based on current time
    let { currentShow, nextShow } = this.getShows()

    // if no current show but a next, use next for kv
    if (nextShow && !currentShow) {
      currentShow = nextShow
    }
    // if current show has changed
    if (this.currentShow !== currentShow) {
      this.currentShow = currentShow
      this.renderHeader()
    }

    // if next show has changed
    if (this.nextShow !== nextShow) {
      this.nextShow = nextShow
      if (nextShow) {
        this.renderCountdown(nextShow)
      } else {
        // nothing more to show from schedule
        this.countdown = false
        countdownTarget.innerHTML = ''
        clearInterval(this.updateInterval)
      }
    }

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

  getShows() {
    const currentTime = this.getCurrentTime()
    let nextShow = SCHEDULE.find(item => {
      const itemTime = DateTime.local(...item.liveDate).setZone("GMT")
      return itemTime > currentTime
    }) || false
    // current show is one previous to next or the last in schedule
    let currentShow = nextShow ? SCHEDULE[SCHEDULE.indexOf(nextShow) - 1] : SCHEDULE[SCHEDULE.length - 1]

    if (nextShow) {
      let nextShowTime = DateTime.local(...nextShow.liveDate).setZone("GMT")
      // if the next show starts within 30 mins, use as current
      if (Interval.fromDateTimes(currentTime, nextShowTime).length('minutes') < 30) {
        currentShow = nextShow
      }
    }

    return {currentShow, nextShow}
  }



}

new SamsungLive
