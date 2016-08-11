
var Block = function (options) {
  this.left = options.pos[0];
  this.top = options.pos[1];
  this.width = options.size[0];
  this.height = options.size[1];
  this.color = options.color;
  this.game = options.game;
  this.drop = this.prize();
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
  if (rand < 0.1) {
    return {prize: "extraLife", color: "orange"};
  } else if (rand < 0.2) {
    return {prize: "extraCannonballs", color: "yellow"};
  } else if (rand < 0.3) {
    return {prize: "longer", color: "purple"};
  } else {
    return null;
  }
};

Block.prototype.type = "Block";

module.exports = Block;
