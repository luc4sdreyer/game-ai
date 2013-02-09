var gameAI = require('../../src/GameAI')

function Minimax() {
}

Minimax.prototype.getMove = function(state) {
	var search = new gameAI.Search();
	var bestPath  = search.MinimaxID(state);
    if (bestPath instanceof Error) {
        return bestPath;
    }
    console.log("bestPath: "+bestPath);
    var move = parseInt(bestPath[0]);								//Why is parseInt necessary?!
    //console.log("move: "+move);
    //console.log("availableMoves: "+state.getMoves());
    if (state.canMove(move) === true) {
    	return move;
    } else {
    	console.log("Minimax bot provided invalid move, using random move");    	 
	    var moves = state.getMoves();
	    var randomMove = moves[Math.floor(Math.random()*moves.length)];
	    return randomMove;
    }    
};

module.exports = Minimax;