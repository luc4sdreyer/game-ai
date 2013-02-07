require('process');

var g = require('./Game');
var state = new g.GameState();

var stdin = process.openStdin();
stdin.on('data', gotData);

function gotData(chunk) {
	console.log("Got chunk: " + chunk);
}

function gotData(chunk) {
	console.log("Got chunk: " + chunk);
}