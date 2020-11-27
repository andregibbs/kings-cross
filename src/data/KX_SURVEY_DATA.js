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
    id: "TEST",
    survey_id: "GOOGLE ID OF FORM",
    prompt: {
      title: 'KX Survey',
      copy: [
        'Would you like to complete a survey?'
      ],
      yes: 'yes',
      no: 'no'
    },
    modal: {
      title: 'modal title',
      copy: [
        'here are a few paragraphss',
        'if some extra copy is needed',
        'can also include <strong>html</strong>'
      ]
    }
  }
]

export default SURVEY_DATA
