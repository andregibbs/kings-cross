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

    this.mediaStarted = false // if media has been started
    this.lastMediaProgress = false // percent of media progress for tracking event

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

    // video load needed for ios events
    this.video.load()

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
      if (!this.mediaStarted) {
        // ignore if media already played once
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.video.addEventListener('canplaythrough', (e) => {
      // ignore if media already played once
      if (!this.mediaStarted) {
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.video.addEventListener('waiting', (e) => {
      // buffering
      this.setState(HOI_MEDIA_STATE.load)
    })

    this.video.addEventListener('pause', (e) => {
      if (!this.video.seeking) {
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.video.addEventListener('timeupdate', e => {
      // this.trackProgress()
    })

    this.video.addEventListener('playing', (e) => {
      this.mediaStarted = true
      this.setState(HOI_MEDIA_STATE.playing)

      // if (ga) {
      //   ga('send', {
      //     hitType: 'event',
      //     eventCategory: 'Video Event',
      //     eventAction: 'Video Play',
      //     eventLabel: 'play' // either video title or page title
      //   })
      //
      //   ga("gtm9999.send", { hitType: "event", eventCategory: "microsite", eventAction: "feature", eventLabel: "kings-cross:complete_" + state.category.toLowerCase(), dimension22: data.bookingRef });
      // }
    })

  }

  trackEvent() {

  }

  trackProgress() {
    // monitors the percentage progress of media playback, sends tracking event every 10%
    const {duration, currentTime, paused} = this.video
    let progress;
    if (!!duration && !!currentTime && !paused) {
      // progress rounded to mutiples of 10 (0%,10%,20%,30%...100%)
      progress = Math.floor((currentTime / duration) * 10) * 10
      // want to trigger if value doesnt equal the last, will capture forward and backwards scrubbing
      if (progress !== this.lastMediaProgress) {
        console.log('progress update', progress)
        // add event
      }
      this.lastMediaProgress = progress
    }
  }

  setState(state) {
    if (this.videoState) {
      this.videoState.setAttribute('data-state', state)
    }
  }

}
