import { createYoutubeInstance } from './utils';

class HOIGallery {

  constructor(el) {
    this.el = el; // parent el of gallery
    this.links = this.el.querySelectorAll('.hoiGallery__NavItem'); // in page gallery links
    this.spotlight = this.el.querySelector('.hoiGallery__Spotlight'); // get spotlight (overlay element)
    this.spotlightCloseButton = this.spotlight.querySelector('.hoiGallery__SpotlightClose');

    this.sliderTarget = this.spotlight.querySelector('.hoiGallery__SpotlightItems');
    this.slick = $j(this.sliderTarget).slick({
      rows: 0,
      accessibility: true,
      focusOnSelect: true,
    });
    this.slickInstance = this.slick[0].slick;

    this.youtubeInstances = []

    this.events();
  }

  events() {
    // close button event
    this.spotlightCloseButton.addEventListener('click', this.closeSpotlight.bind(this))

    // events for gallery item clicks
    this.links.forEach((link) => {
      link.addEventListener('click', this.selectLink.bind(this))
    })

    // subscribe to slick before change event
    $j(this.sliderTarget).on('beforeChange', (e, slick, currentIndex, nextIndex) => {
      // call slideWillShow method with slide element
      this.slideWillShow(nextIndex);
      this.slideWillHide(currentIndex);
    })
  }

  slideWillHide(slideIndex) {
    const youtubeInstance = this.youtubeInstances[slideIndex]
    // if this hiding slide index has a youtube instance
    if (youtubeInstance && typeof youtubeInstance.pauseVideo !== "undefined") {
      // have to check pause
      youtubeInstance.pauseVideo(); // pause the video
    }
  }

  slideWillShow(slideIndex) {
    const slide = this.slickInstance.$slides[slideIndex]; // slide element
    const type = slide.getAttribute('data-type')
    // switch over slide type
    switch (type) {
      case 'youtube':
        let youtubeInstance;
        // if we dont have a stored youtube instance
        if (!this.youtubeInstances[slideIndex]) {
          // get youtube container element
          const youtubeEl = slide.querySelector('.hoiMedia--youtube')
          // check if there is already a youtube instance for this element
          if (youtubeEl._youtubeInstance) {
            youtubeInstance = youtubeEl._youtubeInstance
          } else {
            // if not, create one
            youtubeInstance = createYoutubeInstance(youtubeEl)
          }

          // NOTE:
          // may need to subscribe to play paused events to
          // show/hide a cover image & to enable swiping on the i

          // store instance locally after initializatin
          youtubeInstance.addEventListener('onReady', () => {
            this.youtubeInstances[slideIndex] = youtubeInstance
          })
        } else {
          youtubeInstance = this.youtubeInstances[2]
        }
        // can do stuff here like auto play when slide becomes active
        break;
      default:

    }
  }

  selectLink(event) {
    // get index of current clicked element
    // need to get index of click targets parent element
    const index = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
    this.slideWillShow(index) // call slideWillShow with slide index
    this.slickInstance.slickGoTo(index, true); // set slick slider to selected index
    this.openSpotlight() // open spotlight
  }

  openSpotlight() {
    this.spotlight.setAttribute('active', true)
    this.slick.find('.slick-list').attr('tabindex', 0).focus();
    this.slick.find('.slick-list').focus()
  }

  closeSpotlight() {
    this.spotlight.setAttribute('active', false)
  }

}

export default HOIGallery
