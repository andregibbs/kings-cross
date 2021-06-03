import '../../bootstrap.js'

import VarChallengeComponent from './var-challenge'
import { loadYoutubeAPI } from '../../home-of-innovation/utils'



function VarChallenge() {

  let challengeInstance;

  loadYoutubeAPI().then(() => {
    challengeInstance = new VarChallengeComponent()
  })

}




if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  VarChallenge()
} else {
  document.addEventListener("DOMContentLoaded", KX_WhatsOn)
}
