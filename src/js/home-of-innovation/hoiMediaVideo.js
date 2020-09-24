import { createLoaderAnimation } from './utils'

const HOI_MEDIA_STATE = {
  load: 'load',
  play: 'play',
  playing: 'playing'
}

export default class HOIMediaVideo {

  constructor(videoEl) {
    this.video = videoEl
    this.videoState = videoEl.parentElement.querySelector('.hoiMedia__State')

    // video state is optional, can be hidden
    if (this.videoState) {
      this.playIcon = this.videoState.querySelector('.hoiMedia__StateIcon--play')
      this.loadIcon = this.videoState.querySelector('.hoiMedia__StateIcon--load')
      this.loadAnimation = createLoaderAnimation(this.loadIcon)
    }

    // add loading delay to consecutive media videos
    // maybe remove the preload attribute and then add back in after each has loaded?
    // look at dev tools for performance

    this.events()
    if (this.video.readyState >= 3) {
      this.setState(HOI_MEDIA_STATE.play)
    } else {
      this.setState(HOI_MEDIA_STATE.load)
    }
  }

  events() {

    if (this.videoState) {
      this.videoState.addEventListener('click', (e) => {
        const state = this.videoState.getAttribute('data-state')
        if (state == HOI_MEDIA_STATE.play) {
          this.video.play()
        }
      })
    }

    this.video.addEventListener('canplay', (e) => {
      // console.log('can play')
      this.setState(HOI_MEDIA_STATE.play);
    })

    this.video.addEventListener('canplaythrough', (e) => {
      // console.log('canplaythrough')
      if (this.video.paused) {
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.video.addEventListener('waiting', (e) => {
      // console.log('waiting')
      this.setState(HOI_MEDIA_STATE.load)
    })

    this.video.addEventListener('pause', (e) => {
      this.setState(HOI_MEDIA_STATE.play);
    })

    this.video.addEventListener('playing', (e) => {
      // console.log('playing')
      this.setState(HOI_MEDIA_STATE.playing)
    })

  }

  setState(state) {
    if (this.videoState) {
      this.videoState.setAttribute('data-state', state)
    }
  }

}
