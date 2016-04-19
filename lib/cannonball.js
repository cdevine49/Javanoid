var Cannonball = function (options) {
  this.x = options.x;
  this.y = options.y - Cannonball.radius;
  this.dx = 3;
  this.dy = -3;
  this.radius = options.radius || Cannonball.radius;
  this.fill = options.fill || Cannonball.fill;
  this.released = options.released || false;
  this.game = options.game;
  this.paddle = options.paddle;
};

Cannonball.radius = 8;
Cannonball.fill = [0, Math.PI * 2];

Cannonball.prototype.draw = function (context) {
  context.fillStyle = '#000';
  context.beginPath();
  context.arc(this.x, this.y, this.radius, this.fill[0], this.fill[1]);
  context.fill();
};

Cannonball.prototype.fire = function () {
  this.released = true;

};

Cannonball.prototype.move = function (timeChange) {
  if (!this.released) {
    this.x += this.paddle.goRight;
    this.x -= this.paddle.goLeft;
  } else {
    if (this.game.sideBorderBounce(this.x, this.dx, this.radius)) {
      this.dx = -this.dx;
    }

    if (this.game.topBorderBounce(this.y, this.dy, this.radius)) {
      this.dy = -this.dy;
    }

    if (this.game.paddleBounce(this).length > 0) {
      if (this.game.paddleBounce(this).indexOf('dy') !== -1) {
        this.dy = -this.dy;
      }
      if (this.dx < 4) {
        this.dx += (0.1 * this.paddle.goRight);
      }
      if (this.dx > -4) {
        this.dx -= (0.1 * this.paddle.goLeft);
      }
    }

    var bounceDirection = this.game.blockBounce(this);

    if (bounceDirection) {

      if (bounceDirection.indexOf('dx') !== -1) {
        this.dx = -this.dx;
      }
      if (bounceDirection.indexOf('dy') !== -1) {
        this.dy = -this.dy;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
  }
};

Cannonball.prototype.type = 'Cannonball';

module.exports = Cannonball;
