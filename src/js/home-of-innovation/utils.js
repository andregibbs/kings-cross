// Create youtube instance
export function createYoutubeInstance(element) {
  const videoId = element.getAttribute('data-youtube-id') // get youtube id
  const embedType = element.getAttribute('data-youtube-embed-type')
  const videoState = element.parentElement.querySelector('.hoiMedia__State')

  if (!videoId) {
    return console.log('no video id on element', element)
  }

  // set inital video state to play
  videoState.setAttribute('data-state', 'play')
  function onReady(event) {
    // when player is ready
    videoState.addEventListener('click', () => {
      // play video and set state to playing on state click
      event.target.playVideo()
      videoState.setAttribute('data-state', 'playing')
    })
  }

  let youtubeInstance;
  // instantialize yt player
  switch (embedType) {
    case 'playlist':
      youtubeInstance = new YT.Player(element, {
        height: '100%',
        width: '100%',
        playerVars: {
          listType:'playlist',
          list: videoId
        },
        events: {
          onReady
        }
      })
      break;
    default:
      youtubeInstance = new YT.Player(element, {
        videoId,
        height: '100%',
        width: '100%',
        events: {
          onReady
        }
      })
  }

  // store instance on element
  element._youtubeInstance = youtubeInstance;
  return youtubeInstance
}

// Load Youtube Scripts
export function loadYoutubeAPI() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  return new Promise(function(resolve, reject) {
    window.onYouTubeIframeAPIReady = () => {
      // youtube api ready
      resolve()
    }
  });
}
