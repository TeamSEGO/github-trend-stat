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
  async.each( days, function(path){
    $.ajax({url: "./daily/"+path+".json"}).done(function(data){
      console.log(path, data);
    });
  })
});
