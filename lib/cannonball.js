var Util = require('./util');

var Cannonball = function (options) {
  this.x = options.pos[0];
  this.y = options.pos[1];
  this.radius = options.radius || Cannonball.radius;
  this.fill = options.fill || Cannonball.fill;
  this.released = false;
  this.game = options.game;
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
  this.dx = 2;
  this.dy = -2;
};

Cannonball.prototype.move = function (direction) {
  if (!this.released) {
    if ((this.x - 30 > 0 && direction === -1) || (this.x + 30 < 600 && direction === 1)) {
      this.x += (30 * direction);
    }
  } else {
    if (this.game.sideBorderBounce(this.x, this.dx, this.radius)) {
      this.dx = -this.dx;
    }

    if (this.game.topBorderBounce(this.y, this.dy, this.radius)) {
      this.dy = -this.dy;
    }

    // if (this.game.paddleBounce.call(this.game, this.x, this.dx, this.y, this.dy, this.radius)) {
    if (this.game.paddleBounce(this.x, this.dx, this.y, this.dy, this.radius)) {
      this.dy = -this.dy;
    }

    var bounceDirection = this.game.blockBounce(this.x, this.dx, this.y, this.dy, this.radius);

    if (bounceDirection) {
      if (bounceDirection.indexOf('dx') !== -1 && bounceDirection.indexOf('dy') !== -1) {
        debugger
      }
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
