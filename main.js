function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}
function getRandomSequence(loc)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "series.txt", false);
    var arr;
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                arr = allText.split('\n')[loc];
            }
        }
    }
    rawFile.send(null);
    return arr;
}

function drawTable(ser1, ser2, matrix, path, target){
    var s = "";
    $(target).html("");
    for(var i=0; i< ser1.length; i++){
        var y = ser1.length - i - 1;
        s = "<td style=\"color: #333\">" +ser1[y] + ":</td> "; 
        for(var j =0; j<ser2.length; j++){
            if(isItemInArray(path, [i,j])){
                s+="<td style=\"color: red\">" + Math.round(matrix[i][j]) + "</td> ";
            }
            else{
                s+="<td style=\"color: #333\">" + Math.round(matrix[i][j]) + "</td> ";
            }
        } 
        $(target).append("<tr>"+s+"</tr>");
    }
    // $("#res").append("____________");
    s = "<tr><td>S1/S2</td>";
     for(var x=0; x < ser2.length; x++){
       s+= "<td>" + ser2[x] + "</td> ";
     }
     s += "</tr>"
    $(target).append(s);
	$('.grid-item').css('height', '100%');
	var height = $('.weighted_dtw').outerHeight()
	$('.classic_dtw').css('height', height);
	
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
        firstt.push(parseInt(element) + 20);
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
	var data = [trace1, trace2];

    for (var x = 0; x < path.length; x++) { 
        var i = path[x][0];
        var j = path[x][1];
        data.push({x:[firstt.length - i - 1,  j ], y:[firstt[firstt.length - i - 1],second[j]],type: 'scatter', marker: {color: '#000000',size: 1}});
    }
    
    //traces.forEach(function(element) {
      //  data.push(element);
    //}); 
    var layout = {
          autosize: false,
          width: 900,
          height: 250,
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
    Plotly.newPlot(target, data,layout,{displayModeBar: false, responsive:true});
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

function ACDTW(ser1, ser2, g){
    // TO DO: Implement ACDTW;
    var acdtw = new AdaptiveCostDynamicTimeWarping(ser1, ser2, g);
    path = acdtw.getPath();
    matrix = acdtw.getMatrix();

    drawTable(ser1, ser2, matrix, path, "#acdtw-table");
    drawChart(ser1, ser2, path, "acdtw-chart");
};

function EWDTW(ser1, ser2, wmax, g){
    // TO DO: Implement EWDTW;
    var ewdtw = new EnhancedWeightedDynamicTimeWarping(ser1, ser2);
    path = ewdtw.getPath();
    matrix = ewdtw.getMatrix();

    drawTable(ser1, ser2, matrix, path, "#ewdtw-table");
    drawChart(ser1, ser2, path, "ewdtw-chart");
};



$(document).ready(function() {
    var ser1,ser2,wmax=0,g=1;
    $('.randomseq').click(function() {
        if($(".randomseq").is(':checked')){
            var n = Math.ceil(Math.random()*300);
            var m = Math.ceil(Math.random()*300);
            $('input[name=sequence1]').val(getRandomSequence(n) );
            $('input[name=sequence2]').val(getRandomSequence(m));
            $('input[name=sequence1]').attr("disabled", true);
            $('input[name=sequence2]').attr("disabled",true);
        }
        else{
            $('input[name=sequence1]').attr("disabled", false);
            $('input[name=sequence2]').attr("disabled",false);
        }
    });

    $("#target").click(function() {
        ser1 = $("#sequence1").val().split(",");
        ser2 = $("#sequence2").val().split(",");
        
        DTW(ser1, ser2);
        WDTW(ser1,ser2,wmax,g);
        ACDTW(ser1,ser2,g);
        EWDTW(ser1,ser2);
    });

    $("#myRangeWeighted").on('input', function(){
        wmax = $(this).val();
        $("#demoWeighted").text(wmax);
        if(ser1 == null || ser2 == null){
            ser1 = $("#sequence1").val().split(",");
            ser2 = $("#sequence2").val().split(",");
        }
        WDTW(ser1,ser2,wmax,g);
    });
    $("#myRangeG").on('input', function(){
        g = $(this).val();
        $("demoG").text(g);
        if(ser1 == null || ser2 == null){
            ser1 = $("#sequence1").val().split(",");
            ser2 = $("#sequence2").val().split(",");
        }
        WDTW(ser1,ser2,wmax,g);
    });
    $("#myRangeACG").on('input', function(){
        g = $(this).val();
        $("#demoACG").text(g);
        if(ser1 == null || ser2 == null){
            ser1 = $("#sequence1").val().split(",");
            ser2 = $("#sequence2").val().split(",");
        }
        ACDTW(ser1,ser2,g);
    });
});

