#!/usr/bin/env node

var packageJson = require('../package.json');
var index = require('../dist/index');

/** supported parameters
    - port= - specifies port
*/

var port = 8000;
process.argv.slice(2).forEach(function (val, index, array) {
  if (val.lastIndexOf('port=', 0) === 0) {
    port = parseInt(val.substr(5));
  }
});

var targetPath = process.cwd();

console.log('candygen dev server (version ' + packageJson.version + ')');

var devServer = new index.DevServer(targetPath);
devServer.start(port);
