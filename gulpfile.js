var gulp = require('gulp'); // Require gulp
var path = require('path');

// clean directory
var clean = require('gulp-clean');

// Other dependencies
var chalk = require('chalk');
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync'); // Reload the browser on file changes

// config
var config = require('./libs/gulp-config')
config.gulp = gulp
config.browserSync = browserSync

// modules
var generateIndex = require('./libs/generate-index');
var gulpHtml = require('./libs/gulp-html')
var gulpStyle = require('./libs/gulp-style')
var gulpScript = require('./libs/gulp-script')
var gulpImage = require('./libs/gulp-image')
var gulpAsset = require('./libs/gulp-asset')
var gulpFont = require('./libs/gulp-font')
var gulpWatch = require('./libs/gulp-watch')

var gulpLaravel = require('./libs/gulp-laravel')

var dir = {
  src: path.resolve('src'),
  debug: path.resolve('debug'),
  build: path.resolve('build'),
}

// Tasks -------------------------------------------------------------------- >
// cache.caches = {};

var errorHandler = require('./libs/error-handler')

// Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('sass', gulpStyle.sass);
gulp.task('copyCss', gulpStyle.copy);
gulp.task('css', gulpStyle.compress);

// Task to minify new or changed HTML pages
gulp.task('html', gulpHtml.html(function () {
  
}));

// Task to concat, strip debugging and minify JS files
gulp.task('bundlejs', gulpScript.concat);
gulp.task('copyScripts', gulpScript.copy);
gulp.task('compileScripts', gulpScript.compress);
gulp.task('minifyjs', gulpScript.compress);
gulp.task('minjspages', gulpScript.obfuscatorScriptInPages);

// Task to copy images to build
gulp.task('images', gulpImage.copy);

// Task to compress images and copy to build
gulp.task('compressImages', gulpImage.compress);

// Task to copy "assets" into build
gulp.task('assets', gulpAsset.copy);

// Task to copy fonts into build
gulp.task('fonts', gulpFont.copy);

// Task to convert fonts:
gulp.task('convert-fonts', gulpFont.convert);

// Task to get the size of the debug project
gulp.task('debug-size', function () {
  return gulp
    .src('./debug/**')
    .pipe(size({ showFiles: false, title: "DEBUG:" }))
    .on('error', errorHandler);
});

// Task to get the size of the build project
gulp.task('build-size', function () {
  return gulp
    .src('./build/**')
    .pipe(size({ showFiles: false, title: "BUILD:" }))
    .on('error', errorHandler);
});

// task for watching file changes...
gulp.task('watch', function (done) {
  gulpWatch('debug')
  done()
});

// clean up the build folder...
gulp.task('clean-build', function () {
  return gulp.src(config.dir.build, { read: false, allowEmpty: true }).pipe(clean())
})
gulp.task('clean-debug', function () {
  return gulp.src(config.dir.debug, { read: false, allowEmpty: true }).pipe(clean())
})

// Notify developer about framework is ready...
console.log(config.frameworkName + chalk.red(' DIGIFAST (v' + config.frameworkVersion + ') is setting up. Please wait a moment...'));

// ===========================
// BUILD/RELEASE TEMPLATES
// ===========================
// var buildTasks = ['sass', 'css', 'html', 'minifyjs', 'fonts', 'assets', 'compressImages'];
var buildTasks = gulp.series('clean-build', 'compressImages', 'assets', 'sass', 'css', 'fonts', 'minifyjs', 'html');
gulp.task('build', buildTasks);
gulp.task('release', buildTasks); // alias of build

// ===========================
// WATCHING FILES FOR DEVELOPMENT
// ===========================
var defaultTasks = gulp.series('clean-debug', 'assets', 'sass', 'css', 'copyScripts', 'fonts', 'images', 'html', 'watch', 'debug-size');
gulp.task('default', defaultTasks);

// ===========================
// LARAVEL TEMPLATE GENERATOR:
// ===========================
gulp.task('buildLaravel', gulpLaravel.build);
// default
var buildLaravelTasks = gulp.series('clean-build', 'build', 'clean-laravel-build', 'buildLaravel');
gulp.task('build-laravel', buildLaravelTasks, done => {
  console.log("BUILD COMPLETED!");
  done();
});
