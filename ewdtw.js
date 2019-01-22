( function() {

    "use strict";

    function EnhancedWeightedDynamicTimeWarping ( ts1, ts2 ) {

        var ser1 = ts1;

        var ser2 = ts2;

        var distance;

        var matrix;

        var path;

        var k = function(){
            var sum = 0.0;
            for(var i = 0; i<ser1.length; i++){
                for(var j = -4; j<= 4; j++){
                    if(i > j){
                        sum+= Math.abs(ser1[i] - ser1[i-j]);
                    }
                }
            }
            return Math.pow(sum/8,2);
        }
        var K = k();
        
        var weight = function(i){
            var w =  1 / (1 + Math.exp(-1  * K));
            return w;
        }

        var getDistance = function() {

            if ( distance !== undefined ) {

                return distance;

            }

            matrix = [];

            for(var i = 0; i < ser1.length; i++){
                matrix[i] = [];
                for(var j = 0; j < ser2.length; j++){
                    matrix[i].push(0);
                }
            }

            for ( var i = 0; i < ser1.length; i++ ) {
                var y = ser1.length - i - 1;

                for ( var j = 0; j < ser2.length; j++ ) {

                    var cost = Infinity;

                    if ( i > 0 ) {

                        cost = Math.min( cost, matrix[ y + 1][ j ] );

                        if ( j > 0 ) {

                            cost = Math.min( cost, matrix[ y + 1 ][ j - 1 ] );

                            cost = Math.min( cost, matrix[ y ][ j - 1 ] );

                        }

                    } else {

                        if ( j > 0 ) {

                            cost = Math.min( cost, matrix[ y ][ j - 1 ] );

                        } else {

                            cost = 0;

                        }

                    }

                    matrix[ y ][ j ] = cost + weight(Math.abs(i-j))*(ser1[ i ] - ser2[ j ] )*(ser1[ i ] - ser2[ j ] ) + weight(i);

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

            exports = module.exports = EnhancedWeightedDynamicTimeWarping;

        }

        exports.EnhancedWeightedDynamicTimeWarping = EnhancedWeightedDynamicTimeWarping;

    } else {

        root.EnhancedWeightedDynamicTimeWarping = EnhancedWeightedDynamicTimeWarping;

    }



    if ( typeof define === "function" && define.amd ) {

        define( "dynamic-time-warping", [], function() {

            return EnhancedWeightedDynamicTimeWarping;

        } );

    }

}() );