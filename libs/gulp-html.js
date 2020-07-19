// import libraries
var gulp = require('gulp'); // Require gulp
var path = require('path');
var fileinclude = require('gulp-file-include'); // html include
var gulpif = require('gulp-if');
var rename = require("gulp-rename");
var through = require('through2')
var generateIndex = require('./generate-index');

// import dependencies 
var errorHandler = require('./error-handler')
var config = require("./gulp-config");

// get configuration
var dir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync
var callback

function replaceTagImgLazysize(chunk, enc, cb) {

  var fileContent = chunk.contents.toString();
  var currentIndex = -1;

  function replaceSrcInImg() {

    currentIndex = fileContent.indexOf("<img", currentIndex + 1);

    if (currentIndex <= -1) return;

    var imgTagString = fileContent.substring(currentIndex, fileContent.indexOf('>', (currentIndex + 4)) + 1)
    var newImgTag = fileContent.substring(currentIndex, fileContent.indexOf('>', (currentIndex + 4)) + 1);

    var indexClassName = imgTagString.indexOf('class');
    if (indexClassName > -1) {
      // have class

      // Check no had lazyload
      var indexCLassLazyload = imgTagString.indexOf('lazyload');
      if (indexCLassLazyload == -1) {
        newImgTag = newImgTag.replace(`class="`, `class="lazyload `);
        newImgTag = newImgTag.replace(`class='`, `class='lazyload `);
      }

    } else {
      // tag no had class 
      if (newImgTag.indexOf("/>") > -1) {
        newImgTag = newImgTag.replace("/>", ` class="lazyload"/>`)
      } else {
        newImgTag = newImgTag.replace(">", ` class="lazyload">`)
      }

    }

    var indexDataSrc = imgTagString.indexOf('data-src');
    if (indexDataSrc > -1) {

    } else {

      newImgTag = newImgTag.replace(" src=", " data-src=")

    }

    fileContent = fileContent.replace(imgTagString, newImgTag);

    replaceSrcInImg();
  }

  replaceSrcInImg();

  addLazyTag(fileContent);

  // chunk.contents = new Buffer(fileContent);
  chunk.contents = new Buffer.from(fileContent);

  this.push(chunk);

  cb(null, chunk)
}

function addLazyTag(fileContent) {
  var lazyCustom = 'lazyloadCustom.js';
  if (fileContent.indexOf(lazyCustom) > -1) {
    return;
  }
  var lazyTag = `<script type="text/javascript" async src="assets/js/vendor/lazysizes/lazysizes.min.js"></script>`
  var indexLazyScipt = fileContent.indexOf(lazyTag);
  if (indexLazyScipt <= -1) {
    fileContent = fileContent.replace(`<script type="text/javascript"`, `${lazyTag}\n\t<script type="text/javascript"`)
  }
}

// constructors
function gulpTaskForHtml(cb) {
  //console.log('gulpTaskForHtml')
  return (
    gulp
      .src('./src/*.html')
      // include partials
      .pipe(fileinclude({ prefix: '@@' }))
      .pipe(through.obj(replaceTagImgLazysize))
      //.pipe(minifyHTML())
      .pipe(gulp.dest(dir.debug))
      // rename index file for build
      .pipe(gulpif('**/template.html', rename({ basename: "index" })))
      .pipe(gulpif('**/home.html', rename({ basename: "index" })))
      .pipe(gulpif('**/homepage.html', rename({ basename: "index" })))
      .pipe(gulpif('**/trangchu.html', rename({ basename: "index" })))
      .pipe(gulpif('**/trang-chu.html', rename({ basename: "index" })))
      //.pipe(cache('cache'))
      .pipe(gulp.dest(dir.build))
      .on("finish", function () {
        //console.log("HTML FINISHED")
        // if (cb) cb()
      })
      .on("end", function () {
        //console.log("generateIndex")
        generateIndex(dir.debug);
      })
      .on('error', errorHandler)
  );
};

function onGulpTaskForHtml() {
  // //console.log("!");
  gulpTaskForHtml();
}
// gulp.task('generate-html', gulpTaskForHtml)

module.exports = {
  html: function (cb) {
    // //console.log("!!!!");
    callback = cb;

    //console.log(callback)
    return gulpTaskForHtml
  },
  htmlTask: onGulpTaskForHtml
}

// module.exports = {
//   html: onGulpTaskForHtml
// }

// module.exports = {
//   // html: function (cb) {
//   //   // callback = cb;

//   //   return gulpTaskForHtml(cb)
//   // },
//   // html: gulpTaskForHtml,
//   // compress: compressCssTask
// }
