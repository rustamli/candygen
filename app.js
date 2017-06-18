var express = require('express'),
    watch = require('watch'),
    generator = require('./generator'),
    ziputils = require('./ziputils'),
	opener = require('opener'),
    path = require('path');

const candyBuild = '/build';
module.exports = {
    generateOnce: function(targetPath) {
        generator.run(targetPath, targetPath + candyBuild);
        console.log(`Please navigate to ${candyBuild} to get the build of your website.`);
    },

    start: function (targetPath, port) {
        var app = express(),
            tempOutputPath = __dirname + '/_site-' + port;

        var settings = generator.run(targetPath, tempOutputPath);

        app.use(express.static(tempOutputPath));

        if (settings.extras.length > 0) {
            settings.extras.forEach(function (extra) {
                
                if (extra.name === 'firebase-tools') {
                    console.log('Adding Firebase Extras');
                    var fbp = require(path.join(targetPath, '/node_modules/candygen-firebase/index.js'))
                        .init(targetPath, tempOutputPath, port, express, extra);
                    app.use('/firebase', fbp);
                }

                if (extra.name === 'email-tools') {
                    console.log('Adding Email Extras');
                    var ep = require(path.join(targetPath, '/node_modules/candygen-email/index.js'))
                        .init(targetPath, tempOutputPath, port, express, extra);
                    app.use('/emails', ep);
                }
            });
        }

        app.get('/regenerate', function (req, res) {
            generator.run(targetPath, tempOutputPath);
            res.send('OK');
        });

        app.get('/zip', function (req, res) {
            ziputils.downloadAsZip(targetPath, targetPath, res);
        });

        app.get('/zip-result', function (req, res) {
            ziputils.downloadAsZip(targetPath, tempOutputPath, res, true);
        });

        app.use(function(req, res, next) {
            res.status(404).sendFile(__dirname + '/_site-' + port + '/404.html');
        });

        var server = app.listen(port, function () {
            console.log('Go to: http://localhost:' + port);
            opener('http://localhost:' + port);
        });

        watch.watchTree(targetPath, function (f, curr, prev) {
            if (typeof f == 'object' && prev === null && curr === null) {
                // no change
            } else if (prev === null) {
                // add
                generator.handleChange(f, curr, prev);
            } else if (curr.nlink === 0) {
                // delete
                generator.handleChange(f, curr, prev);
            } else {
                // change
                generator.handleChange(f, curr, prev);
            }
        });
    },

    staticServe: function (targetPath, port) {
        var app = express();

        app.use(express.static(targetPath));

        app.use(function(req, res, next) {
            res.status(404).sendFile(path.join(targetPath, '404.html'));
        });

        var server = app.listen(port, function () {
            console.log('Go to: http://localhost:' + port);
            opener('http://localhost:' + port);
        });
    }
};
