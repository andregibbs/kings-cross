import '../../bootstrap.js'

console.log('form')

const SURVEYS = {
  'test': '1FAIpQLSdEHRFRCpN4PyP8REhSZyCl3T_XMxxFchQyxC-a0XSAIwJQJQ',
  'party': '1FAIpQLScif4GIPUJCO0DjvtnFOdEHDJKFe8nYFpenc6JEy5Xe8dgyqw'
}

const iframe = (id) => `<iframe src="https://docs.google.com/forms/d/e/${id}/viewform?embedded=true" frameborder="0" marginheight="0" marginwidth="0" onLoad="window.onIframeUpdate()">Loading…</iframe>`

const modal = document.querySelector('.modal')
const prompt = document.querySelector('.prompt')
const formTarget = document.querySelector('#form-target')
const clear = document.querySelector('#clear')
clear.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
})

let surveySet = false

const yes = document.querySelector('#yes')
const no = document.querySelector('#no')
const close = document.querySelector('#close')
close.addEventListener('click', hideSurvey)

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const surveyID = urlParams.get('survey') || false

// storage key for the survey id
function storageID(type) {
  return `kx-survey:${surveyID}:${type}`
}

// if user has already been asked
function hasBeenAsked() {
  return localStorage.getItem(storageID('asked')) === 'true'
}
// store that the user has been asked
function storeHasBeenAsked() {
  // stores wether the user has been asked for a survey on this page
  localStorage.setItem(storageID('asked'), 'true')
}

// window function for detecting iframe change
// probably not worth doing,
// window.onIframeUpdate = () => {
//   console.log('iframe update')
// }

// show prompt
function showPrompt() {
  console.log('show prompt')
  prompt.setAttribute('active', '')
  no.addEventListener('click', hidePrompt)
  yes.addEventListener('click', showSurvey)
  // if only want to ask once, use here
  // storeHasBeenAsked()
  // other wise set after a prompt response
}

// hide prompt
function hidePrompt() {
  console.log('hide prompt')
  storeHasBeenAsked()
  prompt.removeAttribute('active')
}

// show survey
function showSurvey() {
  hidePrompt()
  if (!surveySet) {
    formTarget.innerHTML = iframe(SURVEYS[surveyID])
    surveySet = true
  }
  modal.setAttribute('active', '')
}

// hide survey
function hideSurvey() {
  modal.removeAttribute('active')
}

// init logi
if (surveyID) {
  // if not been asked
  if (!hasBeenAsked()) {
    console.log('not asked')
    // show prompt
    showPrompt()
  } else {
    console.log('already asked')
  }
} else {
  console.log('no survey id')
}
