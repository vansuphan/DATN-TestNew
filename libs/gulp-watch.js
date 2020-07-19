// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var chalk = require('chalk');
var CleanCSS = require('gulp-clean-css'); // Minify the CSS (UPDATED TO LATEST)!
var autoprefixer = require('gulp-autoprefixer'); // Auto prefixe CSS
var gulpImage = require('gulp-image'); // gulp-image
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify-es').default;
var fs = require('fs-extra');
var del = require('del');
var flatten = require('gulp-flatten')

// import dependencies 
var errorHandler = require('./error-handler')
var gulpHtml = require('./gulp-html')

// get configuration
var config = require('./gulp-config')
var dir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync
var frameworkName = config.frameworkName

// constructor

var watchDir;
var syncHtmlInt;
var isScanningComplete = false;
var countScannedFolder = 0;
var totalScannedFolder = 4;

function watchError() {
  console.log('watcher -> error');
}

function watchPartialsHtml(path) {
  // console.log(path);

  if (
    path.indexOf('assets/js/digitop/polyfills.js') > -1
    || path.indexOf('assets/js/digitop/loader.js') > -1
    || path.indexOf('assets/css/main.css') > -1
  ) {
    gulpHtml.htmlTask();
    return;
  }
}


function watch(directory, callback) {
  // console.log('startWatching:', dir);
  watchDir = directory;
  // var chokOptions = {
  //   usePolling: true,
  // };

  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));

  var watchers = [
    gulp.watch('src/**/*.html', gulp.series('html')),
    // gulp.watch('src/assets/css/**/*'),
    // gulp.watch('src/assets/js/**/*'),
    // gulp.watch('src/assets/images/**/*'),
    gulp.watch('src/assets/**/*')
  ]
  totalScannedFolder = watchers.length

  watchers.forEach(watcher => {
    watcher.on('ready', checkScanningComplete);
    watcher.on('error', watchError);
    watcher.on('all', onChokChange);
  })
  // -- END --
}

function checkScanningComplete() {
  countScannedFolder++;
  // console.log(countScannedFolder, totalScannedFolder)
  if (countScannedFolder >= totalScannedFolder) {
    isScanningComplete = true;
    console.log(frameworkName + chalk.yellow(' DIGIFAST (v' + config.frameworkVersion + ') IS READY NOW. Happy Coding, Buddy!'));
    // Create virtual local server:
    browserSync.init({ ui: false, server: { baseDir: watchDir } });
    browserSync.notify("<span color='yellow'>First run: scanning the source code, please wait...</span>", 10000);
  }
}

function onChokChange(event, eventPath) {
  eventPath = eventPath.replace(/\\/g, '/');
  if (
    getFileName(eventPath).indexOf('.') == -1 ||
    getFileName(eventPath)[0] == '.' ||
    getFileName(eventPath) == 'Icon?'

  ) return;

  //  console.log ('onChokChange:', event, eventPath);
  if (!isScanningComplete) return;

  if (eventPath.indexOf('.DS_Store') < 0) {
    // ko cần execute nếu là file này
    // console.log (event, eventPath);
    //return;

    // when html in "common" change:
    if (eventPath.indexOf('partials/') > -1) {
      gulpHtml.htmlTask();
      return;
    }

    // Simulating the {base: 'src'} used with gulp.src in the scripts task
    var relativePath = path.relative(path.resolve('src'), eventPath);
    var pathToSrc = path.resolve('src', relativePath);
    var pathToDebug = path.resolve('debug', relativePath);
    var pathToBuild = path.resolve('build', relativePath);
    // console.log(relativePath, pathToBuild, pathToDebug)

    // create new directory
    if (event == 'addDir') {
      //console.log(event + ":", eventPath);
      try {
        fs.ensureDirSync(pathToDebug);
        fs.ensureDirSync(pathToBuild);
      } catch (e) { }
    }

    // remove a directory
    if (event == 'unlinkDir') {
      fs.removeSync(pathToDebug);
      fs.removeSync(pathToBuild);
    }

    // file added or changed
    // console.log(event)
    // event == 'add'
    if (event == 'change' || event == 'add') {
      var ext = getFileExtension(eventPath);
      try {
        // Minify JS & CSS, the rest is just copying:
        if (ext == 'js') {
          if (eventPath.indexOf('js/bundle') > -1) {
            bundleAndExportJS();
          } else {
            minifyAndExportJS(eventPath, pathToDebug, pathToBuild);
          }
        } else if (ext == 'css') {
          minifyAndExportCSS(eventPath, pathToDebug, pathToBuild);
        } else if (ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'svg') {
          copyFileAndMoveTo(eventPath, pathToDebug, pathToBuild);

          //  minifyAndExportImage(eventPath, pathToDebug, pathToBuild);
        } else {
          copyFileAndMoveTo(eventPath, pathToDebug, pathToBuild);
        }
      } catch (e) {
        console.log('Something wrong:' + e.message);
      }
    }

    // Delete file...
    if (event == 'unlink') {
      //console.log(event + ":", eventPath);
      if (fs.existsSync(pathToDebug)) {
        del.sync(pathToDebug);
        console.log(frameworkName + " Deleted file '" + chalk.blue(eventPath) + "' from DEBUG completely.");
      }
      if (fs.existsSync(pathToBuild)) {
        del.sync(pathToBuild);
        console.log(frameworkName + " Deleted file '" + chalk.blue(eventPath) + "' from BUILD completely.");
      }
      // reload browser
      browserSync.reload();
    }
    // end onChokChange
  }
}

function minifyAndExportCSS(srcFilePath, pathToDebug, pathToBuild) {
  var fileName = chalk.blue(getFileName(srcFilePath));
  console.log(frameworkName + ' Minifying CSS: ' + chalk.blue(fileName));
  browserSync.notify("<span color='yellow'>Minifying CSS, please wait!</span>", 5000);

  var debugFileDir = (pathToDebug.indexOf("\\") > -1) ? pathToDebug.substring(0, pathToDebug.lastIndexOf("\\")) : pathToDebug.substring(0, pathToDebug.lastIndexOf("/"));
  var buildFileDir = (pathToBuild.indexOf("\\") > -1) ? pathToBuild.substring(0, pathToBuild.lastIndexOf("\\")) : pathToBuild.substring(0, pathToBuild.lastIndexOf("/"));

  var options = { debug: true, compatibility: '*', level: 2 }

  gulp
    .src(srcFilePath)
    .pipe(flatten())
    .pipe(wait(500))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'], cascade: false }))
    .pipe(gulp.dest(debugFileDir))
    .pipe(CleanCSS(options))
    .on('error', errorHandler)
    .pipe(gulp.dest(buildFileDir))
    .on('error', errorHandler)
    .on('end',
      function () {
        writeLog(pathToDebug, pathToBuild);

        console.log("complete minifyAndExportCSS");
        watchPartialsHtml(srcFilePath);
      }
    )
}

function bundleAndExportJS() {
  console.log(frameworkName + ' Concatting JS files...');
  browserSync.notify("<span color='yellow'>Concatting JS files, please wait!</span>", 5000);

  try {
    gulp
      .src('src/assets/js/bundle/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('debug/assets/js/bundle/'))
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/js/bundle/'))
      .on('end', writeLog);
  } catch (e) {
    //--
  }

  function writeLog() {
    console.log(frameworkName + " Bundled JS: 'all.js'");
    browserSync.reload();
  }

  //console.log("Minified JS: " + srcFilePath);
}

function minifyAndExportJS(srcFilePath, pathToDebug, pathToBuild) {
  console.log(frameworkName + ' Minifying JS: ' + chalk.blue(getFileName(srcFilePath)));
  browserSync.notify("<span color='yellow'>Minifying JS, please wait!</span>", 5000);

  var debugFileDir = (pathToDebug.indexOf("\\") > -1) ? pathToDebug.substring(0, pathToDebug.lastIndexOf("\\")) : pathToDebug.substring(0, pathToDebug.lastIndexOf("/"));
  var buildFileDir = (pathToBuild.indexOf("\\") > -1) ? pathToBuild.substring(0, pathToBuild.lastIndexOf("\\")) : pathToBuild.substring(0, pathToBuild.lastIndexOf("/"));
  // console.log(debugFileDir, buildFileDir)
  try {
    gulp
      .src(srcFilePath)
      .pipe(flatten())
      // .pipe(wait(100))
      .pipe(gulp.dest(debugFileDir))
      .pipe(uglify({ warnings: true }))
      .on('error', errorHandler)
      .pipe(gulp.dest(buildFileDir))
      .on('end',
        function () {
          watchPartialsHtml(srcFilePath);
          writeLog(pathToDebug, pathToBuild);
        }
      )
  } catch (e) {
    //--
  }
  //console.log("Minified JS: " + srcFilePath);
}

function minifyAndExportImage(srcFilePath, pathToDebug, pathToBuild) {
  var debugFileDir = (pathToDebug.indexOf("\\") > -1) ? pathToDebug.substring(0, pathToDebug.lastIndexOf("\\")) : pathToDebug.substring(0, pathToDebug.lastIndexOf("/"));
  var buildFileDir = (pathToBuild.indexOf("\\") > -1) ? pathToBuild.substring(0, pathToBuild.lastIndexOf("\\")) : pathToBuild.substring(0, pathToBuild.lastIndexOf("/"));
  var options = {
    // PNG compress:
    pngquant: true, optipng: false, zopflipng: false,
    // JPG compress:
    jpegRecompress: false, mozjpeg: true, guetzli: false,
    // GIF & SVG compress:
    gifsicle: true, svgo: true,
    // How many images at the time?
    concurrent: 3,
    // Print the logs:
    // quiet: true
  }

  gulp
    .src(srcFilePath)
    .pipe(wait(500))
    .pipe(flatten())
    .pipe(gulp.dest(debugFileDir))
    // Use GULP-IMAGE:
    .pipe(gulpImage(options))
    .pipe(gulp.dest(buildFileDir))
    .on('error', errorHandler)
    .on('end', function () {
      browserSync.reload();
    });
}

function copyFileAndMoveTo(srcFilePath, pathToDebug, pathToBuild) {
  var fileName = chalk.blue(getFileName(srcFilePath));
  console.log(frameworkName + " Copying file '" + chalk.blue(fileName) + "' to DEBUG...");

  var debugFileDir = (pathToDebug.indexOf("\\") > -1) ? pathToDebug.substring(0, pathToDebug.lastIndexOf("\\")) : pathToDebug.substring(0, pathToDebug.lastIndexOf("/"));
  var buildFileDir = (pathToBuild.indexOf("\\") > -1) ? pathToBuild.substring(0, pathToBuild.lastIndexOf("\\")) : pathToBuild.substring(0, pathToBuild.lastIndexOf("/"));

  gulp
    .src(srcFilePath)
    // .pipe(wait(200))
    .pipe(flatten())
    .pipe(gulp.dest(debugFileDir))
    .pipe(gulp.dest(buildFileDir))
    .on('error', errorHandler)
    .on('end', function () {
      console.log(frameworkName + " File '" + chalk.blue(srcFilePath) + "' was copied to DEBUG & BUILD successfully!");
      browserSync.reload();
    });
}

function getFileExtension(path) {
  var _arr = path.split('.');
  var ext = _arr[_arr.length - 1];
  return ext;
}

function getFileName(path) {
  return path.substring(path.indexOf("\\") > -1 ? path.lastIndexOf("\\") + 1 : path.lastIndexOf("/") + 1, path.length)
}

function writeLog(pathToDebug, pathToBuild) {
  var oldStats = fs.statSync(pathToDebug);
  var oldSize = Math.round(oldStats.size / 1024 * 100) / 100;
  var newStats = fs.statSync(pathToBuild);
  var newSize = Math.round(newStats.size / 1024 * 100) / 100;
  var optimizedRate = Math.round((1 - newSize / oldSize) * 100 * 100) / 100;
  var fileName = chalk.blue(getFileName(pathToDebug));
  var savedStr = chalk.green('-' + optimizedRate + '%');
  console.log(frameworkName + " Minified: '" + fileName + "' - Saved: " + savedStr + ' (' + chalk.hex('#999999')(oldSize + ' kB') + ' -> ' + newSize + ' kB)');
  // reload browser...
  browserSync.reload();
}

module.exports = watch