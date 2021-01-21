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

    window.addEventListener('message', function(event) {
      if (event.origin != "https://lcx-player.bambuser.com") {
        return
      }
      // console.log('message', event.data)
    })
  }

  fetchSKUData(skus) {
    return fetchProductData(skus.join(','))
  }

  hydrateProducts(player, products, skuData) {
    products.forEach(({ ref: sku, id: productId, url: publicUrl }) => {
      let productData = skuData[sku]
      console.log('hydrate', productData, skuData, sku)
      player.updateProduct(productId, factory => {
        return factory
          .product(p => p
            .name(productData.product_display_name)
            .brandName('this is a description')
            .sku(sku)
            .variations(v => [v()
              .name(productData.product_display_name)
              .sku(sku)
              .sizes(s => [s()
                .name(productData.product_display_name)
                .sku(sku)
                .price(pr => pr.current(productData.price_info[0].msrp_price.value))
              ])
            ])
          )
      });
    });

  }

  onShoppingReady(player) {

    player.configure({
      currency: 'GBP',
      locale: 'en-GB',
    });

    // hydrate data
    player.on(player.EVENT.PROVIDE_PRODUCT_DATA, event => {
      console.log('ed', event)

      const skus = event.products.map(p => p.ref)
      this.fetchSKUData(skus)
        .then(skuData => {
          console.log('got product data', skuData, event)
          this.hydrateProducts(player, event.products, skuData.products)
        })

    })

  }

}

/*
https://www.samsung.com/uk/api/v4/configurator/syndicated-product-linear?skus=SM-G980FZADEUA,SM-G980FLBDEUA,SM-G980FZIDEUA,SM-G981BZADEUA,SM-G981BLBDEUA,SM-G981BZIDEUA,SM-G986BZADEUA,SM-G986BLBDEUA,SM-G986BZKDEUA,SM-G986BZPDEUA,SM-G988BZADEUA,SM-G988BZAGEUA,SM-G988BZKDEUA,SM-G986BZRDEUA,SM-G986BZBDEUA,SM-G980FZWDEUA,SM-G981BZWDEUA,SM-G986BZWDEUA,SM-G988BZWDEUA,SM-G780FZWDEUA,SM-G780FZBDEUA,SM-G780FZGDEUA,SM-G780FZRDEUA,SM-G780FZODEUA,SM-G780FLVDEUA,SM-G781BZWDEUA,SM-G781BLVDEUA,SM-G781BZBDEUA,SM-G781BZGDEUA,SM-G781BZRDEUA,SM-G781BZODEUA,SM-G781BZWHEUA,SM-G781BLVHEUA,SM-G781BZBHEUA,SM-G781BZGHEUA,SM-G781BZRHEUA,SM-G781BZOHEUA,SM-G780FZWHEUA,SM-G780FLVHEUA,SM-G780FZBHEUA,SM-G780FZGHEUA,SM-G780FZRHEUA,SM-G780FZOHEUA&component=offers,promotion,promotion_price,carrier_attributes&count=0
*/


function fetchProductData(skus) {
  return fetch(`https://www.samsung.com/uk/api/v4/configurator/syndicated-product-linear?skus=${skus}`)
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
