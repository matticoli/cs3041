//Team DRMGames

// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/

var tarR, tarG, tarB, tarHex;

PS.init= function(system, options){
    var x=0, y=0;
    var r, g, b;

    //set grid to 9 by 9
    PS.gridSize(9,9);

    tarR = PS.random(256) - 1; // random red 0-255
    tarG = PS.random(256) - 1; // random green
    tarB = PS.random(256) - 1; // random blue

    tarHex="0x" + ((1 << 24) + (tarR << 16) + (tarG << 8) + tarB).toString(16).slice(1)+" ";


    PS.statusText("Target: " + tarHex);

    //randomize bead colors for entire grid
    while(y < 9) {
        while(x < 9) {
            r = PS.random(256) - 1; // random red 0-255
            g = PS.random(256) - 1; // random green
            b = PS.random(256) - 1; // random blue

            //if bead is randomly set to the target hex, reset
            while(tarR===r && tarG===g && tarB===b) {
                r = PS.random(256) - 1; // random red 0-255
                g = PS.random(256) - 1; // random green
                b = PS.random(256) - 1; // random blue
            }

            PS.color( x, y, r, g, b ); // set bead color

            x= x+1; //increment
        }
        y=y+1; //increment
        x=0; //reset
    }
};

/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

//When the bead is clicked
PS.touch = function( x, y, data, options ) {
    var changeXL, changeXR, changeYL, changeYR;

	PS.audioPlay("fx_click");

	//loop through to change surrounding RGB values
    changeXL= x-1;
    changeYL= y-1;
    changeXR= x+1;
    changeYR= y+1;

    //HAS TO LOOP WHEN IT MAXES OUT
    while(changeXL>=0){
        

       changeXL=changeXL-1;
    }


};


/*
PS.enter ( x, y, button, data, options )
Called when the mouse/touch enters a bead.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

//When mouse cursor hovers over a bead
PS.enter = function( x, y, data, options ) {
    var color;
    var components;

    //find RGB values of current bead
    components = PS.unmakeRGB( PS.color( x , y ), {} );

    //convert RGB values to hex
    color="0x" + ((1 << 24) + (components.r << 16) + (components.g << 8) + components.b).toString(16).slice(1)+ "\n";

    //print target hex and current bead's hex
    PS.statusText("Target hex: " + tarHex + "Current: " + color);
};



/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits a bead.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value associated with this bead, 0 if none has been set.
[options] = an object with optional parameters; see API documentation for details.
*/

/*
PS.exit = function( x, y, data, options ) {
    // Uncomment the following code line to inspect x/y parameters:
    //PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

    // Add code here for when the mouse cursor/touch exits a bead.

};
*/


/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
*/



/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/