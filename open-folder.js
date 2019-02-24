const { dialog } = require('electron').remote;

module.exports = {
    open: function () {
        //var win = require('electron').remote.getCurrentWindow();
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (path) {
            if (path) {
                return path[0];
            }
        });
        return '';
    }
}