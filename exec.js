var moment = require('moment');
var gh = require('./github-trend');
console.log(moment().format("YYYY-MM-DD").toString());
console.log(gh.parseToJson("daily"));
