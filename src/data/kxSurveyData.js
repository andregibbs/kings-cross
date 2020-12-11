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
  after the survey data
  run 'npm run deploy-kx-survey-data-staging' to update local file


  // model

  {
    name: "__SURVEY_NAME (required)",
    active: false,
    pathnames: [__PAGE_PATHNAMES], (/uk/explore/kings-cross)
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

const SURVEY_DATA_LIVE_FILENAME = 'kx-survey-data.json'
const SURVEY_DATA_STAGING_FILENAME = 'kx-survey-data-staging.json'

const SURVEY_DATA = [
  {
    name: "NAME OF SURVEY",
    active: true,
    id: "what-you-think",
    pathnames: [
      '/uk/explore/kings-cross/',
      '/uk/explore/kings-cross/hub/',
      '/uk/explore/kings-cross/innovation/next-level-gaming/',
      '/uk/explore/kings-cross/innovation/next-level-gaming/deadly-pro-gaming-secrets/',
      '/uk/explore/kings-cross/innovation/next-level-gaming/meet-the-game-changers/',
      '/uk/explore/kings-cross/innovation/next-level-gaming/wolfiez-pro-gaming-secrets/',
      '/uk/explore/kings-cross/innovation/connected-christmas/',
      '/uk/explore/kings-cross/innovation/connected-christmas/marcelino-sambe/',
      '/uk/explore/kings-cross/creativity/editing-sessions/',
      '/uk/explore/kings-cross/creativity/editing-sessions/1/',
      '/uk/explore/kings-cross/creativity/editing-sessions/2/',
      '/uk/explore/kings-cross/creativity/editing-sessions/3/',
      '/uk/explore/kings-cross/creativity/editing-sessions/4/',
      '/uk/explore/kings-cross/creativity/editing-sessions/5/',
      '/uk/explore/kings-cross/creativity/editing-sessions/6/',
      '/uk/explore/kings-cross/creativity/editing-sessions/7/'
    ],
    survey_embed_url: "https://docs.google.com/forms/d/e/1FAIpQLScrgghSDPFOhZVlgwZ2RBY9YttF8LO66gp0IV6McTLBhVnOPg/viewform",
    prompt: {
      title: 'Tell us what you think of<br/>Samsung KX',
      copy: [
        'We\'d love to hear your feedback'
      ],
      yes: 'Sure',
      no: 'No Thanks'
    }
  },
  {
    name: "NAME OF SURVEY",
    active: false,
    id: "TEST_2",
    survey_embed_url: "https://docs.google.com/forms/d/e/1FAIpQLScif4GIPUJCO0DjvtnFOdEHDJKFe8nYFpenc6JEy5Xe8dgyqw/viewform",
    prompt: {
      title: 'Survey 2',
      copy: [
        'Test'
      ],
      yes: 'Yes',
      no: 'No'
    }
  }
]

module.exports = {
  SURVEY_DATA_LIVE_FILENAME,
  SURVEY_DATA_STAGING_FILENAME,
  SURVEY_DATA
}
