function KXBootstrap() {

  // written in es5 to avoid compiling
  // TODO browser check
  // polyfill fetch
  var host = window.location.host
  var base = 'https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/dynamic-pages/'
  var page = window.location.pathname.split('/').join('-').replace(/^\-|\-$/g, '');
  var qa = host.indexOf('p6-qa') > -1 ? '-qa' : ''

  if (host.indexOf('p6-qa.samsung.com') === -1 && host.indexOf('www.samsung.com') === -1) {
    // only run on p6-qa and live
    return
  }

  var jsPath = `${base}${page}${qa}.js`
  var htmlPath = `${base}${page}${qa}.html`

  console.log(jsPath, htmlPath)

  var target = document.querySelector('#deploy-target')

  // var fetchHeaders = new Headers();
  // fetchHeaders.append('pragma', 'no-cache');
  // fetchHeaders.append('cache-control', 'no-cache');
  //
  // var options = {
  //   headers: fetchHeaders
  // };

  function insertHtml(callback) {
    console.log('insert html')
    fetch(htmlPath)
      .then(data => {
        // check for success
        return data.text()
      })
      .then(html => {
        target.innerHTML = html
        callback()
      })
  }

  function insertJS(callback) {
    console.log('insert js')
    const kxScript = document.createElement('script')
    kxScript.src = jsPath
    document.body.appendChild(kxScript)
  }

  insertHtml(function(){
    insertJS()
  })

}

KXBootstrap()
