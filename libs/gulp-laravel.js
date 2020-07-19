// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var cheerio = require('gulp-cheerio'); // Parse HTML (like jQuery)
var fileinclude = require('gulp-file-include'); // html include
var clean = require('gulp-clean');
var rename = require("gulp-rename");

// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var dir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync
var frameworkName = config.frameworkName

// constructor
var gulpTaskBuildLaravel = function (callback) {
  function taskCallback() {
    console.log(
      frameworkName + ' -> LARAVEL files were built successfully!'
    );
    // callback function:
    if (callback) callback();
  }

  gulp
    .src('./build/assets/**/*')
    .pipe(gulp.dest('./build-laravel/cdn/assets/'))
    .on('error', errorHandler);

  gulp
    .src('./build/fonts/**/*')
    .pipe(gulp.dest('./build-laravel/cdn/fonts/'))
    .on('error', errorHandler);

  gulp
    .src('./build/js/**/*')
    .pipe(gulp.dest('./build-laravel/cdn/js/'))
    .on('error', errorHandler);

  gulp
    .src('./build/css/**/*')
    .pipe(gulp.dest('./build-laravel/cdn/css/'))
    .on('error', errorHandler);

  // html
  // master.blade.php
  gulp
    .src('./libs/laravel/master.blade.php')
    .pipe(
      fileinclude({
        prefix: '@@',
      })
    )
    .pipe(gulp.dest('./build-laravel/resources/views/frontend/'))
    .on('error', errorHandler);

  // other page views php 
  var mainElement = "", allContent = "";
  gulp.src(['./build/*.html', '!./build/index.html'])
    .pipe(cheerio({
      run: function ($) {
        mainElement = $.html($('main')).toString()
        // console.log(mainElement);
        $.root().html(mainElement)
      },
      parserOptions: { decodeEntities: false }
    }))
    // .pipe(replace(allContent, mainElement))
    // .pipe(replace("<!doctype html>", ""))
    // .pipe(replace("<html class=\"no-js\" lang>", ""))
    // .pipe(replace("</html>", ""))
    .pipe(rename(function (file) {
      file.dirname = path.join(file.dirname, file.basename);
      file.basename = 'index.blade';
      file.extname = '.php';
    }))
    .pipe(gulp.dest('./build-laravel/resources/views/frontend/'))
    .on('error', errorHandler);

  // images
  return gulp
    .src('./build/images/**/*')
    .pipe(gulp.dest('./build-laravel/cdn/images/'))
    .on('error', errorHandler)
    .on('end', taskCallback);
};

gulp.task('clean-laravel-build', function () {
  return gulp.src('./build-laravel', { read: false, allowEmpty: true }).pipe(clean())
})

module.exports = {
  build: gulpTaskBuildLaravel
}