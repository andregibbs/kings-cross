// import glob from 'glob'

const Handlebars = require("hbsfy/runtime");
const DashboardTemplate = require('./template.hbs');

const API = 'http://localhost:3030'
const target = document.body

class DevDashboard {
  constructor() {
    console.log('DevDashboard')

    this.el = null
    this.open = false // maybe local storage to store option
    this.toggle = null
    this.deployButton = null
    this.deployQAButton = null
    this.currentPage = null
    this.statusEl = null

    this.getConfig()
      .then(({pages, aemHTML, aemJS}) => {
        let currentPage = this.currentPage = pages.find(page => page.local_url === window.location.href)
        this.currentPage.selected = true
        this.renderUI({
          pages, currentPage, aemHTML, aemJS
        })
      })
      .then(this.addEvents.bind(this))
  }

  addEvents() {
    this.toggle = document.querySelector('.kxDashboard__toggle')
    this.deployButton = document.querySelector('#deploy-live')
    this.deployQAButton = document.querySelector('#deploy-qa')
    this.statusEl = document.querySelector('.kxDashboard__status')

    // toggle panel
    this.toggle.addEventListener('click', this.toggleHandler.bind(this))
    // deploy html
    this.deployButton.addEventListener('click', () => {
      // add confirmation of pushing live
      if (window.confirm("Deploying Page Content LIVE. Are You Sure?")) {
        this.deployPage(this.currentPage)
      }
    })
    // deploy qa
    this.deployQAButton.addEventListener('click', () => {
      this.deployPage(this.currentPage, true)
    })
    // copy bootstrap scripts for aem page
    document.querySelector('#copy-aem-js').addEventListener('click', () => {
      this.copyAEMText('js')
    })
    document.querySelector('#copy-aem-html').addEventListener('click', () => {
      this.copyAEMText('html')
    })
  }

  copyAEMText(type) {
    const copyEl = document.querySelector(`#aem-${type}-script`)
    copyEl.focus()
    copyEl.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  }

  deployPage(page, qa) {
    // construct api path
    let path = `${API}/deploy?pathname=${page.pathname}`
    path = qa ? `${path}&qa=true` : path
    // set deploying state
    this.el.setAttribute('deploying', '')
    this.statusEl.innerHTML = `<span class="kxDashboard__activity">⏳</span> Deploying ${this.currentPage.name} to ${qa ? 'QA' : 'Live'}`
    // send get request with params
    return fetch(path)
      .then(data => data.json(data))
      .then(deployData => {
        console.log('DevDashboard: deployPage success', deployData)
        this.statusEl.innerHTML = `
          <p>Deployed page ${this.currentPage.name} to ${qa ? 'QA' : 'LIVE'} succesfully</p>
          <pre>
            <span style="font-weight: bold;">HTML file: </span><a href="${deployData.html}">${deployData.html}</a><br/>
            <span style="font-weight: bold;">JS file: </span><a href="${deployData.js}">${deployData.js}</a>
          </pre>
        `
      })
      .catch(e => {
        this.statusEl.innerText = `Error Deploying ${this.currentPage.name} to QA. ${JSON.stringify(e)}`
      })
      .finally(() => {
        this.el.removeAttribute('deploying')
      })


  }

  toggleHandler() {
    this.open = !this.open
    this.el.setAttribute('open', this.open)
  }

  renderUI(data) {
    target.insertAdjacentHTML('beforeend', DashboardTemplate(data))
    this.el = document.querySelector('.kxDashboard')

    return Promise.resolve()
  }

  getConfig() {
    return fetch(`${API}/config`)
      .then(r => r.json())
  }
}

new DevDashboard()
