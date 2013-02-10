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

Search.prototype.MinimaxID = function(state, doAlphaBetaPruning) {
    this.timer = process.hrtime();
    var doAlphaBetaPruning = typeof doAlphaBetaPruning !== 'undefined' ? doAlphaBetaPruning : true;

    var milliseconds = 500;
    var timeLimit = milliseconds*1000000;
    var maxDepthLimit = 40;
    var ignoreTimeLimit = true;
    if (ignoreTimeLimit === true) {
        timeLimit = 10000*1000*1000000;
        maxDepthLimit = 8;
    }
    var numPlayers = 2;
    var bestPath = new Array();

    var negInf = -1000000000;
    var posInf = 1000000000;

    //var newState = currentState.clone();
    var alpha = 0;
    for (var depthLimit = 2; depthLimit <= maxDepthLimit; depthLimit += 2) {
        var newState = state.clone();     
        var tempBestPath = new Array();
        var tempAlpha = null;

        if (doAlphaBetaPruning === true) {                
            var alpha = negInf;
            var beta = posInf;
            var playerNumber = newState.getNextToMove();
            var maximizing = newState.isPlayerMax(playerNumber)
            // if (maximizing === false) {
            //     alpha *= -1;
            //     beta *= -1;
            // }
            tempAlpha = this.Minimax(tempBestPath, timeLimit, depthLimit, 0, newState, alpha, beta);
        } else {
            tempAlpha = this.MinimaxWithoutAB(tempBestPath, timeLimit, depthLimit, 0, newState);
        }
        if (tempAlpha instanceof Error) {
            break;
        } else {
            bestPath = tempBestPath;
            alpha = tempAlpha;
        }
    }
    console.log("best Alpha: "+alpha);
    return bestPath;
};

Search.prototype.MinimaxWithoutAB = function(bestPath, timeLimit, depthLimit, currentDepth, currentState) {
    var diff = process.hrtime(this.timer);
    if ((diff[0] * 1e9 + diff[1]) > timeLimit) {
        return new Error("Timeout");
    }

    if ((currentState.getMoves().length) === 0 || currentDepth >= depthLimit) {
        return currentState.getHeuristicValue();
    }

    var negInf = -1000000000;
    var posInf = 1000000000;

    var playerNumber = currentState.getNextToMove();
    var maximizing = currentState.isPlayerMax(playerNumber);

    var alpha = null;
    if (maximizing === true) {
        alpha = negInf;
    } else {
        alpha = posInf;
    }
    
    var moves = currentState.getMoves();
    var bestMove = null;
    var bestNewPath = null; 
    for (var i = 0; i < moves.length; i++) {
        var newState = currentState.clone();
        if ((currentState.equals(newState)) !== true) {
            console.log("currentState !== equals(newState)");
        }
        var moveSuccess = newState.move(moves[i]);
        if (moveSuccess !== true) {
            console.log("moveSuccess !== true");
            console.log("moves[i]: "+moves[i]);
            console.log("moves: "+moves);
        }
        var newPath = new Array();

        var result = this.MinimaxWithoutAB(newPath, timeLimit, depthLimit, currentDepth+1, newState);
        if (result instanceof Error) {
            return new Error("Timeout");
        }
        if (bestMove === null)  {
            bestMove = moves[i];
            bestNewPath = newPath;
        }
        if (maximizing === true) {
            if (result > alpha) {
                bestMove = moves[i];
                bestNewPath = newPath;
            }
            alpha = Math.max(alpha, result);
        } else {
            if (result < alpha) {
                bestMove = moves[i];
                bestNewPath = newPath;
            }
            alpha = Math.min(alpha, result);
        }
    }
    var bestMoveArray = [bestMove];
    bestMoveArray = bestMoveArray.concat(bestNewPath);
    bestPath.push.apply(bestPath, bestMoveArray);       //The only one-liner way to concat arrays without creating a new one!
    return alpha;
};



Search.prototype.Minimax = function(bestPath, timeLimit, depthLimit, currentDepth, currentState, alpha, beta) {
    var diff = process.hrtime(this.timer);
    if ((diff[0] * 1e9 + diff[1]) > timeLimit) {
        return new Error("Timeout");
    }

    if ((currentState.getMoves().length) === 0 || currentDepth >= depthLimit) {
        return currentState.getHeuristicValue();
    }

    var negInf = -1000000000;
    var posInf = 1000000000;

    var playerNumber = currentState.getNextToMove();
    var maximizing = currentState.isPlayerMax(playerNumber);
    
    var moves = currentState.getMoves();
    var bestMove = null;
    var bestNewPath = null;
    var localAlpha = alpha;
    var localBeta = beta;
    for (var i = 0; i < moves.length; i++) {
        var newState = currentState.clone();
        if ((currentState.equals(newState)) !== true) {
            console.log("currentState !== equals(newState)");
        }
        var moveSuccess = newState.move(moves[i]);
        if (moveSuccess !== true) {
            console.log("moveSuccess !== true");
            console.log("moves[i]: "+moves[i]);
            console.log("moves: "+moves);
        }
        var newPath = new Array();

        var result = this.Minimax(newPath, timeLimit, depthLimit, currentDepth+1, newState, localAlpha, localBeta);
        if (result instanceof Error) {
            return new Error("Timeout");
        }
        if (bestMove === null)  {
            bestMove = moves[i];
            bestNewPath = newPath;
        }
        if (maximizing === true) {
            // Cutoff
            if (result > alpha) {
                bestMove = moves[i];
                bestNewPath = newPath;
            }
            alpha = Math.max(alpha, result);
            if (result >= beta) {
                //console.log("beta cutoff. result:"+result+" beta: "+beta);
                //return result;
            }
            if (alpha > localAlpha) {
                localAlpha = alpha;
            }
        } else {
            // Cutoff
            if (result < beta) {
                bestMove = moves[i];
                bestNewPath = newPath;
            }
            beta = Math.min(beta, result);
            if (result <= alpha) {
                //console.log("alpha cutoff. result:"+result+" alpha: "+alpha);
                return result;
            }
            if (beta < localBeta) {
                localBeta = beta;
            }
        }
    }
    var bestMoveArray = [bestMove];
    bestMoveArray = bestMoveArray.concat(bestNewPath);
    bestPath.push.apply(bestPath, bestMoveArray);       //The only one-liner way to concat arrays without creating a new one!
    if (maximizing === true) {
        return alpha;
    } else {
        return beta;
    }
};
//console.log("=======================");
//console.log("bestNewPath: "+bestNewPath);
//console.log("bestPath: "+bestPath);
//console.log("bestMoveArray: "+bestMoveArray);
//console.log("bestPath push: "+bestPath);

module.exports = Search;