var g = require('./Game');
run();

function run() {
	//test1();
	test2();
}

function test1() {
	var state = new g.GameState();
	console.log("state: ");
	console.log(state);
	console.log("state.getNextToMove(): "+state.getNextToMove());
	console.log("state.getMoves(): "+state.getMoves());
	var newState = state.clone();
	console.log("state.clone(): ");
	console.log(newState);
}

function test2() {
	//do 20 random moves
	var state = new g.GameState();
	for (var i = 0; i<10; i++) {
		var moves = state.getMoves();
		var randomMove = moves[Math.floor(Math.random()*moves.length)];
		state.move(randomMove);
	}

	console.log("state: ");
	console.log(state);
	console.log(state.printGrid());
}