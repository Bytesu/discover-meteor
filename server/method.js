// ===================================================================上传附件开始
var fs = Npm.require('fs');
var mine = Meteor.npmRequire('mime');
//var mine = Meteor.require('mime');
var path = Npm.require('path');

//var bcrypt = Meteor.npmRequire('bcrypt');
//console.log(('aaaaa'))
//console.log(SHA256('aaaaa'));
//
//bcrypt.hash(SHA256('aaaaa'), 10, function(err, hash) {
//    if(err){
//        console.log(err);
//
//    }else{
//        console.log(hash);
//    }
//});


// NFS挂掉的话该方法启用
function fsStat(path) {
    return new Promise(function (resolve, reject) {

        fs.stat(path, function (err, fsStatRes) {

            if (err) {
                reject(err);
            } else {
                resolve(fsStatRes);
            }
        });
    });
}
function readFilePromise(defaultIcon) {
    return new Promise(function (resolve, reject) {
        fs.readFile(defaultIcon, function (err, file) {
            if (err) {
                reject(err);
            } else {
                resolve(file);
            }
        })
    });
}

function catchReadError(response, where) {
    console.log('here ! err-'+where)
    var to = where.split('/').pop();
    switch (to) {
        case 'user':
            var defaultIcon = '/files/user/default.png';
            break;
        case 'attach':
            break;
        case 'logo':
            var defaultIcon = '/files/logo/default.png'
            break;
    };
    response.writeHead(404, {
        'Content-Type': mine.lookup(defaultIcon) + ';charset=utf-8'
    });
    response.write('404 : not found ! ');
    response.end();
}
function readFile(response, where, filename) {
    if (!filename) throw new Meteor.Error(404, 'filename没有传值');
    filename = filename && path.basename(filename);
    var realpath = '/' + where + '/' + filename;
    var fileSize = 0;
    fsStat(realpath).then(function (result) {

        if (result.isFile()) {
            fileSize = result.size;
            return readFilePromise(realpath);
        } else {
            return new Promise(function (resolve, reject) {
                reject('not found error');
            });
        }
    }).then(function (file) {
        response.writeHead(200, {
            'Content-Type': mine.lookup(realpath) + ';charset=utf-8',
            'Content-Disposition': 'inline',
            'Content-Size': fileSize
        });
        response.write(file);
        response.end();
    }).catch(function (err) {

        catchReadError(response,where);
    });
}


Meteor.methods({
    saveFile: function (blob, name, path, encoding, where) {
        var path = cleanPath(path),
            crypto = Npm.require('crypto');
        fs = Npm.require('fs'),
            name = cleanName(name || 'file'),
            encoding = encoding || 'binary',
            chroot = Meteor.chroot || '/' + where;
        var hash = crypto.createHash('md5');
        hash.update(blob);
        var md5 = hash.digest('hex');
        path = chroot + (path ? '/' + path + '/' : '/');
        console.log(path)
        fs.writeFile(path + name, blob, encoding, function (err) {
            console.log(err)
            if (err) {
                throw (new Meteor.Error(500, '文件保存失败:', err));
            } else {
                console.log('该文件:' + name + '(' + encoding + ')' + ' 保存在' + path);

                return 1;
            }
        });

        function cleanPath(str) {
            if (str) {
                return str.replace(/\.\./g, '').replace(/\/+/g, '').
                    replace(/^\/+/, '').replace(/\/+$/, '');
            }
        }

        function cleanName(str) {
            if (str) {
                return str.replace(/\.\./g, '').replace(/\//g, '');
            }
        }
    }
});
