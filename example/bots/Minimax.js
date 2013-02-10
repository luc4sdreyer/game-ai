var gameAI = require('../../src/GameAI')

function Minimax(doAlphaBetaPruning) {
    this.doAlphaBetaPruning = typeof doAlphaBetaPruning !== 'undefined' ? doAlphaBetaPruning : true;
}

Minimax.prototype.getMove = function(state) {
	var failedMove = false;
	var search = new gameAI.Search();
	var bestPath  = search.MinimaxID(state, this.doAlphaBetaPruning);
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