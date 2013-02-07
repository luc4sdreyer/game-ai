// y = 0 is the bottom of the grid, it will be used first 

function GameState() {
	this.gridWidth = 7;
	this.gridHeight = 6;
	this.numberOfPlayers = 2;
	this.nextToMove = 0;

	this.grid = new Array(this.gridHeight);

	for (var y = 0; y < this.gridHeight; y++) {
		this.grid[y] = new Array(this.gridWidth);
		for (var x = 0; x < this.gridWidth; x++) {
			this.grid[y][x] = 0;
		}
	}
}

GameState.prototype.getStateValue = function() {
	var chainLength = 1;
	var leftOpen = false;
	var rightOpen = false;
	var chains0 = new Array(2);
	chains0[0] = new Array(5);
	chains0[1] = new Array(5);
	var chains1 = new Array(2);
	chains1[0] = new Array(5);
	chains1[1] = new Array(5);
	for (var y = 0; y < this.gridHeight; y++) {
		leftOpen = false;
		rightOpen = false;
		chainLength = 1;
		for (var x = 1; x < this.gridWidth; x++) {
			if ((this.grid[y][x-1] === this.grid[y][x]) && (this.grid[y][x] !== 0)) {
				chainLength++;
			} else if (chainLength > 1) {
				if (this.grid[y][x] !== 0) {
					rightOpen = true;
				}
				if (rightOpen && leftOpen) {
					chains1[this.grid[y][x-1]][chainLength]++;
				} else if (rightOpen || leftOpen) {
					chains0[this.grid[y][x-1]][chainLength]++;
				}
				chainLength = 1;
				leftOpen = false;
				rightOpen = false;
			}
			if ((x-2) >= 0 && this.grid[y][x-2] === 0) {
				leftOpen = true;
			}

		}
	}
	console.log("chains0:"+chains0);
	console.log("chains1:"+chains1);
};

GameState.prototype.getNextToMove = function() {
	return this.nextToMove;
};

GameState.prototype.getMoves = function() {
	var availableMoves = [];
	
	for (var x = 0; x < this.gridWidth; x++) {
		if (this.grid[this.gridHeight-1][x] === 0) {
			availableMoves.push(x);
		}
	}
	return availableMoves;
};

GameState.prototype.canMove = function(move) {
	var availableMoves = this.getMoves;
	var index = availableMoves.indexOf(move);
	if (index >= 0) {
		return true;
	} else {
		return false;
	}
};

GameState.prototype.move = function(move) {
	var moved = false;
	for (var y = 0; y < this.gridHeight; y++) {
		if (this.grid[y][move] === 0) {
			this.grid[y][move] = this.getNextToMove()+1;
			moved = true;
			break;
		}
	}
	if (!moved) {
		return false;
	} else {
		this.nextToMove = (this.nextToMove+1) % this.numberOfPlayers;
		return true;
	}	
};

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
};

GameState.prototype.printGrid = function() {
	var gridString = '';

	for (var y = 0; y < this.gridHeight; y++) {
		for (var x = 0; x < this.gridWidth; x++) {
			gridString += this.grid[this.gridHeight-y-1][x];
		}
		gridString += '\n';
	}
	return gridString;
};

module.exports = GameState;