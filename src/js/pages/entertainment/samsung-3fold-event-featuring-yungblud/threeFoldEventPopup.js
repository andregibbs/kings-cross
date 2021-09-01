import '../../../bootstrap.js'
//import 'slick-carousel'

import { createYoutubeInstance, loadYoutubeAPI } from '../../../home-of-innovation/utils'


function ThreeFoldEventPopup() {
    // reset scroll
    window.scrollTo(0,0)

    const elPopup = document.querySelector('.threeFoldEventPopup')
    const popupImg = document.querySelectorAll('.threeFoldEventImgPopup .threeFoldEventPopupImg')
    const elImgPopup = document.querySelector('.threeFoldEventImgPopup')

    const elWrapper = document.querySelector('.threeFoldEvent')
    const itemsImgThumb = [].slice.call(elWrapper.querySelectorAll('.threeFoldImgPopup__item'))

    const popupImgWrapper = document.querySelector('.threeFoldEventPopupImgs')
    const popupImages = [].slice.call(popupImgWrapper.querySelectorAll("img"))

    //Image attach events
    itemsImgThumb.forEach((itemImgThumb, index) => {
        itemImgThumb.addEventListener('click', () => {
            itemImgThumbClicked(index)
        })
    })
   

    function itemImgThumbClicked(index) {
        const itemImgThumb = itemsImgThumb[index]
        setupImgPopup(itemImgThumb)
    }


    function setupImgPopup(itemImgThumb) {

        const imgIndex = parseInt(itemImgThumb.getAttribute('data-index'))
        const imagepath = popupImages[imgIndex-1].getAttribute('src')

        popupImg[0].setAttribute('src', imagepath)
        elImgPopup.setAttribute('open','')

        document.querySelector('.threeFoldEventImagePopup__close').addEventListener('click', () => {
          
            // hide modal
            elImgPopup.removeAttribute('open')

        })

    }


    const popupVideoEle = document.querySelectorAll('.threeFoldEventVideoPopup .threeFoldEventVideo')
    const player = popupVideoEle[0]
    /*const player = popupVideoEle[0].find("iframe").get(0);*/
    const iframeVideoEle = document.querySelector('#threeFoldEventVideoIframe') 
    const elVideoPopup = document.querySelector('.threeFoldEventVideoPopup')
    const itemsVideoThumb = [].slice.call(elWrapper.querySelectorAll('.threeFoldVideoPopup__item'))

   itemsVideoThumb.forEach((itemVideoThumb, index) => {
        itemVideoThumb.addEventListener('click', () => {
            //itemVideoThumbClicked(index)
            const youtubeId = itemVideoThumb.getAttribute('data-youtubeId')
            setupVideoPopup(youtubeId);
        })
    })


    function setupVideoPopup(youtubeId) {

        //https://www.youtube.com/embed/QeUFb8thax0?loop=0&playlist=QeUFb8thax0&autoplay=0&enablejsapi=1

        let youtubeVideoUrl = "https://www.youtube.com/embed/QeUFb8thax0?loop=0&playlist="+youtubeId+"&autoplay=0&enablejsapi=1"

        iframeVideoEle.setAttribute('src', youtubeVideoUrl)

        elVideoPopup.setAttribute('open','')

        document.querySelector('.threeFoldEventVideoPopup__close').addEventListener('click', () => {
          
            // hide modal
            postMessageToPlayer(player, {
              "event": "command",
              "func": "pauseVideo"
            });

            iframeVideoEle.removeAttribute('src')

            elVideoPopup.removeAttribute('open')

        })

    }

    // POST commands to YouTube or Vimeo API
    function postMessageToPlayer(player, command){
      if (player == null || command == null) return;
      player.contentWindow.postMessage(JSON.stringify(command), "*");
    }  





}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  ThreeFoldEventPopup()
} else {
  document.addEventListener("DOMContentLoaded", Home)
}