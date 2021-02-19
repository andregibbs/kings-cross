function KXBootstrap() {

  // written in es5 to avoid compiling
  // TODO browser check
  // polyfill fetch

  var kxb_host = window.location.host
  var kxb_base = 'https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/dynamic-pages/'
  var kxb_page = window.location.pathname.split('/').join('-').replace(/^\-|\-$/g, '');
  var kxb_qa = kxb_host.indexOf('p6-qa') > -1 ? '-qa' : ''

  if (kxb_host.indexOf('p6-qa.samsung.com') === -1 && kxb_host.indexOf('www.samsung.com') === -1) {
    // only run on p6-qa and live
    return
  }

  var kxb_jsPath = `${kxb_base}${kxb_page}${kxb_qa}.js`
  var kxb_htmlPath = `${kxb_base}${kxb_page}${kxb_qa}.html`

  // console.log(kxb_jsPath, kxb_htmlPath)

  var kxb_target = document.querySelector('#deploy-target')

  // var fetchHeaders = new Headers();
  // fetchHeaders.append('pragma', 'no-cache');
  // fetchHeaders.append('cache-control', 'no-cache');
  //
  // var options = {
  //   headers: fetchHeaders
  // };

  function bootstrapFailed() {
    console.log('create fallback redirect here')
  }

  function insertHtml(callback) {
    console.log('insert html')
    fetch(kxb_htmlPath)
      .then(data => {
        // check for success
        if (data.status !== 200) {
          return bootstrapFailed()
        }
        return data.text()
      })
      .then(html => {
        kxb_target.innerHTML = html
        callback()
      })
  }

  function insertJS(callback) {
    // using fetch to check existence of file
    fetch(kxb_jsPath)
      .then(data => {
        if (data.status !== 200) {
          return bootstrapFailed()
        }
        console.log('insert js')
        var kxb_script = document.createElement('script')
        kxb_script.src = kxb_jsPath
        document.body.appendChild(kxb_script)
        callback()
      })
  }

  insertHtml(function(){
    insertJS(function() {
      kxb_target.setAttribute('loaded','')
    })
  })

}

KXBootstrap()
