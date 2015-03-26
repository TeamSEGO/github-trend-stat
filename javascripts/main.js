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
      console.log(idx, days);
      stackData( idx, len, day, JSON.parse(data), cb );
    }).fail(function(){cb();});
  }, graph );
});
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

    var len = grpData["datasets"].length;
    var index = -1;

    for(var i=0;i<len;i++){
      if(grpData["datasets"][i]["label"]==url) index=i;
    }
    if(index > 0){
      grpData["datasets"][index]["data"][idx] = starnum;
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
      console.log(ds["label"]);
      grpData["datasets"].push(ds);
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
var option = {
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    bezierCurve : true,
    bezierCurveTension : 0.4,
    pointDot : true,
    pointDotRadius : 4,
    pointDotStrokeWidth : 1,
    pointHitDetectionRadius : 20,
    datasetStroke : true,
    datasetStrokeWidth : 2,
    datasetFill : true,
    legendTemplate : '<ul>'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
                    +'<li>'
                    +'<span style=\"background-color:<%=datasets[i].strokeColor%>\">&nbsp;&nbsp;&nbsp;</span>'
                    +'<% if (datasets[i].label) { %><a href=\"http://www.github.com/<%= datasets[i].label %>\"><%= datasets[i].label %></a><% } %>'
                  +'</li>'
                +'<% } %>'
              +'</ul>',
      customTooltips: function(tooltip) {
                        if (!tooltip) {
                            return;
                        }
                  }
};
var graph = function(){
  var ctx = document.getElementById("trend-stat").getContext("2d");
  var statLineChart = new Chart(ctx).Line(grpData,option);
  var legend = statLineChart.generateLegend();
  $('#trend-legend').append(legend);
}
