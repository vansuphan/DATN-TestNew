var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var pkg = require('../package.json')

var dir = {
  src: path.resolve('src'),
  debug: path.resolve('debug'),
  build: path.resolve('build'),
}

var config = {
  frameworkName: '[' + chalk.hex('#666666')(pkg.name) + ']',
  frameworkVersion: pkg.version,
  gulp: null,
  browserSync: null, 
  dir: dir
}
// console.log(config)

module.exports = config