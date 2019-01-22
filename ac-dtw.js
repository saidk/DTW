( function() {

    "use strict";

    function AdaptiveCostDynamicTimeWarping ( ts1, ts2, g ) {

        var ser1 = ts1;

        var ser2 = ts2;

        var distance;

        var matrix;

        var path;

        var g = g;

        var r = Math.min(ser1.length, ser2.length) / Math.max(ser1.length, ser2.length);


        var c = function(x){
            console.log(x);
            return g*r*x + 1;
        }

        var getDistance = function() {

            if ( distance !== undefined ) {

                return distance;

            }

            matrix = []; var A=[]; var B=[];  
            for( var i = 0; i < ser1.length; i++ ){
                A[i] = [];
                B[i] = [];
                matrix[i] = [];
                for ( var j = 0; j < ser2.length; j++ ) {
                    A[i][j] = 0;
                    B[i].push(0);
                    matrix[i].push(0);
                }
            }

            A[0][0] = 1; 
            B[0][0] = 1;

            for ( var i = 0; i < ser1.length; i++ ) {

                var y = ser1.length - i - 1;
                for ( var j = 0; j < ser2.length; j++ ) {

                    var cost= Infinity;
                    
                    var d1 = cost, d2 = cost, d3 = cost;

                    var dist = (ser1[ i ] - ser2[ j ] )*(ser1[ i ] - ser2[ j ] );

                    if(i > 0){
                        
                        d1 =  c(B[i-1][j])*dist  + matrix[ y+1 ][ j ];

                        if(j > 0){
                            d2 =  dist + matrix[ y+1 ][ j - 1 ];
                        }
                    }
                    else{

                        if( j > 0 ){
                            console.log(i, j-1 , A[i][ j-1 ]);
                            d3 =  c( A[i][j-1] ) * dist +  matrix[ y ][ j - 1 ];
                        }else{
                            cost = dist;
                        }
                    }

                    matrix[ y ][ j ] = Math.min(Math.min(d1,cost), Math.min(d2,d3));
                    if(matrix[y][j] == d1){
                        A[i][j] = 1;
                        B[i][j] = B[i-1][j] + 1;
                    }
                    else if(matrix[y][j] == d2){
                        A[i][j] = 1;
                        B[i][j] = 1;
                    }
                    else if(matrix[y][j] == d3){
                        A[i][j] = A[i][j-1] + 1;
                        B[i][j] = 1;
                    }else{
                        //do nothing
                    }

                }

            }


            return Math.sqrt(matrix[ ser1.length - 1 ][ ser2.length - 1 ]);

        };



        this.getDistance = getDistance;



        var getPath = function() {

            if ( path !== undefined ) {

                return path;

            }

            if ( matrix === undefined ) {

                getDistance();

            }

            var i = 0;

            var j = ser2.length - 1;

            path = [ ];

            while ( i != ser1.length && j >= 0 ) {
                path.push([ i, j ]);
                
                if( i < ser1.length-1 ){
                    var min = Math.min( matrix[i+1][j], matrix[i][j-1], matrix[i+1][j-1] )
                    if(min == matrix[i+1][j]){
                        i = i+1;
                    }
                    else if(min == matrix[i][j-1]){
                        j = j-1;
                    }
                    else{
                        i = i+1;
                        j = j-1;
                    }
                }
                else{
                    min = matrix[i][j-1]
                    j =  j-1;
                
                }

            }

            // path = path.reverse();



            return path;

        };



        this.getPath = getPath;


        var getMatrix = function(){
            if ( matrix === undefined ) {

                getDistance();

            }
            return matrix;
        }

        this.getMatrix = getMatrix;
    }



    var root = typeof self === "object" && self.self === self && self ||

        typeof global === "object" && global.global === global && global ||

        this;



    if ( typeof exports !== "undefined" && !exports.nodeType ) {

        if ( typeof module !== "undefined" && !module.nodeType && module.exports ) {

            exports = module.exports = AdaptiveCostDynamicTimeWarping;

        }

        exports.AdaptiveCostDynamicTimeWarping = AdaptiveCostDynamicTimeWarping;

    } else {

        root.AdaptiveCostDynamicTimeWarping = AdaptiveCostDynamicTimeWarping;

    }



    if ( typeof define === "function" && define.amd ) {

        define( "dynamic-time-warping", [], function() {

            return AdaptiveCostDynamicTimeWarping;

        } );

    }

}() );