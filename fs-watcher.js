const octoprint_api=require('./octoprint-api');

module.exports = {
    start: function startWatcher(path) {
        var chokidar = require("chokidar");

        var watcher = chokidar.watch(path, {
            ignored: /[\/\\]\./,
            persistent: true
        });

        watcher.on('ready', function () {
            console.info('From here can you check for real changes, the initial scan has been completed.');
            // Declare the listeners of the watcher
            watcher
                .on('add', function (path) {
                    console.log('File', path, 'has been added');
                    octoprint_api.upload(path);
                })
                .on('addDir', function (path) {
                    console.log('Directory', path, 'has been added');
                })
                .on('change', function (path) {
                    console.log('File', path, 'has been changed');
                    octoprint_api.upload(path);
                })
                .on('unlink', function (path) {
                    console.log('File', path, 'has been removed');
                })
                .on('unlinkDir', function (path) {
                    console.log('Directory', path, 'has been removed');
                })
                .on('error', function (error) {
                    console.log('Error happened', error);
                })
            // .on('raw', function(event, path, details) {
            //      // This event should be triggered everytime something happens.
            //      console.log('Raw event info:', event, path, details);
            // });
        })
    }
}