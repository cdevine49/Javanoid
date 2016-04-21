
var Score = function (options) {
  this.current = "placeholder";
  this.high = "placeholder";
};

Score.prototype.draw = function (context) {
  context.fillStyle = this.color;
  context.strokeStyle = this.border;
  context.beginPath();
  context.rect(this.left, this.top, this.width, this.height);
  context.fill();
  context.stroke();
};

Score.prototype.type = "Score";

module.exports = Score;
