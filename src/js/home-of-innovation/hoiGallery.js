class HOIGallery {

  constructor(el) {
    this.el = el; // parent el of gallery
    this.links = this.el.querySelectorAll('.hoiGallery__NavItem'); // in page gallery links
    this.spotlight = this.el.querySelector('.hoiGallery__Spotlight'); // get spotlight (overlay element)
    this.spotlightCloseButton = this.spotlight.querySelector('.hoiGallery__SpotlightClose');

    this.sliderTarget = this.spotlight.querySelector('.hoiGallery__SpotlightItems');
    this.slick = $(this.sliderTarget).slick();
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
    $(this.sliderTarget).on('beforeChange', (e, slick, current, next) => {
      // call slideWillShow method with slide element
      this.slideWillShow(next);
      this.slideWillHide(current);
    })
  }

  slideWillHide(slideIndex) {
    const youtubeInstance = this.youtubeInstances[slideIndex]
    // if this hiding slide index has a youtube instance
    if (youtubeInstance) {
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
        // if slide has no youtube instance
        if (!this.youtubeInstances[slideIndex]) {
          // create one in youtube media element
          const youtubeEl = slide.querySelector('.hoiGallery__Media--youtube')
          // get youtube id
          const videoId = slide.getAttribute('data-content')
          // instantialize yt player
          youtubeInstance = new YT.Player(youtubeEl, {
            videoId,
            height: '100%',
            width: '100%'
          })
          // will probably need to subscribe to play paused events to
          // show/hide a cover image & to enable swiping on the i

          // store instance
          this.youtubeInstances[slideIndex] = youtubeInstance
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
    const index = Array.from(event.target.parentNode.children).indexOf(event.target);
    this.slideWillShow(index) // call slideWillShow with slide index
    this.slickInstance.slickGoTo(index, true); // set slick slider to selected index
    this.openSpotlight() // open spotlight
  }

  openSpotlight() {
    this.spotlight.setAttribute('active', true)
  }

  closeSpotlight() {
    this.spotlight.setAttribute('active', false)
  }

}

export default HOIGallery
