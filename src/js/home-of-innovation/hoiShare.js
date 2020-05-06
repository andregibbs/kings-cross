import Clipboard from 'clipboard';

export default function hoiShare() {

  const component = document.querySelector('.hoiShare')

  if (!component) {
    return console.log('no share component')
  }

  function twitterURL() {
    return `https://twitter.com/intent/tweet?text=${window.location.href}`
  }

  function facebookURL() {
    return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
  }

  const twitterEl = component.querySelector('#twitter');
  if (twitterEl) {
    twitterEl.href = twitterURL()
  }
  const facebookEl = component.querySelector('#facebook')
  if (facebookEl) {
    facebookEl.href = facebookURL()
  }
  // const shareEl = component.querySelector('#share')
  // shareEl.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   console.log('copy')
  // })

  const shareCopy = new Clipboard(component.querySelector('#share'), {
    text: () => {
      return window.location.href
    }
  })

  shareCopy.on('success', (e) => {
    const copyFeedback = component.querySelector('.hoiShare__Feedback')
    copyFeedback.classList.remove('hoiShare__Feedback--animate')
    setTimeout(() => {
      copyFeedback.classList.add('hoiShare__Feedback--animate')
    }, 10)
  })

}
