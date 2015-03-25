var korDateFmt ="YYYY-MM-DD";
var startMoment = moment("2015-03-17");
var grpData ={};
var getDateSeries = function( from, to ){
  var diff_y_1 = to.diff(from,'days') - 1;
  var days = [];
  days.push(from.format(korDateFmt).toString());
  while(true){
    days.push(from.add(1,'days').format(korDateFmt).toString());
    if(!diff_y_1--)break;
  }
  return days;
}


$( document ).ready(function(){
  var days = getDateSeries(startMoment,moment());
  grpData["labels"] = days;
  grpData["datasets"] = [];
  console.log(days);
  async.each( days, function( day, cb ){
    $.ajax({url: "./daily/"+day+".json"}).done(function(data){
      var idx = getIndexFromNums(days,day);
      var len = days.length;
      stackData( idx, len, day, data, cb );
    });
  }, graph );
});
var stackData = function( idx, lenOfDay, day, data, cb ){
  async.each(data, function(module, ccb){
    var url = module['url'];
    var day = data;
    var starnum = module['starnum'];
    var datasets = grpData["datasets"];

    var len = datasets.length;
    var index = -1;
    for(var i=0;i<len;i++){
      if(datasets[i]["label"]) index=i;
    }
    if(index>0){
      datasets[index]["label"]["data"][idx] = starnum;
    }else{
      datasets[index] = {};
      datasets[index]["label"] =  url;
      var randomColor = function(){
        var r = Math.floor((Math.random() * 255) + 1);
        var g = Math.floor((Math.random() * 255) + 1);
        var b = Math.floor((Math.random() * 255) + 1);
        return r +"," +g+"," + b;
      }();
      console.log(randomColor,idx, starnum);
      datasets[index]["fillColor"] = "rgba("+randomColor+",0.2)";
      datasets[index]["strokeColor"] = "rgba("+randomColor+",1)";
      datasets[index]["pointColor"] = "rgba("+randomColor+",1)";
      datasets[index]["pointStrokeColor"] = "#fff";
      datasets[index]["pointHighlightFill"]= "#fff";
      datasets[index]["pointHighlightStroke"] = "rgba("+randomColor+",1)";
      datasets[index]["label"]["data"]=new Array(lenOfDay);
      console.log(datasets[index]["label"]["data"]);
      datasets[index]["label"]["data"][idx] = starnum;
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
/*
var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
*/
var graph = function(){
  var ctx = document.getElementById("trend-stat").getContext("2d");
  var myLineChart = new Chart(ctx).Line(data);
}
