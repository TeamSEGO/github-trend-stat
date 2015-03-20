var jsons = ["2015-03-17","2015-03-18","2015-03-19","2015-03-20"];
$( document ).ready(function(){
  console.log('This would be the main JS file.');
  Async.eachSeries(jsons, function(path){
    $.ajax({url: "./javascript/"+path,
  }).done(function(data){
    console.log(data);
  });
  })
});
