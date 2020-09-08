/* Gulp & Gulp dependencies */
var gulp = require('gulp')
var argv = require('yargs').argv
var clean = require('gulp-clean')
var imagemin = require('gulp-imagemin')
var sass = require('gulp-sass')
var watch = require('gulp-watch')
var sequence = require('gulp-sequence')
var babel = require('gulp-babel')
var handlebars = require('gulp-hb')
var rename = require('gulp-rename')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var browserSync = require('browser-sync')
var watchify = require('watchify')
var babel = require('babelify')
var through = require('through2')
var uglify = require('gulp-uglify')
var htmlmin = require('gulp-html-minifier');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var merge = require('merge-stream');

var prompt = require('prompt');
var hbsfy = require('hbsfy')

/* Other dependencies */
var chalk = require('chalk')
var path = require('path')
var fs = require('fs')

var getFilesInDirectory = require('./tasks/helpers').getFilesInDirectory
var HoiSearchContent = require('./tasks/hoi-search-content')

var log = function( message, type ) {
	return ( type === 'error' ) ? console.log( chalk.red( message ) ) : console.log( chalk.green( message ) );
}

var SITE = 'uk';
var SUBFOLDER = '/explore/kings-cross';

/* Configuration */
var config = {

	/* Root directory */
	ROOT_FOLDER: __dirname,

	/* Build output */
	BUILD_FOLDER: path.join( __dirname, '/build/' ),

	/* Content dam assets*/
	ASSETS_FOLDER: path.join( __dirname, '/src/assets/'),

	/* Development source files */
	SRC_FOLDER: path.join( __dirname, 'src'),
}

gulp.task('browser-sync', function() {
  browserSync.init({
			watch: true,
			proxy: "kings-cross.samsung.com",
  });
});

/* Gulp delete build folder */
gulp.task('delete-build', function() {

	return gulp.src( config.BUILD_FOLDER, {read: false})
	    .pipe(clean())
	    .on('end', function(){
				log("Cleaned build directory")
	    })
})

// Copy things into build folder
gulp.task('copy-assets', function (cb) {

    return gulp.src([ config.ASSETS_FOLDER + '/**/*.{svg,png,gif,jpg}' ])
       .pipe(gulp.dest( config.BUILD_FOLDER + '/content/dam/samsung/'  + SITE + '/' + SUBFOLDER + '/' )),

   gulp.src([ config.SRC_FOLDER + '/js/librarys/**/*.js' ])
       .pipe(gulp.dest( config.ROOT_FOLDER + '/build/js/librarys/' ))

});

//  I'm finding this tasks not that great. maybe needs some work on it.
//  Image optimization
gulp.task('images', function(cb){
	return gulp.src( config.ASSETS_FOLDER + SITE + '/' + SUBFOLDER + '/**/*')
	.pipe(imagemin([
	    imagemin.gifsicle({interlaced: true}),
	    imagemin.optipng({optimizationLevel: 6}),
	    imagemin.svgo({plugins: [
	    	{removeViewBox: true},
	    	{cleanupIDs: false},
	    	{removeTitle: true},
	    	{removeDesc: true}
	    ]})
	 ], {
	 	verbose: true,
		interlaced: false
	 }))
	.pipe( gulp.dest( config.ROOT_FOLDER + '/build/content/dam/samsung/' + SITE + '/' + SUBFOLDER + '/') )
	.on('end', function() {
		log('Images Compressed')
	})

});

/* Gulp compile SCSS as compress/minified */
gulp.task('scss', function() {

  const isStagingTask = argv._[0] === 'staging';

  const srcFiles = isStagingTask ? [
    config.SRC_FOLDER + '/scss/main.scss',
    config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/staging.scss'
  ] : [
    config.SRC_FOLDER + '/scss/main.scss'
  ]

  return gulp.src(srcFiles)
	 	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	 		.pipe(autoprefixer({
		  grid: true,
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(concat('main.css'))
    	.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css' ))
    	.on('end', function() {
    		log('SCSS Compiled')
    	})
})

// Gulp task to build individual page css files (moving away from one massive css for all pages)
gulp.task('scss-page', function() {

  const pages = ['home']
  const isStagingTask = argv._[0] === 'staging';

  let streams = []
  pages.forEach(page => {
    const srcFiles = isStagingTask ? [
      `${config.SRC_FOLDER}/scss/pages/${page}/index.scss`,
      config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/staging.scss'
    ] : [
      `${config.SRC_FOLDER}/scss/pages/${page}/index.scss`
    ]

    let stream = gulp.src(srcFiles)
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(autoprefixer({
        grid: true,
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(concat(`${page}.css`))
      .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css' ))

    streams.push(stream)
  })

  return merge(streams)

  // return gulp.src(srcFiles)
  //   .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  //   .pipe(autoprefixer({
  //     grid: true,
  //     browsers: ['last 2 versions'],
  //     cascade: false
  //   }))
  //   .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css' ))
  //   .on('end', function() {
  //     log('SCSS Page Compiled')
  //   })


})

/* JavaScript - Babel / Browserify */
function compileJS( watch ) {

    var bundler = watchify(browserify( config.SRC_FOLDER + '/js/main.js', { debug: true }).transform(hbsfy).transform(babel.configure({ presets: ['es2015-ie'] })))

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) { console.error(err); this.emit('end'); })
			.pipe(source('main.js'))
            .pipe(buffer())
            // .pipe(uglify())
			.pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/js' ))

	}

	if ( watch ) {
		bundler.on('update', function() {
			log('Rebundling JavaScript')
			rebundle()
		})
	}

	rebundle()
}

function watchJS() {
	return compileJS( true )
}

gulp.task('buildJS', function() { return compileJS() })
gulp.task('watchJS', function() { return watchJS() })

/* Watch /src directory for changes & reload gulp */
gulp.task('html', function () {
		var data = require(config.SRC_FOLDER + '/data/config.json')

    const isStagingTask = argv._[0] === 'staging';

		/* No copy doc exists, just compile the templates as is */
		return gulp.src( config.SRC_FOLDER + '/pages/**/*.{html,js,hbs}' )
			.pipe(handlebars({
					helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
					partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
					bustCache: true,
					data: {
            config: {
              ...data,
              site: SITE,
              subfolder: SUBFOLDER,
              staging: isStagingTask
            }
          }
				})
			)
			.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' ))

})


// minify HTML
//  https://www.npmjs.com/package/gulp-html-minifier
//  https://github.com/kangax/html-minifier
gulp.task('minify', () => {
    return gulp.src( config.ROOT_FOLDER + '/build/**/*.html' )
        .pipe(htmlmin({
            useShortDoctype: true,
            collapseWhitespace: true,
            removeComments: false,
            preserveLineBreaks: true,
            minifyCSS: true,
            minifyJS: true,
            decodeEntities: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            ignorePath: config.ROOT_FOLDER + '/build/assets'
        }))
        .pipe(gulp.dest( config.ROOT_FOLDER + '/build/' ))
});

// Compress js
gulp.task('compress', function (cb) {
        pump([
                gulp.src('lib/*.js'),
                uglify(),
                gulp.dest('dist')
            ],
            cb
        );
	});

/* Watch /src directory for changes & reload gulp */
gulp.task('watch', function () {
	gulp.watch( config.SRC_FOLDER + '/scss/**/*.scss', ['scss', 'scss-page'] )
	gulp.watch( config.SRC_FOLDER + '/js/**/*.js', ['watchJS'] )
    gulp.watch( config.SRC_FOLDER + '/templates/partials/**/*.hbs', ['html'] )
    gulp.watch( config.SRC_FOLDER + '/pages/**/*.html', ['html'] )

	log('Watching src for changes... ')

})

/*****
  HOME OF INNOVATION (HOI) TASKS
*****/

// HOI folder, moved to script scope as its used in multiple tasks
var _HOI_FOLDER = 'home-of-innovation';

// Function to generate Home Of Innovation Pages
function HOITemplates(skipTemplates, dynamicDataCallback, selectedFiles) {

  // Path to HOI config pages
  const pagesBasePath = config.SRC_FOLDER + '/' + _HOI_FOLDER + '/pages/'
  // Public path for relative urls
  const publicUrl = '/' + SITE + SUBFOLDER + '/';

  // Array of file paths to page configs
  // disabled as inteferring with dynamic data (need to process all pages)
  let pages;
  // if a single file is specified
  // if (selectedFiles) {
  //   pages = selectedFiles
  // } else {
    // otherwise use all
    pages = getFilesInDirectory(pagesBasePath)
  // }

  // is staging task
  const isStagingTask = argv._[0] === 'hoi-staging';

  // declare dynamic data object
  let dynamicComponentData = {}

  // Helper Functions
  // Fetch page config for url (path = "segment/segment" | "segment/segment/segment")
  function getPageData(path) {
    // TODO: could update to handle strings with slashes before/after /slug/sub-slug/
    path = path.split('/').join('|')
    const pageData = require(pagesBasePath + path + '.json')
    return pageData
  }

  // Create breadcrumbs based of page configs url segments (urlSegments ['slug', 'sub-slug'])
  function createBreadcrumbs(urlSegments) {
    // Include index by default
    let breadcrumbs = [{
      url: publicUrl,
      title: "Home" //getPageData('index').title
    }]

    // Loop through segments provided
    urlSegments.forEach((segment, i) => {
      // if no segment string skip as we are on index
      if (!segment.length) {
        return
      }
      // We also want to include the parent segments for their urls
      let combinedSegments = urlSegments.slice(0, i + 1).join('/')
      breadcrumbs.push({
        url: publicUrl + combinedSegments,
        title: getPageData(combinedSegments).title
      })
    });
    return breadcrumbs;
  }

  // Finds other page configs with a group id
  function getPagesWithGroupId(id, currentFilePath) {
    const withId = []
    let allPages = getFilesInDirectory(pagesBasePath)
    allPages.forEach((path) => {
      // ignore current file path

      if (path !== currentFilePath) {
        const pageData = require(path)
        if (pageData.group === id && !pageData.hidden) {
          // Include page data aswell, no point double requiring in our use case
          withId.push({
            path,
            pageData
          })
        }
      }
    })
    return withId;
  }

  // https://gist.github.com/getify/3667624
  function escapeDoubleQuotes(str) {
      if (typeof str !== 'string') {
        return str
      }
     return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
   }

  // Include any data that requires dynamic data from a different page
  function populatePageDataVariables(pageData, currentFilePath) {
    // First population
    // Based on specific component
    pageData.components.map((component) => {
      switch (component.type) {
        // special case to help with building graduate fashion week page
        case 'gfw-gallery':
          component.items = component.items.map((id) => {
            // get buttons from file data
            const buttons = getPageData(`_data-gfw`)[`${id}-files`].map((item) => {
              item.target = "_blank"
              return item
            })
            return {
              type: `{{_data-gfw[${id}-type]}}`,
              active: `{{_data-gfw[${id}-active]}}`,
              title: `{{_data-gfw[${id}-name]}}`,
              image: `{{_data-gfw[${id}-image]}}`,
              alt: `{{_data-gfw[${id}-alt]}}`,
              list_buttons: {
                style: {
                  align: "center"
                },
                items: buttons
              },
              content: `{{_data-gfw[${id}-content]}}`,
              gallery_components: [
                {
                  type: "headline",
                  copy: `{{_data-gfw[${id}-name]}}`,
                  level: "3"
                },
                {
                  type: "buttons",
                  style: {
                    align: "center"
                  },
                  items: buttons
                }
              ]
            }
          })
          return component
          break;
        case 'related':
          // Related pages, create items array with populated data
          component.items = component.ids.map((id) => {
            const path = id.split('|').join('/')
            return {
              url: publicUrl + path,
              image: getPageData(path).thumb,
              title: getPageData(path).title,
              alt: getPageData(path).alt || getPageData(path).title
            }
          })
          return component
          break;
        case 'group':
          // find pages with same group id
          let groupPages = getPagesWithGroupId(component.id, currentFilePath);
          // create array of items with data
          // console.log(publicUrl, path.replace(pagesBasePath, '').replace(/\|/g,'/').replace('.json', ''))
          component.items = groupPages.map(({path, pageData}) => {
            const url = pageData.placeholder ? false : publicUrl + path.replace(pagesBasePath, '').replace(/\|/g,'/').replace('.json', '')
            return {
              title: pageData.title,
              image: pageData.thumb,
              alt: pageData.alt || pageData.title,
              sort: pageData.sort,
              url,
            }
          })
          component.items.sort((a, b) => a.sort - b.sort)
          break;
        case 'group-land-id':
        case 'link-list-id':
          component.items = component.items.map((id) => {
            const path = id.split('|').join('/')
            const pageData = getPageData(path)
            const url = pageData.placeholder ? false : publicUrl + path.replace(pagesBasePath, '').replace(/\|/g,'/').replace('.json', '')
            return {
              title: pageData.title,
              description: pageData.description,
              image: pageData.image,
              alt: pageData.alt || pageData.title,
              url
            }

          })

        default:
      }
    })

    // Second population
    // Using custom tags to id and populate data, search for a predefined delimited variable in the json string,
    // eg.  {{slug|sub-slug[key]}}
    // fetch the page data from the specified page, then replace the values in the string with the key value

    let dataString = JSON.stringify(pageData)
    // Regex for{{page|page-path[key]}}
    const regex = /{{(?<page>.*?)\[(?<key>.*?)\]}}/
    // Loop over matches
    while ((match = regex.exec(dataString)) !== null) {
      const {page, key} = match.groups;
      let value;
      // special for any special cases
      switch (key) {
        case 'url':
          // if url we want to construct it (not avaliable in page config file)
          value = publicUrl + page.split('|').join('/')
          break;
        default:
          // otherwise get data then key
          // escaping quotes that were pr eviously escaped
          value = getPageData(page)[key]
          value = value ? escapeDoubleQuotes(value) : value

      }
      // update dataString, replacing the first (current) matched occurence using matched string
      dataString = dataString.replace(match[0], value)
    }
    // console.log(dataString)
    return JSON.parse(dataString);
  }


  // Fetch the theme color for current page
  function getThemeColor(urlSegments) {
    const data = getPageData(urlSegments[0])
    return data.theme ? data.theme.color : ""
  }

  // Main loop for each page config
  pages.forEach((filePath) => {

    // Clear require cache
    // Get page config data
    delete require.cache[require.resolve(filePath)];
    const pageData = require(filePath);

    // Create array for this pages url segments (['slug'/])
    const urlSegments = filePath
      .replace(pagesBasePath, '')
      .replace('.json','')
      .replace('index', '')
      .split('|');

    if (urlSegments[0][0] === "_") {
      return log('Skipping page: ' + urlSegments.join('/'))
    } else {
      log('Building page: ' + urlSegments.join('/'))
    }

    const breadcrumbs = createBreadcrumbs(urlSegments)
    const populatedData = populatePageDataVariables(pageData, filePath);
    const themeColor = getThemeColor(urlSegments)

    // populate dynamic data object
    populatedData.components.forEach((component) => {
      if (component.dynamic) {
        // create unique reference, replace dynamic id in page data
        let reference = urlSegments.join('/') + '-' + component.dynamic
        component.dynamic = reference
        dynamicComponentData[reference] = component
      }
    })

    // skip templates if set
    if (skipTemplates !== true) {

      // Gulp loop to generate the site files
      gulp.src( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/index.hbs' )
      .pipe(handlebars({
        helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
        partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
        bustCache: true,
        data: {
          ...populatedData,
          breadcrumbs,
          themeColor,
          config: {
            site: SITE,
            subfolder: SUBFOLDER,
            staging: isStagingTask
          }
        }
      }))
      .pipe(rename('index.html'))
      .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' + urlSegments.join('/') ))
      .on('error', function(err) { log('Error building HTML template:' + urlSegments.join('/'), 'error') })
      .on('end', function(err) { log('Compiled Template: ' + urlSegments.join('/')) })

    }

  })

  if (dynamicDataCallback) {
    dynamicDataCallback(dynamicComponentData)
  }

  // write dynamic data file for use in local dev
  fs.writeFileSync(config.BUILD_FOLDER + '/hoi-dynamic-local.json', JSON.stringify(dynamicComponentData))

  // finish off with generating the search content
  // automatically writes the local search data file
  HoiSearchContent()

}

function HOIJs (bundler) {

	// function rebundle() {
	bundler.bundle()
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(source('main.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/js/home-of-innovation' ))
    log('Rebundled HOI JS')
  // }

  // if ( watch ) {
  //   bundler.on('update', function() {
  //     log('Rebundling HOI JS')
  //     rebundle()
  //   })
  // }
  //
  // rebundle()

}

// Home Of Innovation Build Task
// wrapping build function due to watch issues
gulp.task('home-of-innovation-build', () => {
  // buildHomeOfInnovation()
  HOITemplates()
  return
})

let hoiJSBundler;
gulp.task('home-of-innovation-js', () => {
  if (!hoiJSBundler) {
    hoiJSBundler = watchify(
      browserify( config.SRC_FOLDER + '/js/home-of-innovation/main.js', { debug: true })
        .transform(hbsfy)
        .transform(babel.configure({ presets: ['es2015-ie'] })))
  }
  HOIJs(hoiJSBundler)
  return
})

// Home Of Innovation SCSS Task
gulp.task('home-of-innovation-scss', () => {

  const isStagingTask = argv._[0] === 'hoi-staging';

  const srcFiles = isStagingTask ? [
    config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/index.scss',
    config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/staging.scss'
  ] : [
    config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/index.scss'
  ]

  // HOI SCSS
  return gulp.src(srcFiles)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
    grid: true,
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(concat('index.css'))
    .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css/' + _HOI_FOLDER ))
    .on('end', function() {
      log('HOI SCSS Compiled')
    })
})

// Home Of Innovation Watch Task
gulp.task('home-of-innovation-watch', () => {
  // watch and update all (removed as was getting slow)
  // gulp.watch( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/**/*', ['home-of-innovation-build'] )
  gulp.watch( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/**/*', (changeObj) => {
    // use changed file object to only update single template, wraped in array
    return HOITemplates(false, false, [changeObj.path])
  } )
  gulp.watch( config.SRC_FOLDER + '/scss/**/*.scss', ['home-of-innovation-scss'] )
  gulp.watch( config.SRC_FOLDER + '/js/**/*.js', ['home-of-innovation-js'] )
  gulp.watch( config.SRC_FOLDER + '/templates/partials/**/*', ['home-of-innovation-build'] )
  log('Watching HOI folder')
})

gulp.task('hoi-staging', ['home-of-innovation-scss', 'home-of-innovation-build', 'home-of-innovation-js', 'home-of-innovation-watch'])
gulp.task('hoi-dev', ['home-of-innovation-scss', 'home-of-innovation-build', 'home-of-innovation-js', 'home-of-innovation-watch'])

gulp.task('production', sequence('copy-assets', 'scss', 'buildJS', 'html') )
gulp.task('development', sequence('copy-assets', 'scss', 'scss-page', 'buildJS', 'html') )
gulp.task('_staging', sequence('copy-assets', 'scss', 'scss-page', 'buildJS', 'html') )

gulp.task('staging', ['watch', '_staging', 'watchJS'])
gulp.task('default', ['watch', 'development', 'watchJS'])

// export hoi templates script for deploying dynamic data
exports.HOITemplates = HOITemplates
