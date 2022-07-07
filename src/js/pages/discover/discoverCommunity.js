export default class DiscoverCommunity {
  constructor(el) {
    this.el = el || document.querySelector('.discoverCommunity')
    this.items = [].slice.call(this.el.querySelectorAll('.discoverCommunity__item'))
    this.toggles = [].slice.call(this.el.querySelectorAll('.discoverCommunity__item_toggle'))
    this.titles = [].slice.call(this.el.querySelectorAll('.discoverCommunity__title'))

    // attach events for titles and body
    this.titles.forEach((title, index) => {
      title.addEventListener('click', () => {
        this.itemClicked(index)
      })
    })
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.itemClicked(index)
      })
    })
  }

  itemImageAnchors(item) {
    return {
      anchor: parseInt(item.getAttribute('data-anchor')),
      image: item.querySelector('.discoverCommunity__item_image')
    }
  }

  itemClicked(clickedIndex) {
    this.toggles.forEach((toggle, index) => {
      const item = this.items[index]
      const {anchor, anchorActive, image} = this.itemImageAnchors(item)
      if (index === clickedIndex) {
        item.setAttribute('active', '')
        this.titles[index].setAttribute('active', '')
        image.style.transform = `translateX(0)`
      } else {
        item.removeAttribute('active')
        this.titles[index].removeAttribute('active')
        image.style.transform = `translateX(${anchor}%)`
      }
    })
  }
}
