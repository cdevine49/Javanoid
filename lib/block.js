
var Block = function (options) {
  this.left = options.pos[0];
  this.top = options.pos[1];
  this.width = options.size[0];
  this.height = options.size[1];
  this.color = options.color;
  this.game = options.game;
  this.drop = this.prize() || null;
};

Block.prototype.draw = function (context) {
  context.fillStyle = this.color;
  // context.strokeStyle = "white";
  context.strokeStyle = this.border;
  context.beginPath();
  context.rect(this.left, this.top, this.width, this.height);
  context.fill();
  context.stroke();
};

Block.prototype.prize = function () {
  var rand = Math.random();
  if (rand < 0.02) {
    return {prize: "extraLife"};
  } else if (rand < 0.05) {
    // return "longer";
    return {prize: "extraLife"};
  } else if (rand < 1) {
    // return "threeBalls";
    return {prize: "extraCannonballs"};
  }
};

Block.prototype.type = "Block";

module.exports = Block;
