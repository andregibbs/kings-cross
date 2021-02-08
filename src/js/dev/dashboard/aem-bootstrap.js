(() => {

  const base = 'https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/dynamic-pages/'
  const page = window.location.pathname.split('/').join('-').replace(/^\-|\-$/g, '');
  const jsPath = `${base}${page}.js`
  const htmlPath = `${base}${page}.html`

  const target = document.querySelector('#kx-deployment-target')

  /*
    fetch html data
    either precompile this script with fetch
    or, check for fetch, if none, polyfill that shit then get html
  */

  // load js file in script tag
  // insert html into target element

  const kxScript = document.createElement('script')
  kxScript.src = jsPath

  document.body.appendChild(kxScript)





})()


//<div id="kx-deployment-target"></div>
