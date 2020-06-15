import KXEnv from '../util/KXEnv'

const LIVE_OPENING_TIMES = 'https://kxuploads.s3.eu-west-2.amazonaws.com/sot/results.json'
const STAGING_OPENING_TIMES = 'https://kxuploads.s3.eu-west-2.amazonaws.com/sot/results-new.json'

export default class findKX {

  constructor() {

    // element to append times to
    this.openingTimesEl = document.querySelector('.findkx__openings__dynamic')

    if (!this.openingTimesEl) {
      return console.log('no findkx/times element')
    }

    // get url for data based on env
    const url = KXEnv.live ? LIVE_OPENING_TIMES : LIVE_OPENING_TIMES

    // get data then populate
    this.fetchData(url)
      .then(this.populateTimes.bind(this))
  }

  fetchData(url) {
    return fetch(url).then(r => r.json())
  }

  populateTimes(data) {

    // line template
    let template = function(day, time) {
      return `
        <div class="findkx__openings__line">
          <p><span class="fz18">${day}</span></p>
          <p class="fz18">${time}</p>
        </div>
      `
    }

    // append template for each line
    data.forEach((item) => {
      let split = item.split(': ')
      this.openingTimesEl.insertAdjacentHTML('beforeend', template(split[0], split[1]))
    })

  }

}
