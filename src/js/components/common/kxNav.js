import navBurgerAnimation from '../../animation/nav-burger-animation.json'

class KXNav {
  constructor() {
    this.el = document.querySelector('.kxNav')
  	this.height = this.el.offsetHeight
    this.sticky = false
    this.mobileToggle = this.el.querySelector('.kxNav__MobileToggle')
    this.mobileOpen = false

    // flag to determine wether the nav holds the search component (it can be included within page as a hoi component)
    this.navContainsSearchComponent = this.el.querySelector('.hoiSearch') !== null
    this.searchToggles = [].slice.call(this.el.querySelectorAll('.kxNav__SearchLink'))
    this.searchOpen = false

    // mobile nav container
    this.mobileNav = this.el.querySelector('.kxNav__MobileNav')
    // TODO: add resize/rotate listener to adjust

    // set subview sizes
    this.setSubviewPosition()

    // create burger animation
    this.burgerAnimation = this.initBurgerAnimation()

    // create search event
    this.initSearchToggle()

    this.mobileToggle.addEventListener('click', this.mobileToggleHandler.bind(this))
    window.addEventListener('scroll', this.scrollHandler.bind(this))
  }

  // handles scroll and sets sticky state
  scrollHandler() {
    if (this.getTop() <= 0) {
      this.el.setAttribute('sticky', '')
      this.sticky = true
    } else {
      this.el.removeAttribute('sticky')
      this.sticky = false
    }
  }

  // gets navigation top position
  getTop() {
    return this.el.getBoundingClientRect().top
  }

  // Sets subview top position (calculating gnb size)
  setSubviewPosition() {
    const subViews = [].slice.call(document.querySelectorAll('.kxNav__SubView'))
    const gnb = document.querySelector('.gnb')
    if (!gnb) {
      return // no gnb
    }
    const gnbHeight = gnb.offsetHeight
    subViews.forEach((view) => {
      view.style.top = `${gnbHeight}px`
    })
  }

  // MOBILE NAV
  // toggle mobile sidebar
  mobileToggleHandler() {
    // close search first if open
    if (this.searchOpen) {
      return this.closeSearch();
    }
    // otherwise toggle mobile nav
    if (this.mobileOpen) {
      this.el.removeAttribute('mobile-nav-open')
      this.mobileOpen = false
      if (this.burgerAnimation) {
        this.burgerAnimation.playSegments([95, 125], true);
      }
    } else {
      this.el.setAttribute('mobile-nav-open', '')
      this.mobileOpen = true
      if (this.burgerAnimation) {
        this.burgerAnimation.playSegments([30, 60], true);
      }
    }
  }

  // create burger animation
  initBurgerAnimation() {
    const toggleEl = document.querySelector('.kxNav__MobileToggle')
    let burgerAnimation = false;
    // burger menu anim
    if (lottie) {
      burgerAnimation = lottie.loadAnimation({
        container: toggleEl, // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: navBurgerAnimation // the path to the animation json
      });
      burgerAnimation.setSpeed(1.3);
    }
    return burgerAnimation
  }

  // SEARCH VIEW
  // init search view toggle
  initSearchToggle() {
    this.searchToggles.forEach(el => {
      el.addEventListener('click', (e) => {
        // if the nav does not hold the search component, just scroll top
        // currently used for hoi home page
        if (!this.navContainsSearchComponent) {
          window.scrollTo({
            top: this.getTop(),
            left: 0,
            behavior: 'smooth'
          })
          return
        }
        if (this.searchOpen ) {
          this.closeSearch()
        } else {
          this.openSearch()
        }
      })
    })
  }

  // opens search view
  openSearch() {
    this.el.setAttribute('search-open', '')
    this.el.removeAttribute('search-closed')
    this.searchOpen = true
  }

  // closes search view
  closeSearch() {
    this.el.removeAttribute('search-open')
    // set a search closed state to animate nav items back
    // state not set initially on page load
    this.el.setAttribute('search-closed', '')
    this.searchOpen = false
  }
}

export default KXNav
