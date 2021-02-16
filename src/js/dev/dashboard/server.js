const express = require('express')
const cors = require('cors')
const glob = require('glob')
const http = require('http')
const puppeteer = require('puppeteer')
const fs = require('fs')

const Terser = require('terser');
const HTMLMinifier = require('html-minifier-terser');

const DeployFileToKXAWS = require('../../../../tasks/deploy-file-to-kx-aws')

const PAGE_TYPE = {
  HOI: 'hoi',
  STATIC: 'static'
}

const LOCAL_DEV_HOST = 'http://kings-cross.samsung.com'
const SCRAPER_PATH = `${LOCAL_DEV_HOST}/scraper-modified.js`
const DEPLOYED_PATH = 'https://kxuploads.s3.eu-west-2.amazonaws.com/home-of-innovation-dynamic/dynamic-pages/'

const AEM_Javascript = fs.readFileSync(require.resolve('./aem-bootstrap.js'), 'utf8');
const AEM_Html = fs.readFileSync(require.resolve('./aem-bootstrap.html'), 'utf8');

class DashboardServer {
  constructor() {
    console.log('DashboardServer')
    this.pages = []
    this.getPages().then(this.startServer.bind(this))
  }

  startServer() {
    console.log('DashboardServer: Starting Server')
    const express = require('express')
    const app = express()
    const port = 3030
    const pages = this.pages;

    app.use(cors())

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.get('/config', (req, res) => {
      res.json({
        pages: this.pages,
        aemHTML: AEM_Html,
        aemJS: AEM_Javascript
      })
    })

    // deploy?page=/pathname/here
    app.get('/deploy', (req, res) => {
      const pathname = req.query.pathname
      const qa = req.query.qa ? true : false
      const page = pages.find(page => {
        return page.pathname == pathname
      })
      if (!page) {
        return res.status(400).json({ error: `Couldn't find page: ${pathname}` });
      }
      page.deploy(qa)
        .then(data => {
          console.log('DashboardServer: File Deployments Complete - ', page.name)
          res.json(data)
        })
        .catch(e => {
          console.log('Error', e);
          res.status(400).send(e)
        })
    })

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })

  }

  getPages() {
    console.log('DashboardServer: Collecting Pages')
    function getHoiPages() {
      return new Promise((resolve, reject) => {
        glob('src/home-of-innovation/pages/**/[!_]*.json', {ignore: ['**/component*.json']}, (err, files) => {
          resolve(files.map(file => new DashboardPage(file, PAGE_TYPE.HOI)))
        });
      });
    }
    function getStaticPages() {
      return new Promise((resolve, reject) => {
        glob('src/pages/**/*.html', (err, files) => {
          resolve(files.map(file => new DashboardPage(file, PAGE_TYPE.STATIC)))
        });
      });
    }
    return Promise.all([getHoiPages(), getStaticPages()]).then(values => {
      this.pages = this.pages.concat(values[0]).concat(values[1])
      console.log(`DashboardServer: Collected ${this.pages.length} Pages`)
    })
  }
}

class DashboardPage {
  constructor(filename, type) {
    this.pathname = false;
    this.qa_url = false
    this.live_url = false
    this.staging_url = false;
    this.name = false
    this.filename = false
    this.type = type
    this.generate(filename, type)
  }
  generate(filename, type) {
    switch (type) {
      case PAGE_TYPE.HOI:
        this.pathname = filename.replace('src/home-of-innovation/pages', '/uk/explore/kings-cross').replace(/\|/g, '/').replace('.json','')
        break;
      case PAGE_TYPE.STATIC:
        this.pathname = filename.replace('src/pages', '/uk/explore/kings-cross').replace('index.html', '')
        break;
      default:
    }
    this.qa_url = `https://p6-qa.samsung.com${this.pathname}`
    this.live_url = `https://www.samsung.com${this.pathname}`
    this.staging_url = `https://d1bb30i8nznsls.cloudfront.net${this.pathname}`
    this.local_url = `${LOCAL_DEV_HOST}${this.pathname}/` // ! trailing slash important
    this.editor_url = `https://p6-eu-author.samsung.com/editor.html/content/samsung${this.pathname}.html`
    // remove slashes and leading dash
    this.filename = this.pathname.split('/').join('-').replace(/-/,'')
    this.name = this.pathname.replace('/uk/explore/kings-cross/', '').replace(/\/$/, '')
    // set name to index if home page
    if (!this.name.length) { this.name = 'home' }
  }
  deploy(qa) {
    console.log('DashboardPage: deploy');
    const filename = qa ? `${this.filename}-qa` : this.filename
    return this.getContent()
      .then(this.compressFiles)
      .then(data => {
        console.log('DahboardPage: html size (kb)', Buffer.byteLength(data.html, 'utf8') / 1000)
        console.log('DahboardPage: js size (kb)', Buffer.byteLength(data.js, 'utf8') / 1000)
        // setup upload promises
        const htmlUpload = this.uploadToAWS(data.html, filename, 'html', 'text/html')
        const jsUpload = this.uploadToAWS(data.js, filename, 'js', 'application/javascript')
        return Promise.all([htmlUpload, jsUpload])
          .then((uploadPaths) => {
            console.log('DashboardPage: Uploads complete')
            const resp = Object.assign({}, uploadPaths[0], uploadPaths[1])
            return resp
          })
      })
  }
  compressFiles(dataArray) {
    const jsMinify = Terser.minify(dataArray.js, {}).then(({code}) => { return code })
    const htmlMinify = () => {
      const htmlCode = HTMLMinifier.minify(dataArray.html, {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeEmptyElements: false,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      })
      return Promise.resolve(htmlCode)
    }
    return Promise.all([htmlMinify(), jsMinify]).then(promises => {
      return {
        html: promises[0],
        js: promises[1]
      }
    })
  }
  uploadToAWS(data, filename, extension, contentType) {
    console.log('DashboardPage: Uploading to aws '+filename);
    return new Promise(function(resolve, reject) {
      DeployFileToKXAWS(data, `${filename}.${extension}`, (err, data) => {
        if (err) {
          reject({error: err})
        }
        const resp = {}
        resp[extension] = `${DEPLOYED_PATH}${filename}.${extension}`
        resolve(resp)
      }, 'dynamic-pages', contentType)
    });
  }
  getContent() {
    const localURL = this.local_url
    return new Promise(function(resolve, reject) {
      (async () => {
        const browser = await puppeteer.launch();
        try {
          const page = await browser.newPage();
          await page.goto(localURL);
          await page.addScriptTag({url: SCRAPER_PATH})
          // wait for scraper to init
          await page.waitForFunction('window.cheillondon !== undefined');
          // wait for the scraped data to be loaded
          await page.waitForFunction('window.cheillondon.scraper.main.scrapedJS !== undefined');
          await page.waitForFunction('window.cheillondon.scraper.main.scrapedHTML !== undefined');
          const pageData = await page.evaluate(() => {
            return {
              js: window.cheillondon.scraper.main.scrapedJS,
              html: window.cheillondon.scraper.main.scrapedHTML
            };
          });
          resolve(pageData)
        } catch (e) {
          reject(e)
        } finally {
          await browser.close();
        }

      })();
    });
  }
}

new DashboardServer()
