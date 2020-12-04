/*

  KXSurvey

  Class will detect a query string parameter <URL_PARAM>
  if param is present
    script will look up the matching record in SURVEY DATA
  if record is found for id
    script will render the kxSurvey template to the page

  Reminder:
    if the survey data has been updated in src/data/kxSurveyData
    but not visible when testing
    run 'npm run deploy-kx-survey-data-staging' to update the local file

*/

import getParam from '../getParam' // maybe move/replace script
import KXEnv from '../../util/KXEnv'

const template = require('../../../templates/partials/components/common/kxSurvey.hbs');

const LOCAL_STORAGE_KEY = 'kxs-history'
const URL_PARAM = 'kxsid'
const PROMPT_DISPLAY_DELAY = 2500;

// move this somewhere common to fetch data
// base path for dynamic data
const FETCH_BASE = "https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/"
// kx survey filenames
const {
  SURVEY_DATA_LIVE_FILENAME,
  SURVEY_DATA_STAGING_FILENAME
} = require('../../../../src/data/kxSurveyData');

// paths for local, staging/qa & live data
const STAGING_URL = FETCH_BASE + SURVEY_DATA_STAGING_FILENAME
const LIVE_URL = FETCH_BASE + SURVEY_DATA_LIVE_FILENAME
const LOCAL_URL = '/' + SURVEY_DATA_STAGING_FILENAME

// path based on env
const KX_SURVEY_DATA_URL = KXEnv.live ? LIVE_URL : KXEnv.local ? LOCAL_URL : STAGING_URL;


class KXSurvey {
  constructor() {

    this.templateTarget = document.querySelector('.cheil-static')
    this.surveyID = getParam(URL_PARAM)

    this.modalEl = null
    this.promptEl = null
    this.promptYes = null
    this.promptNo = null
    this.modalClose = null

    this.userInteracted = false

    // reset view history
    if (getParam('reset')) {
      this.resetHistory()
    }

    if (this.hasBeenAskedForSurvey(this.surveyID) || !this.surveyID || !this.templateTarget) {
      // user has already been asked about this survey
      // or no survey id
      // or no template target
      return
    }

    // fetch
    // fetch either local/staging/or live data
    // if no data and local message in console that the survey data needs to be written locally
    this.fetchSurveyData()
      .then(surveyData => {
        // find survey data for id in url
        const selectedSurvey = surveyData.filter(survey => {
          return survey.id === this.surveyID
        })[0]

        if (!selectedSurvey) {
          console.log('no survey with specified id')
          return // no survey present
        }

        // render template and setup view
        this.renderTemplate(selectedSurvey)
        this.setupView();

        // prompt trigger method
        this.listenForUserInteraction()

      })
      .catch(e => {
        if (KXEnv.local) {
          console.log('NOTE: you may receive this message if the kxsurvey data has not been generated locally. run \'npm run deploy-kx-survey-data-staging\' to create')
        }
        return console.log(e)
      })

  }

  listenForUserInteraction() {
    window.addEventListener('scroll', this.userInteraction.bind(this))
    window.addEventListener('mousemove', this.userInteraction.bind(this))
    window.addEventListener('touchstart', this.userInteraction.bind(this))
  }

  userInteraction(e) {
    // on first interaction
    if (!this.userInteracted) {
      this.userInteracted = true
      window.removeEventListener('scroll', this.userInteraction.bind(this))
      window.removeEventListener('mousemove', this.userInteraction.bind(this))
      window.removeEventListener('touchstart', this.userInteraction.bind(this))
      this.showPrompt(this)
    }
  }

  fetchSurveyData() {
    return fetch(KX_SURVEY_DATA_URL).then(r => r.json())
  }

  renderTemplate(data) {
    // render template to view and setup eventss
    this.templateTarget.insertAdjacentHTML('beforeend', template(data))
    this.setupView()
  }

  showPrompt() {
    // show prompt after timeout
    setTimeout(() => {
      this.promptEl.setAttribute('active', '')
    }, PROMPT_DISPLAY_DELAY)
  }

  setupView() {
    // configure view events
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
      this.modalEl.removeAttribute('active') // hide modal
      // todo, destroy self?
    })

  }

  userRejectPrompt() {
    // user rejects prompt
    this.promptEl.removeAttribute('active') //hide prompt
    this.storeUserAsked()
  }

  userAcceptPrompt() {
    // user accepts prompt
    // lock scroll
    document.querySelector('html').style.overflow = 'hidden'
    this.modalEl.setAttribute('active','') // show modal
    this.promptEl.removeAttribute('active') // hide prompt
    this.storeUserAsked()
  }

  getSurveyHistory() {
    const surveyHistory = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (surveyHistory !== null) {
      // if exists
      return JSON.parse(surveyHistory)
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
    // reset local storage
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

}


export default KXSurvey
