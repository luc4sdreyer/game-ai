require('process');

var g = require('./Game');
var state = new g.GameState();

var b = require('./bots/Bots');
var bot = null;

var setup = true;
var vsBot = false;

var stdin = process.openStdin();
stdin.on('data', gotData);

displayState();
promptInput();

function displayState() {
    console.log("Current game grid:");
    console.log(state.printGrid());
}

function promptInput() {
    if (setup === true) {
        console.log("Choose an opponent: (1) Minimax bot; (2) Random bot; (3) Human ");
    } else {
        console.log("Pick a move: "+state.getMoves());
    }
}

function gotData(input) {
    if (setup === true) {
        //var stringInput = String(input);
        var numInput = parseInt(input);
        //console.log(stringInput.charAt(0));
        setup = false;
        switch (numInput) {
        case 1:
            vsBot = true;
            bot = new b.Minimax();
            break;
        case 2:
            vsBot = true;
            bot = new b.Random();
            break;
        case 3:
            vsBot = false;
            break;
        default:            
            setup = true;
            console.log("Invalid option, try again.");
            break;
        }
        if (setup === false) {            
            promptInput();
        }
        // if (numInput === 1 || numInput === 2 || numInput === 3) {
        //     switch if (stringInput.charAt(0) === 'y') {
        //         vsBot = true;
        //     }
        //     setup = false;
        //     promptInput();
        // } else {
        //     console.log("Invalid option, try again.");
        // }
    } else {
        var validMove = state.canMove(parseInt(input));
        if (validMove !== true) {
            console.log("Invalid option, try again.");
            return;
        } else {
            doMove(parseInt(input));
        }
    }
}

function doMove(move) { 
    var negInf = -1000000000;
    var posInf = 1000000000;

    var playerToMoveNow = state.getNextToMove();
    state.move(move);
    var hValue = state.getHeuristicValue();
    console.log("hValue: "+hValue);
    if (hValue <= negInf || hValue >= posInf) {
        console.log("==========================");
        console.log("Game over, player "+(playerToMoveNow+1)+" wins!");
        console.log("Final game grid:");
        console.log(state.printGrid());
        process.exit(1);
    } else {
        displayState();
        if ((vsBot === true && state.getNextToMove() === 0) || vsBot === false) {
            promptInput();
        } else {
            doMove(bot.getMove(state));
        }
    }
}