var express = require('express'),
    watch = require('watch'),
    emailPanel = require('./emails'),
    firebasePanel = require('./firebase-tools'),
    generator = require('./generator'),
    ziputils = require('./ziputils'),
	opener = require('opener'),
    path = require('path');

module.exports = {
    start: function (targetPath, port) {
        var app = express(),
            tempOutputPath = __dirname + '/_site-' + port;

        generator.run(targetPath, tempOutputPath);

        app.use(express.static(tempOutputPath));

        var ep = emailPanel.init(targetPath, port);
        app.use('/emails', ep);

        var fbp = firebasePanel.init(targetPath, tempOutputPath, port);
        app.use('/firebase', fbp);

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
