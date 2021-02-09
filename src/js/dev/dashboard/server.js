const express = require('express')
const cors = require('cors')
const glob = require('glob')
const http = require('http')
const puppeteer = require('puppeteer')

const DeployFileToKXAWS = require('../../../../tasks/deploy-file-to-kx-aws')

const PAGE_TYPE = {
  HOI: 'hoi',
  STATIC: 'static'
}

const LOCAL_DEV_HOST = 'http://kings-cross.samsung.com'

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

    app.get('/pages', (req, res) => {
      res.json(this.pages)
    })

    // deploy?page=/pathname/here
    app.get('/deploy', (req, res) => {
      const pathname = req.query.pathname
      const page = pages.find(page => {
        return page.pathname == pathname
      })
      if (!page) {
        return res.status(400).json({ error: `Couldn't find page: ${pathname}` });
      }

      page.deploy()
        .then(data => {
          console.log('DashboardServer: File Deployments Complete')
          res.send(`${page.name} deployed`)
        })
        .catch(e => {
          console.log('Error', e);
          res.status(500).send(e)
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
        glob('src/home-of-innovation/pages/**/[!_]*.json', (err, files) => {
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
      console.log(this.pages[0])
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
    // remove slashes and leading dash
    this.filename = this.pathname.split('/').join('-').replace(/-/,'')
    this.name = this.pathname.replace('/uk/explore/kings-cross/', '')
  }
  deploy() {
    console.log('DashboardPage: deploy');
    return this.getContent()
      .then(data => {
        // setup upload promises
        const htmlUpload = this.uploadToAWS(data.html, `${this.filename}.html`, 'text/html')
        const jsUpload = this.uploadToAWS(data.js, `${this.filename}.js`, 'application/javascript')
        return Promise.all([htmlUpload, jsUpload])
          .then((promiseData) => {
            console.log('DashboardPage: Uploads complete')
            return promiseData
          })
      })
  }
  uploadToAWS(data, filename, contentType) {
    console.log('DashboardPage: Uploading to aws '+filename);
    return new Promise(function(resolve, reject) {
      DeployFileToKXAWS(data, filename, (err, data) => {
        if (err) {
          reject({error: err})
        }
        resolve({data: filename})
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
          // maybe inject the scraper script here instead of via page scripts
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
