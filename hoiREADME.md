# Home Of Innovation


## Structure

src/home-of-innovation
  pages/
    page json config files
  index.hbs
    root template for hoi pages

scss/components/home-of-innovation
  scss files for hoi components & extras

scss/home-of-innovation
  index scss file for innovation

templates/partials/home-of-innovation/
  hoi component templates & extras

gulpfile
  gulp hoi command
  TODO add build?

## Page config files

structure

## Components

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
