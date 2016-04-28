
var Score = function (options) {
  this.current = options.current || 0;
  this.high = options.high || 0;
};

Score.left = 0;
Score.top = 0;
Score.width = 150;
Score.height = 20;

Score.prototype.draw = function (context) {
  context.font = "16px Arial";
  context.fillStyle = "black";
  context.fillText("Current Score:", 10, 15);
  context.fillText(this.current, 120, 15);
  context.fillText("Your Best Score:", 150, 15);
  context.fillText(this.high, 275, 15);
};

Score.prototype.type = "Score";

module.exports = Score;
