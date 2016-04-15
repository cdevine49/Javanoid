
var Block = function (options) {
  this.left = options.pos[0];
  this.top = options.pos[1];
  this.width = options.size[0];
  this.height = options.size[1];
  this.color = options.color;
  this.game = options.game;
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

Block.prototype.type = "Block";

module.exports = Block;
