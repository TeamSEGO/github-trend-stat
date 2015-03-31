var moment = require('moment');
var low = require('lowdb')
var db = low('db.json')
var today = moment();
var aMonthAgo = moment().subtract(1,'months');
console.log(today.format("YYYY-MM-DD").toString());
console.log(aMonthAgo.format("YYYY-MM-DD").toString());
//db('posts').push({ "2015-03-31": "awesome?"});
var dd= db('posts').findIndex( function(chr){
  return chr["2015-03-31"];
});
console.log(dd);
