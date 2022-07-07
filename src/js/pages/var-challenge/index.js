import '../../bootstrap.js'

import VarChallengeComponent from './var-challenge'
import { loadYoutubeAPI } from '../../home-of-innovation/utils'



function VarChallenge() {

  const launchTerms = document.querySelector('#launch-terms')
  const closeTerms = document.querySelector('#inline-terms-close')
  let challengeInstance;

  loadYoutubeAPI().then(() => {
    challengeInstance = new VarChallengeComponent()
  })

  launchTerms.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('#inline-terms').setAttribute('active','')
  })

  closeTerms.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('#inline-terms').removeAttribute('active')
  })

}




if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  VarChallenge()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
