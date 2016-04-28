var GameView = function (game, context) {
  this.game = game;
  this.context = context;
};

GameView.prototype.start = function () {
  this.game.newGame();
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
