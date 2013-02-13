var g = require('./Game');
run();

function run() {
    //test1();
    //test6();
    testBots2();
}

function test1() {
    var state = new g.GameState();
    console.log("state: ");
    console.log(state);
    console.log("state.getNextToMove(): "+state.getNextToMove());
    console.log("state.getMoves(): "+state.getMoves());
    var newState = state.clone();
    console.log("state.clone(): ");
    console.log(newState);
}

function test2() {
    //do 20 random moves
    var state = new g.GameState();
    for (var i = 0; i<10; i++) {
        var moves = state.getMoves();
        var randomMove = moves[Math.floor(Math.random()*moves.length)];
        state.move(randomMove);
    }

    console.log("state: ");
    console.log(state);
    console.log(state.printGrid());
    state.getHeuristicValue();
}

function test3() {
    var state = new g.GameState();

    state.grid[5] = [0,0,0,0,0,0,0];
    state.grid[4] = [0,0,0,0,0,0,0];
    state.grid[3] = [2,2,0,0,0,2,2];
    state.grid[2] = [0,0,0,0,0,0,0];
    state.grid[1] = [0,1,1,1,1,0,0];
    state.grid[0] = [0,1,1,0,2,0,0];

    //console.log("state: ");
    //console.log(state);
    console.log(state.printGrid());
    state.getHeuristicValue();
}

function test4() {
    var state = new g.GameState();

    state.grid[5] = [0,0,1,1,0,0,0];
    state.grid[4] = [0,1,0,0,0,0,0];
    state.grid[3] = [1,1,0,1,0,0,0];
    state.grid[2] = [0,0,0,0,0,0,0];
    state.grid[1] = [0,1,0,0,0,0,0];
    state.grid[0] = [0,0,0,0,0,0,0];

    //console.log("state: ");
    //console.log(state);
    console.log(state.printGrid());
    state.getHeuristicValue();
}

function test5() {
    var state = new g.GameState();

    state.grid[5] = [0,0,0,0,0,0,0];
    state.grid[4] = [1,1,1,0,1,1,1];
    state.grid[3] = [1,1,1,0,1,1,1];
    state.grid[2] = [0,0,0,0,0,0,0];
    state.grid[1] = [1,1,1,0,1,1,1];
    state.grid[0] = [1,1,1,0,1,1,1];

    //console.log("state: ");
    //console.log(state);
    console.log(state.printGrid());
    state.getHeuristicValue();
}

function test6() {
    var state = new g.GameState();

    state.grid[5] = [0,0,0,0,0,0,0];
    state.grid[4] = [0,0,0,0,0,0,0];
    state.grid[3] = [0,0,0,0,0,0,0];
    state.grid[2] = [0,0,0,0,0,0,0];
    state.grid[1] = [2,0,0,0,2,0,2];
    state.grid[0] = [1,2,2,1,1,1,1];

    //console.log("state: ");
    //console.log(state);
    console.log(state.printGrid());
    state.getHeuristicValue();
}

// Play a tournament between a number of bots
function testBots1() {
    var b = require('./bots/Bots');
    var state = new g.GameState();
    var bots = [
        new b.Minimax(true , null, true, 6),
        new b.Minimax(false, null, true, 6)
        ,new b.Random()
        ];
    var numGames = 10;
    results = new Array(bots.length);
    for (var bot1 = 0; bot1 < bots.length; bot1++) {
        results[bot1] = new Array(bots.length);
        for (var bot2 = 0; bot2 < bots.length; bot2++) {
            results[bot1][bot2] = 0;
        }
    }

    for (var gameNr = 0; gameNr < numGames; gameNr++) {
        for (var bot1 = 0; bot1 < bots.length; bot1++) {
            for (var bot2 = 0; bot2 < bots.length; bot2++) {
                if (bot2 === bot1) continue;
                //if (bot2 >= bot1) break;
                state = new g.GameState();
                //state.loadFromFile("grid.txt");
                var players = [bots[bot1], bots[bot2]];
                var playerNum = 0;
                while (state.isGameOver() !== true) {
                    var move = players[playerNum++].getMove(state);
                    var success = state.move(move);                
                    if (success !== true) {
                        console.log(players[playerNum-1]+" provided invalid move ("+move+"), game ended");
                        break;
                    }                
                    console.log(state.printGrid());
                    if (state.isGameOver() === true) {
                        console.log(players[playerNum-1]+" (player "+playerNum+") wins!");
                        if ((playerNum === 0) != (bot2 > bot1)) { //Another way to do XOR
                            results[bot1][bot2]++;
                        } else {
                            results[bot2][bot1]++;
                        }
                    }
                    playerNum %= 2;
                }
            }
        }
    }
    for (var bot1 = 0; bot1 < bots.length; bot1++) {
        console.log("bot"+bot1+" : "+String(results[bot1]));
    }
    
}

// Play Minimax bot vs Random bot, and test if AlphaBeta pruning vs no pruning always produces the same move
// Also compares the time needed to search to a given depth with different options
function testBots2() {
    var depthSearched  = [2,    3,      4,  5,  6];
    var numGamesToPlay = [1500, 200,    20, 4,  1];
    var averages = [];
    var averagesNormalized = [];

    for (var d = 0; d < depthSearched.length; d++) {
        averages.push([]);
        averagesNormalized.push([]);
        var gameAI = require('../src/GameAI')
        var b = require('./bots/Bots');
        var state = new g.GameState();
        var minibots = [
            [false , null, true, depthSearched[d]],
            [true, null, true, depthSearched[d]]
            ];

        var timePerMove = [];
        for (var k = 0; k < minibots.length; k++) {
            timePerMove.push([]);
        }

        var numGames = numGamesToPlay[d];
        results = new Array(2);
        for (var bot1 = 0; bot1 < 2; bot1++) {
            results[bot1] = 0;
        }

        for (var gameNr = 0; gameNr < numGames; gameNr++) {
            //if (Math.floor(gameNr/(numGames)*100) % 10 === 0) {
            if (gameNr % Math.floor(numGames/10) === 0) {
                console.log(Math.floor(gameNr/(numGames)*100) +"% complete");
            }
            state = new g.GameState();
            var playerNum = 0;
            var move = -1;
            var success = false;
            while (state.isGameOver() !== true) {
                if (gameNr*2 >= numGames) {
                    var rBot = new b.Random();
                    move = rBot.getMove(state);
                    success = state.move(move);
                    if (success !== true) {
                        console.log(" provided invalid move ("+move+"), game ended");
                        break;
                    }
                    if (state.isGameOver() === true) {
                        break;
                    }
                }
                var bestPaths = new Array(minibots.length);
                for (var m = 0; m < minibots.length; m++) {
                    var search = new gameAI.Search();
                    var startTime = process.hrtime();
                    bestPaths[m] = search.MinimaxID(state, minibots[m][0], minibots[m][1], minibots[m][2], minibots[m][3]);
                    var diff = process.hrtime(startTime);
                    timePerMove[m].push((diff[0] * 1e9 + diff[1]));
                }
                for (var i = 0; i < bestPaths[0].length; i++) {
                    for (var j = 1; j < bestPaths.length; j++) {
                        if (bestPaths[j][i] !== bestPaths[j-1][i]) {
                            console.log("Discrepancy found!");
                            break;
                        }
                    }                
                }
                //console.log(bestPaths[0] +" === "+ bestPaths[1]);
                move = bestPaths[0][0];
                success = state.move(move);
                if (success !== true) {
                    console.log(" provided invalid move ("+move+"), game ended");
                    break;
                } 
                if (state.isGameOver() === true) {
                    results[0]++;
                }

                if (gameNr*2 < numGames) {
                    var rBot = new b.Random();
                    move = rBot.getMove(state);
                    success = state.move(move);
                    if (success !== true) {
                        console.log(" provided invalid move ("+move+"), game ended");
                        break;
                    }
                    if (state.isGameOver() === true) {
                        break;
                    }
                }
            }
        }

        var sums = new Array(minibots.length);
        for (var i = 0; i < minibots.length; i++) {
            sums[i] = 0;
            for (var j = 0; j < timePerMove[0].length; j++) {
                sums[i] += timePerMove[i][j];
            }
            averages[d].push(Math.round(sums[i]/timePerMove[0].length/1000));
        }
        for (var i = 0; i < minibots.length; i++) {
            averagesNormalized[d].push(Math.round(sums[0]/sums[i]*100));
        }
        console.log("final score for depth "+d+": "+String(results));
    }
    for (var d = 0; d < depthSearched.length; d++) {
        console.log("Depth = "+depthSearched[d]+": abs time avg (us): "+String(averages[d]));
        console.log("Depth = "+depthSearched[d]+": time avg increase: "+String(averagesNormalized[d]));
    }
    
}