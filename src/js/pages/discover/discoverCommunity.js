export default class DiscoverCommunity {
  constructor(el) {
    this.el = el || document.querySelector('.discoverCommunity')
    this.items = [].slice.call(this.el.querySelectorAll('.discoverCommunity__item'))

    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.itemClicked(index)
      })
    })
  }

  itemClicked(clickedIndex) {
    this.items.forEach((item, index) => {
      if (index === clickedIndex) {
        item.setAttribute('active', '')
      } else {
        item.removeAttribute('active')
      }
    })
  }
}
