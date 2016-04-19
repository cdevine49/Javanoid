var Bonus = function (options) {
  this.x = options.x;
  this.y = options.y;
  this.prize = options.prize;
  this.color = options.color || '#fff';
  this.radius = options.radius || Bonus.radius;
  this.fill = options.fill || Bonus.fill;
  this.game = options.game;
};

Bonus.radius = 5;
Bonus.fill = [0, Math.PI * 2];

Bonus.prototype.draw = function (context) {
  // debugger
  context.fillStyle = this.color;
  context.beginPath();
  context.arc(this.x, this.y, this.radius, this.fill[0], this.fill[1]);
  context.fill();
};


Bonus.prototype.move = function (timeChange) {
  this.y += timeChange / 10;
  this.game.wonPrize(this);
};

Bonus.prototype.type = 'Bonus';

module.exports = Bonus;
