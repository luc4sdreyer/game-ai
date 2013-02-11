var gameAI = require('../../src/GameAI')

function Minimax(doAlphaBetaPruning, timeLimit, ignoreTimeLimit, maxDepthLimit) {
    this.doAlphaBetaPruning = doAlphaBetaPruning;
    this.timeLimit          = timeLimit;
    this.ignoreTimeLimit    = ignoreTimeLimit;
    this.maxDepthLimit      = maxDepthLimit;
}

Minimax.prototype.getMove = function(state) {
	var failedMove = false;
	var search = new gameAI.Search();
	var bestPath  = search.MinimaxID(state, this.doAlphaBetaPruning, this.timeLimit, this.ignoreTimeLimit, this.maxDepthLimit);
    if (!(bestPath instanceof Error)) {
	    console.log("bestPath: "+bestPath);
	    var move = parseInt(bestPath[0]);								//Why is parseInt necessary?!
	    //console.log("move: "+move);
	    //console.log("availableMoves: "+state.getMoves());
	    if (state.canMove(move) === true) {
	    	return move;
	    }
    }
	//console.log("Minimax bot provided invalid move, using random move");    	 
    //var moves = state.getMoves();
    //var randomMove = moves[Math.floor(Math.random()*moves.length)];
    console.log("Minimax bot (player "+state.getNextToMove()+") provided invalid move ("+move+")");
    return -1;
};

module.exports = Minimax;