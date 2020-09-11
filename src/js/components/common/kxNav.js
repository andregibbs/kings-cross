class KXNav {
  constructor() {
    this.search = true; // search instance

    this.el = document.querySelector('.kxNav')
  	this.height = this.el.offsetHeight
    this.sticky = false
    this.mobileToggle = this.el.querySelector('.kxNav__MobileToggle')
    this.mobileOpen = false

    // TODO: set mobile nav top offset based on GNB
    // also add resize/rotate listener to adjust

    this.mobileToggle.addEventListener('click', this.mobileToggleHandler.bind(this))
    window.addEventListener('scroll', this.scrollHandler.bind(this));
  }

  getTop() {
    return this.el.getBoundingClientRect().top
  }

  mobileToggleHandler(e) {
    if (this.mobileOpen) {
      this.el.removeAttribute('mobileOpen')
    } else {
      this.el.setAttribute('mobileOpen', '')
    }
  }

  scrollHandler(e) {
    if (this.getTop() <= 0) {
      console.log('sticky')
      this.el.setAttribute('sticky', '')
      this.sticky = true
    } else {
      console.log('notsticky')
      this.el.removeAttribute('sticky')
      this.sticky = false
    }
  }

  openSearch() {
    // public exposed search method
  }

  closeSearch() {

  }
}

export default KXNav
