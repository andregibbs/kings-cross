# Home Of Innovation (HOI)

This Home of Innovation readme covers the new set of pages build outside the existing structure.

## HOI File Structure

```
├── src/
│   ├── home-of-innovation/
│   │   ├── pages/
│   │   │   ├── {page-config}.json
│   │   ├── index.hbs
│   ├── scss/
│   │   ├── home-of-innovation/
│   │   │   ├── index.scss
│   │   │   ├── staging.scss
│   │   ├── components/
│   │   │   ├── home-of-innovation/
│   │   │   │   ├── {component-style}.scss
│   ├── templates/
│   │   ├── home-of-innovation/
│   │   │   ├── {component-template}.hbs
└── gulpfile.js
```

## Gulp  
We have tasks created for development and staging. The HOI pages have some elements that inherit the style from the main pages. It is best to run the regular gulp tasks in tandem.

### Development
`gulp hoi-dev`  
Builds project and watches for changes in src for rebuilding.

This task can be used for scraping and deployment to AEM, minification not added yet. Slim markup already though.

### Staging
`gulp hoi-staging`  
Builds project and watches for changes (includes staging polyfill css with fonts and removes samsung headers and footers from templates)


#### Staging Deployment
Staging builds can be deployed quickly to our cloudfront environment.
All files (including non HOI pages) are included and existing files will be overwritten.

Command:  
`bash ./dodeploy staging`

#### Staging URL
https://d1bb30i8nznsls.cloudfront.net/uk/explore/kings-cross/

### Deployment

Run both `gulp hoi-dev` & `gulp` for scraping.


## Page Config Files  
The page config files are responsible for holding page relevant data.

The naming of the file relates to the pages URL with each url segment separated by a pipe `|`.
Pages will be built under `/uk/explore/kings-cross/` with pipes indicating subdirectories.

Example `category-page|single-page.json` will create a page with the path `/uk/explore/kings-cross/category-page/single-page`. Pages can (probably) be as deep as required and also use numbers as url paths.

### Structure
```javaScript
{
  "title": PAGE_TITLE (REQUIRED)
  "description": PAGE_DESCRIPTION (OPTIONAL)
  "image": LARGE_IMAGE_URL (REQUIRED)
  "alt": IMAGE_ALT (OPTIONAL)
  "thumb": THUMB_IMAGE_URL (REQUIRED)
  "group": PAGE_GROUP_ID (OPTIONAL)
  "sort": PAGE_GROUP_SORT (number sort index for PAGE_GROUP_ID)(OPTIONAL)
  "placeholder": PLACEHOLDER_PAGE (if the page should be referenced but not linked to)(OPTIONAL)
  "theme": THEME_OBJECT (OPTIONAL) {
    "color": LINK_COLOR (OPTIONAL)
  },
  "components": [
    COMPONENT_OBJECTS
  ]
}

```

The Page model stores top level info about the page and an array of what components should be shown on the page. The components array will contain objects defining what components should be shown and the data to be displayed. (More info under [Components](#components))

Note on the theme object & color, this will only be applied on top level HOI pages (ie /category/ not /category/page)

The placeholder key denotes that the page should be referenced in the group component, but not linked to. Functionality could be used in other components if needed.

### Variables

Included in the build task is the ability to reference key values from other page config files. Variables can also reference their own pages values. This makes it easy to reference and make changes to page values, across pages, by only editing in one place.

The syntax to use is:

```
  {{page-to-reference[key-to-reference]}}
  {{page-to-reference|sub-page[key-to-reference]}}
```

Example: Will find the config file named 'page-name' and pull the title key value into the config file when building the handlebars template.
```
  {{page-name[title]}}
```


### Special Variables
#### URL

To automatically include the generated url of another config generated page, the key [url] can be used in the variable.


```
  Example:
  {{page-name[url]}}

  Will resolve:
  `/uk/explore/kings-cross/page-name/`
```

**BE CAREFUL WITH REFERENCING VALUES THAT ARE OTHER VARIABLES.**  
It is possible that circular references may occur if variable chains exist and never resolve to a value.


## Components <a name="components"></a>

Each component can be included in the page components array using an object with a type key.

```javascript
{
  "type": COMPONENT ID
}
```

### Buttons
Component ID: **buttons**

Items can hold multiple buttons.

```javaScript
{
  "type": "buttons",
  "items": [
    {
      "copy": BUTTON_TEXT (REQUIRED)
      "url":  URL (REQUIRED),
      "target": LINK_TARGET (OPTIONAL)
    }
  ]
}
```

### Gallery
Component ID: **gallery**

Items can hold multiple media items, and handle three different media types; Image, Youtube Embed & Native Video.

```javaScript
{
  "type": "gallery",
  "title": GALLERY_TITLE (OPTIONAL)
  "items": [
    {
      "type": "image",
      "title": IMAGE_TITLE (OPTIONAL)
      "description": IMAGE_DESCRIPTION (OPTIONAL)
      "image": THUMB_IMAGE_URL (REQUIRED)
      "content": IMAGE_URL (REQUIRED)
    },
    {
      "type": "youtube",
      "title": IMAGE_TITLE (OPTIONAL)
      "description": IMAGE_DESCRIPTION (OPTIONAL)
      "image": THUMB_IMAGE_URL (REQUIRED)
      "content": YOUTUBE_VIDEO_ID (REQUIRED)
    },
    {
      "type": "video",
      "title": IMAGE_TITLE (OPTIONAL)
      "description": IMAGE_DESCRIPTION (OPTIONAL)
      "image": THUMB_IMAGE_URL (REQUIRED)
      "poster": VIDEO_POSTER_URL (OPTIONAL)
      "content": VIDEO_URL (REQUIRED)
    }
  ]
}
```

### GroupLand
Component ID: **group-land**

Can hold and display up to 4 items with the following options. Layout of the component adjusts automatically depending on how many items are included.

```javaScript
{
  "type": "group-land",
  "dynamic": DYNAMIC_ID (OPTIONAL (see Dynamic components))
  "items": [
    {
      "title": ITEM_TITLE (REQUIRED)
      "description": ITEM_DESCRIPTION (OPTIONAL)
      "image": ITEM_IMAGE (REQUIRED)
      "url": ITEM_URL (REQUIRED)
    },
    ...
  ]
}
```

### GroupLand ID
Component ID: **group-land-id**

Will render the same templates as regular group-land, but items can be populated using an array of page IDs. This component can hold more than 4 items and will generate multiple GroupLand components automatically.

```javaScript
{
  "type": "group-land-id",
  "dynamic": DYNAMIC_ID (OPTIONAL (see Dynamic components))
  "items": [
    "category|page-id",
    "creativity|innovation-sessions|adam-gemili-rachel-ama-get-fit-get-cooking",
    "creativity|innovation-sessions|elz-barney-career-advice",
    ...
  ]
}
```

### Headline
Component ID: **headline**

HEADLINE_LEVEL indicates the size of the headline, 1, 2, 3, 4, 5, 6. Default 1

```javaScript
{
  "type": "headline",
  "level": HEADLINE_LEVEL ("1"|"2"|"3"|"4"|"5"|"6") (OPTIONAL: default "1"),
  "copy": HEADLINE_COPY (REQUIRED)
}
```

### KeyVisual (Kv)
Component ID: **kv**

KV can handle four different MEDIA_OBJECT types; Image, Youtube Embed, Native Video & Native Audio.

The components array will hold other components to display alongside the media. Try not to overload, but not limit on inclusions here but haven't tested heavily.

```javaScript
{
  "type": "kv",
  "style": STYLE_OBJECT (OPTIONAL) {
    "desktop": DESKTOP_STYLE (left|top|right) (OPTIONAL: default left)
    "mobile": MOBILE_STYLE (top|bottom) (OPTIONAL: default top)
  },
  "media": MEDIA_OBJECT (image) (REQUIRE_ONE) {
    "type": "image",
    "content": IMAGE_URL (REQUIRED),
    "alt": IMAGE_ALT (OPTIONAL)
  },
  "media": MEDIA_OBJECT (youtube) (REQUIRE_ONE) {
    "type": "youtube",
    "content": YOUTUBE_ID (REQUIRED)
    "embedType": EMBED_TYPE (video|playlist) (OPTIONAL: default video)
    "poster": MEDIA_COVER (OPTIONAL)
    "poster_mobile": MEDIA_COVER_MOBILE (OPTIONAL)
  },
  "media": MEDIA_OBJECT (video|audio) (REQUIRE_ONE) {
    "type": MEDIA_TYPE (video|audio) (REQUIRED)
    "content": MEDIA_URL (REQUIRED)
    "poster": MEDIA_COVER (PREFERED)
    "poster_mobile": MEDIA_COVER_MOBILE (OPTIONAL)
  },
  "components": [
    COMPONENT_OBJECTS
  ]
},
```

### Image
Component ID: **image**

When used in page COMPONENT_OBJECTS, the component will be wrapped for responsive layout.

```javaScript
{
  "type": "image",
  "content": IMAGE_URL (REQUIRED)
  "alt": IMAGE_ALT (OPTIONAL)
},
```

### Video
Component ID: **video**

When used in page COMPONENT_OBJECTS, the component will be wrapped for responsive layout.

```javaScript
{
  "type": "video",
  "content": VIDEO_URL (REQUIRED)
  "poster": VIDEO_POSTER (OPTIONAL)
}
```

### YouTube Video
Component ID: **image**

When used in page COMPONENT_OBJECTS, the component will be wrapped for responsive layout.

```javaScript
{
  "type": "youtube",
  "content": YOUTUBE_ID (REQUIRED)
}
```

### LinkList
Component ID: **linklist**

```javaScript
{
  "type": "link-list",
  "title": LIST_TITLE (OPTIONAL)
  "dynamic": DYNAMIC_ID (OPTIONAL (see Dynamic components))
  "items": [
    {
      "title": ITEM_TITLE (REQUIRED)
      "url": ITEM_URL (REQUIRED)
      "image": ITEM_IMAGE (REQUIRED),
      "alt": IMAGE_ALT (OPTIONAL)
    },
    ...
  ]
}
```

### Group
Component ID: **group**

This component will fetch the required data for a LinkList component based on the PAGE_GROUP_ID provided.

All pages that match the PAGE_GROUP_ID will be included and be sorted by their PAGE_GROUP_SORT value

```javaScript
{
  "type": "group",
  "title": LIST_TITLE (OPTIONAL)
  "dynamic": DYNAMIC_ID (OPTIONAL (see Dynamic components))
  "id": PAGE_GROUP_ID (REQUIRED)
}
```

### Paragraphs
Component ID: **paragraphs**

Component will create a multiple paragraph elements for each array value. HTML can be included.

```javaScript
{
  "type": "paragraphs",
  "style": STYLE_OBJECT (OPTIONAL) {
    "large": LARGE_PARAGRAPH_TEXT (BOOL) (OPTIONAL: default false)
  },
  "text": [
    PARAGRAPH_STRINGS
  ]
}
```

### Wrapper
Component ID: **wrapper**

Wrapper component for component layouts. Will center content to a max width and pad for mobile & desktop.

Generally always used within the page component category.

```javaScript
{
  "type": "wrapper",
  "components": [
    COMPONENT_OBJECTS
  ]
}
```

### Share
Component ID: **share**

Requires 0-Config. Page titles are injected into component through javascript.

Generally used directly under KV and unwrapped. but can probably be included anywhere.

```javaScript
{
  "type": "share"
}
```

## Dynamic components

Some components can be configured to load the content dynamically, reducing the need to deploy multiple pages when only one page has been updated.

The components this applies to are:
* group
* link-list
* group-land
* group-land-id

To configure the component for dynamic deployment, simply include the `"dynamic"` key to the component object, and create a **unique dynamic ID for the page**. This ID is used to load the content via javascript.

```javaScript
{
  "type": "group",
  "dynamic": "unique-for-page-id",
  "id": "page-group-to-load"
}
```

The HOI build task will resolve and populate all the content for the page, before template generation. At this point the data marked to be dynamic will be copied out for use in local, staging, p6-qa and live dynamic component loading.

To deploy the data to the staging and p6-qa environment, use the command: (p6-qa.samsung.com & our cloudfront staging)

`npm run hoi-dynamic-staging`

For live use: (samsung.com only)

`npm run hoi-dynamic-live`

You will be prompted to confirm the live deployment in terminal.

After deployment, any pages that are published with dynamic components will automatically consume the new data for display.


## Other Components

These components have templates but needed in production or require user inclusion into the pages.

### Spacer
Component ID: **spacer**

Used in component demo pages for development. Dont use in production

```javaScript
{
  "type": "spacer"
}
```

### Breadcrumbs
COMPONENT NAME: n/a  

This component is used on every page and shouldn't be included in the page components. The data for this component is generated automatically in the gulpfile.

## Styles

The HOI scss files are held under `scss/home-of-innovation` and `scss/components/home-of-innovation`.

## Templates

The HOI component templates are stored under `templates/partials/home-of-innovation`. The main index page template is located at `home-of-innovation/index.hbs`.

TODO: might be worth moving some of these around so the files of similar types arent in wildly different directories.

## Scraping/Deploying pages

Pages need to be scraped for deployment to AEM, this means running a bookmarklet on the local development page to extract the HTML/CSS and Javascript code.

```
javascript:void((function(){var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','https://s3-eu-west-1.amazonaws.com/aem-scraper/aem-source-scraper-2019.js?r=%27+Math.random()*99999999);document.body.appendChild(e)})());
```

The scraper tool can be added as a bookmarklet within your browsers bookmark bar. (Chrome recommended).

With the local page built using `gulp hoi-dev`. The code can be extracted ready to copy to AEM

Within the AEM page that matches the path of the page you are building, the code must be copied to the Static Component selected from the AEM components list. Once dragged into the page, the component can be clicked on the display a modal with three tabs.
The HTML/CSS code should be copied into the `Body (HTML)` tab, and the JS code into `Footer (Javascript)`

Once pasted into the component, the page can be published to QA for checking over and then Live to deploy on the production site. This is done by selecting `Start Workflow` from the top menu of the editor window and selecting either `Samsung Direct QA Workflow` to push to QA and `Samsung Direct Workflow` for live.

Remember to run the dynamic data deployment to either staging of live after creating pages that have dynamic data associated with them.


## TODOS

1. Fix up gulp task to prevent failures when files missing, not building if non hoi scss change etc

2. Look into build task that could compute what files need updating in aem.
Was thinking to use the repo git history to compare changes and flag files that differe in content.
Or we could compare against live, might be more tricky.
