// This function 

function Search() {
    this.timer = null;
}

/* state object must support the following functions:
        name                return type
        ----                -----------
        clone()             state
        getHeuristicValue() number
        getNextToMove()     integer
        getMoves()          list of moves
        move(move)          boolean
 */

Search.prototype.MinimaxID = function(state) {
    this.timer = process.hrtime();
    var milliseconds = 3000;
    var timeLimit = milliseconds*1000000;
    var maxDepthLimit = 40;
    var numPlayers = 2;
    var bestPath = new Array(numPlayers);

    var negInf = -1000000000;
    var posInf = 1000000000;

    //var newState = currentState.clone();
    var alpha = 0;
    for (var depthLimit = 2; depthLimit < maxDepthLimit; depthLimit++) {
        var newState = state.clone();        
        // for (var playerNumber = 0; playerNumber < numPlayers; playerNumber++) {
        //     for (var bestMove in bestPath[playerNumber]) {
        //         newState.move(bestMove);
        //     }
        // }
        bestPath = new Array();
        for (var i = 0; i < numPlayers; i++) {
            bestPath.push(new Array(depthLimit));
        }
        alpha = this.Minimax(bestPath, timeLimit, depthLimit, 0, newState);
        if (alpha instanceof Error) {
            break;
        }
    }
    return bestPath;
};

Search.prototype.Minimax = function(bestPath, timeLimit, depthLimit, currentDepth, currentState) {
    var diff = process.hrtime(this.timer);
    if ((diff[0] * 1e9 + diff[1]) > timeLimit) {
        return new Error("Timeout");
    }
    //console.log("(diff[0] * 1e9 + diff[1]): "+(diff[0] * 1e9 + diff[1]));
    //console.log("timeLimit: "+timeLimit);
    //console.log("process.hrtime()[1]: "+process.hrtime()[1]);
    //console.log("diff: "+(process.hrtime()[1] - this.timer));

    if ((currentState.getMoves().length) === 0 || currentDepth >= depthLimit) {
        return currentState.getHeuristicValue();
    }

    var negInf = -1000000000;
    var posInf = 1000000000;

    var alpha = negInf;

    var playerNumber = currentState.getNextToMove();
    var moves = currentState.getMoves();
    var bestMove = null;
    var newAlpha = alpha;
    for (var possibleMove in moves) {
        var newState = currentState.clone();
        newState.move(possibleMove);
        var minimax = this.Minimax(bestPath, timeLimit, depthLimit, currentDepth+1, newState);
        if (minimax instanceof Error) {
            return new Error("Timeout");
        }
        newAlpha = Math.max(alpha, -1*minimax);
        if (newAlpha > alpha) {
            bestMove = possibleMove;
        }
        alpha = newAlpha;
    }
    bestPath[playerNumber][currentDepth] = bestMove;
    return alpha;
};

module.exports = Search;