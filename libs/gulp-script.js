// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify-es').default;
var using = require('gulp-using') // print filename :P
const globby = require('globby');
const ProgressCLI = require('cli-progress');

var javascriptObfuscator = require('gulp-javascript-obfuscator-nothrow');


// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var dir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync

const listAllFilesAndDirs = dir => globby(`${dir}/**/*.js`);

// constructor
var concatScripts = function () {
  return gulp
    .src('./src/assets/js/bundle/*.js')
    .pipe(concat('all.js'))
    .pipe(stripDebug())
    .pipe(gulp.dest(path.resolve(dir.debug, 'assets/js/bundle')))
    .pipe(uglify())
    .pipe(gulp.dest(path.resolve(dir.build, 'assets/js/bundle')))
    .on('end', function () {
      console.log("All scripts are bundled into 'assets/js/bundle/all.js'");
    });
};

var copyScriptTask = function () {
  return gulp.src('./src/assets/js/**/*')
    .pipe(gulp.dest(path.resolve(dir.debug, 'assets/js')))
    .pipe(browserSync.reload({ stream: true }));
};

var compileScriptsTask = function () {

  var count = 0

  return gulp
    .src('./src/assets/js/**/*.js')
    .pipe(uglify())
    // .pipe(using({ prefix: "Compressed file:", filesize: true }))
    .pipe(gulp.dest(path.resolve(dir.build, 'assets/js')))
    .on('error', errorHandler)
    .on('data', function (data) {
      count++
      console.log("compiling script... " + count)
    })
    .on("end", function () {
      // console.log('end');
    })
    .on("finish", function () {

      console.log('');

    });
};



var optionsJavascriptObfuscator = {
  compact: true,
  unicodeEscapeSequence: false,
  transformObjectKeys: true,
  stringArray: true,
  stringArrayEncoding: 'base64',
  stringArrayThreshold: 0.3,
  rotateStringArray: true,
  identifierNamesGenerator: 'hexadecimal',
  sourceMap: false,
  renameGlobals: false
};

var obfuscatorScriptInPages = function () {
  return gulp
    .src(['./src/assets/js/*.js', './src/assets/js/!(vendor)/**/*.js'])
    .pipe(uglify({ warnings: 'verbose' }))
    .pipe(gulp.dest('./build/assets/js/'))
    .pipe(javascriptObfuscator(optionsJavascriptObfuscator))
    .pipe(gulp.dest('./build/assets/js-obfuscator/'))
    .on('end', function () {
      console.log('All scripts were obfuscator.');
    });
};
module.exports = {
  concat: concatScripts,
  copy: copyScriptTask,
  compress: compileScriptsTask,
  obfuscatorScriptInPages: obfuscatorScriptInPages,
}

// function (dir, cb) {
//   outputDir = dir
//   taskCallback = cb


// }