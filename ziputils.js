
var path = require('path'),
    archiver = require('archiver');

module.exports = {
    downloadAsZip: function (targetPath, folderPath, res, includeDataFolder) {
        var timestamp = (new Date()).getTime().toString(36).toUpperCase();
        res.attachment(path.basename(targetPath) + '-candy-' + timestamp + '.zip');

        var archive = archiver('zip');

        archive.on('error', function (err) {
            console.error(err.message, err);
        });

        archive.pipe(res);

        var src = [
            '**', '!**/.DS_Store', '!.DS_Store'
        ];

        if (!includeDataFolder) {
            src.push('!data/**');
        }

        archive.bulk([
            {
                expand: true,
                cwd: folderPath,
                src: src,
                dest: '.'
            }
        ]);

        archive.finalize();
    }
};