const request = require('request');
const userData = require('./user-data');

var extensions = ['gcode', 'gco', 'g', 'stl', 'hex'];

module.exports = {
    upload: function (path, location = 'local') {
        // check if is with supported extension
        if (extensions.indexOf(path.split('.').pop()) < 0) {
            console.log(`Extension: ${path.split('.').pop()} is not supported by OctoPrint.`);
            return;
        }

        // read userData
        var baseurl = userData.get('baseurl');
        var apikey = userData.get('apikey');

        var ulr = baseurl + '/api/files/' + location + '?apikey=' + apikey;
        var formData = {
            file: require('fs').createReadStream(path)
        }
        request.post({
            url: ulr,
            formData: formData
        }
            , function (error, response, body) {
                if (error != null) {
                    console.log(`${error}`);
                } else {
                    console.log(`STATUS: ${response.statusCode}`);
                    console.log(`Message: ${response.statusMessage}`);
                    if (response.statusCode != 201) {
                        console.log(`Body: ${body}`);
                    }
                }
            })
    }
}