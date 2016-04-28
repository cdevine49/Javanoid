var Block = require('./block');
var Bonus = require('./bonus');
var Cannonball = require('./cannonball');
var Paddle = require('./paddle');
var Score = require('./gameInfo');

var Game = function () {
  this.blocks = [];
  this.bonuses = [];
  this.cannonballs = [];
  this.paddles = [];
  this.lives = 3;

  this.addBlocks();
  this.score = new Score ({current: 0, high: localStorage.getItem("personalBest")});
};

Game.DIM_X = 600;
Game.DIM_Y = 300;
Game.blockColumns = 7;
Game.blockRows = 12;

Game.prototype.add = function (object) {
  if (object.type === "Paddle") {
    this.paddles.push(object);
  } else if (object.type === "Cannonball") {
    this.cannonballs.push(object);
  } else if (object.type === "Block") {
    this.blocks.push(object);
  } else if (object.type === "Bonus") {
    this.bonuses.push(object);
  } else {
    throw "Game#add error";
  }
};

Game.prototype.addBlocks = function () {
  for (var r = 0; r < Game.blockRows; r++) {
    for (var c = 0; c < Game.blockColumns; c++) {
      this.add(new Block({
        pos: [50 * r, 20 * (c + 1)],
        size: [50, 20],
        color: ['#93B2D4', '#2D94F9', '#01D22E', '#FFFF00', '#F0C300', '#F87F06', '#FB122B'][c],
        game: this.game
      }));
    }
  }
};

Game.prototype.addCannonball = function (options) {
  args = $l.extend({ game: this }, options);
  var cannonball = new Cannonball(args);

  key('space', function () { cannonball.fire(); });

  this.add(cannonball);
  return cannonball;
};

Game.MOVES = {
  "left": -1,
  "right": 1
};

Game.prototype.addPaddle = function (options) {
  args = $l.extend({ game: this }, options);
  var paddle = new Paddle(args);
  this.add(paddle);
  return paddle;
};

Game.prototype.allObjects  = function () {
  return [].concat(this.paddles, this.blocks, this.cannonballs, this.bonuses);
};

Game.prototype.checkCollisions = function () {

};

Game.prototype.draw = function (context) {
  context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  context.fillStyle = '#ccc';
  context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function(obj) {
    obj.draw(context);
  });
  this.score.draw(context);
};

// Reflection Methods

Game.prototype.paddleBounce = function (cannonball) {
  var result = [];
  for (var i = 0; i < this.paddles.length; i++) {
    var paddle = this.paddles[i];
    var paddleHeight = Game.DIM_Y - paddle.height;
    var currentCannonballBottom = cannonball.y + cannonball.radius;
    var currentCannonballRight = cannonball.x + cannonball.radius;
    var currentCannonballleft = cannonball.x - cannonball.radius;

    var nextCannonballBottom = cannonball.y + cannonball.dy + cannonball.radius;
    var nextCannonballRight = cannonball.x + cannonball.dx + cannonball.radius;
    var nextCannonballLeft = cannonball.x + cannonball.dx - cannonball.radius;

    var nextPaddleMove = paddle.goRight - paddle.goLeft;

    if (currentCannonballBottom <= paddleHeight && nextCannonballBottom > paddleHeight && nextCannonballRight >= paddle.left + nextPaddleMove && nextCannonballLeft <= paddle.left + paddle.width + nextPaddleMove) {
      cannonball.paddle = paddle;
      result.push('dy');
    }

    // if (cannonballBottom > paddleHeight && cannonball.x + cannonball.dx > paddle.left && cannonball.x + cannonball.dx < paddle.left + paddle.width) {
    //   cannonball.paddle = paddle;
    //   result.push('dy');
    // }
    // if (cannonball.y + cannonball.radius > paddleHeight && cannonball.x + cannonball.dx + cannonball.radius > paddle.left && cannonball.x + cannonball.dx + cannonball.radius < paddle.left + paddle.width) {
    //   cannonball.paddle = paddle;
    //   result.push('dx');
    // }
  }

  // If the bottom of the ball is:
    // below or equal to 590,
    // dy will take it above 590,
    // the sides of the ball are between the left and right of the paddle
    // reverse the sign of dy
  //

  //  y = 589, dy = 3
    // reverse sign of dy
  // x = 1 left of paddle.left, dx = 3
    // reverse sign of dx

  // y = 591 (this means it got below the paddle, so it wasn't above when it hit 591)
  // x is between paddle sides
    // should be impossible

  // y = 591
    // do nothing
  // x is outside paddle and x + dx is inside paddle
    // reverse sign of dx


  return result;
};

Game.prototype.blockBounce = function (cannonball) {
  var result = [];
  for (var i = 0; i < this.blocks.length; i++) {
    var block = this.blocks[i];
    if (cannonball.y + cannonball.dy + cannonball.radius > block.top  && cannonball.y + cannonball.dy - cannonball.radius < block.top + block.height && cannonball.x + cannonball.dx + cannonball.radius > block.left  && cannonball.x + cannonball.dx - cannonball.radius < block.left + block.width) {
      // add Drop if it exists
      if (block.drop) {
        args = $l.extend({game: this, x: block.left + (block.width / 2), y: block.top + (block.height / 2)}, block.drop);
        var bonus = new Bonus(args);
        this.add(bonus);
      }
      this.remove(block);
      if (cannonball.y + cannonball.radius > block.top && cannonball.y - cannonball.radius < block.top + block.height) {
        result.push('dx');
      }

      if (cannonball.x + cannonball.radius > block.left && cannonball.x - cannonball.radius < block.left + block.width) {
        result.push('dy');
      }
      return result;
    }
  }
  return false;
};

Game.prototype.sideBorderBounce = function (x, dx, radius) {
  return (x + dx > Game.DIM_X - radius || x + dx < radius);
};

Game.prototype.topBorderBounce = function (y, dy, radius) {
  return (y + dy < radius);
};

Game.prototype.outOfBounds = function (y, radius) {
  for (var j = 0; j < this.cannonballs.length; j++) {
    var cannonball = this.cannonballs[j];
    if (Game.DIM_Y < cannonball.y - cannonball.radius) {
      this.remove(cannonball);
      j -= 1;
    }
  }
  for (var h = 0; h < this.bonuses.length; h++) {
    var bonus = this.bonuses[h];
    if (Game.DIM_Y < bonus.y - bonus.radius) {
      this.remove(bonus);
      h -= 1;
    }
  }
};

Game.prototype.wonPrize = function (bonus) {
  // Refactor to use paddleBounce
  for (var i = 0; i < this.paddles.length; i++) {
    var paddle = this.paddles[i];
    if ( bonus.y > Game.DIM_Y - paddle.height - bonus.radius && bonus.x > paddle.left && bonus.x < paddle.left + paddle.width) {
      switch (bonus.prize) {
        case "extraLife":
          this.lives += 1;
          break;
        case "extraCannonballs":
          var cannonball = this.cannonballs[Math.floor(Math.random() * this.cannonballs.length)];
          var sign = Math.random() > 0.5 ? 1 : -1;
          var dx = sign * 1.3 * Math.random() * cannonball.dx;
          sign = Math.random() > 0.5 ? 1 : -1;
          var dy = sign * Math.random() * cannonball.dy;
          this.addCannonball({released: true, x: cannonball.x, y: cannonball.y, dx: dx, dy: dy });

          sign = Math.random() > 0.5 ? 1 : -1;
          dx = sign * 1.3 * Math.random() * cannonball.dx;
          dy = sign * Math.random() * cannonball.dy;
          this.addCannonball({released: true, x: cannonball.x, y: cannonball.y, dx: 1.5, dy: -1 });
          break;
        case "longer":
          paddle.width = 90;
          break;
      }
      this.remove(bonus);
    }
  }
  return null;
};

Game.prototype.extraLife = function () {

};

Game.prototype.newGame = function () {
  paddle = this.addPaddle();
  this.addCannonball({
    paddle: paddle,
    x: paddle.left + (paddle.width / 2),
    y: paddle.top
  });
};

Game.prototype.gameOver = function () {
  localStorage.setItem("personalBest", this.score.high);
  this.allObjects().forEach(function (obj) {
    this.remove(obj);
  }.bind(this));
  this.score.current = 0;
  this.addBlocks();
  this.newGame();
};

Game.prototype.selfMovingObjects = function () {
  return [].concat(this.cannonballs, this.bonuses);
};

Game.prototype.moveObjects = function (timeChange) {
  this.selfMovingObjects().forEach(function (obj) {
     obj.move(timeChange);
  });
};

Game.prototype.reset = function () {
  this.lives -= 1;
  if (this.lives === 0) {
    this.gameOver();
  } else {
    this.paddles = [];
    this.newGame();
  }
};

Game.prototype.remove = function (object) {
  if (object.type === "Paddle") {
    this.paddles.splice(this.paddles.indexOf(object), 1);
  } else if (object.type === "Cannonball") {
    this.cannonballs.splice(this.cannonballs.indexOf(object), 1);
  } else if (object.type === "Block") {
    this.blocks.splice(this.blocks.indexOf(object), 1);
  } else if (object.type === "Bonus") {
    this.bonuses.splice(this.bonuses.indexOf(object), 1);
  } else {
    throw "Game#remove error";
  }
};

Game.prototype.step = function (timeChange) {
  this.moveObjects(timeChange);
  this.outOfBounds();
  this.updateScore();
  if (this.cannonballs.length === 0) {
    this.reset();
  }
};

Game.prototype.updateScore = function () {
  this.score.current = (84 - this.blocks.length);
  if (this.score.current > this.score.high) {
    this.score.high = this.score.current;
    localStorage.setItem("personalBest", this.score.high);
  }
};

module.exports = Game;
