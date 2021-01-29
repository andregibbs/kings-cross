import { trackEvent } from '../util/GATracking';

export default class HoiBambuser {

  constructor(el) {
    // console.log('HoiBambuser')

    this.showID = el.getAttribute('showID')
    if (!this.showID) return

    // testing
    // this.showID = "ptff7RvpmQ3Sx1mfembV"

    window.initBambuserLiveShopping({
      showId: this.showID,
      node: el.querySelector('.hoiBambuser__Launch'),
      type: "overlay",
    });

    window.onBambuserLiveShoppingReady = this.onShoppingReady.bind(this)

    /*
      These lines fix an issue where:
      once a bambuser stream is launched
      the current page location is used to create an iframe to display under the stream player
      on ios, the iframe does not render correctly
      I believe ios does not render the iframe if it is not visible to the user.
      more info: https://stackoverflow.com/questions/55068656/safari-mobil-iframe-content-out-of-view-not-rendered
      by adjusting the overflowscrolling attribute, the layout is redrawn
    */
    const fixEl = document.body
    const settouch = (e) => fixEl.style.webkitOverflowScrolling = 'touch'
    fixEl.addEventListener("touchend", settouch, false);

  }

  fetchSKUData(skus) {
    return fetchProductData(skus.join(','))
  }

  hydrateProducts(player, products, skuData) {
    products.forEach(({ ref: sku, id: productId, url: publicUrl }) => {
      let productData = skuData[sku]
      // console.log('hydrate', productData, skuData, sku, publicUrl)

      if (productData !== undefined) {
        player.updateProduct(productId, factory => {
          // if the page is loaded on qa, swap out the public url host with p6
          if (window.location.hostname === "p6-qa.samsung.com") {
            publicUrl = publicUrl.replace('www.samsung.com','p6-qa.samsung.com')
          }
          return factory.inheritFromPlaceholder()
            .publicUrl(publicUrl)
            .product(p => p
              .name(productData.product_display_name)
              .sku(sku)
              .variations(v => [v()
                .name(productData.product_display_name)
                .sku(sku)
                .sizes(s => [s()
                  .name(productData.product_display_name)
                  .sku(sku)
                  .price(pr => pr.current(`£${productData.price_info[0].msrp_price.value}`))
                ])
              ])
            )
        });
      }
    });
  }

  onShoppingReady(player) {

    player.configure({
      currency: ' ',
      locale: 'en-GB',
    });

    // hydrate data
    player.on(player.EVENT.PROVIDE_PRODUCT_DATA, event => {
      const skus = event.products.map(p => p.ref)
      this.fetchSKUData(skus)
        .then(skuData => {
          this.hydrateProducts(player, event.products, skuData.products)
        })

    })

    // events
    window.addEventListener('message', this.processMediaEvent.bind(this))

  }

  processMediaEvent(event) {
    if (event.origin != "https://lcx-player.bambuser.com") {
      return
    }
    const trackingEvent = JSON.parse(event.data)
    const trackingData = trackingEvent.data

    // console.log(trackingEvent, trackingData)

    const TRACKING = {
      CATEGORY: 'microsite',
      ACTION: 'feature',
      CLOSE_PRODUCTS: 'minimise shop',
      OPEN_PRODUCTS: 'video:shop',
      PRODUCT_CLICK: 'select product',
      PLAY: 'video:play',
      PAUSE: 'video:pause',
      SHARE: 'video:share',
      LIKE: 'like video',
      CALENDAR: 'add-to-calendar',
      MINIMIZE: 'minimise video',
      prefix: (label) => { return `uk:kings-cross:samsung-people-live:${label}` }
    }
    switch (trackingEvent.eventName) {
      case 'livecommerce:on-progress-update':
        // ignore progress update for now
        break;
      case 'livecommerce:minimize':
        trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.MINIMIZE))
        break;
      case 'livecommerce:tracking-point':
        // tracking event
        const eventData = trackingData.data
        switch (eventData.interactionType) {
          case 'hideAllProductsOverlay':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.CLOSE_PRODUCTS))
            break;
          case 'goToProductSurfBehind':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(`${TRACKING.PRODUCT_CLICK}:${eventData.title}`))
            break;
          case 'showAllProductsOverlay':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.OPEN_PRODUCTS))
            break;
          case 'resume':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.PLAY))
            break;
          case 'pause':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.PAUSE))
            break;
          case 'action-bar:share':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.SHARE))
            break;
          case 'like':
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(TRACKING.LIKE))
            break;
          case 'pending-curtain:share:facebook':
          case 'pending-curtain:share:whatsapp':
          case 'pending-curtain:share:email':
          case 'pending-curtain:share:twitter':
          case 'pending-curtain:share:linkedin':
          case 'pending-curtain:share:clipboard':
            const shareType = eventData.interactionType.split('pending-curtain:share:')[1];
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(`${TRACKING.SHARE}:${shareType}`))
            break;
          case 'pending-curtain:addToCalendar:google':
          case 'pending-curtain:addToCalendar:apple':
          case 'pending-curtain:addToCalendar:outlook':
          case 'pending-curtain:addToCalendar:office365':
          case 'pending-curtain:addToCalendar:ics':
            const calendarType = eventData.interactionType.split('pending-curtain:addToCalendar:')[1];
            trackEvent(TRACKING.CATEGORY, TRACKING.ACTION, TRACKING.prefix(`${TRACKING.CALENDAR}:${shareType}`))
            break;
          default:
            console.log('untracked tracking point', trackingEvent,  trackingData)
        }
      default:
        console.log('untracked event', trackingEvent,  trackingData)
        /*
          CANT TRACK
          min/max chat
          close popover video ?!
        */
    }
  }

}

function fetchProductData(skus) {
  // host name for qa / live
  const hostname = window.location.hostname == 'p6-qa.samsung.com' ? 'p6-qa.samsung.com' : 'www.samsung.com';
  return fetch(`https://${hostname}/uk/api/v4/configurator/syndicated-product-linear?skus=${skus}`)
    .then((response) => {
      return response.json()
      // callback(response.data);
    }).then(json => {
      // console.log('success', json)
      return json
    }).catch((error) => {
      // console.log('error')
      return error
      // callback(error.response.data);
    });
}
