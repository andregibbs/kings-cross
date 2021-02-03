import glob from 'glob'

const DashboardTemplate = require('./template.hbs');

class DevDashboard {
  constructor() {
    console.log('dashboard')
    this.getPages()
  }

  getPages() {
    const hoiPages = glob('/src/home-of-innovation/pages/**/*.json');
    const staticPages = glob('src/pages/**/*.html')
    console.log(hoiPages, staticPages)
  }
}


export default new DevDashboard()
