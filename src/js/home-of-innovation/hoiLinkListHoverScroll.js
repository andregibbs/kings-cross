class HOILinkListHoverScroll {
  constructor(el) {

    this.el = el
    this.scrollEl = el.querySelector('.hoiList') // scrolling element

    this.leftScroll = el.querySelector('.hoiLinkList__ScrollArrow--left')
    this.rightScroll = el.querySelector('.hoiLinkList__ScrollArrow--right')

    console.log(this.el, this.leftScroll)

    this.animating = false
    this.directionForward = false
    this.scrollSpeed = 4

    this.checkEndOfScroll()

    this.leftScroll.addEventListener('mouseenter', () => {
      this.animating = true
      this.directionForward = false
      this.startScrolling()
    })

    this.leftScroll.addEventListener('mouseleave', () => {
      this.animating = false
    })

    this.rightScroll.addEventListener('mouseenter', () => {
      this.animating = true
      this.directionForward = true
      this.startScrolling()
    })

    this.rightScroll.addEventListener('mouseleave', () => {
      this.animating = false
    })

    this.scrollEl.addEventListener('scroll', () => {
      requestAnimationFrame(this.checkEndOfScroll.bind(this))
    })

  }

  startScrolling() {
    let direction = this.directionForward ? this.scrollSpeed : this.scrollSpeed * -1
    if (this.animating) {
      this.scrollEl.scrollLeft += direction
      this.checkEndOfScroll()
      requestAnimationFrame(this.startScrolling.bind(this))
    }
  }

  checkEndOfScroll() {
    const el = this.scrollEl
    const leftEnd = el.scrollLeft <= 0
    const rightEnd = (el.scrollWidth - (el.scrollLeft + el.offsetWidth)) <= 0
    if (leftEnd) {
      this.el.setAttribute('end-left', '')
    } else if (rightEnd) {
      this.el.setAttribute('end-right', '')
    } else {
      this.el.removeAttribute('end-left')
      this.el.removeAttribute('end-right')
    }
  }
}

export default class HOILinkListHoverManager {

  constructor() {
    this.instances = [].slice.call(document.querySelectorAll('.hoiLinkList--scroll')).map(element => {

      return new HOILinkListHoverScroll(element)

    })
  }

}
