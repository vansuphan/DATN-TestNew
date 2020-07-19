// SAMSUNG TASK - Put everything in HTML file
// var samsungTasks = ['convertFonts', 'sass', 'css', 'html', 'compileScripts', 'assets', 'fonts', 'compressImages'];
// var samsungTasks = ['styleSamsungTask', 'copyStaticFilesSamsungTask'];
var curTaskDone = 0;
var totalTaskDone = 5;
var styleSamsungTask = function () {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(wait(500))
    .pipe(
      plumber({
        errorHandler: errorHandler,
      })
    )
    .pipe(sass())
    .on('error', errorHandler)
    .pipe(gulp.dest('./src/css'))
    .on('end', function () {
      // copy compiled CSS to debug
      gulp
        .src('./src/css/**/*.css')
        .pipe(
          autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false,
          })
        )
        .pipe(gulp.dest('./debug/css'))
        .on('end', checkTaskDone);
    });
};
gulp.task('styleSamsungTask', styleSamsungTask);

var copyStaticFilesSamsungTask = function () {
  gulp
    .src('./src/js/**/*')
    .pipe(gulp.dest('./debug/js/'))
    .on('error', errorHandler)
    .on('end', checkTaskDone);

  gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest('./debug/assets/'))
    .pipe(gulp.dest('./samsung-debug/assets/'))
    .on('error', errorHandler)
    .on('end', checkTaskDone);

  gulp
    .src('./debug/fonts/**/*')
    .pipe(gulp.dest('./samsung-debug/fonts/'))
    .on('error', errorHandler)
    .on('end', checkTaskDone);

  return gulp
    .src('./src/images/**/*')
    .pipe(gulp.dest('./debug/images/'))
    .pipe(gulp.dest('./samsung-debug/images/'))
    .on('error', errorHandler)
    .on('end', checkTaskDone);
};
gulp.task('copyStaticFilesSamsungTask', copyStaticFilesSamsungTask);

var samsungTasks = gulp.series(
  'styleSamsungTask',
  'copyStaticFilesSamsungTask'
);

// var scriptSamsungTask = function(){
//   gulp.src('./src/js/**/*.js')
//     .pipe(gulp.dest('./debug/js/'))
//     .pipe(gulp.dest('./samsung-debug/js'))
//     .on('error', errorHandler)
//     .on('end', checkTaskDone);
// };
// gulp.task('scriptSamsungTask', scriptSamsungTask);

function checkTaskDone() {
  curTaskDone++;
  // console.log("-> curTaskDone: " + curTaskDone);
  if (curTaskDone == totalTaskDone) {
    // console.log("All tasks are DONE!");
    watchSamsungDir();
  }
}

gulp.task('samsung', samsungTasks);

// Task to build HTML pages for SAMSUNG:
var gulpTaskBuildHtmlSamsung = function (callback) {
  gulp
    .src('./samsung-debug/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        preserveLineBreaks: true,
        minifyCSS: true,
        minifyJS: true,
        // removeComments: true
      })
    )
    .on('error', errorHandler)
    .pipe(gulp.dest('./samsung-build/'))
    .on('end', taskCallback);

  gulp
    .src('./src/assets/**/*')
    .pipe(gulp.dest('./samsung-build/assets/'))
    .on('error', errorHandler);
  // .on('end', checkTaskDone);

  gulp
    .src('./debug/fonts/**/*')
    .pipe(gulp.dest('./samsung-build/fonts/'))
    .on('error', errorHandler);
  // .on('end', checkTaskDone);

  return gulp
    .src('./src/images/**/*')
    .pipe(gulp.dest('./samsung-build/images/'))
    .on('error', errorHandler);
  // .on('end', checkTaskDone);

  function taskCallback() {
    console.log(
      frameworkName + ' -> SAMSUNG HTML files were built successfully!'
    );
    // callback function:
    if (callback) callback();
  }
};

gulp.task('samsung-build', gulpTaskBuildHtmlSamsung);

function watchSamsungDir() {
  // get list of CSS & JS files to inject into HTML files:
  var mainJsContent = fs.readFileSync('src/js/main.js', 'utf8');
  mainJsContent = mainJsContent.substring(
    0,
    mainJsContent.indexOf('var GLoader')
  );

  // console.log(mainJsContent);
  var indexes = [];
  var files = [];
  // search css files:
  var startIndex = 0;
  searchForFiles('css');
  // search js files:
  startIndex = 0;
  searchForFiles('js');

  // check file existed & remove:
  var tmpFiles = [];
  for (var i = 0; i < files.length; i++) {
    var fileSrcUrl = 'debug/' + files[i];
    if (fs.existsSync(fileSrcUrl)) {
      tmpFiles.push(fileSrcUrl);
    }
  }
  files = tmpFiles.slice();
  // console.log(files);

  // get html files
  var htmlFiles = [];
  fs.readdirSync('debug').forEach(file => {
    if (file.indexOf('.html') > -1 && file.indexOf('index.html') == -1) {
      htmlFiles.push(file);
    }
  });
  // console.log(htmlFiles);

  var curInjectedCount = 0;
  var totalInjectedCount = htmlFiles.length;
  for (i = 0; i < htmlFiles.length; i++) {
    insertScriptsIntoHtml(htmlFiles[i]);
  }

  function insertScriptsIntoHtml(htmlFile) {
    var htmlContent = fs.readFileSync('debug/' + htmlFile, 'utf8');
    var indexOfBodyEnd = htmlContent.indexOf('</body>');
    var contentOfBody = htmlContent.substring(0, indexOfBodyEnd);
    var i;

    // Remove "/js/main.js":
    // contentOfBody = contentOfBody.replace('<script src="js/main.js" defer></script>', '');
    // contentOfBody = contentOfBody.replace('<script src="js/main.js"></script>', '');

    // Remove all <script> tag:
    var scriptTags = getAllStringsFromTo(
      contentOfBody,
      '<script src=',
      '</script>',
      true
    );
    for (i = 0; i < scriptTags.length; i++) {
      var scriptTag = scriptTags[i];
      contentOfBody = contentOfBody.replace(scriptTag, '');
    }

    for (i = 0; i < files.length; i++) {
      var fileSrcUrl = files[i];
      var fileSrcType = fileSrcUrl.indexOf('.css') > -1 ? 'css' : 'js';
      var fileContent = fs.readFileSync(fileSrcUrl, 'utf8');

      contentOfBody += '\n  ';
      contentOfBody += '\n  <!-- From: ' + fileSrcUrl + ' -->';

      if (fileSrcType == 'css') {
        // remove "../":
        fileContent = fileContent.replace(
          new RegExp('../fonts', 'g'),
          'fonts'
        );
        contentOfBody += '\n  <style>';
      } else {
        contentOfBody += '\n  <script type="text/javascript">';
      }

      contentOfBody += '\n  ' + fileContent;

      if (fileSrcType == 'css') {
        contentOfBody += '\n  </style>';
      } else {
        contentOfBody += '\n  </script>';
      }

      contentOfBody += '\n  ';
    }

    // Inject {page} & get ID of <main> and call {page}.init():
    var shouldCallJsInit = htmlContent.indexOf('<main id="') > -1;
    if (shouldCallJsInit) {
      var idOfMainTag = getStringFromTo(htmlContent, '<main id="', '"');
      // htmlContent.substring(htmlContent.indexOf('<main id="') + 10, htmlContent.indexOf('"', htmlContent.indexOf('<main id="') + 10));
      console.log('idOfMainTag: ' + idOfMainTag);

      if (idOfMainTag) {
        contentOfBody +=
          '\n  <!-- PAGE INIT: /js/pages/' + idOfMainTag + '.js -->';
        contentOfBody += '\n  <script type="text/javascript">';

        var mainJsContent = fs.readFileSync(
          'debug/js/pages/' + idOfMainTag + '.js',
          'utf8'
        );
        contentOfBody += '\n  ' + mainJsContent;
        contentOfBody += '\n  ' + idOfMainTag + '.init();';
        contentOfBody += '\n  </script>';
      }
    }

    // end HTML:
    contentOfBody += '\n</body>\n</html>';

    fs.ensureFileSync('samsung-debug/' + htmlFile);
    fs.writeFileSync('samsung-debug/' + htmlFile, '');
    fs.writeFileSync('samsung-debug/' + htmlFile, contentOfBody);

    // Start a server:
    checkInjectionDone();
  }

  function searchForFiles(type) {
    var index = mainJsContent.indexOf('"' + type.toLowerCase(), startIndex);

    if (index > -1) {
      var endIndex = mainJsContent.indexOf(
        '.' + type.toLowerCase() + '"',
        index + 1
      );
      var fileUrl = mainJsContent.substring(
        index + 1,
        endIndex + type.length + 1
      );

      files.push(fileUrl);
      indexes.push(index);

      startIndex = index + 1;
      searchForFiles(type);
    }
  }

  function checkInjectionDone() {
    curInjectedCount++;
    if (curInjectedCount >= totalInjectedCount) {
      var samsungDebugDir = path.resolve('samsung-debug');
      generateIndex(samsungDebugDir);

      browserSync.init({
        ui: false,
        server: {
          baseDir: 'samsung-debug',
        },
      });
    }
  }
}

function getAllStringsFromTo(content, fromStr, toStr, isIncludeStartAndEnd) {
  if (!isIncludeStartAndEnd) isIncludeStartAndEnd = false;
  var arr = [];
  var si = 0;
  var t = getAmountOfString(fromStr, content);

  for (var i = 0; i < t; i++) {
    var indexOfFromStr = isIncludeStartAndEnd
      ? content.indexOf(fromStr, si)
      : content.indexOf(fromStr, si) + fromStr.length;
    var indexOfToStr = isIncludeStartAndEnd
      ? content.indexOf(toStr, indexOfFromStr) + toStr.length
      : content.indexOf(toStr, indexOfFromStr);
    var word = content.substring(indexOfFromStr, indexOfToStr);
    var wordIndex = content.indexOf(word);
    arr.push(word);
    si = wordIndex + 1;
  }

  return arr;
}

function getStringFromTo(content, fromStr, toStr, isIncludeStartAndEnd) {
  if (!isIncludeStartAndEnd) isIncludeStartAndEnd = false;
  var indexOfFromStr = isIncludeStartAndEnd
    ? content.indexOf(fromStr)
    : content.indexOf(fromStr) + fromStr.length;
  var indexOfToStr = isIncludeStartAndEnd
    ? content.indexOf(toStr, indexOfFromStr) + toStr.length
    : content.indexOf(toStr, indexOfFromStr);
  var str = content.substring(indexOfFromStr, indexOfToStr);
  return str;
}

function getAmountOfString(str, inContent) {
  var regex = new RegExp(str, 'g');
  var count = (inContent.match(regex) || []).length;
  return count;
}