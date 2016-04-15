var Block = require('./block');
var Cannonball = require('./cannonball');
var Paddle = require('./paddle');

var Game = function () {
  this.blocks = [];
  this.cannonballs = [];
  this.paddles = [];
  this.lives = 3;

  this.addBlocks();
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
  args = $l.extend({
    pos: [Game.DIM_X / 2, Game.DIM_Y - Cannonball.radius - Paddle.height],
    game: this
  }, options);
  var cannonball = new Cannonball(args);

  Object.keys(Game.MOVES).forEach(function(e) {
    key(e, function () { cannonball.move(Game.MOVES[e]); });
  });
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

  Object.keys(Game.MOVES).forEach(function(e) {
    key(e, function () { paddle.move(Game.MOVES[e]); });
  });

  this.add(paddle);
  return paddle;
};

Game.prototype.allObjects  = function () {
  return [].concat(this.paddles, this.blocks, this.cannonballs);
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
};

// Reflection Methods

Game.prototype.paddleBounce = function (x, dx, y, dy, radius) {
  for (var i = 0; i < this.paddles.length; i++) {
    var paddle = this.paddles[i];
    if ( y + dy > Game.DIM_Y - paddle.height - radius && x > paddle.left && x < paddle.left + paddle.width) {
      return true;
    }
  }

  return false;
};

Game.prototype.blockBounce = function (x, dx, y, dy, radius) {
  var result = [];
  for (var i = 0; i < this.blocks.length; i++) {
    var block = this.blocks[i];
    if (y + dy + radius > block.top  && y + dy - radius < block.top + block.height && x + dx + radius > block.left  && x + dx - radius < block.left + block.width) {
      this.remove(block);
      if (y + radius > block.top && y - radius < block.top + block.height) {
        result.push('dx');
      }

      if (x + radius > block.left && x - radius < block.left + block.width) {
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
  for (var i = 0; i < this.paddles.length; i++) {
    var paddle = this.paddles[i];
    for (var j = 0; j < this.cannonballs.length; j++) {
      var cannonball = this.cannonballs[j];
      if (Game.DIM_Y < cannonball.y - cannonball.radius) {
        this.cannonballs.splice(this.cannonballs.indexOf(cannonball), 1);
        j -= 1;
      }
    }
  }
};

Game.prototype.gameOver = function () {
  
};

Game.prototype.moveCannonball = function (timeChange) {
  this.cannonballs.forEach(function (cannonball) {
    if (cannonball.released) { cannonball.move(); }
  });
};

Game.prototype.reset = function () {
  this.lives -= 1;
  if (this.lives === 0) {
    this.gameOver();
  } else {
    this.paddles = [];
    this.addPaddle();
    this.addCannonball();
  }
};

Game.prototype.remove = function (object) {
  if (object.type === "Paddle") {
    this.paddles.splice(this.paddles.indexOf(object), 1);
  } else if (object.type === "Cannonball") {
    this.cannonballs.splice(this.cannonballs.indexOf(object), 1);
  } else if (object.type === "Block") {
    this.blocks.splice(this.blocks.indexOf(object), 1);
  } else {
    throw "Game#remove error";
  }
};

Game.prototype.step = function (timeChange) {
  this.moveCannonball(timeChange);
  this.outOfBounds();
  if (this.cannonballs.length === 0) {
    this.reset();
  }
  // this.checkCollisions();
};

module.exports = Game;
