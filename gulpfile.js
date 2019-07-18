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
	return ( type === 'error' ) ? console.log( chalk.red( message ) ) : console.log( chalk.green( message ) )
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
    gulp.watch( config.SRC_FOLDER + '/templates/partials/*.hbs', ['html'] )
    gulp.watch( config.SRC_FOLDER + '/pages/**/*.html', ['html'] )

	log('Watching src for changes... ')

})

gulp.task('production', sequence('delete-build', 'copy-assets', 'scss', 'buildJS', 'html') )
gulp.task('development', sequence('copy-assets', 'scss', 'buildJS', 'html', 'minify') )
gulp.task('default', ['watch', 'development', 'watchJS'])
