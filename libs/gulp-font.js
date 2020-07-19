// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var fontmin = require('gulp-fontmin'); // convert fonts

// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var dir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync

// constructor
var fontTask = function () {
  return (
    gulp
      .src('./src/fonts/**/*')
      .on('error', errorHandler)
      .pipe(gulp.dest('./debug/fonts'))
      .pipe(gulp.dest('./build/fonts'))
      //.pipe(cache('cache'))
      .on('error', errorHandler)
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
};

function convert() {
  return gulp
    .src('./src/ttf-fonts/**')
    .pipe(fontmin())
    .on('error', errorHandler)
    .pipe(gulp.dest('./debug/fonts'))
    .pipe(gulp.dest('./build/fonts'));
}

module.exports = {
  copy: fontTask,
  convert: convert
}