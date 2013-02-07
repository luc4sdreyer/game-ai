require('process');

var g = require('./Game');
var state = new g.GameState();

var b = require('./bots/Bots');
var bot = new b.Random();

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
		console.log("Play vs a bot? y/n");
	} else {
		console.log("Pick a move: "+state.getMoves());
	}
}

function gotData(input) {
	if (setup === true) {
		var stringInput = String(input);
		//console.log(stringInput.charAt(0));
		if (stringInput.charAt(0) === 'y' || stringInput.charAt(0) === 'n') {
			if (stringInput.charAt(0) === 'y') {
				vsBot = true;
			}
			setup = false;
			promptInput();
		} else {
			console.log("Invalid option, try again.");
		}
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
	var hValue = state.getStateValue();
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