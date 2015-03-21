var moment = require('moment');
var today = moment();
var aMonthAgo = moment().subtract(1,'months');
console.log(today.format("YYYY-MM-DD").toString());
console.log(aMonthAgo.format("YYYY-MM-DD").toString());
