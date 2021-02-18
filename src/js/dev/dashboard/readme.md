# KX Deployment Dashboard

Currently set up to deploy HOI pages via the Dashboard UI.

HOI pages can have automated deployment activated by setting `"automated": true` within the page configuration file.

After enabling locally, the bootstrap scripts should be copied and pasted into AEM as usual. The pages can then be deployed to AWS using the deploy qa/live buttons and the AEM pages deployed with the bootstrap script to QA/live.

This has not been tested on p5

Automated deployments could be used for static/non HOI pages, but UI will have to be added to static pages and server script started manually or with the `kx:dashboard:server` gulp task added to the regular gulp task.

## Instructions

Run `gulp hoi-dev` to compile scripts and start the server

## Server  
`server.js`

Fetches all relevent kx pages.  
Handles endpoints for page deployments  
Spawns a puppeteer instance to load the page, inject the scraper, then retrieve the js/html.  
The code is also passed through a minifier before AWS deployment.

## UI
`index.js`

Loaded by page in bootstrap/header.hbs on when automated flag is set.

## Scraper
`scraper-modified.js`

This is a modified version of the usual Cheil scraper. Not much has changed except the scraped html and js values are stored globally and retrieved when the server loads the page via puppeteer

## Bootstraps
`aem-bootstrap.html`  
`aem-bootstrap.js`

Two scripts (html/js) to be copied to AEM  
The bootstraps will apply some initial styling, and then load and inject the two AWS deployed files
