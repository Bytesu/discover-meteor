/***
资料：
  1. iron:router后端路由

  2. 数据库操作：

*/
Test = new Mongo.Collection('test');

if(Meteor.isServer){
  // Router.onBeforeAction(function () {
  //
  // })
  Router.route('/test',{where:'server'}).post(function () {
    console.log(this.request.body);
    Test.insert(this.request.body);
    this.response.end(JSON.stringify({
      code:200,
      msg:'success'
    }));
  }).get(function () {
    console.log(this.request.param);
    return this.response.end(JSON.stringify(Test.find({}).fetch()));
  }).delete(function () {
    this.response.end(JSON.stringify({
      code:200,
      msg:'success'
    }));
  }).put(function () {
    this.response.end(JSON.stringify({
      code:200,
      msg:'success'
    }));
  })

}
