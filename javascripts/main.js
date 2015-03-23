var korDateFmt ="YYYY-MM-DD";
var startMoment = moment("2015-03-17");
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
  console.log(days);
  async.each( days, function( day, cb ){
    $.ajax({url: "./daily/"+day+".json"}).done(function(data){
      stackData( data, cb );
    });
  }, graph );
});
var stackData = function(data,cb){
  async.EachSeries(data, function(module, ccb){
    
    ccb();
  }, function(){
    cb();
  });


}
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
var graph = function(){
  var ctx = document.getElementById("trend-stat").getContext("2d");
  var myLineChart = new Chart(ctx).Line(data);

}
