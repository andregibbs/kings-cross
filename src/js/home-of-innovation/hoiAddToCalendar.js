import addToCalendarAnimation from '../animation/add-to-calendar.json';
import { createCalendar } from 'add-to-calendar-buttons'

import svgToMiniDataURI from 'mini-svg-data-uri'
import googleSVG from '../../templates/partials/svg/google.svg'
import appleSVG from '../../templates/partials/svg/apple.svg'
import outlookSVG from '../../templates/partials/svg/outlook.svg'

class HOIAddToCalendar {
  constructor(element) {
    this.el = element
    this.calendarData = this.getCalendarData()
    if (!this.calendarData) {
      console.log('invalid data for event')
      return this.hideComponent()
    }
    if (this.calendarData.start.getTime() < Date.now()) {
      // event has passed
      this.hideComponent()
    }
    this.createCalendarComponent()
    this.componentModifications()
  }

  hideComponent() {
    this.el.style.visibility = 'hidden'
  }

  getCalendarData() {
    const data = {}
    let mainEl = this.el
    function attr(key) {
      return mainEl.getAttribute(`data-${key}`);
    }
    ['title','description','address','start','end', 'duration'].forEach(key => {
      const value = attr(key)
      if (value) {
        switch (key) {
          case 'start':
          case 'end':
            data[key] = new Date(value)
            break;
          case 'duration':
            data[key] = parseInt(value);
            break;
          default:
            data[key] = value
        }
      }
    })
    console.log(data)
    if (!data.start || !data.duration && !data.end) {
      console.log('addToCalendar: data requires end or duration value')
      return false
    }
    return data
  }

  componentModifications() {
    const ctaText = `Remind Me`
    const icons = [
      { cls: 'ical', svg: appleSVG, text: 'Apple' },
      { cls: 'google', svg: googleSVG, text: 'Google/Android' },
      { cls: 'outlook', svg: outlookSVG, text: 'Outlook' },
    ]
    function styleString({cls, svg}) {
      return document.createTextNode(`.icon-${cls}:before { background-image: url("${svgToMiniDataURI(svg)}") !important; }`)
    }

    const styles = document.createElement('style')
    styles.type = 'text/css'

    // loop, create styles & make button modifications
    icons.forEach(icon => {
      styles.appendChild(styleString(icon))
      const iconEl = this.el.querySelector(`.icon-${icon.cls}`)
      const pageTitle = this.el.getAttribute('data-page-title')
      iconEl.innerText = icon.text
      iconEl.setAttribute('ga-ca', 'microsite')
      iconEl.setAttribute('ga-ac', 'feature')
      iconEl.setAttribute('ga-la', `uk:kings-cross:${pageTitle}:add-to-calendar:${icon.text}`)
      iconEl.setAttribute('data-omni-type', 'microsite')
      iconEl.setAttribute('data-omni-uk', `uk:kings-cross:${pageTitle}:add-to-calendar:${icon.text}`)
    })

    // modify calendar label
    const calendarLabelEl = this.el.querySelector('label.add-to-calendar-checkbox')
    calendarLabelEl.innerText = ''
    this.createIcon(calendarLabelEl)
    calendarLabelEl.appendChild(document.createTextNode(ctaText))

    // apply styles
    this.el.appendChild(styles)

  }


  createCalendarComponent() {
    const buttonTarget = this.el
    let calendar = createCalendar({
      data: this.calendarData
    })
    buttonTarget.appendChild(calendar)
  }

  createIcon(el) {
    let loaderAnimation = false;
    // burger menu anim
    if (lottie) {
      loaderAnimation = lottie.loadAnimation({
        container: el, // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        animationData: addToCalendarAnimation // the path to the animation json
      });
      loaderAnimation.addEventListener('complete', function() {
        setTimeout(function(){
          loaderAnimation.goToAndPlay(0);
        }, 5000);
      })
    }
    return loaderAnimation
  }
}

export default HOIAddToCalendar
