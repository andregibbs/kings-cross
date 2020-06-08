export default class HOIDynamicLinkList {


  constructor(el) {


    this.dynamicID = el.getAttribute('dynamic')

    console.log('dynamic id', this.dynamicID)

  }

}
