/**
 * Created by s_ on 15/11/22.
 */

// Router.after(function(req,res){
//     // Iron.Router.bodyParser
//     // console.log(req.params)
//     // console.log((this.request.body))
//     console.log('after ')
//     this.response.write('tteessss');
//     this.response.end();
//     // next();
// },{where:'server'});

Router.before(function(req,res,next){
    // Iron.Router.bodyParser
    // console.log(req.params)
    // console.log((this.request.body))
  //   console.log('before ');
  //   var ended = false;
  //   var write  =  this.response.write;
  //   this.response.write = function(chunk,encoding){
  //       // try{
  //       //     chunk = JSON.parse(chunk);
  //       // }catch(e){
  //       //     chunk = chunk;
  //       // }
  //       // chunk.name = "----------";
  //      return write(chunk,encoding);
  //  }
    next();
},{where:'server'})
// Router.onBeforeAction(function(req,res,next){
//     // Iron.Router.bodyParser
//     // console.log(req.params)
//     console.log('beforeAction ')
//     console.log((this.request.body))
//     next();
// },{where:'server'})
// Router.use('/*', { where: 'server' ,action:function(){
//     console.log(this.request.body)
//     console.log('rout ')
//     this.next();
// }});
var fs = Npm.require('fs'); // call node core module !
var formidable = Meteor.npmRequire('formidable');//call upload module
var util = Npm.require('util');
Router.route('/posts/:id', { where: 'server' })
    .get(function () {
        // curl -XGET "http://localhost:3000/posts/getAll?s=2#3"
        var pos = Posts.find();
        console.log(pos.count(),this.params.id,this.request.query)
        //console.log(Posts.find().fetch());
        this.response.end('AAAA-GET-'+pos.count());
    })
    .post(function () {
        // curl -XPOST --data "hong=2312" "http://localhost:3000/posts/xxxxxxx"
        var pos = Posts.find();
        //console.log(this.request.body)
        this.response.write(pos.fetch().length+'====')
        this.response.write(('------'))

        this.response.end();


    })
    .put(function () {
        var pos = Posts.find();
        console.log(pos.count(),this.params.id,this.request.body);
        this.response.end('AAAA-PUT-'+pos.count());
    }).delete(function(){

    });
/**
* 文件上传
*/
Router.route('/file',{where:'server'}).post(function () {
  var form = new formidable.IncomingForm();
  form.uploadDir = '/files/test';//上传目录
  var res = this.response;
  form.parse(this.request,function (err,fields,files) {
    // console.log(err);
    if(err)throw err;
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end(util.inspect({fields: fields, files: files}));
  });
});
