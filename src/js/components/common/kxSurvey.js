import SURVEY_DATA from '../../../data/KX_SURVEY_DATA'; // temp until dynamic data built
import getParam from '../getParam' // maybe move replace script

const template = require('../../../templates/partials/components/common/kxSurvey.hbs');

const URL_PARAM = 'kxsid'
const PROMPT_DISPLAY_DELAY = 1000

/*
  KX Survey

  Class will detect a query string parameter <URL_PARAM>
  if param is present
    script will look up the matching record in SURVEY DATA
  if record is found for id
    script will render the kxSurvey template to the page

*/

class KXSurvey {
  constructor() {
    this.templateTarget = document.querySelector('.cheil-static')

    const surveyData = this.getSurveyData()

    if (this.templateTarget && surveyData) {
      this.renderTemplate(surveyData)
    }
  }

  getSurveyData() {
    const surveyID = getParam(URL_PARAM)
    const surveyData = SURVEY_DATA.filter(survey => {
      return survey.id === surveyID
    })[0]
    return surveyData
  }

  renderTemplate(data) {
    console.log('render', data)
    this.templateTarget.insertAdjacentHTML('beforeend', template(data))
    this.setupView()
  }

  showPrompt() {

  }

  setupView() {
    const el = this.templateTarget
    const modalEl = el.querySelector('.kxSurvey__modal')
    const promptEl = el.querySelector('.kxSurvey__prompt')
    const promptYes = el.querySelector('#kxSurvey__prompt--yes')
    const promptNo = el.querySelector('#kxSurvey__prompt--no')
    const modalClose = el.querySelector('.kxSurvey__modal_close')

    promptYes.addEventListener('click', () => {
      console.log('show survey')
      // lock scroll
      document.querySelector('html').style.overflow = 'hidden'
      modalEl.setAttribute('active','')
      promptEl.removeAttribute('active')
    })
    promptNo.addEventListener('click', () => {
      console.log('no survey')
      promptEl.removeAttribute('active')
    })

    modalClose.addEventListener('click', () => {
      // unlock scroll
      document.querySelector('html').style.overflow = ''
      modalEl.removeAttribute('active')
    })

    // show prompt after x secondss
    setTimeout(() => {
      promptEl.setAttribute('active', '')
    }, PROMPT_DISPLAY_DELAY)


  }
}


export default new KXSurvey()
