# Home Of Innovation (HOI)

## HOI Files

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
We have tasks created for development and staging

### Development
`gulp hoi-dev`  
Builds project and watches for changes in src for rebuilding

### Staging
`gulp hoi-staging`
Creates staging builds and deploys to s3

## Page Config Files  
The page config files are responsible for holding relevant data.

### Structure
```javaScript
{
  "title": PAGE TITLE,
  "description": PAGE DESCRIPTION,
  "image": LARGE IMAGE URL,
  "thumb": SMALL IMAGE URL,
  "group": PAGE GROUP ID,
  "components": [
    PAGE COMPONENTS
  ]
}

```

The Page model stores top level info about the page and an array of what components should be shown on the page. The components array will contain objects defining what components should be shown and the data to be displayed. (More info under [Components](#components))

## Components <a name="components"></a>

Each component can be included in the page components array using an object with a type key.

```javascript
{
  "type": COMPONENT ID
}
```

### Breadcrumbs
COMPONENT NAME: n/a  

This component is used on every page and shouldn't be included in the page components. The data for this component is generated automatically in the gulpfile.

### Buttons
Component ID: **buttons**

```javaScript
{
  "type": "buttons",
  "items": [
    {
      ""
    }
  ]
}
```

### Gallery
Component ID: **gallery**

### GroupLand
Component ID: **groupland**

### Headline
Component ID: **headline**

### KeyVisual (Kv)
Component ID: **kv**

### LinkList
Component ID: **linklist**

### Related
Component ID: **related**

### Group
Component ID: **group**

### Paragraphs
Component ID: **paragraphs**

### Spacer
Component ID: **spacer**

Dev only at the moment

### Wrapper
Component ID: **wrapper**


### Styles

### Templates

### List

component types and models

## Loose ends

contentFindOutMore
contentIntro

not sure if will be used

contentPagination

might not be needed, pagination can be included.
smart way to do it could be using a group id for the content group and include an 'episode' or 'series' number stating its place in the episode
pagination will then look for other pages with the group id and select next/prev based on episode

or.. maybe have a template name as a number
{{category/content-type/1}}
{{category/content-type/1}}
(might not work for build/aem/seo)

## TODOS

Fix up gulp task to prevent failures when
 files missing etc
Look into build task that could compute what files need updating in aem (using git history? previous build tasks?)
