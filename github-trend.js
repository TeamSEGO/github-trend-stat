var request = require("request");
var env = require('jsdom').env;
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var trendData ={};


var parseToJson = exports.parseToJson = function(weeklyOrDaily,callback){
  var sum = [];
  request('https://github.com/trending?since='+weeklyOrDaily, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      env(body, function (errors, window) {
        if(errors)console.log(errors);
        var $ = require('jquery')(window);
        $(".repo-list-item").each(function(index, valueObj){
          var url = $(valueObj).find(".repo-list-name>a").attr("href");
          var description = $(valueObj).find(".repo-list-description").text().trim();
          var meta = $(valueObj).find(".repo-list-meta").text().trim().replace(/\n/g,"").split("•");
          var language,starnum;
          if( meta.length==3 ){
            language = meta[0].trim();
            starnum = parseInt(meta[1].substring(0,meta[1].indexOf("stars") ).replace(/,/g,"") );
          }else if(meta.length==2){
            language = "none"
            starnum = parseInt(meta[0].substring(0,meta[0].indexOf("stars") ).replace(/,/g,"") );
          }else{
            console.log("exception occurred!");
            throw "Exception";
          }
          sum.push({url:url,description:description, language: language, starnum: starnum});
          if( index == 24){
            fs.writeFile(__dirname + "/"+weeklyOrDaily+"/"+moment().format("YYYY-MM-DD").toString()+".json", JSON.stringify(sum) , function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
          });
          }
        });
      });
    }
  });
}

var eachFileAdjust = function(){
  async.each( days, function( day, cb ){
    $.ajax({url: "./daily/"+day+".json"}).done(function(data){
      var idx = getIndexFromNums(days,day);
      var len = days.length;
      if( (typeof data === "object") && (data !== null) ){
        stackData( idx, len, day, data, cb );
      }else{stackData( idx, len, day, JSON.parse(data), cb );}
    }).fail(function(){cb();});
  }, graph );
}

var stackData = function( idx, lenOfDay, day, data, cb ){
  var getArrayFromData = function(lenOfDay){
    var arr = [];
    arr.push(0);
    while(lenOfDay--)arr.push(0);
    return arr;
  }
  async.each(data, function(module, ccb){
    var url = module['url'];
    var day = data;
    var starnum = module['starnum'];

    var len = trendData["datasets"].length;
    var index = -1;

    for(var i=0;i<len;i++){
      if(trendData["datasets"][i]["label"]==url) index=i;
    }
    if(index > 0){
      trendData["datasets"][index]["data"][idx] = starnum;
    }else{
      var ds = {};
      ds["label"] = url;
      var randomColor = function(){
        var r = Math.floor((Math.random() * 255) + 1);
        var g = Math.floor((Math.random() * 255) + 1);
        var b = Math.floor((Math.random() * 255) + 1);
        return r +"," +g+"," + b;
      }();
      ds["fillColor"] = "rgba("+randomColor+",0.2)";
      ds["strokeColor"] = "rgba("+randomColor+",1)";
      ds["pointColor"] = "rgba("+randomColor+",1)";
      ds["pointStrokeColor"] = "#fff";
      ds["pointHighlightFill"]= "#fff";
      ds["pointHighlightStroke"] = "rgba("+randomColor+",1)";
      ds["data"] = getArrayFromData(lenOfDay);
      ds["data"][idx] = starnum;
      trendData["datasets"].push(ds);
    }
    ccb();
  }, function(){
    cb();
  });
}
var getIndexFromNums = function (days,day){
  var len  = days.length;
  for(var i=0;i<len;i++){
    if(days[i]==day) return i;
  }
}
