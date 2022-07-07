import getParam from '../../../js/components/getParam'
import { DateTime } from 'luxon';

class VarChallengeComponent {
  constructor() {
    this.componentEl = document.querySelector('.varChallenge')
    this.questionsEl = document.querySelector('#var-questions')
    this.videoEl = document.querySelector('#var-video')
    this.introEl = document.querySelector('#var-intro')
    this.outroEl = document.querySelector('#var-outro')
    this.startButton = document.querySelector('#var-start')
    this.restartButton = document.querySelector('#var-restart')
    this.resultsProgress = document.querySelector('#var-progress')

    // cue points
    this.cuePointIndex = 0
    this.cuePoints = [
      {
        time: 68.8,
        resultTime: 72.511687,
        question: 'Handball?',
        answers: ['Yes', 'No'],
        answer: 1 // index of answer array
      },
      {
        time: 134,
        resultTime: 137.302714,
        question: 'Handball?',
        answers: ['Yes', 'No'],
        answer: 0
      },
      {
        time: 193.4,
        resultTime: 197.357724,
        question: 'Penalty?',
        answers: ['Yes', 'No'],
        answer: 1
      },
      {
        time: 263.6,
        resultTime: 267.154452,
        question: 'Foul?',
        answers: ['Yes', 'No'],
        answer: 1
      },
      {
        time: 316.3,
        resultTime: 319.533193,
        question: 'Offside?',
        answers: ['Yes', 'No'],
        answer: 1
      },
      {
        time: 325.9,
        end: true
      }
    ]

    this.answerResponses = []
    // render questions -> return answer buttons
    this.answerButtons = this.renderQuestions()
    // needed for ios
    this.videoEl.load()
    // setup event listeners
    this.eventListeners()

  }


  // track video progress and show views where required
  trackProgress() {
    const { currentTime } = this.videoEl
    const currentCue = this.cuePoints[this.cuePointIndex]
    // console.log('progress', currentCue, currentTime, this.cuePointIndex)

    if (!currentCue) return // last cue

    if (currentTime >= currentCue.time && currentCue.end) {
      // dont end the challenge here, just speed up the video til end
      this.resultsProgress.innerHTML = '' // clear results too
      this.videoEl.playbackRate = 3
      return
      // return this.endChallenge()
    }

    if (currentTime >= currentCue.time && !currentCue.asked) {
      currentCue.asked = true
      return this.showQuestion(currentCue)
    }
    if (currentTime >= currentCue.resultTime) {
      return this.showResult()
    }
  }

  showResult() {
    const success = this.answerResponses[this.cuePointIndex] === this.cuePoints[this.cuePointIndex].answer
    this.resultsProgress.insertAdjacentHTML('beforeend', `
      <div class="varChallenge__progress_item varChallenge__progress_item--${success ? 'correct' : 'incorrect'}"></div>
    `)
    // after result show, incremeent index
    this.cuePointIndex++
  }

  showQuestion(cuePoint) {
    // show question
    const questionEl = this.questionsEl.querySelector(`.varChallenge__question:nth-child(${this.cuePointIndex+1})`)
    questionEl.setAttribute('active', '')
    this.videoEl.pause()
  }

  questionAnswered(e) {
    const questionEl = this.questionsEl.querySelector(`.varChallenge__question:nth-child(${this.cuePointIndex+1})`)
    const { cueIndex, answerIndex } = e.target.dataset
    this.answerResponses[parseInt(cueIndex)] = parseInt(answerIndex)
    questionEl.removeAttribute('active')
    this.videoEl.play()
  }

  // component events
  eventListeners() {
    // launch app
    this.startButton.addEventListener('click', this.startChallenge.bind(this))

    this.restartButton.addEventListener('click', this.restartChallenge.bind(this))

    this.answerButtons.forEach(button => {
      button.addEventListener('click', this.questionAnswered.bind(this))
    })

    this.videoEl.addEventListener('canplaythrough', (e) => {
      this.componentEl.setAttribute('ready', '')
      this.introEl.setAttribute('animate-swipe', '')
    })

    this.videoEl.addEventListener('timeupdate', this.trackProgress.bind(this))

    this.videoEl.addEventListener('ended', this.endChallenge.bind(this))

  }

  endChallenge() {
    const scoreEl = this.componentEl.querySelector('#var-outro-score')
    const copyEl = this.componentEl.querySelector('#var-outro-copy')
    // works on the basis if first five cues being questions
    const score = this.answerResponses.map((answer, index) => this.cuePoints[index].answer === answer).filter(x => x === true).length // calc score
    scoreEl.innerText = `${score} / ${this.answerResponses.length}` // set score

    // HANDOVER OUTRO COPY CHANGE - change the copy on and after the 7th june

    // if (DateTime.local() >= DateTime.fromObject({year: 2021, month:6, day:7}) || getParam('copy')) {
    //   copyEl.innerText = `Why not head down to KX to have another go in person and be in with the chance to get a new Samsung Neo QLED 8K TV for £1*`
    // }

    this.componentEl.setAttribute('ended', '')
    this.introEl.removeAttribute('animate-swipe')
  }

  restartChallenge() {
    this.cuePointIndex = 0
    this.videoEl.currentTime = 0
    this.answerResponses = []
    this.videoEl.playbackRate = 1
    // reset asked flag from trackProgress
    this.cuePoints.forEach((cue, i) => {
      if (cue.asked) {
        delete cue.asked
      }
    })

    this.componentEl.removeAttribute('ended')
    this.componentEl.removeAttribute('started')

    this.introEl.setAttribute('animate-swipe', '')
  }

  startChallenge() {
    this.componentEl.setAttribute('started', '')
    this.introEl.removeAttribute('animate-swipe')

    //dev
    // this.cuePointIndex = 4
    // this.videoEl.currentTime = 283
    // this.videoEl.playbackRate = 5;

    // fast mode
    const fastMode = getParam('fast') || false
    if (fastMode) {
      this.videoEl.playbackRate = 5;
    }

    this.videoEl.play()
  }

  renderQuestions() {
    this.cuePoints
      .filter(cue => cue.answers !== undefined) // filter to only cues with answers
      .forEach((cue, cueIndex) => {
      this.questionsEl.insertAdjacentHTML('beforeend', `
        <div class="varChallenge__question  varChallenge__view--swipe" data-cue-index="${cueIndex}">
          <div class="varChallenge__view_body">
            <h3>${cue.question}</h3>
            <div class="varChallenge__answers">
              ${cue.answers.map((answer, answerIndex) => {
                return `<button
                ga-ca="microsite"
                ga-ac="feature"
                ga-la="uk:kings-cross:var-challenge:challenge-q${cueIndex+1}-${answer}"
                data-omni-type="microsite"
                data-omni="uk:kings-cross:var-challenge:challenge-q${cueIndex+1}-${answer}"
                class="varChallenge__answer" data-cue-index="${cueIndex}" data-answer-index="${answerIndex}">${answer}</button>`
              }).join(' ')}
            </div>
          </div>
        </div>
      `)
    })
    return document.querySelectorAll('.varChallenge__answer')
  }
}

export default VarChallengeComponent
