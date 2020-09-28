class HOILinkListHoverScroll {
  constructor(el) {

    this.el = el
    this.scrollEl = el.querySelector('.hoiList') // scrolling element

    this.scrollEl.addEventListener('ListItemsUpdated', this.shouldShowScrollArrows.bind(this))

    this.leftScroll = el.querySelector('.hoiLinkList__ScrollArrow--left')
    this.rightScroll = el.querySelector('.hoiLinkList__ScrollArrow--right')

    this.animating = false
    this.directionForward = false
    this.scrollSpeed = 4

    this.shouldShowScrollArrows()
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

  shouldShowScrollArrows() {
    const scrollChildren = this.scrollEl.querySelectorAll('.hoiList__Item')
    // if there are no children, its probable that the list is dynamic and not loaded
    if (scrollChildren.length === 0) {
      return
    }
    // set hide attribute on main el (not scrolling el) to allow css to target scroll arrows
    if (scrollChildren.length <= 4) {
      // if we have childred and less than 4 items, hide arrows
      this.el.setAttribute('hide-scroll-arrows', '')
    } else {
      // else show em
      this.el.removeAttribute('hide-scroll-arrows')
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
