class KXNav {
  constructor() {
    this.search = true; // search instance

    this.el = document.querySelector('.kxNav')
  	this.height = this.el.offsetHeight
    this.sticky = false

    window.addEventListener('scroll', this.scrollHandler.bind(this));
  }

  getTop() {
    return this.el.getBoundingClientRect().top
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
