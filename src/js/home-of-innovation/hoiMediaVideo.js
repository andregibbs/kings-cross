import { createLoaderAnimation } from './utils'
import { trackEvent } from '../util/GATracking.js'

const HOI_MEDIA_STATE = {
  load: 'load',
  play: 'play',
  playing: 'playing'
}

const TRACKING = {
  CATEGORY: 'Media Event',
  ACTION_PLAY: 'Play',
  ACTION_UPDATE: 'Progress',
  ACTION_PAUSE: 'Pause',
  ACTION_ENDED: 'Ended',
  ACTION_SEEKED: 'Seek'
}

// Not just for video (audio too)
export default class HOIMediaVideo {

  constructor(videoEl) {
    this.media = videoEl
    this.mediaState = videoEl.parentElement.querySelector('.hoiMedia__State')
    this.fileName = this.media.src.split('/').slice(-1)[0]

    this.mediaStarted = false // if media has been started
    this.mediaSeeked = false // store seeking interaction
    this.lastMediaProgress = false // percent of media progress for tracking event

    // video state is optional, can be hidden
    if (this.mediaState) {
      this.playIcon = this.mediaState.querySelector('.hoiMedia__StateIcon--play')
      this.loadIcon = this.mediaState.querySelector('.hoiMedia__StateIcon--load')
      this.loadAnimation = createLoaderAnimation(this.loadIcon)
    }

    // TODO: add loading delay to multiple media on page
    // maybe remove the preload attribute and then add back in after each has loaded?
    // look at dev tools for performance
    this.events()

    // video load needed for ios events
    this.media.load()

    if (this.media.readyState >= 3) {
      this.setState(HOI_MEDIA_STATE.play)
    } else {
      this.setState(HOI_MEDIA_STATE.load)
    }
  }

  events() {

    if (this.mediaState) {
      this.mediaState.addEventListener('click', (e) => {
        const state = this.mediaState.getAttribute('data-state')
        if (state == HOI_MEDIA_STATE.play) {
          this.media.play()
        }
      })
    }

    this.media.addEventListener('canplay', (e) => {
      // ignore if media already initiated
      if (!this.mediaStarted) {
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.media.addEventListener('canplaythrough', (e) => {
      // ignore if media already initiated
      if (!this.mediaStarted) {
        this.setState(HOI_MEDIA_STATE.play);
      }
    })

    this.media.addEventListener('waiting', (e) => {
      // buffering
      this.setState(HOI_MEDIA_STATE.load)
    })

    this.media.addEventListener('pause', (e) => {
      if (!this.media.seeking) {
        this.setState(HOI_MEDIA_STATE.play);
        trackEvent(TRACKING.CATEGORY, TRACKING.ACTION_PAUSE, this.fileName, {
          eventValue: Math.floor(this.getMediaPositionProgress() * 100)
        })
      }
    })

    this.media.addEventListener('timeupdate', e => {
      this.trackProgress(TRACKING.CATEGORY, TRACKING.ACTION_ENDED, this.fileName)
    })

    this.media.addEventListener('play', e => {
      if (!this.mediaSeeked) {
        trackEvent(TRACKING.CATEGORY, TRACKING.ACTION_PLAY, this.fileName, {
          eventValue: Math.floor(this.getMediaPositionProgress() * 100)
        })
      } else {
        trackEvent(TRACKING.CATEGORY, TRACKING.ACTION_SEEKED, this.fileName, {
          eventValue: Math.floor(this.getMediaPositionProgress() * 100)
        })
      }
    })

    this.media.addEventListener('ended', e => {
      trackEvent(TRACKING.CATEGORY, TRACKING.ACTION_ENDED, this.fileName)
    })

    this.media.addEventListener('playing', (e) => {
      this.mediaStarted = true
      this.setState(HOI_MEDIA_STATE.playing)
    })

    this.media.addEventListener('seeking', e => {
      // set flag for seeking, is reset during trackProgress
      this.mediaSeeked = true
    })

    this.media.addEventListener('seeked', e => {
      // set flag for seeking, is reset during trackProgress
      this.mediaSeeked = true
    })

  }

  getMediaPositionProgress() {
    const {duration, currentTime, paused} = this.media
    return currentTime / duration
  }

  trackProgress() {
    // monitors the percentage progress of media playback, sends tracking event every 10%
    const {duration, currentTime, paused} = this.media
    let progress;

    // skip if no values or media was previously seeked
    if (!!duration && !!currentTime && !paused && !this.mediaSeeked) {
      // progress rounded to mutiples of 10 (0%,10%,20%,30%...100%)
      progress = Math.floor(this.getMediaPositionProgress() * 10) * 10
      // want to trigger if value doesnt equal the last, will capture forward and backwards scrubbing
      if (progress !== this.lastMediaProgress) {
        // console.log('progress update', progress)
        trackEvent(TRACKING.CATEGORY, TRACKING.ACTION_UPDATE, this.fileName, {
          eventValue: progress
        })
      }
      this.lastMediaProgress = progress
    }
    // if media has seeked, dont fire progress event and reset lastMediaProgress to seeked position
    if (this.mediaSeeked) {
      progress = Math.floor(this.getMediaPositionProgress() * 10) * 10
      this.lastMediaProgress = progress
      this.mediaSeeked = false
    }
  }

  setState(state) {
    if (this.mediaState) {
      this.mediaState.setAttribute('data-state', state)
    }
  }

}
