

export default class DiscoverExperience {

  constructor() {
    this.el = document.querySelector('.discover__Experience');
    if (!this.el) return;

    this.activeIndex = false
    this.items = [].slice.call(this.el.querySelectorAll('.discover__ExperienceItem'))

    this.addEventListeners(this.items);
  }

  addEventListeners(items) {
    items.forEach((item, i) => {
      item.addEventListener('click', this.itemClickHandler.bind(this))
      item.querySelector('.discover__ExperienceItem__Close').addEventListener('click', this.itemCloseHandler.bind(this))
    });
  }

  itemClickHandler(e) {
    const el = e.target
    console.log('item clicked', el)

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
    console.log('item close', e)

    this.items.forEach((item) => {
      item.removeAttribute('active')
    })


  }



}
