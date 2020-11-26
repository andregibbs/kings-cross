/*

  This file holds the configuration values for ks surveys
  the surveys are google forms served in an iframe

  this file holds the
    name of the survey
    wether the surve is active
    url identifier to trigger a form
    the id of the public google form to embed

  this data is used in deploy-kx-survey-data.js
    to deploy the dynamic data for consumption on staging and live envs

  it is also used locally for development

*/

const SURVEY_DATA = [
  {
    name: "NAME OF SURVEY",
    active: false,
    id: "PUBLIC ID USED IN PARAMETER",
    form_id: "GOOGLE ID OF FORM"
  }
]

export default SURVEY_DATA
