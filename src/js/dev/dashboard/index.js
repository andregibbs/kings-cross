// import glob from 'glob'

const DashboardTemplate = require('./template.hbs');

const API = 'http://localhost:3030'

class DevDashboard {
  constructor() {
    console.log('DevDashboard')

    this.getPages()

  }

  getPages() {
    return fetch(`${API}/pages`)
      .then(r => r.json())
      .then(pages => {
        console.log('DevDashboard: pages', pages);
      })
  }
}

new DevDashboard()
