// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

//global database variable
var db="Mirror";

// Global M for game props
var M = {
    DEBUG: false,
    currentLevel: 0,
};

M.levels = [`
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
    G  ww  g    
`,`
    g  ww  G    
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
    t  ww  t    
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
`,`
       ww       
       ww       
       ww       
       ww       
tttttttwwttttttt
       ww       
       ww       
   g   ww   G
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
`,`
       ww       
  g G  ww       
       ww       
       ww       
tttttttwwttttttt
       ww       
       ww       
tttttttww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
       ww       
`,`
       ww       
       ww       
       ww       
    t  ww  t    
wwwwwwwww       
       ww       
       ww       
   g   ww       
   G   ww       
       ww       
w wwwwwww       
       ww       
    t  ww  t    
       ww       
       ww       
       ww       
`,`
       ww       
  g    ww       
       ww        
wwwwtwwww       
    t  wwwwtwwww
       ww       
       ww       
      www       
       ww       
       ww       
wwwwwwwwwwwwwwtw
       ww     G 
    t  ww  t    
 g     ww       
       ww       
       ww       
`,`
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
wwwwwwwwwwwwwwww
`];

M.level = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

var Terrain = {
    FLOOR: {
        id: ' ',
        color: 0xBBBBBB,
    },
    ICE: {
        id: 'c',
        color: 0xFFFFFF,
    },
    MIRROR: {
        id: 'm',
        color: 0xDDDDDD,
    },
    TELEPORT: {
        id: 't',
        color: 0x0000FF,
    },
    TGOAL: {
        id: 'g',
        color: 0x00FF00,
    },
    PGOAL: {
        id: 'G',
        color: 0x00AA00,
    },
    WALL: {
        id: 'w',
        color: 0x000000,
    },
};

M.player = {x: 1, y: 1};
M.target = {x: 14, y: 1};
M.pdone = false;
M.tdone = false;

M.movePlayer = function(x, y, p) {
    if(!p) {
        p = M.player;
        M.movePlayer(-x, y, M.target);
    }

    var nx = (p.x + x) > 15 ? 15 : (p.x + x) < 0 ? 0 : p.x + x;
    var ny = (p.y + y) > 15 ? 15 : (p.y + y) < 0 ? 0 : p.y + y;

    // Make sure there isn't a wall there
    if(!(PS.color(nx, ny) === Terrain.WALL.color)) {
        // Actually move
        p.x = nx;
        p.y = ny;
        // Check if player and target are at their goals
        if(p === M.target) {
            if (PS.color(nx, ny) === Terrain.TGOAL.color) {//TODO FIx this use bitmap
                M.tdone = true;
            } else {
                M.tdone = false;
            }
        } else if(p === M.player) {
            if (PS.color(nx, ny) === Terrain.PGOAL.color) {//TODO FIx this use bitmap
                M.pdone = true;
            } else {
                M.pdone = false;
            }
        }

        // If both are at goal, move to next lvl
        if(M.tdone && M.pdone) {
            PS.audioPlay("fx_coin2");

            if ( db && PS.dbValid( db ) ) {
                PS.dbEvent( db, "Level complete", M.currentLevel ); // val can be anything
            }

            if ( !M.levels[M.currentLevel + 1] && db && PS.dbValid( db ) ) {
                PS.dbEvent( db, "gameover", true );
                PS.dbSend( db, "bmoriarty", { discard : true } );
                db = null;
            }
            M.loadLevel(++M.currentLevel);
        }

        if (PS.color(nx, ny) === Terrain.TELEPORT.color) {
            PS.fade(nx, ny, 40);
            PS.audioPlay("fx_swoosh");
            p.x = 15 - p.x;
        }
    }

};

M.loadLevel = function(lvl) {
    var x = 0, y = 0;
    M.levels[lvl].split('').forEach( function(c) {
        if(c !== "\n" && x !== 16) {
            // PS.debug("Checking "+x+","+y);
            Object.keys(Terrain).forEach(function(terr) {
                // PS.debug("\t"+terr);
                if(c === Terrain[terr]["id"]) {
                    // PS.debug("Matched "+x+","+y);
                    M.level[x][y] = Terrain[terr]["color"];
                    // PS.color(x, y, Terrain[terr]["color"]);
                }
            });
            x++;
        } else if (y !== 15 && x !== 0) {
            y++;
            x = 0;
        }
    });
};

M.drawLevel = function() {
    for(var x = 0; x < 16; x++) {
        for(var y = 0; y < 16; y++) {
            PS.fade(x, y, 0);
            PS.color(x, y, M.level[x][y]);
            PS.borderColor(x, y, M.level[x][y]);
            PS.border(x, y, 0);
        }
    }
};

M.pos = function(x, y) {
    return {x: x, y: y};
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/
var finalize = function( system, options ) {
    PS.statusColor(0xFFFFFF);
    PS.statusText("Mirrors");

    PS.timerStart(5, function() {
        // Redraw map
        M.drawLevel();

        // Redraw player and target
        // PS.borderFade(M.player.x, M.player.y, 40);
        PS.color(M.player.x, M.player.y, 0x333333);
        PS.color(M.target.x, M.target.y, 0x777777);
        // PS.radius(M.player.x, M.player.y, 50);

    });
};

PS.init = function(system, option) {
    if(M.DEBUG) {
        PS.debug("Debug mode on. Disable for production.");
    } else {
        PS.debug = function(){};
    }

    PS.gridSize(16, 16);
    PS.gridColor(0x000000);

    M.loadLevel(0);
    M.drawLevel();

    if ( db ) {
        db = PS.dbInit( db, { login : finalize } );
        if ( db === PS.ERROR ) {
            db = null;
        }
    }
    else {
        finalize(system, options);
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
/*

PS.touch = function( x, y, data, options ) {
};

*/

/*
PS.release ( x, y, data, options )
Called when the mouse button is released over a bead, or when a touch is lifted off a bead
It doesn't have to do anything
[x] = zero-based x-position of the bead on the grid
[y] = zero-based y-position of the bead on the grid
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/
/*

PS.release = function( x, y, data, options ) {
};

*/

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

/*
PS.enter = function( x, y, data, options ) {
};
*/

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
};
*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
*/
PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

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
PS.keyDown = function( key, shift, ctrl, options ) {
    switch(key) {
        case PS.KEY_ARROW_LEFT:
            M.movePlayer(-1, 0);
            break;
        case PS.KEY_ARROW_RIGHT:
            M.movePlayer(1, 0);
            break;
        case PS.KEY_ARROW_UP:
            M.movePlayer(0, -1);
            break;
        case PS.KEY_ARROW_DOWN:
            M.movePlayer(0, 1);
            break;
    }


};

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


PS.keyUp = function( key, shift, ctrl, options ) {

};


/*
PS.input ( sensors, options )
Called when an input device event (other than mouse/touch/keyboard) is detected.
It doesn't have to do anything.
[sensors] = an object with sensor information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
NOTE: Mouse wheel events occur ONLY when the cursor is positioned over the grid.
*/
PS.input = function( sensors, options ) {

};



/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
It doesn't have to do anything.
[options] = an object with optional parameters; see API documentation for details.
NOTE: This event is only used for applications utilizing server communication.
*/
PS.shutdown = function( options ) {
    if ( db && PS.dbValid( db ) ) {
        PS.dbEvent( db, "shutdown", true );
        PS.dbSend( db, "bmoriarty", { discard : true } );
    }
};

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
