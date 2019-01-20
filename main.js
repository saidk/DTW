function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function drawTable(ser1, ser2, matrix, path, target){
    var s = "";
    for(var i=0; i< ser1.length; i++){
        var y = ser1.length - i - 1;
        s = "<td style=\"color: #ccc\">" + ser1[y] + ":</td> "; 
        for(var j =0; j<ser2.length; j++){
            if(isItemInArray(path, [i,j])){
                s+="<td style=\"color: red\">" + matrix[i][j] + "</td> ";
            }
            else{
                s+="<td style=\"color: #333\">" + matrix[i][j] + "</td> ";
            }
        } 
        $(target).append("<tr>"+s+"</tr>");
    }
    // $("#res").append("____________");
    s = "<tr><td></td>";
     for(var x=0; x < ser2.length; x++){
       s+= "<td>" + ser2[x] + "</td> ";
     }
     s += "</tr>"
    $(target).append(s);
}

function drawChart(first, second, path, target){
    //draw chart
    // console.log(first, second, path);
    first_x = [];
    for(var i =0;i<first.length;i++){
        first_x.push(i);
    }
    second_x = [];
    for(var i =0;i<second.length;i++){
        second_x.push(i);
    }
    var firstt = [];
    first.forEach(function(element) {
        firstt.push(element+20);
    }); 
    var trace1 = {
      x: first_x,
      y: firstt,
      type: 'scatter',
      marker: {color: '#ff0000',size: 8}
    };
    
    var trace2 = {
      x: second_x,
      y:  second,
      type: 'scatter',
      marker: {color: '#0000ff',size: 8}
    };
    var traces = [];
    for (var x = 0; x < path.length; x++) { 
        var i = path[x][0];
        var j = path[x][1];
        console.log(path[i][1]);
        traces.push({x:[firstt.length - i - 1,  j ], y:[firstt[firstt.length - i - 1],second[j]],type: 'scatter', marker: {color: '#000000',size: 8}});
    }
    var data = [trace1, trace2];
    
    traces.forEach(function(element) {
        data.push(element);
    }); 
    var layout = {
          autosize: false,
          width: 600,
          height: 150,
          margin: {
            l: 1,
            r: 1,
            b: 1,
            t: 1,
            pad: 1
          },
          showlegend:false,
          hovermode:false,
          textinfo:false,
          showgrid:false,
          xaxis: {
                  title: '',
                  autorange: true,
                  showgrid: false,
                  zeroline: false,
                  showline: false,
                  autotick: true,
                  ticks: '',
                  showticklabels: false
              },
          yaxis:{
                title: '',
                autorange: true,
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false
          }
        };
    Plotly.newPlot(target, data,layout,{displayModeBar: false});
    }


function DTW(ser1, ser2){

    var dtw = new DynamicTimeWarping(ser1, ser2);
    // $("#res").append(dtw.getPath());
    path = dtw.getPath();
    matrix = dtw.getMatrix();

    drawTable(ser1, ser2, matrix, path, "#dtw-table");
    drawChart(ser1, ser2, path, "dtw-chart");
        
}

function WDTW(ser1, ser2, wmax, g){
    // TO DO: Implement WDTW;
    var wdtw = new WeightedDynamicTimeWarping(ser1, ser2,wmax, g);
    path = wdtw.getPath();
    matrix = wdtw.getMatrix();

    drawTable(ser1, ser2, matrix, path, "#wdtw-table");
    drawChart(ser1, ser2, path, "wdtw-chart");
};

function ACDTW(ser1, ser2, wmax, g){
    // TO DO: Implement ACDTW;
};

function EWDTW(ser1, ser2, wmax, g){
    // TO DO: Implement EWDTW;
};


$(document).ready(function() {
    $('.randomseq').click(function() {
        if($(".randomseq").is(':checked')){
            $('input[name=sequence1]').attr("disabled", true);
            $('input[name=sequence2]').attr("disabled",true);
        }
        else{
            $('input[name=sequence1]').attr("disabled", false);
            $('input[name=sequence2]').attr("disabled",false);
        }
    });

    $("#target").click(function() {
        var ser1 = $("#sequence1").val().split(",");
        var ser2 = $("#sequence2").val().split(",");
        var wmax = 0.1;
        var g    = 0.1;
        console.log(ser1);
        console.log(ser2);
        
        DTW(ser1, ser2);
        WDTW(ser1,ser2,wmax,g);
        // ACDTW(ser1,ser2,g);
        // EWDTW(ser1,ser2);
    });


});



//weighted
var sliderWeighted = document.getElementById("myRangeWeighted");
var outputWeighted = document.getElementById("demoWeighted");
outputWeighted.innerHTML = sliderWeighted.value;

sliderWeighted.oninput = function() {
  outputWeighted.innerHTML = this.value;
}
//enhanced weighted
var sliderEnhancedOne = document.getElementById("myRangeEnhancedOne");
var outputEnhancedOne = document.getElementById("demoEnhancedOne");
outputEnhancedOne.innerHTML = sliderEnhancedOne.value;

sliderEnhancedOne.oninput = function() {
  outputEnhancedOne.innerHTML = this.value;
}

