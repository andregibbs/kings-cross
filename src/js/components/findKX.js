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
    const url = KXEnv.live ? LIVE_OPENING_TIMES : STAGING_OPENING_TIMES

    // get data then populate
    this.fetchData(url)
      .then(this.populateTimes.bind(this))
  }

  fetchData(url) {
    return fetch(url).then(r => r.json())
  }

  populateTimes(data) {



    // line template
    let template = function(line) {
      return `
        <div class="findkx__openings__line">
          <p class="fz18">${line}</p>
        </div>
      `
    }

    // append template for each line
    data.forEach((item) => {
      console.log('item', template(item))
      this.openingTimesEl.insertAdjacentHTML('beforeend', template(item))
    })

  }

}
