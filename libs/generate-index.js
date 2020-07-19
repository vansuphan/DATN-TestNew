'use strict';

var fs = require('fs-extra');
var path = require('path');

/**
 * Generate index.html with the list of html files in target directory.
 * @param {String} dir - The target directory path.
 * @param {Object} [options] - Optional configuration options.
 */
function generate(dir, options) {
    console.log("index");
    var content = "<html>";
    var targetDir = path.resolve(dir);
    var targetFile = path.resolve(dir, "index.html");
    var title = "DIGIFAST - List of files";
    // Meta
    content += '<title>' + title + '</title>';
    content += '<meta charset=\"utf-8\">';
    content += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">';
    content += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
    content += '<meta http-equiv="content-language" content="en" />';
    content += '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0">';
    // Styles
    content += "<style>";
    content += "\n    body, html { margin: 0; padding: 60px; font-family: Georgia; }";
    content += "\n    ul { margin: 0; padding: 0; }";
    content += "\n    li { position: relative; display: inline-block; padding: 8px 15px; list-style: none; border: 1px solid #999; background-color: white; margin-right: 5px; margin-bottom: 5px; }";
    content += "\n    li:hover { background-color: #dadada }";
    content += "\n    li a { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }";
    // content += "\n    li a, li a:active, li a:hover { color: black }";
    content += "</style>";
    // Body
    content += "<body>";
    content += "<h1>" + title + "</h1>";
    content += "<ul>";

    content += "<li><a href='index.html'></a>index.html</li>";
    content += "<hr>";
    
    fs.readdirSync(targetDir).forEach(file => {
        // console.log(file);
        if(file.indexOf(".html") > -1 && file != "index.html") {
            content += "<li><a href='" + file + "'></a>" + file + "</li>";
        }
    });

    content += "</ul>";
    content += "</body></html>";

    fs.writeFileSync(targetFile, content);
    // console.log("The file was saved!");
};

/**
 * Expose
 */
module.exports = generate;
