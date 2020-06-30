export default class DiscoverExperience {

  constructor(el) {
    if (!el) return;
    this.el = el

    this.activeIndex = false
    this.items = [].slice.call(this.el.querySelectorAll('.discoverExperience__Item'))

    this.addEventListeners(this.items);
  }

  addEventListeners(items) {
    // add item and close events
    items.forEach((item, i) => {
      item.addEventListener('click', this.itemClickHandler.bind(this))
      item.querySelector('.discoverExperience__ItemClose').addEventListener('click', this.itemCloseHandler.bind(this))
    });
  }

  itemClickHandler(e) {
    const el = e.target

    // set all to inactive
    this.items.forEach((item) => {
      item.setAttribute('active', 'false')
      item.style.zIndex = '';
    })

    // set current to active
    el.setAttribute('active', 'true')
    el.style.zIndex = '5';

  }

  itemCloseHandler(e) {
    e.stopImmediatePropagation()
    // remove all active states (neutral)
    this.items.forEach((item) => {
      item.removeAttribute('active')
    })
  }

}
