function Random() {
}

Random.prototype.getMove = function(state) {	
	var moves = state.getMoves();
	var randomMove = moves[Math.floor(Math.random()*moves.length)];
	return randomMove;
};

module.exports = Random;