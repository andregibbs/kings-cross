import SURVEY_DATA from '../../../data/KX_SURVEY_DATA'; // temp until dynamic data built
import getParam from '../getParam' // maybe move replace script

const template = require('../../../templates/partials/components/common/kxSurvey.hbs');

const LOCAL_STORAGE_KEY = 'kxs-history'
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
    this.surveyID = getParam(URL_PARAM)

    this.modalEl = null
    this.promptEl = null
    this.promptYes = null
    this.promptNo = null
    this.modalClose = null

    // reset view history
    if (getParam('reset')) {
      this.resetHistory()
    }

    if (this.hasBeenAskedForSurvey(this.surveyID) || !this.surveyID) {
      // user has already been asked about this survey
      // or no survey id
      return
    }

    const surveyData = this.getSurveyData()
    if (this.templateTarget && surveyData) {
      this.renderTemplate(surveyData)
    }
  }

  getSurveyData() {
    const surveyData = SURVEY_DATA.filter(survey => {
      return survey.id === this.surveyID
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
    this.modalEl = el.querySelector('.kxSurvey__modal')
    this.promptEl = el.querySelector('.kxSurvey__prompt')
    this.promptYes = el.querySelector('#kxSurvey__prompt--yes')
    this.promptNo = el.querySelector('#kxSurvey__prompt--no')
    this.modalClose = el.querySelector('.kxSurvey__modal_close')

    this.promptYes.addEventListener('click', this.userAcceptPrompt.bind(this))
    this.promptNo.addEventListener('click', this.userRejectPrompt.bind(this))

    this.modalClose.addEventListener('click', () => {
      // unlock scroll
      document.querySelector('html').style.overflow = ''
      this.modalEl.removeAttribute('active')
    })

    // show prompt after x secondss
    setTimeout(() => {
      this.promptEl.setAttribute('active', '')
    }, PROMPT_DISPLAY_DELAY)

  }

  userRejectPrompt() {
    console.log('userRejectPrompt')
    this.promptEl.removeAttribute('active')
    this.storeUserAsked()
  }

  userAcceptPrompt() {
    console.log('userAcceptPrompt')
    document.querySelector('html').style.overflow = 'hidden'
    this.modalEl.setAttribute('active','')
    this.promptEl.removeAttribute('active')
    this.storeUserAsked()
  }

  getSurveyHistory() {
    const surveyHistory = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (surveyHistory !== null) {
      // if exists
      return surveyHistory
    } else {
      // else return empty array
      return []
    }
  }

  hasBeenAskedForSurvey(id) {
    const surveyHistory = this.getSurveyHistory()
    if (surveyHistory) {
      // if id is present in stored survey array
      if (surveyHistory.indexOf(id) > -1) {
        return true
      }
      return false
    }
    return false
  }

  storeUserAsked() {
    const surveyHistory = this.getSurveyHistory()
    // push id to stored array
    surveyHistory.push(this.surveyID)
    // save array
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(surveyHistory))
  }

  resetHistory() {
    console.log('reset storage')
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

}


export default new KXSurvey()
