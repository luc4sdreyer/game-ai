

function GameState() {
    this.gridWidth = 7;
    this.gridHeight = 6;
    this.numberOfPlayers = 2;
    this.nextToMove = 0;

    this.grid = new Array(this.gridHeight);

    // y = 0 is the bottom of the grid, it will be used first 
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
    if (moved === false) {
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

GameState.prototype.isPlayerMax = function(playerNumber) {
    if (playerNumber === 0) {
        return true;
    } else {
        return false;
    }
};

GameState.prototype.equals = function(state) {
    if (state.gridWidth !== this.gridWidth) {
        return false;
    }
    if (state.gridHeight !== this.gridHeight) {
        return false;
    }
    if (state.numberOfPlayers !== this.numberOfPlayers) {
        return false;
    }
    if (state.nextToMove !== this.nextToMove) {
        return false;
    }

    var equals = true;
    for (var y = 0; y < this.gridHeight; y++) {
        for (var x = 0; x < this.gridWidth; x++) {
            if (state.grid[y][x] !== this.grid[y][x]) {
                equals = false;
            }
        }
    }
    return equals;
};

GameState.prototype.isGameOver = function() {
    var negInf = -1000000000;
    var posInf = 1000000000;

    var hValue = this.getHeuristicValue();
    if (hValue <= negInf || hValue >= posInf) {
        return true;
    } else {
        return false;
    }
};

GameState.prototype.printGrid = function() {
    var gridString = '';
    for (var x = 0; x < this.gridWidth; x++) {
        gridString += '|' + x;
    }
    gridString += '|\n';
    for (var x = 0; x < this.gridWidth; x++) {
        gridString += '##';
    }
    gridString += '#\n';
    for (var y = 0; y < this.gridHeight; y++) {
        for (var x = 0; x < this.gridWidth; x++) {
            gridString += '|' + this.grid[this.gridHeight-y-1][x];
            //gridString += '\t';
        }
        gridString += '|\n';
    }
    return gridString;
};

GameState.prototype.loadFromFile = function(filename) {
    var fs = require('fs');
    var array = fs.readFileSync(filename).toString().split("\n");
    for(var i = 0; i < array.length; i++) {
        if (i+1 === array.length) {
            this.nextToMove = parseInt(array[i]);
        } else {
            var elements = array[i].split("|");
            for(var j = 0; j < array.length; j++) {
                this.grid[array.length-i-2][j] = parseInt(elements[j]);
            }
        }
    }
    console.log("Loaded gameState:");
    console.log(this.printGrid());
};

GameState.prototype.getHeuristicValue = function() {
    var debug = 0;
    var chainLength = 1;
    var leftOpen = false;
    var rightOpen = false;
    var zeroChain = [0,0];
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
        // Check for sequences of the same colour of length 2-4 (chains) horizontally
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
                    } else if (chainLength >= 4) {
                        zeroChain[this.grid[y][x-1]-1]++;
                    }
                    chainLength = 1;
                    leftOpen = false;
                    rightOpen = false;
                }

            }
        }
    }

    if (doV === true) {
        // Check for chains vertically
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
                    } else if (chainLength >= 4) {
                        zeroChain[this.grid[y-1][x]-1]++;
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
                } else if (chainLength >= 4) {
                    zeroChain[this.grid[y+1][x-1]-1]++;
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
                } else if (chainLength >= 4) {
                    zeroChain[this.grid[y-1][x-1]-1]++;
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
    var fourChains = [0,0];
    fourChains[0] = singleChain[0][4] + doubleChain[0][4] + zeroChain[0];
    fourChains[1] = singleChain[1][4] + doubleChain[1][4] + zeroChain[1];
    if (fourChains[0] + fourChains[1] !== 0) {
        //console.log("H1");
        if (fourChains[0] >= fourChains[1]) {
            score = posInf;
        } else {
            score = negInf;
        }
    } else {
        //console.log("H2");
        var singleChainValue = [0,0,1,10,0];
        var doubleChainValue = [0,0,2,20,0];
        for (var i = 0; i < singleChainValue.length; i++) {
            //console.log("H3");
            score += (singleChain[0][i] - singleChain[1][i])*singleChainValue[i] + (doubleChain[0][i] - doubleChain[1][i])*doubleChainValue[i]
        }
    }

    var print = 0;
    if (print > 0) {
        console.log("            0,1,2,3,4");
        console.log("zeroChain          :"+zeroChain[0]);
        console.log("zeroChain          :"+zeroChain[1]);
        console.log("singleChain:"+singleChain[0]);
        console.log("singleChain:"+singleChain[1]);
        console.log("doubleChain:"+doubleChain[0]);
        console.log("doubleChain:"+doubleChain[1]);
    }
    return score;
};

module.exports = GameState;