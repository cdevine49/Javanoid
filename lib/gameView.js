var GameView = function (game, context) {
  this.game = game;
  this.context = context;
};

GameView.prototype.start = function () {
  paddle = this.game.addPaddle();
  this.game.addCannonball({
    paddle: paddle,
    x: paddle.left + (paddle.width / 2),
    y: paddle.top
  });
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.count = 0;

GameView.prototype.animate = function (time) {
  var timeChange = time - this.lastTime;
  this.game.step(timeChange);
  this.game.draw(this.context);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
