var g = require('./Game');
run();

function run() {
    //test1();
    //test6();
    testBots1();
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

function testBots1() {
    var b = require('./bots/Bots');
    var state = new g.GameState();
    bots = [
        new b.Minimax(true),
        //new b.Minimax(false)
        //,new b.Random()
        ];
    results = new Array(bots.length);
    for (var bot1 = 0; bot1 < bots.length; bot1++) {
        results[bot1] = new Array(bots.length);
        for (var bot2 = 0; bot2 < bots.length; bot2++) {
            results[bot1][bot2] = 0;
        }
    }

    for (var bot1 = 0; bot1 < bots.length; bot1++) {
        for (var bot2 = 0; bot2 < bots.length /*&& bot1 !== bot2*/; bot2++) {
            //if (bot2 >= bot1) break;
            state = new g.GameState();
            state.loadFromFile("grid.txt");
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
                    if (playerNum === 0) {
                        results[bot1][bot2]++;
                    } else {
                        results[bot2][bot1]++;
                    }
                }
                playerNum %= 2;
            }
        }
    }
    for (var bot1 = 0; bot1 < bots.length; bot1++) {
        console.log(results[bot1]);
    }
    
}