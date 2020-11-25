import KXEnv from '../util/KXEnv'


const STORE_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.google.android.youtube',
  ios: 'https://apps.apple.com/gb/app/youtube-watch-listen-stream/id544007664'
}

export default function HOIYoutubeLiveChat() {

  const elements = [].slice.call(document.querySelectorAll('.hoiYoutubeLiveChat'))

  if (!elements.length) {
    // no live chats
    return
  }

  elements.forEach((element) => {
    const id = element.getAttribute('data-youtube-id')
    const target = element.querySelector('.hoiYoutubeLiveChat__embed')

    if (!id) {
      // no video id
      return
    }

    // check if user has a mobile/tablet device
    if (Device()) {
      // if so, show device live chat instructions
      element.setAttribute('is-device','')

      // mobile chat eventss
      const showInstructionsButton = element.querySelector('.hoiYoutubeLiveChat__mobile a[show-instructions]')
      const downloadAppButton = element.querySelector('.hoiYoutubeLiveChat__mobile a[download-app]')

      // show instructions
      showInstructionsButton.addEventListener('click', () => {
        element.setAttribute('instructions', '')
      })

      // handle download link
      downloadAppButton.addEventListener('click', () => {
        window.open(STORE_LINKS[Device()])
      })

    } else {
      // else add desktop frame
      const iframe = document.createElement('iframe')
      iframe.src = liveChatUrl(id)
      iframe.frameBorder = 0
      iframe.height = "100%"
      iframe.width = "100%"
      target.appendChild(iframe)
    }

  });

}

function Device() {
  if (/Android/i.test(navigator.userAgent)) {
    return 'android'
  } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return 'ios'
  }
  return false
}

function liveChatUrl(id) {
  return `https://www.youtube.com/live_chat?v=${id}&embed_domain=${KXEnv.hostname}`
}
