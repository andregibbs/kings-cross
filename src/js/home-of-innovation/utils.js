// Create youtube instance
export function createYoutubeInstance(element) {
  const videoId = element.getAttribute('data-youtube-id') // get youtube id
  const embedType = element.getAttribute('data-youtube-embed-type')

  if (!videoId) {
    return console.log('no video id on element', element)
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
        }
      })
      break;
    default:
      youtubeInstance = new YT.Player(element, {
        videoId,
        height: '100%',
        width: '100%'
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
