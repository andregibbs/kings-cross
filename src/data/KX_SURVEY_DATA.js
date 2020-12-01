/*

  This file holds the configuration values for ks surveys
  the surveys are google forms served in an iframe

  this file holds the
    name of the survey
    wether the surve is active
    url identifier to trigger a form
    the url of the google form to embed.
      (this has been kept as a full url incase anything else needs to be iframed on kx)

  this data is used in deploy-kx-survey-data.js
    to deploy the dynamic data for consumption on staging and live envs

  it is also used locally for development

  // model

  {
    name: "__SURVEY_NAME (required)",
    active: false,
    id: "__SURVEY_ID (required)",
    survey_embed_url: "__EMBED_URL (required)",
    prompt: {
      title: '__PROMPT_TITLE (required)',
      copy: [
        '__PROMPT_COPY (optional)'
      ],
      yes: '__PROMPT_YES (optional)',
      no: '__PROMPT_NO (optional)'
    },
    modal: {
      title: '__MODAL_TITLE (optional)',
      copy: [
        '__MODAL_COPY (optional)'
      ]
    }
  }

*/

const SURVEY_DATA = [
  {
    name: "NAME OF SURVEY",
    active: false,
    id: "TEST",
    survey_embed_url: "https://docs.google.com/forms/d/e/1FAIpQLScrgghSDPFOhZVlgwZ2RBY9YttF8LO66gp0IV6McTLBhVnOPg/viewform",
    prompt: {
      title: 'Tell us what you think of<br/>Samsung KX',
      copy: [
        'We\'d love to hear your feedback'
      ],
      yes: 'Yes',
      no: 'X'
    }
  }
]

export default SURVEY_DATA
