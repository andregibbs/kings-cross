import '../../../bootstrap.js'

import HOIAddToCalendar from '../../../home-of-innovation/hoiAddToCalendar'
const hoiAddToCalendarTemplate = require('../../../../templates/partials/home-of-innovation/hoiAddToCalendar.hbs');
const calendarTarget = document.querySelector('#hoi-add-to-calendar-target')

const ADD_TO_CALENDAR = {
  DATE: 'July 26, 2021 18:00',
  TITLE: 'Solve For Tomorrow: Future Talks Designing for a sustainable future',
  DESCRIPTION: 'sft',
  DURATION: 60
}

const TWITCH = {
  CHANNEL:'gamesdonequick',
  TARGET_ELEMENT: 'twitch-embed-target'
}

const ELEMENTS = {
  PAGE: document.querySelector('.cheil-static'),
  LAUNCH_BUTTON: document.querySelector('#launch-video'),
  KV: document.querySelector('.hoiKv'),
  KV_MEDIA: document.querySelector('.hoiKv__Media')
}


class SolveForTomorrow {
  constructor() {
    this.renderAddToCalendar()
    // this.renderTwitchEmbed()
    this.eventListeners()
  }

  eventListeners() {
    ELEMENTS.LAUNCH_BUTTON.addEventListener('click', () => {
      this.renderTwitchEmbed()
      ELEMENTS.KV_MEDIA.setAttribute('active', '')
      setTimeout(() => {

        ELEMENTS.PAGE.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth'
        })

      }, 500) // kv height anim time

    })
  }

  renderTwitchEmbed() {
    if (!Twitch) {
      console.log('no twitch')
      return setTimeout(this.renderTwitchEmbed.bind(this), 1000)
    }

    new Twitch.Embed(TWITCH.TARGET_ELEMENT, {
      width: '100%',
      height: '100%',
      channel: TWITCH.CHANNEL,
      layout: 'video',
      // autoplay: false,
      // Only needed if this page is going to be embedded on other websites
      parent: ["kings-cross.samsung.com", "p6-qa.samsung.com", "samsung.com"]
    });
  }

  renderAddToCalendar() {
    const templateData = {
      "title": ADD_TO_CALENDAR.TITLE,
      "start": ADD_TO_CALENDAR.DATE,
      "description": ADD_TO_CALENDAR.DESCRIPTION,
      "address": window.location.href,
      "duration": ADD_TO_CALENDAR.DURATION
    }
    calendarTarget.innerHTML = ''
    calendarTarget.insertAdjacentHTML('beforeend', hoiAddToCalendarTemplate(templateData))
    new HOIAddToCalendar(calendarTarget.querySelector('.hoiAddToCalendar'))
  }
}


console.log('aaaaa')
new SolveForTomorrow()
