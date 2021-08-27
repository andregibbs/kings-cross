import '../../../bootstrap.js'
//import 'slick-carousel'


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

  /*  const popupMobImgWrapper = document.querySelector('.threeFoldEventPopupImgsMob')
    const popupMobImages = [].slice.call(popupMobImgWrapper.querySelectorAll("img"))*/


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

        //const imgPath = elImgPopup.getAttribute('data-img-path')
        const imgIndex = parseInt(itemImgThumb.getAttribute('data-index'))
       // const view = itemImgThumb.getAttribute('data-view')
        const imagepath = popupImages[imgIndex-1].getAttribute('src')
        
        /*let imagepath = '';

        if (view == 'desktop') {

            imagepath = popupImages[imgIndex-1].getAttribute('src')
        
        } else {

            imagepath = popupMobImages[imgIndex-1].getAttribute('src')

        }*/

        
        popupImg[0].setAttribute('src', imagepath)
        elImgPopup.setAttribute('open','')

        document.querySelector('.threeFoldEventImagePopup__close').addEventListener('click', () => {
          
            // hide modal
            elImgPopup.removeAttribute('open')

        })

    }





    //Video attach events
    const popupVidPosterImgWrapper = document.querySelector('.threeFoldEventPopupVideoPosterImgs')
    const popupVidPosterLinks = [].slice.call(popupVidPosterImgWrapper.querySelectorAll("link"))

    const popupVidWrapper = document.querySelector('.threeFoldEventPopupVideos')
    const popupVidLinks = [].slice.call(popupVidWrapper.querySelectorAll("link"))

    const popupVideoEle = document.querySelectorAll('.threeFoldEventVideoPopup .threeFoldEventVideo')
    const elVideoPopup = document.querySelector('.threeFoldEventVideoPopup')
    const itemsVideoThumb = [].slice.call(elWrapper.querySelectorAll('.threeFoldVideoPopup__item'))

    itemsVideoThumb.forEach((itemVideoThumb, index) => {
        itemVideoThumb.addEventListener('click', () => {
            itemVideoThumbClicked(index)
        })
    })
   

    function itemVideoThumbClicked(index) {
        const itemVideoThumb = itemsVideoThumb[index]
        setupVideoPopup(itemVideoThumb)
    }


    function setupVideoPopup(itemVideoThumb) {

        //const imgPath = elImgPopup.getAttribute('data-img-path')
        const videoIndex = parseInt(itemVideoThumb.getAttribute('data-index'))

        const vidPosterImagepath = popupVidPosterLinks[videoIndex-1].getAttribute('href')
        const vidPath = popupVidLinks[videoIndex-1].getAttribute('href')
        
        popupVideoEle[0].setAttribute('poster', vidPosterImagepath)
        popupVideoEle[0].setAttribute('src', vidPath)
        elVideoPopup.setAttribute('open','')

        document.querySelector('.threeFoldEventVideoPopup__close').addEventListener('click', () => {
          
            // hide modal
            popupVideoEle[0].pause();
            elVideoPopup.removeAttribute('open')

        })

    }



}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  ThreeFoldEventPopup()
} else {
  document.addEventListener("DOMContentLoaded", Home)
}