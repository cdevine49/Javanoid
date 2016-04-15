var Game = require('./game');
var GameView = require('./gameView');

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('javanoid-canvas');
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;

  var context = canvas.getContext('2d');
  var game = new Game();
  new GameView(game, context).start();
});
