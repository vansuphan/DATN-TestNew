// import libraries
var path = require('path');
var wait = require('gulp-wait'); // Wait before next
var using = require('gulp-using') // print filename :P
var gulpImage = require('gulp-image'); // gulp-image
// var imagemin = require('gulp-imagemin'); // Minify images
const globby = require('globby');
const ProgressCLI = require('cli-progress');

// import dependencies 
var errorHandler = require('./error-handler')

// get configuration
var config = require('./gulp-config')
var outputDir = config.dir
var gulp = config.gulp
var browserSync = config.browserSync

// constructor

const listAllFilesAndDirs = dir => globby([`${dir}/**/*.jpg`, `${dir}/**/*.jpeg`, `${dir}/**/*.png`, `${dir}/**/*.gif`, `${dir}/**/*.svg`]);

// 2018-08-11: Turn off for Windows performance optimization
// TinyPNG Licenses:
// var keyId = 0;
// var tinifyKeys = ["Hi2uw_dMoQ-KVj2dRhmRIqu5uAYPBxfe", "k4-JHNwzo_FQ19L6Esqu410mPlU-t6AV", "k1F9qDtzkBc_y7J9WFVkJ_fQa_uTUQ27", "zQqn3G1JnbGaTqOakEXsRJ5YbnfezPMP","MDh8hTaQ9T0yI9gvsaZP6Lg6e7lyty_m","TbACUv6YaQkWJHcFMg58C_aMO-NHsZrg","ODtIMa5BQO6aCo2pBf7Rr6ckFpqD5tWS","19GvxEdKHXgh1VY57SGbYlYlOCLJXbL5","FYs6UtZWivDP5hyR9Ah0B2K5MbqE9gG4","xCTyAjwvfHEzsQgB3EQtV9NjW-DrM7Ls","02Ddy7lU8cip4OoSUCVKhX1R9NYyEEg9","mogvLTu3D9d7N-impQx4x5C1-sRygGnB","TYFWQ4bSjiLocPmi1wspzDm-7toE53xs","ez8G3b8HpgFB8jER8ToU_qLy6c9ZwsAF","QcSq-7b-gjpPUYrzcMRC4wFlXWNWWB5E","SQUu1J9kZtPr1jXIrMH4jAH4g_pbKGYc","-FbQ_wAEdiW9iOG5esb76YiroBe_8Dwy","alTIg10DpvnD9wiheHw0JozemFeGoSad","BhwgtJLj9SoktGsWqft1N8EO1pIRqYm6","9ZvfmWcotCUA5XOqj0pInJxyUHEuHcru","mQ0_4YzSHXacWykKioDtemY8sgUED1kF","pWFJJnrqQNVJlOLHyU_PWzTa_LFyCVTs","I5VctbVXpWvBkjkIbcUBDT6j4I_KR1-D","kmCPD9t-NHucE9ZURUCw74YZueNm9VX6","wElEZFp26-6DUiWPrtxi7DV_hDLdMFH-","G92PTY8U8CNaWOtz21ehR0uwUkSLUuTb","9ADItvxBBv1uFNJORJzW6aJROmj4PSSX","J_SqF7YEBRYfz3Fwy5GLfZOyQoorxUb4","YxpvoiF2-4vrHhtm31uKyF5R146k11P1","80EgmGqFDIgqnFG6rx0hxPA812f8nGqf","0cCoExOkI3NOuUGn33NgKSeuUPDoy-SA","XjbTO3I2MEYkLhND3VA0evdjfg98qVm0","iTMiO4t826Fk7foWG1rbD8s1M4WS8tYt","ize_7w6oUYOSklTIlI8YfRAq7FogaBx6","Vf3s_EN2WZ29kjrd8JX8r9qiKvb7rOiG","--QiguTk_fTOKv8CvUa1TiA_z4wFnVt8","1IAa8X3Mn1n4cVqNrAGy9PAa0hQlAXLy","b88hMEGqXDjl6R0tI1KvwVS6HngTpd8-","7NmcLgv874GyMSZxTxVA40w5Boj9s9li","xxNoyu-pDu6ikmWKBLMG6DF3SQNhujph","mkWR4NGZ3b1NI18tkJK0lJkOVyDcu8JU","3dRtrTms73CBEfO4Cm2pAr9cel55Z2oz","Vf3s_EN2WZ29kjrd8JX8r9qiKvb7rOiG","OVIv__U4QVsqOL5Gz3zhvi33ALEmRqZl","jLEqyutENQO08vSoHiWb_Z5upVRA_xZW","Cm4OwFOYI0mM_EZK9gogu2NMPAQbaBK_","Bs3UmWkV1kCTuYInCEG-eP6j6kwtcrYv","RcwqiDVz-qfjgz5YI_B8Y8sGPBVmVv9m","yuBekcICOCiHFvQ5Zht9wby6n44optOs","kPSyXSc8_1yDjXftWrHFCo0_t69OAGHQ","EtZ1NiOV0Eo0qDGXShtACK_tO5uuzVki","TTMhPr11fzMO7WAuSjmio3LNKzOoa42X"];
// shuffle(tinifyKeys);
// tinify.key = tinifyKeys[keyId];

var copyImageTask = async function () {
  // 
  return gulp
    .src(['./src/assets/**/*.jpg', './src/assets/**/*.jpeg', './src/assets/**/*.png', './src/assets/**/*.gif', './src/assets/**/*.svg'])
    .pipe(gulp.dest('./debug/assets'))
    .pipe(gulp.dest('./build/assets'))
    // .pipe(using({ prefix: "Copied file:", filesize: true }))
    .on('error', errorHandler)
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

var compressImageTask = async function (callback) {
  
  var files = await listAllFilesAndDirs("./src/assets")
  // console.log(files.length)
  // console.log(files)
  console.log('start');
  var count = 0
  // var progressBar = new ProgressCLI.SingleBar({}, ProgressCLI.Presets.shades_classic)
  // progressBar.start(files.length, count);

  return await (
    gulp
      .src(['./src/assets/**/*.jpg', './src/assets/**/*.jpeg', './src/assets/**/*.png', './src/assets/**/*.gif', './src/assets/**/*.svg'])
      // Use TINYPNG (BEST / BUT SLOW)
      // .pipe(gulpTinify(randomTinyKey))
      //.on('error', errorHandler)
      // Use GULP-IMAGE:
      .pipe(
        gulpImage({
          // PNG compress:
          pngquant: true,
          optipng: false,
          zopflipng: false,
          // JPG compress:
          jpegRecompress: false,
          mozjpeg: true,
          guetzli: false,
          // GIF & SVG compress:
          gifsicle: true,
          svgo: true,
          // How many images at the time?
          concurrent: 3,
          // Print the logs:
          quiet: true
        })
      )
      .pipe(gulp.dest('./build/assets'))
      // .pipe(using({prefix: 'Compressed file'}))
      .on('error', errorHandler)
      .on('data', function (data) {
        count++

        if (count == 1) {
          progressBar = new ProgressCLI.SingleBar({}, ProgressCLI.Presets.shades_classic)
          progressBar.start(files.length, count);
        }
        // console.log("counting..." + count)
        progressBar.update(count);
        // if(count >= files.length){
        //   progressBar.stop();
        // }
      })
      .on("end", function () {
        console.log('end');
        progressBar.stop();


      })
      .on("finish", function () {
        console.log('finish');
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        // progressBar.update(count);
        progressBar.stop();
      })
  );
};

module.exports = {
  copy: copyImageTask,
  compress: compressImageTask
}