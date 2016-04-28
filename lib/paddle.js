var Paddle = function (options) {
  this.left = options.left || Paddle.left;
  this.top = options.top || Paddle.top;
  this.width = options.width || Paddle.width;
  this.height = options.height || Paddle.height;
  this.goLeft = 0;
  this.goRight = 0;
  this.game = options.game;

  $l("html").on("keydown", this.move.bind(this));
  $l("html").on("keyup", this.stop.bind(this));
};

Paddle.left = 270;
Paddle.top = 290;
Paddle.width = 60;
Paddle.height = 10;

Paddle.prototype.draw = function (context) {
  this.left += this.goRight;
  this.left -= this.goLeft;

  if (this.left + this.goRight - this.goLeft < 0) {
    this.goLeft = 0;
  } else if (this.left + this.width + this.goRight - this.goLeft > 600) {
    this.goRight = 0;
  }
  
  // image = new Image();
  // context.drawImage(image, this.left, this.top, this.width, this.height);
  // image.src = 'sprites/paddle.png';

  context.fillStyle = 'blue';
  context.beginPath();
  context.rect(this.left, this.top, this.width, this.height);
  context.fill();
};

Paddle.prototype.move = function (e) {
  if (this.game.paddles[0] === this) {
    if (e.keyCode === 39 && this.left + this.width !== 600) {
      this.goRight = 5;
    } else if  (e.keyCode === 37 && this.left !== 0) {
      this.goLeft = 5;
    }
  }

  // if ((this.left !== 0 && direction === -1) || (this.left + this.width !== 600 && direction === 1) ) {
  //   debugger
  //   this.velocity = (30 * direction);
  //   this.left += this.velocity;
  // } else {
  //   this.velocity = 0;
  // }
};

Paddle.prototype.stop = function (e) {
  if (this.game.paddles[0] === this) {
    if (e.keyCode === 39) {
      this.goRight = 0;
    } else if  (e.keyCode === 37) {
      this.goLeft = 0;
    }
  }
};

Paddle.prototype.type = 'Paddle';

module.exports = Paddle;
