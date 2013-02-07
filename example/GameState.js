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
	var availableMoves = this.getMoves();
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
			//gridString += '\t';
		}
		gridString += '\n';
	}
	return gridString;
};

GameState.prototype.getStateValue = function() {
	var debug = 0;
	var chainLength = 1;
	var leftOpen = false;
	var rightOpen = false;
	var singleChain = new Array(2);
	singleChain[0] = new Array(5);
	singleChain[1] = new Array(5);
	var doubleChain = new Array(2);
	doubleChain[0] = new Array(5);
	doubleChain[1] = new Array(5);
	for (var i = 0; i < singleChain[0].length; i++) {
		singleChain[0][i] = 0;
		singleChain[1][i] = 0;
		doubleChain[0][i] = 0;
		doubleChain[1][i] = 0;
	}

	var doH = true;
	var doV = true;
	var doD1 = true;
	var doD2 = true;

	if (doH === true) {
		// Check for sequences of the same colour of length 2-4 horizontally
		for (var y = 0; y < this.gridHeight; y++) {
			leftOpen = false;
			rightOpen = false;
			chainLength = 1;
			for (var x = 1; x < this.gridWidth; x++) {
				if (debug > 0)
					console.log("chainLength: "+chainLength);
				if (x >= 2 && this.grid[y][x-2] === 0) {
					leftOpen = true;
					if (debug > 0)
						console.log("\tif1");
				}
				if ((this.grid[y][x-1] === this.grid[y][x]) && (this.grid[y][x] !== 0)) {
					chainLength++;
					if (debug > 0)
						console.log("\t\tif2");
				}
				if ((chainLength > 1) && ((this.grid[y][x-1] !== this.grid[y][x]) || (x === this.gridWidth-1))) {
					if (debug > 0)
						console.log("\t\t\tif3");
					if (this.grid[y][x] === 0) {
						rightOpen = true;
						if (debug > 0)
							console.log("\t\t\tif\tA");
					}
					if (debug > 0) {
						console.log("rightOpen: "+rightOpen);
						console.log("leftOpen: "+leftOpen);
						console.log("this.grid["+y+"]["+x+"]: "+this.grid[y][x]);
					}
					if (rightOpen === true && leftOpen === true) {
						if (doubleChain[this.grid[y][x-1]-1][chainLength] === 0)
							doubleChain[this.grid[y][x-1]-1][chainLength] = 1;
						else 
							doubleChain[this.grid[y][x-1]-1][chainLength]++;
						if (debug > 0)
							console.log("\t\t\tif\tB");
					} else if (rightOpen === true || leftOpen === true) {					
						if (singleChain[this.grid[y][x-1]-1][chainLength] === 0)
							singleChain[this.grid[y][x-1]-1][chainLength] = 1;
						else 
							singleChain[this.grid[y][x-1]-1][chainLength]++;
						if (debug > 0)
							console.log("\t\t\tif\tC");
					}
					chainLength = 1;
					leftOpen = false;
					rightOpen = false;
				}

			}
		}
	}

	if (doV === true) {
		// Check for sequences vertically
		for (var x = 0; x < this.gridWidth; x++) {
			leftOpen = false;
			rightOpen = false;
			chainLength = 1;
			for (var y = 1; y < this.gridHeight; y++) {
				if (debug > 0)
					console.log("chainLength: "+chainLength);
				if (y >= 2 && this.grid[y-2][x] === 0) {
					leftOpen = true;
					if (debug > 0)
						console.log("\tif1");
				}
				if ((this.grid[y-1][x] === this.grid[y][x]) && (this.grid[y][x] !== 0)) {
					chainLength++;
					if (debug > 0)
						console.log("\t\tif2");
				}
				if ((chainLength > 1) && ((this.grid[y-1][x] !== this.grid[y][x]) || (y === this.gridHeight-1))) {
					if (debug > 0)
						console.log("\t\t\tif3");
					if (this.grid[y][x] === 0) {
						rightOpen = true;
						if (debug > 0)
							console.log("\t\t\tif\tA");
					}
					if (debug > 0) {
						console.log("rightOpen: "+rightOpen);
						console.log("leftOpen: "+leftOpen);
						console.log("this.grid[y]["+x+"]: "+this.grid[y][x]);
					}
					if (rightOpen === true && leftOpen === true) {
						if (doubleChain[this.grid[y-1][x]-1][chainLength] === 0)
							doubleChain[this.grid[y-1][x]-1][chainLength] = 1;
						else 
							doubleChain[this.grid[y-1][x]-1][chainLength]++;
						if (debug > 0)
							console.log("\t\t\tif\tB");
					} else if (rightOpen === true || leftOpen === true) {					
						if (singleChain[this.grid[y-1][x]-1][chainLength] === 0)
							singleChain[this.grid[y-1][x]-1][chainLength] = 1;
						else 
							singleChain[this.grid[y-1][x]-1][chainLength]++;
						if (debug > 0)
							console.log("\t\t\tif\tC");
					}
					chainLength = 1;
					leftOpen = false;
					rightOpen = false;
				}

			}
		}
	}

	if (doD1 === true) {
		// Check for chains diagonally (y = -x on Cartesian plane)
		var x = 0;
		var y = 0;
		var yC = 0;
		var c = 0;
		var s = this.gridWidth*this.gridHeight;
		while (c < s) {
			//console.log("("+x+","+y+")");
			//this.grid[y][x] = c;

			//if (x > 0 && y < this.gridHeight-1) {
			if (debug > 0)
				console.log("chainLength: "+chainLength);
			if ((x >= 2 && y < this.gridHeight-2) && this.grid[y+2][x-2] === 0) {
				leftOpen = true;
				if (debug > 0)
					console.log("\tif1");
			}
			if ((x > 0 && y < this.gridHeight-1) && ((this.grid[y+1][x-1] === this.grid[y][x]) && (this.grid[y][x] !== 0))) {
				chainLength++;
				if (debug > 0)
					console.log("\t\tif2");
			}
			if ((chainLength > 1) && ((this.grid[y+1][x-1] !== this.grid[y][x]) || ((x === this.gridWidth-1) || (y === 0)))) {
				if (debug > 0)
					console.log("\t\t\tif3");
				if (this.grid[y][x] === 0) {
					rightOpen = true;
					if (debug > 0)
						console.log("\t\t\tif\tA");
				}
				if (debug > 0) {
					console.log("rightOpen: "+rightOpen);
					console.log("leftOpen: "+leftOpen);
					console.log("this.grid[y]["+x+"]: "+this.grid[y][x]);
				}
				if (rightOpen === true && leftOpen === true) {
					if (doubleChain[this.grid[y+1][x-1]-1][chainLength] === 0)
						doubleChain[this.grid[y+1][x-1]-1][chainLength] = 1;
					else 
						doubleChain[this.grid[y+1][x-1]-1][chainLength]++;
					if (debug > 0)
						console.log("\t\t\tif\tB");
				} else if (rightOpen === true || leftOpen === true) {					
					if (singleChain[this.grid[y+1][x-1]-1][chainLength] === 0)
						singleChain[this.grid[y+1][x-1]-1][chainLength] = 1;
					else 
						singleChain[this.grid[y+1][x-1]-1][chainLength]++;
					if (debug > 0)
						console.log("\t\t\tif\tC");
				}
				chainLength = 1;
				leftOpen = false;
				rightOpen = false;
			}
			//}

			y--;
			x++;
			c++;
			if ((x >= this.gridWidth) || (y < 0)) {
				y = ++yC;
				x = 0;
				leftOpen = false;
				rightOpen = false;
				chainLength = 1;
			}
			while (y >= this.gridHeight) {			
				y--;
				x++;
			}
		}
	}

	if (doD2) {
		// Check for chains diagonally (y = x on Cartesian plane)
		var x = 0;
		var y = this.gridHeight-1;
		var yC = 1;
		var c = 0;
		var s = this.gridWidth*this.gridHeight;
		while (c < s) {
			//console.log("("+x+","+y+")");
			//this.grid[y][x] = c;

			//if (x > 0 && y > 0) {
			if (debug > 0)
				console.log("chainLength: "+chainLength);
			if ((x >= 2 && y >= 2) && this.grid[y-2][x-2] === 0) {
				leftOpen = true;
				if (debug > 0)
					console.log("\tif1");
			}
			if ((x > 0 && y > 0) && ((this.grid[y-1][x-1] === this.grid[y][x]) && (this.grid[y][x] !== 0))) {
				chainLength++;
				if (debug > 0)
					console.log("\t\tif2");
			}
			if ((chainLength > 1) && ((this.grid[y-1][x-1] !== this.grid[y][x]) || ((x === this.gridWidth-1) || (y === this.gridHeight-1)))) {
				if (debug > 0)
					console.log("\t\t\tif3");
				if (this.grid[y][x] === 0) {
					rightOpen = true;
					if (debug > 0)
						console.log("\t\t\tif\tA");
				}
				if (debug > 0) {
					console.log("rightOpen: "+rightOpen);
					console.log("leftOpen: "+leftOpen);
					console.log("this.grid["+y+"]["+x+"]: "+this.grid[y][x]);
				}
				if (rightOpen === true && leftOpen === true) {
					if (doubleChain[this.grid[y-1][x-1]-1][chainLength] === 0)
						doubleChain[this.grid[y-1][x-1]-1][chainLength] = 1;
					else 
						doubleChain[this.grid[y-1][x-1]-1][chainLength]++;
					if (debug > 0)
						console.log("\t\t\tif\tB");
				} else if (rightOpen === true || leftOpen === true) {					
					if (singleChain[this.grid[y-1][x-1]-1][chainLength] === 0)
						singleChain[this.grid[y-1][x-1]-1][chainLength] = 1;
					else 
						singleChain[this.grid[y-1][x-1]-1][chainLength]++;
					if (debug > 0)
						console.log("\t\t\tif\tC");
				}
				chainLength = 1;
				leftOpen = false;
				rightOpen = false;
			}
			//}

			y++;
			x++;
			c++;
			if ((x >= this.gridWidth) || (y >= this.gridHeight)) {
				y = this.gridHeight - ++yC;
				x = 0;
				leftOpen = false;
				rightOpen = false;
				chainLength = 1;
			}
			while (y < 0) {			
				y++;
				x++;
			}
		}
	}
	//console.log(this.printGrid());

    var negInf = -1000000000;
    var posInf = 1000000000;
	var score = 0;

	// Check for endgame condition, othwise calculate heuristic value
	if (singleChain[0][4]+doubleChain[0][4] + singleChain[1][4]+doubleChain[1][4] !== 0) {
		if (singleChain[0][4]+doubleChain[0][4] >= singleChain[1][4]+doubleChain[1][4]) {
			score = posInf;
		} else {
			score = negInf;
		}
	} else {
		var singleChainValue = [0,0,1,10,0];
		var doubleChainValue = [0,0,2,20,0];
		for (var i = 0; i < singleChain.length; i++) {
			score += (singleChain[0][i] - singleChain[1][i])*singleChainValue[i] + (doubleChain[0][i] - doubleChain[1][i])*doubleChainValue[i]
		}
	}
	return score;


	console.log("            0,1,2,3,4");
	console.log("singleChain:"+singleChain[0]);
	console.log("singleChain:"+singleChain[1]);
	console.log("doubleChain:"+doubleChain[0]);
	console.log("doubleChain:"+doubleChain[1]);
};

module.exports = GameState;