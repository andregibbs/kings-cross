import getParam from '../../../js/components/getParam'

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
        time: 29.4,
        resultTime: 72.511687,
        question: 'Handball?',
        answers: ['Yes', 'No'],
        answer: 1 // index of answer array
      },
      {
        time: 91.5,
        resultTime: 137.302714,
        question: 'Handball?',
        answers: ['Yes', 'No'],
        answer: 0
      },
      {
        time: 158.1,
        resultTime: 197.357724,
        question: 'Penalty?',
        answers: ['Yes', 'No'],
        answer: 1
      },
      {
        time: 216.8,
        resultTime: 267.154452,
        question: 'Foul?',
        answers: ['Yes', 'No'],
        answer: 1
      },
      {
        time: 283,
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


    // youtube
    // let videoReady = this.youtubeReady.bind(this)
    // let onStateChange = this.youtubeStateChange.bind(this)
    // this.youtubeInstance = new YT.Player(this.videoEl, {
    //   videoId: "fIYiC2Q5m_k",
    //   height: '100%',
    //   width: '100%',
    //   playerVars: {
    //     showinfo: 0,
    //     controls: 0,
    //     autohide: 1,
    //     modestbranding: 1
    //   },
    //   events: {
    //     videoReady,
    //     onStateChange
    //   }
    // })
    // // timeout for video progress
    // this.videoProgressInterval = null

  }


  // track video progress and show views where required
  trackProgress() {
    const { currentTime } = this.videoEl
    const currentCue = this.cuePoints[this.cuePointIndex]
    // console.log('progress', currentTime, this.cuePointIndex)

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

  // youtube events
  // youtubeReady() {
  //   console.log('vid ready')
  //   this.componentEl.setAttribute('ready', '')
  // }
  //
  // youtubeStateChange(e) {
  //   switch (e.data) {
  //     case YT.PlayerState.PLAYING:
  //       this.videoProgressInterval = setInterval(this.trackProgress.bind(this), 1000)
  //       break;
  //     case YT.PlayerState.PAUSED:
  //     case YT.PlayerState.ENDED:
  //       clearInterval(this.videoProgressInterval)
  //       break;
  //     default:
  //   }
  // }

  endChallenge() {
    const scoreEl = this.componentEl.querySelector('#var-outro-score')
    const score = this.answerResponses.map((answer, index) => this.cuePoints[index].answer === answer).length // calc score
    scoreEl.innerText = `${score} / ${this.answerResponses.length}` // set score
    this.componentEl.setAttribute('ended', '')
    this.introEl.removeAttribute('animate-swipe')
  }

  restartChallenge() {
    this.cuePointIndex = 0
    this.videoEl.currentTime = 0
    this.answerResponses = []
    this.videoEl.playbackRate = 1
    this.componentEl.removeAttribute('ended')
    this.componentEl.removeAttribute('started')

    this.introEl.setAttribute('animate-swipe', '')
    // this.startChallenge()
  }

  startChallenge() {
    this.componentEl.setAttribute('started', '')
    this.introEl.removeAttribute('animate-swipe')

    //dev
    // this.cuePointIndex = 4
    // this.videoEl.currentTime = 283
    // this.videoEl.playbackRate = 5;
    const fastMode = getParam('fast') || false
    if (fastMode) {
      this.videoEl.playbackRate = 4;
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
                return `<button class="varChallenge__answer" data-cue-index="${cueIndex}" data-answer-index="${answerIndex}">${answer}</button>`
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
