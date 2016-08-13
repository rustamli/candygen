
var express = require('express'),
    fs = require('fs'),
    juice = require('juice'),
    path = require('path');

module.exports = {
    init: function (targetPath, port) {
        var emailsPanel = express();

        emailsPanel.get('/juice', function (req, res) {
            var source = fs.readFileSync(__dirname + '/_site-' + port + '/' + req.url.split('file=')[1], 'utf8');
            res.send(juice(source));
        });

        return emailsPanel;
    }
};