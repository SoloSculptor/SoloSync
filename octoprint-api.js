const request = require('request');

var baseurl = 'http://192.168.7.79';
var apikey = '5DFA94D27AD742B6ABE70B74BF55CF3F';
var extensions = ['gcode', 'gco', 'g', 'stl', 'hex'];

module.exports = {
    upload: function (path, location = 'local') {
        if (extensions.indexOf(path.split('.').pop()) < 0) {
            console.log(`Extension: ${path.split('.').pop()} is not supported by OctoPrint.`);
            return;
        }
        var ulr = baseurl + '/api/files/' + location + '?apikey=' + apikey;
        var formData = {
            file: require('fs').createReadStream(path)
        }
        var request = require('request').post({
            url: ulr,
            formData: formData
        }
            , function (error, response, body) {
                if (error != null) console.log(`Error: ${error}`);
                console.log(`STATUS: ${response.statusCode}`);
                console.log(`Message: ${response.statusMessage}`);
                if (response.statusCode != 201) {
                    console.log(`Body: ${body}`);
                }
            })
    }
}