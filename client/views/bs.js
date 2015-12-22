Template.bs.events({
  'change input[name="file"]':function (e) {

  var _files = e.target.files;
  if (_files.length === 1) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/file');
    var filePath = _files[0].name;
    xhr.setRequestHeader('file-name', filePath.substring(filePath.lastIndexOf('\\') + 1));
    xhr.send(_files[0]);

  }
    // $.post({
    //   url:'/file',
    //   data:{file:e.target.files[0]},
    //   success:function (a1,a2) {
    //     console.log(a2);
    //   }
    // })
  }
})
