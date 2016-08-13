
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    child_process = require('child_process');

module.exports = {
    init: function (targetPath, tempOutputPath, port) {
        var firebasePanel = express();

        firebasePanel.get('/deploy', function (req, res) {
            var output = child_process.exec('firebase deploy', {
                cwd: tempOutputPath
            }, function (error, stdout, stderr) {
                var outContent = stdout ? 'stdout: \n\n' + stdout + '\n\n\n' : '';

                if (stderr) {
                    outContent += 'stderr: \n\n' + stderr;
                }

                fs.writeFileSync(path.join(tempOutputPath, '/fb-deploy.log'), outContent);
            });


            var stdout = '',
                stderr = '',
                writeToFile = function () {
                    fs.writeFileSync(path.join(tempOutputPath, '/fb-deploy.log'), stdout + '\n\n --- \n\n' + stderr);
                };

            output.stdout.on('data', function (data) {
                stdout += data;
                writeToFile();
            });

            output.stderr.on('data', function (data) {
                stderr += data;
                writeToFile();
            });

            res.send('OK');
        });

        return firebasePanel;
    }
};