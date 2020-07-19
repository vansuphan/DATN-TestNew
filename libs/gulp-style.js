// import libraries
var path = require('path');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass'); // Compile Sass into CSS
var CleanCSS = require('gulp-clean-css'); // Minify the CSS (UPDATED TO LATEST)!
var autoprefixer = require('gulp-autoprefixer'); // Auto prefixe CSS
var wait = require('gulp-wait'); // Wait before next

// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var outputDir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync

var compileSassTask = function () {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(wait(500))
    .pipe(
      plumber({
        errorHandler: errorHandler,
      })
    )
    .pipe(sass())
    .pipe(gulp.dest(path.resolve(outputDir.src, 'assets/css')))
    .on('error', errorHandler)
    .pipe(browserSync.reload({ stream: true }));
};
// gulp.task('sass', compileSassTask);

var copyCssTask = function () {
  return (
    gulp
      .src('./src/assets/css/**/*.css')
      .pipe(gulp.dest(path.resolve(outputDir.debug, 'assets/css')))
      //.pipe(cache('cache'))
      .on('error', errorHandler)
      .pipe(browserSync.reload({ stream: true }))
  );
};
// gulp.task('copyCss', copyCssTask);

var compressCssTask = function () {
  return (
    gulp
      .src('./src/assets/css/**/*')
      .pipe(wait(500))
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 3 versions'],
          cascade: false,
        })
      )
      .pipe(
        CleanCSS(
          {
            debug: true,
            compatibility: '*',
            level: 2,
          }
        )
      )
      .on('error', errorHandler)
      .pipe(gulp.dest(path.resolve(outputDir.build, 'assets/css')))
      //.pipe(cache('cache'))
      .on('error', errorHandler)
      .pipe(browserSync.reload({ stream: true }))
  );
};
// gulp.task('css', compressCssTask);

module.exports = {
  sass: compileSassTask,
  copy: copyCssTask,
  compress: compressCssTask
}

// function (dir, cb) {
//   outputDir = dir
//   taskCallback = cb


// }