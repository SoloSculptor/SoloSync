const fs = require('fs');
const path = require('electron').app.getPath('userData') + '/';

module.exports = {
    set: function (key, value) {
        console.log('saved: ' + path + key + '.txt');
        fs.writeFileSync(path + key + '.txt', value, 'utf8');
    },
    get: function (key) {
        if (fs.existsSync(path + key + '.txt')) {
            return fs.readFileSync(path + key + '.txt', 'utf8')
        } else{
            return null;
        }
    }
}