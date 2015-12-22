Object.defineProperty(Meteor, 'saveFile', {
    value: function(blob, name, where, path, type, callback) {
        var fileReader = new FileReader(),
            method, encoding = 'binary',
            type = type || 'binary';
        switch (type) {
            case 'text':
                method = 'readAsText';
                encoding = 'utf8';
                break;
            case 'binary':
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
            default:
                method = 'readAsBinaryString';
                encoding = 'binary';
                break;
        }
        fileReader.onload = function(file) {
            Meteor.call('saveFile', (file.srcElement || file.originalTarget).result, name, path, encoding, where, callback);
        }
        fileReader[method](blob);
    },
    writable: false
});
