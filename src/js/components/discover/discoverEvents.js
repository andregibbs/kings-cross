export default class DiscoverEvents {
  constructor(el) {
    this.el = el
    this.slider = el.querySelector('.discoverEvents__Slider')

    $(this.slider).slick({
      dots: true,
      arrows: false
    })

  }
}
