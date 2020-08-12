import KXEnv from '../util/KXEnv'

export default function HOIYoutubeLiveChat() {

  const elements = [].slice.call(document.querySelectorAll('.hoiYoutubeLiveChat'))

  if (!elements.length) {
    // no live chats
    return
  }

  elements.forEach((element) => {
    const id = element.getAttribute('data-youtube-id')
    if (!id) {
      // no video id
      return
    }
    const iframe = document.createElement('iframe')
    iframe.src = liveChatUrl(id)
    iframe.frameBorder = 0
    iframe.height = "100%"
    iframe.width = "100%"
    element.appendChild(iframe)
  });

}

function liveChatUrl(id) {
  return `https://www.youtube.com/live_chat?v=${id}&embed_domain=${KXEnv.hostname}`
}
