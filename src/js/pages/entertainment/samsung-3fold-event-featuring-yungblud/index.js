import '../../../bootstrap.js'

import HOIShare from '../../../home-of-innovation/hoiShare';

import ThreeFoldEventPopup from './threeFoldEventPopup';


// import Scroll from './scrollTo';


class Samsung3Fold {

	constructor() {

		HOIShare()

    // Parallax
    // clamp helper
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    // parallax class to use on elements
    class ParallaxEl {
      constructor({
        el,
        offsetVertFn = () => 0, // function that returns how many pixels the parallax item should move from its origin
        speed = 0.5, // modifier on how fast the element shifts
        shiftOffsetFn = () => 0 // function that returns the number of pixels to offset the element after start and end points are calculated
      }) {
        this.el = el
        this.elHeight = this.el.offsetHeight
        this.pageCenter = 0
        this.parallaxStart = 0
        this.parallaxEnd = 0
        this.offsetVert = 0
        this.offsetVertFn = offsetVertFn
        this.shiftOffsetFn = shiftOffsetFn
        this.speed = speed
        this.setPositionValues()
      }
      // sets instance properties for update
      setPositionValues() {
        this.el.style.transform = '' // clear the style before calculating
        // after a tick
        setTimeout(() => {
          this.offsetVert = this.offsetVertFn() // get offset vert
          this.shiftOffset = this.shiftOffsetFn() // get shift value
          this.pageCenter = (this.el.getBoundingClientRect().top + window.scrollY) + (this.el.offsetHeight / 2) // calc elements scroll center
          this.parallaxStart = (this.pageCenter - this.offsetVert) - this.shiftOffset // calc start scroll position
          this.parallaxEnd = (this.pageCenter + this.offsetVert) - this.shiftOffset // calc end scroll position
          this.update(window.scrollY)
        }, 50)
      }

      update(scroll) {
        const center = scroll + (window.innerHeight / 2) // center of page scroll pos
        const dec = (center - this.parallaxStart) / (this.pageCenter - this.parallaxStart) // progress of page scroll relative to element
        const position = clamp(((this.offsetVert * dec) * -1) * this.speed, -this.elHeight/2, this.elHeight/2) // min/maxed new transform position
        this.el.style.transform = `translate(0, ${position}px)`
      }
    }


    // desktop els
    // main set of images
    const deskParaEls = [].slice.call(document.querySelectorAll('.desktopWrapper .parallax .flex-grid-cell'))
    const desktopParallaxItems = deskParaEls.map(el => {
      // el.style.border = '1px solid red'
      return new ParallaxEl({
        el,
        offsetVertFn: () => window.innerHeight / 8,
        shiftOffsetFn: () => (([].slice.call(el.parentElement.children).indexOf(el) / el.parentElement.children.length) - 0.5) * (window.innerHeight / 8) * -1
      })

    })
    // bottom layer
    const deskParaBotEls = [].slice.call(document.querySelectorAll('.desktopWrapper .bottomLayer figure'))
    const deskParaBotItems = deskParaBotEls.map(el => {
      return new ParallaxEl({
        el,
        offsetVertFn: () => window.innerHeight / 4,
        speed: 0.25
      })
    })
    // top layer
    const deskParaTopEls = [].slice.call(document.querySelectorAll('.desktopWrapper .topLayer'))
    const deskParaTopItems = deskParaTopEls.map(el => {
      return new ParallaxEl({
        el,
        offsetVertFn: () => window.innerHeight / 4,
        speed: 0.75
      })
    })

    // on scroll with anim frame
    let animFrame;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(() => {
        const scroll = window.scrollY
        // if desktop
        if (window.innerWidth >= 535) {
          // update all parallax element s
          desktopParallaxItems.forEach((pEl, index) => {
            pEl.update(scroll)
          })
          deskParaBotItems.forEach(pEl => {
            pEl.update(scroll)
          })
          deskParaTopItems.forEach(pEl => {
            pEl.update(scroll)
          })
        }
      })
    })

    // update parallax positions on resize
    let resizeAnimFrame;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeAnimFrame)
      resizeAnimFrame = requestAnimationFrame(() => {
        const scroll = window.scrollY
        // if desktop
        if (window.innerWidth >= 535) {
          // resset all parallax element
          desktopParallaxItems.forEach((pEl, index) => {
            pEl.setPositionValues()
          })
          deskParaBotItems.forEach(pEl => {
            pEl.setPositionValues()
          })
          deskParaTopItems.forEach(pEl => {
            pEl.setPositionValues()
          })
        }
      })
    })
	}
}


new Samsung3Fold()
