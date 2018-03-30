// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

/*
This is a template for creating new Perlenspiel games.
All event-handling functions are commented out by default.
Uncomment and add code to the event handlers required by your project.
*/

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.init() event handler:

var State = {
    INTRO: -1,
    OFF: 0,
    WANDER: 1,
    CIRCLE: 2,
    FOLLOW: 3,

    x: 31,
    y: 16,

    current: -1,
    runTime: 0,// millis
    tasks: [],
    taskCreate: (state, x, y, duration) => {
        return {
          state: state,
          x: x,
          y: y,
          duration: duration,
        };
    },
};

var flyColor = PS.COLOR_YELLOW;

var images = []; //array of images loaded on initalization

PS.init = function( system, options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin with a call to PS.gridSize( x, y )
	// where x and y are the desired initial dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the default dimensions (8 x 8).
	// Uncomment the following code line and change the x and y parameters as needed.

	PS.gridSize( 32, 32 );

	PS.gridColor(PS.COLOR_BLACK);
	PS.gridFade(120);

	PS.applyRect(0, 0, 32, 32, (i, j) => {
        PS.color(i, j, PS.COLOR_BLACK);
        PS.border(i, j, PS.COLOR_BLACK);
        PS.fade(i, j, 120);
    });

	PS.audioPlay("crickets_0",
        {loop: true, fileTypes: ["mp3"], path: "https://opengameart.org/sites/default/files/"});

	


	PS.timerStart(10, PS.loop);
    // PS.fadeGrid(PS.COLOR_BLACK);
	// This is also a good place to display your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.

    //var title25, title50, title75, title100;
    //var fireFly;

    // Image loading function
    // Called when image loads successfully
    // [data] parameter will contain imageData

    var myLoader = function ( imageData ) {
            images.push(imageData);
            // i=i+1;
            // Report imageData in debugger

            // PS.debug("Loaded " + imageData.source +
            //     ":\nid = " + imageData.id +
            //     "\nwidth = " + imageData.width +
            //     "\nheight = " + imageData.height +
            //     "\nformat = " + imageData.pixelSize + "\n");
    };

    // Load image in default format (4)

    PS.imageLoad( "Firefly Title Screen 25.png", myLoader );
    PS.imageLoad( "Firefly Title Screen 50.png", myLoader );
    PS.imageLoad( "Firefly Title Screen 75.png", myLoader );
    PS.imageLoad( "Firefly Title Screen 100.png", myLoader );
    var i=0;

    var introTimer = PS.timerStart(30, () => {
        if(i<4) {
            if (images[i]) {
                PS.imageBlit(images[i], 0, 0);
                i = i + 1;
            }
        } else {
            PS.applyRect(0, 0, 32, 32, (i, j) => {
                PS.fade(i, j, 120);
                PS.color(i, j, PS.COLOR_BLACK);
            });
            State.current = State.OFF;
            PS.timerStop(introTimer);
            PS.timerStart(10, PS.loop);
        }
    })

};

function randPos() {
    return {
        x: Math.floor(Math.random()*31 + 1),
        y: Math.floor(Math.random()*31 + 1),
    }
}

/*
*
* TODO: Comment
* */
PS.loop = function() {
    if(State.tasks[0]) {// If task queued

    } else {
        switch(State.current) {
            case State.INTRO:
                 break;
            case State.OFF:
                flyColor = PS.COLOR_RED;
                if(!State.path || State.path.length === 0) {
                    State.path = PS.line(State.x || 0, State.y || 0, 31, randPos().y);
                }

                if(State.x === 31) {
                    PS.applyRect(State.x, State.y, 2, 2, (x, y) => {
                        PS.fade(x, y, 0);
                        PS.color(x, y, PS.COLOR_BLACK);
                        return;
                    });
                    return;
                }
                break;
            case State.WANDER:
                flyColor = PS.COLOR_YELLOW;
                // Firefly on screen but no queued task, wander
                if((!State.path || !State.path[0]) && Math.random() < 0.2) {
                    State.path = PS.line(State.x || 0, State.y || 0, randPos().x, randPos().y);// Yea I know I'm calling it twice
                }

                break;
            case State.FOLLOW:
                flyColor = PS.COLOR_WHITE;
                break;

        }

        // Draw:
        var pos = State.path && State.path.shift();
        if(!pos) {
            return;
        }

        PS.applyRect(State.x, State.y, 2, 2, (x, y) => {
            PS.fade(x, y, 60, {rgb: PS.COLOR_ORANGE});
            PS.color(x, y, PS.COLOR_BLACK);
            return;
        });

            State.x = pos[0];
            State.y = pos[1];

            PS.applyRect(State.x, State.y, 2, 2, (x, y) => {
                PS.fade(x, y, 0);
            PS.color(x, y, PS.COLOR_BLACK);
            PS.color(x, y, flyColor);
        });
        State.runTime = 0;
    }
}

/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.touch() event handler:



PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
    State.path = PS.line(State.x, State.y, x, y);
    State.current = State.FOLLOW;
	// Add code here for mouse clicks/touches over a bead.
};



/*
PS.release ( x, y, data, options )
Called when the mouse button is released over a bead, or when a touch is lifted off a bead
It doesn't have to do anything
[x] = zero-based x-position of the bead on the grid
[y] = zero-based y-position of the bead on the grid
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.release() event handler:



PS.release = function( x, y, data, options ) {
    State.current = State.WANDER;

    // Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
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

// Uncomment the following BLOCK to expose PS.enter() event handler:



PS.enter = function( x, y, data, options ) {
    if(State.current === State.INTRO) return;
    State.path = [];
    State.current = State.WANDER;

    // Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
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

// Uncomment the following BLOCK to expose PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.exitGrid() event handler:



PS.exitGrid = function( options ) {
    if(State.current === State.INTRO) return;
    // Uncomment the following code line to verify operation:
    State.path = [];
    State.current = State.OFF;
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};



/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
It doesn't have to do anything.
[key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
http://users.wpi.edu/~bmoriarty/ps/constants.html
[shift] = true if shift key is held down, else false.
[ctrl] = true if control key is held down, else false.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.keyDown() event handler:

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

*/

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
It doesn't have to do anything.
[key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
http://users.wpi.edu/~bmoriarty/ps/constants.html
[shift] = true if shift key is held down, else false.
[ctrl] = true if control key is held down, else false.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when an input device event (other than mouse/touch/keyboard) is detected.
It doesn't have to do anything.
[sensors] = an object with sensor information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
NOTE: Mouse wheel events occur ONLY when the cursor is positioned over the grid.
*/

// Uncomment the following BLOCK to expose PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
NOTE: This event is only used for applications utilizing server communication.
*/

// Uncomment the following BLOCK to expose PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "Daisy, Daisy ...\n" );

	// Add code here for when Perlenspiel is about to close.
};

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
