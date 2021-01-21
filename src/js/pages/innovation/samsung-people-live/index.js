import { DateTime, Interval } from 'luxon';
import getParam from '../../../../js/components/getParam'

const Handlebars = require("hbsfy/runtime");
// Handlebars.registerPartial('home-of-innovation/hoiBambuser', require('../../../../templates/partials/home-of-innovation/hoiBambuser.hbs'))
import HandlebarsHelpers from '../../../../templates/helpers/handlebarsHelpers';
HandlebarsHelpers.register(Handlebars)

const template = require('../../../../templates/partials/home-of-innovation/hoiBambuser.hbs');
const templateTarget = document.querySelector('#bambuser-target')
const titleTarget = document.querySelector('#title-target h1')

import HoiBambuser from '../../../../js/home-of-innovation/HoiBambuser';

const SCHEDULE = [
  {
    liveDate: [2021,1,21,12,0],
    showID: 'ymIn5cG7nsUMhly5Gx1S',
    title: 'January 21st 12PM',
    cta: "Launch Show (21st 12pm)",
    poster: 'https://picsum.photos/1440/900'
  }
]

const __SCHEDULE = [
  {
    liveDate: [2021,1,29,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 29th 4PM',
    cta: "Launch Show (29th 4PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,1,29,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 29th 6PM',
    cta: "Launch Show (29th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,1,30,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 30th 4PM',
    cta: "Launch Show (30th 4PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,1,30,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 30th 6PM',
    cta: "Launch Show (30th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,1,31,16,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 31st 4PM',
    cta: "Launch Show (31st 4PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,1,31,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'January 31st 6PM',
    cta: "Launch Show (31st 4PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,2,4,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'February 4th 6PM',
    cta: "Launch Show (4th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,2,5,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'February 5th 6PM',
    cta: "Launch Show (5th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,2,6,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'February 6th 6PM',
    cta: "Launch Show (6th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  },
  {
    liveDate: [2021,2,7,18,0],
    showID: '1JySqY77y0inrbcvMsi5',
    title: 'February 7th 6PM',
    cta: "Launch Show (7th 6PM)",
    poster: 'https://picsum.photos/1440/900'
  }
]

class SamsungLive {

  constructor () {
    this.pageInitiateTime = DateTime.local()
    this.currentShow = false
    this.nextShow = false
    this.update()

    // debug for now, change for countdown / update method
    setInterval(() => {
      this.update()
    }, 5000)

  }

  renderHeader() {
    // clear element
    templateTarget.innerHTML = ""
    // render template
    templateTarget.insertAdjacentHTML('beforeend', template(this.currentShow))
    // init class
    new HoiBambuser(document.querySelector('.hoiBambuser'))
    // update title
    titleTarget.innerText = this.currentShow.title
  }

  update() {
    // get shows based on current time
    let { currentShow, nextShow } = this.getShows()

    console.log('update', this.currentShow, currentShow, nextShow)

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
      // this.renderCountdown()
      // render countdown
    }

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
      if (Interval.fromDateTimes(currentTime, itemTime).length('minutes') < 30) {
        // if next show is within x minutes skip
        return false
      }
      return itemTime > currentTime
    }) || false
    // current show is one previous to next or the last in schedule
    let currentShow = nextShow ? SCHEDULE[SCHEDULE.indexOf(nextShow) - 1] : SCHEDULE[SCHEDULE.length - 1]
    return {currentShow, nextShow}
  }



}

new SamsungLive
