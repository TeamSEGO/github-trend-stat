var jsons = ["2015-03-17","2015-03-18","2015-03-19","2015-03-20","2015-03-20"];
$( document ).ready(function(){
  console.log('This would be the main JS file.');
  async.eachSeries(jsons, function(path){
    $.ajax({url: "./daily/"+path+".json",
  }).done(function(data){
    console.log(data);
  });
  })
});
