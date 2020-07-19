// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var gulpImage = require('gulp-image'); // gulp-image
var chalk = require('chalk');
var _if = require('gulp-if')

// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var outputDir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync
var frameworkName = config.frameworkName

// constructor
var copyAssetsTask = async function () {

  return (
    gulp
      .src('./src/assets/**/*')
      .pipe(gulp.dest('./debug/assets'))
      // Use GULP-IMAGE:
      // .pipe(_if(["**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.gif", "**/*.svg"], gulpImage({
      //   // PNG compress:
      //   pngquant: true,
      //   optipng: false,
      //   zopflipng: false,
      //   // JPG compress:
      //   jpegRecompress: false,
      //   mozjpeg: true,
      //   guetzli: false,
      //   // GIF & SVG compress:
      //   gifsicle: true,
      //   svgo: true,
      //   // How many images at the time?
      //   concurrent: 3,
      //   // Print the logs:
      //   quiet: true
      // })))
      .pipe(gulp.dest('./build/assets'))
      .on('error', errorHandler)
      .on('finish', function () {
        // console.log(frameworkName + chalk.blue(' "/assets"') + ' was synced completely.');
      })
  );
};

module.exports = {
  copy: copyAssetsTask
}