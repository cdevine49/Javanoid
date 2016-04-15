var Paddle = function (options) {
  this.left = options.left || Paddle.left;
  this.top = options.top || Paddle.top;
  this.width = options.width || Paddle.width;
  this.height = options.height || Paddle.height;
  this.game = options.game;
};

Paddle.left = 270;
Paddle.top = 290;
Paddle.width = 60;
Paddle.height = 10;

Paddle.prototype.draw = function (context) {
  context.fillStyle = 'blue';
  context.beginPath();
  context.rect(this.left, this.top, this.width, this.height);
  context.fill();
};

Paddle.prototype.move = function (direction) {
  if ((this.left !== 0 && direction === -1) || (this.left + this.width !== 600 && direction === 1) ) {
    this.left += (30 * direction);
  }
};

Paddle.prototype.type = 'Paddle';

module.exports = Paddle;
