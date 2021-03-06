var GameView = function (game, context) {
  this.game = game;
  this.context = context;
};

GameView.prototype.start = function () {
  localStorage.setItem("currentScore", 0);
  key('enter', function (e) {
    e.preventDefault();
    this.game.gameStarted = true;
    this.game.playing = true;
    this.game.won = false;
  }.bind(this));
  this.game.newGame(true);
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
  var timeChange = time - this.lastTime;
  this.game.step(timeChange);
  this.game.draw(this.context);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
