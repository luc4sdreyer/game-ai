var g = require('./Game');
run();

function run() {
	//test1();
	test5();
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
	state.getStateValue();
}

function test3() {
	var state = new g.GameState();

	state.grid[5] = [0,0,0,0,0,0,0];
	state.grid[4] = [0,0,0,0,0,0,0];
	state.grid[3] = [2,2,0,0,0,2,2];
	state.grid[2] = [0,0,0,0,0,0,0];
	state.grid[1] = [0,1,1,1,1,0,0];
	state.grid[0] = [0,1,1,0,2,0,0];

	//console.log("state: ");
	//console.log(state);
	console.log(state.printGrid());
	state.getStateValue();
}

function test4() {
	var state = new g.GameState();

	state.grid[5] = [0,0,1,1,0,0,0];
	state.grid[4] = [0,1,0,0,0,0,0];
	state.grid[3] = [1,1,0,1,0,0,0];
	state.grid[2] = [0,0,0,0,0,0,0];
	state.grid[1] = [0,1,0,0,0,0,0];
	state.grid[0] = [0,0,0,0,0,0,0];

	//console.log("state: ");
	//console.log(state);
	console.log(state.printGrid());
	state.getStateValue();
}

function test5() {
	var state = new g.GameState();

	state.grid[5] = [0,0,0,0,0,0,0];
	state.grid[4] = [1,1,1,0,1,1,1];
	state.grid[3] = [1,1,1,0,1,1,1];
	state.grid[2] = [0,0,0,0,0,0,0];
	state.grid[1] = [1,1,1,0,1,1,1];
	state.grid[0] = [1,1,1,0,1,1,1];

	//console.log("state: ");
	//console.log(state);
	console.log(state.printGrid());
	state.getStateValue();
}