var notify = require('gulp-notify');
var gutil = require('gulp-util'); // gulp utils

var reportError = function (error) {
  var lineNumber = error.cause
    ? 'LINE ' + (error.lineNumber || error.cause.line)
    : error.lineNumber ? 'LINE ' + error.lineNumber : '';

  notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: 'Error at line [' + lineNumber + '] (See console).',
    sound: 'Sosumi', // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep(); // Beep 'sosumi' again

  // Easy error reporting
  //console.log(error.toString());

  // Pretty error reporting
  var report = '';
  var errorChalk = gutil.colors.white.bgRed;

  report += errorChalk('TASK:') + ' [' + error.plugin + ']\n';
  //if (error.line) { report += chalk('LINE:') + ' ' + error.line + '\n'; }
  if (error.fileName) {
    report += errorChalk('FILE:') + ' ' + error.fileName + '\n';
  }
  if (lineNumber) {
    report += errorChalk('LINE:') + ' ' + lineNumber + '\n';
  }
  report += errorChalk('ERROR:') + ' ' + error.message;
  if (error.cause) {
    report += ' => ' + error.cause.message + '\n';
  }

  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
};

module.exports = reportError