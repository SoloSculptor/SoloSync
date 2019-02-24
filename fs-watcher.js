const chokidar = require("chokidar");
var watcher = null;

module.exports = {
    start: function startWatcher(path) {
        if (watcher != null) {
            console.log('Close previous watcher');
            watcher.close();
        }

        if (path != null) {
            watcher = chokidar.watch(path, {
                ignored: /[\/\\]\./,
                persistent: true
            });

            console.log('Watching: ' + path);
        }

        return watcher;
    }
}