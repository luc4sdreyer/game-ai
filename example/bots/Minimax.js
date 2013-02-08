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
    var move = bestPath[state.getNextToMove()][0];
    return move;
};

module.exports = Minimax;