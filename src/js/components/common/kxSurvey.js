import SURVEY_DATA from '../../../data/KX_SURVEY_DATA'; // temp until dynamic data built
import getParam from '../getParam' // maybe move replace script

const template = require('../../../templates/partials/components/common/kxSurvey.hbs');
const URL_PARAM = 'kxsid'

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
    const surveyID = getParam(URL_PARAM)
    const surveyData = SURVEY_DATA.filter(survey => {
      return survey.id === surveyID
    })[0]

    console.log(surveyID, surveyData)

    if (this.templateTarget && surveyData) {
      this.renderTemplate(surveyData)
    }
  }

  renderTemplate(data) {
    this.templateTarget.insertAdjacentHTML('beforeend', template())
    this.addEvents()
  }

  addEvents() {
    const promptYes = this.templateTarget.querySelector('#kxSurvey__prompt--yes')
    const promptNo = this.templateTarget.querySelector('#kxSurvey__prompt--no')

    promptYes.addEventListener('click', () => {
      console.log('show survey')
    })
    promptNo.addEventListener('click', () => {
      console.log('no survey')
    })
  }
}


export default new KXSurvey()
