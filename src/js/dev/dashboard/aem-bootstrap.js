(() => {

  const base = 'https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/dynamic-pages/'
  let page = window.location.pathname.split('/').join('-').replace(/^\-|\-$/g, '');

  // temp dev
  console.log(page, page.replace('deploy-test', 'bambuser'))
  page = page.replace('deploy-test', 'bambuser')

  const jsPath = `${base}${page}.js`
  const htmlPath = `${base}${page}.html`

  const target = document.querySelector('#deploy-target')

  function insertHtml() {
    return fetch(htmlPath)
      .then(data => {
        // check for success
        return data.text()
      })
      .then(html => {
        target.innerHTML = html
      })
  }

  function insertJS() {
    const kxScript = document.createElement('script')
    kxScript.src = jsPath
    document.body.appendChild(kxScript)
    return Promise.resolve()
  }

  insertHtml().then(insertJS)

})()


//<div id="kx-deployment-target"></div>
