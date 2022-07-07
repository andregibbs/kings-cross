export default class DiscoverEvents {
  constructor(el) {
    this.el = el
    this.slider = el.querySelector('.discoverEvents__Slider')

    $j(this.slider).slick({
      dots: true,
      arrows: false
    })

  }
}
