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

/* Other dependencies */
var chalk = require('chalk')
var path = require('path')
var fs = require('fs')

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

	return gulp.src( config.SRC_FOLDER + '/scss/**/*.scss' )
	 	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	 		.pipe(autoprefixer({
		  grid: true,
          browsers: ['last 2 versions'],
          cascade: false
      }))
    	.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css' ))
    	.on('end', function() {
    		log('SCSS Compiled')
    	})
})

/* JavaScript - Babel / Browserify */
function compileJS( watch ) {

    var bundler = watchify(browserify( config.SRC_FOLDER + '/js/main.js', { debug: true }).transform(babel.configure({ presets: ['es2015-ie'] })))

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
		var data = config.SRC_FOLDER + '/data/config.json'

		/* No copy doc exists, just compile the templates as is */
		return gulp.src( config.SRC_FOLDER + '/pages/**/*.{html,js,hbs}' )
			.pipe(handlebars({
					helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
					partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
					bustCache: true,
					data: data
				})
			)
			.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' ))

})

// HOI folder, moved to script scope as its used in multiple tasks
var _HOI_FOLDER = 'home-of-innovation';

/* separate task and folder to keep everything separate */
// switched from gulp task to function (causing issues with watch)
function buildHomeOfInnovation() {

	console.log('do home of innovation');

	// the main site data ... needed for nav ...
	var data = config.SRC_FOLDER + '/data/config.json'

	// ensure the content file exists ...
	if ( fs.existsSync( path.join( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/content.json' ) ) ) {

		// construct the path
		var contentPath = path.join( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/content.json' )

		// get as an object
		var contentObject;
    try {
      contentObject = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
    } catch(e) {
      console.log(e)
      return false
    }

		console.log(contentObject.items.length);

		var homeURL = '/' + SITE + SUBFOLDER + '/' + _HOI_FOLDER + '/';

		var breadcrumbs = [];

		var levelThreePages = [];

		if (contentObject.items) {

			var levelThreeIndex = 0;

			for (var i = 0; i < contentObject.items.length; i++) {

				if (contentObject.items[i].items) {

					for (var j = 0; j < contentObject.items[i].items.length; j++) {

						var levelThreePage = {};

						// add the 'stuff' to the front of the url to 'help' (including level 2 details)
						levelThreePage.url = homeURL + contentObject.items[i].url + '/' + contentObject.items[i].items[j].url;
						levelThreePage.title = contentObject.items[i].items[j].title;

						// add the level 3 page to the levelThreePages array - for use later for prev and next
						levelThreePages.push(levelThreePage);
						// increment the counter
						levelThreeIndex++;

					}

				}
				else {

					var levelThreePage = {};

					// add the 'stuff' to the front of the url to 'help'
					levelThreePage.url = homeURL + contentObject.items[i].url;
					levelThreePage.title = contentObject.items[i].title;

					// add the level 3 page to the levelThreePages array - for use later for prev and next
					levelThreePages.push(levelThreePage);
					// increment the counter
					levelThreeIndex++;

				}

			}

			for (var i = 0; i < levelThreePages.length; i++) {
				console.log(i + ' ' + levelThreePages[i].title + ' ' + levelThreePages[i].url);
			}

			levelThreeIndex = 0;

			for (var i = 0; i < contentObject.items.length; i++) {

				console.log(contentObject.items[i].title);

				// level 2 ...

				breadcrumbs = [
					{
						'title':'Home',
						'url': homeURL
					},
					{
						'title':contentObject.items[i].title,
						'url': homeURL + contentObject.items[i].url
					}
				];

				var prev, next = null;

				if (contentObject.items[i].items) {
					// this is a real level 2 ... so no prev and prev
				}
				else {
					// this is really a level 3 ... so need to populate prev and next

					// should be a function !!!! >>>

					// get the index of the prev and next item for jump controls
					var prevIndex = levelThreeIndex > 0 ? levelThreeIndex - 1 : levelThreePages.length - 1;
					var nextIndex = levelThreeIndex < levelThreePages.length - 1 ? levelThreeIndex + 1 : 0;
					// get the actual prev and next contentObject items
					prev = levelThreePages[prevIndex];
					next = levelThreePages[nextIndex];

					console.log(prev.title + ' ' + prev.url);
					console.log(next.title + ' ' + next.url);

					levelThreeIndex++;

					// <<< should be a function !!!!

				}

				gulp.src( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/index.hbs' )
					.pipe(handlebars({
							helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
							partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
							bustCache: true,
							data: {
								'dtgen': new Date(),
								'site': SITE,
								'subfolder': SUBFOLDER + '/' + _HOI_FOLDER,
								'breadcrumbs': breadcrumbs,
								'findoutmore': contentObject.items,
								'back': breadcrumbs[breadcrumbs.length - 2],
								'prev': prev,
								'next': next
							}
						}).data( data ).data( contentObject.items[i] )
					)
					.pipe(rename('index.html'))
					.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' + _HOI_FOLDER + '/' + contentObject.items[i].url ))
					.on('error', function(err) { log('Error building HTML templates', 'error') })
					.on('end', function(err) { log('Compiled HTML templates') })


				if (contentObject.items[i].items) {

					for (var j = 0; j < contentObject.items[i].items.length; j++) {

						console.log('- ' + contentObject.items[i].items[j].title);

						// group stuff

						if (contentObject.items[i].items[j].group) {
							console.log('GROUP - ' + JSON.stringify(contentObject.items[i].items[j].group));
							// load up groupItmes ...
							var groupItems = [];
							// loop through all 3rd level items and if group is the same add it to groupItems
							// ONLY if NOT this item
							for (var gi = 0; gi < contentObject.items.length; gi++) {
								for (var gj = 0; gj < contentObject.items[gi].items.length; gj++) {
									// item has a group, it has the same code but is NOT the same group object
									if (contentObject.items[gi].items[gj].group &&
										contentObject.items[gi].items[gj].group.code == contentObject.items[i].items[j].group.code &&
										contentObject.items[gi].items[gj].group != contentObject.items[i].items[j].group) {
										// add the item to groupItems
										groupItems.push(contentObject.items[gi].items[gj]);
										// then add groupItem.link
										groupItems[groupItems.length - 1].link = homeURL + contentObject.items[gi].url + '/' + contentObject.items[i].items[gj].url;
									}
								}
							}
							contentObject.items[i].items[j].group.items = groupItems;
						}

						// related stuff

						if (contentObject.items[i].items[j].related) {
							console.log('RELATED - ' + JSON.stringify(contentObject.items[i].items[j].related));
							// load up groupItmes ...
							var relatedItems = [];
							// loop through the ids
							for (var ctr = 0; ctr < contentObject.items[i].items[j].related.ids.length; ctr++) {
								var id = contentObject.items[i].items[j].related.ids[ctr];
								var bits = id.split('|');
								// make sure there are 2 bits to the id
								if (bits.length == 2) {
									// loop through all 3rd level items and if id matches (id = [i]url | [j]url ) add it to relatedItems
									for (var ri = 0; ri < contentObject.items.length; ri++) {
										for (var rj = 0; rj < contentObject.items[ri].items.length; rj++) {
											// item has a group, it has the same code but is NOT the same group object
											if (contentObject.items[ri].url == bits[0] &&
												contentObject.items[ri].items[rj].url == bits[1]) {
												// add the item to relatedItems
												relatedItems.push(contentObject.items[ri].items[rj]);
												// then add groupItem.link
												relatedItems[relatedItems.length - 1].link = homeURL + contentObject.items[ri].url + '/' + contentObject.items[ri].items[rj].url;
											}
										}
									}
									contentObject.items[i].items[j].related.items = relatedItems;
								}
							}
						}




						// level 3 ...

						breadcrumbs = [
							{
								'title':'Home',
								'url': homeURL
							},
							{
								'title':contentObject.items[i].title,
								'url': homeURL + contentObject.items[i].url
							},
							{
								'title':contentObject.items[i].items[j].title,
								'url': homeURL + contentObject.items[i].url + '/' + contentObject.items[i].items[j].url
							}
						];

						// should be a function !!!! >>>

						// get the index of the prev and next item for jump controls
						var prevIndex = levelThreeIndex > 0 ? levelThreeIndex - 1 : levelThreePages.length - 1;
						var nextIndex = levelThreeIndex < levelThreePages.length - 1 ? levelThreeIndex + 1 : 0;
						// get the actual prev and next contentObject items
						var prev = levelThreePages[prevIndex];
						var next = levelThreePages[nextIndex];

						console.log(prev.title + ' ' + prev.url);
						console.log(next.title + ' ' + next.url);

						levelThreeIndex++;

						// <<< should be a function !!!!

						gulp.src( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/index.hbs' )
							.pipe(handlebars({
									helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
									partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
									bustCache: true,
									data: {
										'dtgen': new Date(),
										'site': SITE,
										'subfolder': SUBFOLDER + '/' + _HOI_FOLDER,
										'breadcrumbs': breadcrumbs,
										'findoutmore': contentObject.items,
										'back': breadcrumbs[breadcrumbs.length - 2],
										'prev': prev,
										'next': next

									}
								}).data( data ).data( contentObject.items[i].items[j] )
							)
							.pipe(rename('index.html'))
							.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' + _HOI_FOLDER + '/' + contentObject.items[i].url + '/' + contentObject.items[i].items[j].url ))
							.on('error', function(err) { log('Error building HTML templates', 'error') })
							.on('end', function(err) { log('Compiled HTML templates') })

					}

				}

			}

		}




		breadcrumbs = [
			{
				'title':'Home',
				'url': homeURL
			}
		];

		return gulp.src(contentPath )
			.pipe(through.obj(function (file, enc, cb) {
				/* Data as JSON from Copy Doc */
				gulp.src( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/index.hbs' )
					.pipe(handlebars({
							helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
							partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
							bustCache: true,
							data: {
								'dtgen': new Date(),
								'site': SITE,
								'subfolder': SUBFOLDER + '/' + _HOI_FOLDER,
								'xbreadcrumbs': breadcrumbs,
								'findoutmore':contentObject.items,
								'epoch': (new Date).getTime(),
								// 'author': gitConfigFile.user.name.split(' ')[0],
							}
						}).data( data ).data( contentObject )
					)
					.pipe(rename('index.html'))
					.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' + _HOI_FOLDER ))
					.on('error', function(err) { log('Error building HTML templates', 'error') })
					.on('end', function(err) { log('Compiled HTML templates') })

			}))



//		// test building a page ...
//		return gulp.src( config.SRC_FOLDER + _HOI_FOLDER + 'index.html' )
//			.pipe(handlebars({
//					helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
//					partials: config.SRC_FOLDER + '/templates/partials/**/*.{html,js,hbs}',
//					bustCache: true,
//					data: data // data passed in as a json file path
//				}).data( contentObject ) // data passed in as an json object
//			)
//			.pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/' + _HOI_FOLDER ))



	}
	else {

		console.log('MISSING home-of-innovation copy.json');

	}

// })
}

// Home Of Innovation Build Task
// wrapping build function due to watch issues
gulp.task('home-of-innovation-build', () => {
  buildHomeOfInnovation()
  return
})

// Home Of Innovation SCSS Task
gulp.task('home-of-innovation-scss', () => {

  // HOI SCSS
  return gulp.src(config.SRC_FOLDER + '/scss/'+_HOI_FOLDER+'/index.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(autoprefixer({
      grid: true,
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(gulp.dest( config.BUILD_FOLDER + SITE + '/' + SUBFOLDER + '/css/' + _HOI_FOLDER ))
      .on('end', function() {
        log('HOI SCSS Compiled')
      })

})

// Home Of Innovation Watch Task
gulp.task('home-of-innovation-watch', () => {
  gulp.watch( config.SRC_FOLDER + '/' + _HOI_FOLDER + '/**/*', ['home-of-innovation-build'] )
  gulp.watch( config.SRC_FOLDER + '/scss/**/*.scss', ['home-of-innovation-scss'] )
  gulp.watch( config.SRC_FOLDER + '/templates/partials/' + _HOI_FOLDER + '/**/*', ['home-of-innovation-build'] )
  log('Watching HOI folder')
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
	gulp.watch( config.SRC_FOLDER + '/scss/**/*.scss', ['scss'] )
	gulp.watch( config.SRC_FOLDER + '/js/**/*.js', ['watchJS'] )
    gulp.watch( config.SRC_FOLDER + '/templates/partials/**/*.hbs', ['html'] )
    gulp.watch( config.SRC_FOLDER + '/pages/**/*.html', ['html'] )

	log('Watching src for changes... ')

})

gulp.task('hoi', ['home-of-innovation-scss', 'home-of-innovation-build', 'home-of-innovation-watch'])

gulp.task('production', sequence('delete-build', 'copy-assets', 'scss', 'buildJS', 'html') )
gulp.task('development', sequence('copy-assets', 'scss', 'buildJS', 'html', 'minify') )
gulp.task('default', ['watch', 'development', 'watchJS'])
