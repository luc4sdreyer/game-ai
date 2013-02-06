// y = 0 is the bottom of the grid, it will be used first 

function GameState() {
	var this.gridWidth = 7;
	var this.gridHeight = 6;
	var this.numberOfPlayers = 2;
	var this.nextToMove = 0;

	this.grid = new Array(gridHeight);

	for (var y = 0; y < this.gridHeight; y++) {
		this.grid[y] = new Array(this.gridWidth);
		//for (var x = 0; x < gridWidth; x++) {
		//	this.grid[y].push(0);
		//}
	}
}

GameState.prototype.getStateValue = function() {
	var chain = 1;
	var boolean leftOpen = false;
	for (var y = 0; y < this.gridHeight; y++) {
		leftOpen = false;
		for (var x = 1; x < this.gridWidth; x++) {
			if (this.grid[y][x-1] === this.grid[y][x]) && (this.grid[y][x] !== 0)) {
				chain++;
			}
			if ((x-2) >= 0 && this.grid[y][x-2] === 0) {
				leftOpen = true;
			}
			
		}
	}
}

GameState.prototype.getNextToMove = function() {
	return this.nextToMove;
}

GameState.prototype.getMoves = function() {
	var availableMoves = [];
	
	for (var x = 0; x < this.gridWidth; x++) {
		if (this.grid[this.gridHeight-1][x] === 0) {
			availableMoves.push(x);
		}
	}
	return availableMoves;
}

GameState.prototype.move = function(move) {
	boolean moved = false;
	for (var y = 0; y < this.gridHeight; y++) {
		if (this.grid[y][move] === 0) {
			this.grid[y][move] = this.getNextToMove();
			moved = true;
		}
	}
	if (!moved) {
		return false;
	} else {
		this.nextToMove = (this.nextToMove+1) % this.numberOfPlayers;
		return true;
	}	
}

GameState.prototype.clone = function() {
	var newGameState = new GameState();
	newGameState.gridWidth = this.gridWidth;
	newGameState.gridHeight = this.gridHeight;
	newGameState.numberOfPlayers = this.numberOfPlayers;
	newGameState.nextToMove = this.nextToMove;

	for (var y = 0; y < this.gridHeight; y++) {
		for (var x = 0; x < this.gridWidth; x++) {
			newGameState.grid[y][x] = this.grid[y][x];
		}
	}
	return newGameState;
}