import { DateTime, Interval } from 'luxon';

const countdownTemplate = require('../../../templates/partials/components/common/kxCountdown/kxCountdown.hbs');
const digitTemplate = require('../../../templates/partials/components/common/kxCountdown/KXCountdownDigit.hbs');

class KXCountdown {
  constructor(el, endDateTime, customCurrentTime = false, autoUpdate = false) {
    this.el = el
    this.endDateTime = DateTime.local(...endDateTime).setZone("GMT")
    // TODO make internal function for updating
    this.autoUpdate = autoUpdate // allow for internal updating
    // init template
    this.setupTemplate()
    // init Digits
    this.day_0 = new KXCountdownDigit(this.el.querySelector('[day_0]'), 0)
    this.day_1 = new KXCountdownDigit(this.el.querySelector('[day_1]'), 0)
    this.hour_0 = new KXCountdownDigit(this.el.querySelector('[hour_0]'), 0)
    this.hour_1 = new KXCountdownDigit(this.el.querySelector('[hour_1]'), 0)
    this.minute_0 = new KXCountdownDigit(this.el.querySelector('[minute_0]'), 0)
    this.minute_1 = new KXCountdownDigit(this.el.querySelector('[minute_1]'), 0)
    this.second_0 = new KXCountdownDigit(this.el.querySelector('[second_0]'), 0)
    this.second_1 = new KXCountdownDigit(this.el.querySelector('[second_1]'), 0)
    // trigger initial update
    this.update(customCurrentTime)
  }

  setupTemplate() {
    this.el.innerHTML = ""
    // render template
    this.el.insertAdjacentHTML('beforeend', countdownTemplate())
  }

  update(customCurrentTime = false) {
    // current local time
    const currentDateTime = customCurrentTime ? customCurrentTime : DateTime.local()
    // calculate diffs
    const diffs = this.endDateTime.diff(currentDateTime, ['days', 'hours', 'minutes', 'seconds'])
    // stringify diff values
    const sDays = diffs.days.toString()
    const sHours = diffs.hours.toString()
    const sMinutes = diffs.minutes.toString()
    const sSeconds = Math.floor(diffs.seconds).toString()
    // get required digit string
    const digits = {
      day_0: sDays.length > 1 ? sDays[0] : "0",
      day_1: sDays.length > 1 ? sDays[1] : sDays[0],
      hour_0: sHours.length > 1 ? sHours[0] : "0",
      hour_1: sHours.length > 1 ? sHours[1] : sHours[0],
      minute_0: sMinutes.length > 1 ? sMinutes[0] : "0",
      minute_1: sMinutes.length > 1 ? sMinutes[1] : sMinutes[0],
      second_0: sSeconds.length > 1 ? sSeconds[0] : "0",
      second_1: sSeconds.length > 1 ? sSeconds[1] : sSeconds[0]
    }
    // send digits to KXDigit instances to update
    this.day_0.update(digits.day_0)
    this.day_1.update(digits.day_1)
    this.hour_0.update(digits.hour_0)
    this.hour_1.update(digits.hour_1)
    this.minute_0.update(digits.minute_0)
    this.minute_1.update(digits.minute_1)
    this.second_0.update(digits.second_0)
    this.second_1.update(digits.second_1)
  }
}

class KXCountdownDigit {
  constructor(el, digit) {
    // set el update with initial digit
    this.el = el
    this.digit = false
    this.update(digit)
  }
  update(newDigit) {
    // only update template if digits differ from exsting
    if (this.digit !== newDigit) {
      let digits = {}
      if (this.digit !== false) {
        // if a digit has already been created
        digits.in = newDigit
        digits.out = this.digit
      } else {
        // otherwise just use in
        digits.in = newDigit
      }
      // update digit ref
      this.digit = newDigit
      // clear and render
      this.el.innerHTML = ""
      this.el.insertAdjacentHTML('beforeend', digitTemplate(digits))
    }
  }
}

export default KXCountdown
