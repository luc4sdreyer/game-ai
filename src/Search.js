// This function 

/* state object must support the following functions:
        name                return type
        ----                -----------
        clone()             state
        getStateValue()     number
        getNextToMove()     integer
        getMoves()          list of moves
        move(move)          boolean
 */
function MinimaxID(state) {
    var miliseconds = 3000;
    var timeLimit = miliseconds*1000000;
    var maxDepthLimit = 100;
    var numPlayers = 2;
    var bestPath = new Array(numPlayers);

    var negInf = -1000000000;
    var posInf = 1000000000;

    //var newState = currentState.clone();
    var alpha = 0;
    for (var depthLimit = 2; depthLimit < maxDepthLimit; depthLimit++) {
        // var newState = state.clone();        
        // for (var playerNumber = 0; playerNumber < numPlayers; playerNumber++) {
        //     for (var bestMove in bestPath[playerNumber]) {
        //         newState.move(bestMove);
        //     }
        // }
        bestPath = new Array(numPlayers);
        alpha = this.Minimax(bestPath, timeLimit, depthLimit, 0, newState))
        if (alpha instanceof Error) {
            break;
        }
    }
    return bestPath;
}

function Minimax(bestPath, timeLimit, depthLimit, currentDepth, currentState) {
    if (timer[1] - process.hrtime()[1] > timeLimit) {
        return new Error("Timeout");
    }

    if (len(getMoves(currentState)) === 0 || currentDepth >= depthLimit) {
        return currentState.getStateValue();
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
        newAlpha = max(alpha, -1*this.Minimax(timeLimit, depthLimit, currentDepth+1, newState))
        if (newAlpha instanceof Error) {
            return new Error("Timeout");
        }
        if (newAlpha > alpha) {
            bestMove = possibleMove;
        }
        alpha = newAlpha;
    }
    bestPath[playerNumber].push(bestMove);
    return alpha;
}