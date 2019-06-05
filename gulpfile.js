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

/* Pretty logs */
var log = function( message, type ) {
	return ( type === 'error' ) ? console.log( chalk.red( message ) ) : console.log( chalk.green( message ) )
}

/* Project name & output directory */
var PROJECT_NAME = 'cheil-london-v2'

/* Some globals to help us */
var SITE = (argv.site != '' && typeof(argv.site) != "undefined" ? argv.site : "uk")
var SUBFOLDER = (argv.subfolder != '' && typeof(argv.subfolder) != "undefined" ? PROJECT_NAME +"/"+ argv.subfolder : PROJECT_NAME)

/* Configuration */
var config = {

	/* Root directory */
	ROOT_FOLDER: __dirname,

	/* Build output */
	BUILD_FOLDER: path.join( __dirname, '/build/' ),

	/* Content dam assets*/
	ASSETS_FOLDER: path.join( __dirname, '/src/assets/'),

	/* Content dam assets*/
	BLOG_FOLDER: path.join( __dirname, '/src/blog/'),

	/* Development source files */
	SRC_FOLDER: path.join( __dirname, 'src'),
}

gulp.task('browser-sync', function() {
  browserSync.init({
			watch: true,
			server: {
				baseDir: "./build"
			}
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

    return gulp.src([config.ASSETS_FOLDER + '/**/*'])
       .pipe(gulp.dest(config.ROOT_FOLDER + '/build/assets/')),

   gulp.src([ config.SRC_FOLDER + '/favicon/**/*'])
       .pipe(gulp.dest( config.ROOT_FOLDER + '/build/' )),

    gulp.src([ config.SRC_FOLDER + '/pages/**/*'])
        .pipe(gulp.dest( config.ROOT_FOLDER + '/build/' )),

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
    	.pipe(gulp.dest( config.BUILD_FOLDER + '/css/' ))
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
            .pipe(gulp.dest( config.BUILD_FOLDER + '/js/' ))

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

	if ( fs.existsSync( path.join( config.SRC_FOLDER + '/copy/' + SITE + '/copy.json' ) ) && fs.existsSync( path.join( config.SRC_FOLDER + '/copy/default.json' ) ) ) {

		var defaultCopyPath = path.join( config.SRC_FOLDER + '/copy/default.json' )
		var copyPath = path.join( config.SRC_FOLDER + '/copy/' + SITE + '/copy.json' )

		/* Check if copy doc exists in /src/copy/uk/copy.json */
		var defaultCopyObject = JSON.parse(fs.readFileSync(defaultCopyPath, 'utf8'))
		var localCopyObject= JSON.parse(fs.readFileSync(copyPath, 'utf8'))
		var data = Object.assign(defaultCopyObject, localCopyObject)

		return gulp.src(copyPath )
			.pipe(through.obj(function (file, enc, cb) {
				/* Data as JSON from Copy Doc */
				gulp.src( config.SRC_FOLDER + '/*.{html,js,hbs}' )
					.pipe(handlebars({
							helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
							partials: config.SRC_FOLDER + '/templates/partials/*.{html,js,hbs}',
							bustCache: true,
							data: {
								'dtgen': new Date(),
								'site': SITE,
								'subfolder': config.SRC_FOLDER + '/pages/**/*'
							}
						}).data( data )
					)
					.pipe(gulp.dest( config.BUILD_FOLDER ))
					.on('error', function(err) { log('Error building HTML templates', 'error') })
					.on('end', function(err) { log('Compiled HTML templates') })

			}))

	} else {

console.log('this one');

		/* No copy doc exists, just compile the templates as is */
		return gulp.src( config.SRC_FOLDER + '/pages/**/*.{html,js,hbs}' )
			.pipe(handlebars({
					helpers: config.SRC_FOLDER + '/templates/helpers/handlebarsHelpers.js',
					partials: config.SRC_FOLDER + '/templates/partials/*.{html,js,hbs}',
					bustCache: true,
					data: {
						'dtgen': new Date(),
						'site': SITE,
						'subfolder': config.SRC_FOLDER + '/pages/**/*',

						"page":{
							"form":{
								"name":"Full Name",
								"email":"Email address",
								"url":"Your YouTube or Vimeo URL",
								"title":"Title of submission",
								"description":"Description of submission",
								"skills":"Skills",
								"experience":"Work experience",
								"terms":"Terms",
								"terms_long":"I accept and agree to comply with the <a class='link link--pink' target='_blank' href='http://stg.cheil.uk.s3-website.eu-west-2.amazonaws.com/legal/'>Cheil Website Terms of Use</a>.",
								// "terms_long":"I accept and agree to comply with the <a class='link link--pink' target='_blank' href='http://cheilv2.cheil.com/legal/'>Cheil Website Terms of Use</a>",
								"privacy":"Privacy",
								"privacy_long":"I have read and understood the <a class='link link--pink' target='_blank' href='http://stg.cheil.uk.s3-website.eu-west-2.amazonaws.com/legal/'>Cheil Recruitment Privacy Notice</a> and the <a class='link link--pink' target='_blank' href='http://stg.cheil.uk.s3-website.eu-west-2.amazonaws.com/legal'>Cheil Website Privacy Notice</a> which will apply to the processing of any personal information I submit in connection with my application.",
								// "privacy_long":"I have read and understood the <a class='link link--pink' target='_blank' href='http://cheilv2.cheil.com/legal/'>Cheil Recruitment Privacy Notice</a> and the <a class='link link--pink' target='_blank' href='http://cheilv2.cheil.com/legal'>Cheil Website Privacy Notice</a> which will apply to the processing of any personal information I submit in connection with my application",
								"indemnity":"Indemnity",
								"indemnity_long":"I warrant that the video I have uploaded is work created or developed solely by myself, except that where I have used another person’s work I have credited the use of that work."
							}
						}

					}
				})
			)
			.pipe(gulp.dest( config.BUILD_FOLDER ))
			.on('error', function(err) { log('Error building HTML templates', 'error') })
			.on('end', function(err) { log('Compiled HTML templates') })
	}

})

// minify HTML
//  https://www.npmjs.com/package/gulp-html-minifier
//  https://github.com/kangax/html-minifier
gulp.task('minify', () => {
    return gulp.src( config.ROOT_FOLDER + '/build/**/*.html' )
        .pipe(htmlmin({
            useShortDoctype: true,
            collapseWhitespace: true,
            removeComments: true,
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

gulp.task('sitemap', function () {
    gulp.src('build/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'https://cheil.uk/'
        }))
        .pipe(gulp.dest('./build'));
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
    gulp.watch( config.SRC_FOLDER + '/templates/partials/*.hbs', ['html'] )
    gulp.watch( config.SRC_FOLDER + '/pages/**/*.html', ['html'] )

	log('Watching src for changes... ')

})

gulp.task('production', sequence('delete-build', 'copy-assets', 'scss', 'buildJS', 'html') )
gulp.task('development', sequence('copy-assets', 'scss', 'buildJS', 'html', 'minify') )
gulp.task('default', ['watch', 'development', 'watchJS'])
