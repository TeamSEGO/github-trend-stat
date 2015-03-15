var request = require("request");
var env = require('jsdom').env;
request('https://github.com/trending?since=weekly', function (error, response, body) {
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
        console.log( url, description, language, starnum );
        //console.log(valueObj);
      });
    });
  }
})
