#!/usr/bin/env node

var packageJson = require('../package.json');
var index = require('../dist/index');

/** supported commands
    - <empty> - runs generation once
    - init - generates candygen.config.js file
    - version - outputs version
*/

var command = process.argv[2];
var targetPath = process.cwd();

console.log('candygen (version ' + packageJson.version + ')');

if (!command) {
  console.log('running generator ...');
  var generator = new index.Generator(targetPath);
  generator.run();
} else if (command === 'init') {
  console.log('initializing directory ...');
  index.Initializer.init(targetPath);
}
