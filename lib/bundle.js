/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = document.getElementById('javanoid-canvas');
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  var context = canvas.getContext('2d');
	  var game = new Game();
	  new GameView(game, context).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(2);
	var Bonus = __webpack_require__(3);
	var Cannonball = __webpack_require__(4);
	var Paddle = __webpack_require__(5);
	var Score = __webpack_require__(6);
	
	var Game = function () {
	  this.blocks = [];
	  this.bonuses = [];
	  this.cannonballs = [];
	  this.paddles = [];
	  this.lives = 3;
	  this.gameStarted = false;
	  this.playing = false;
	  this.gameWon = false;
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
	
	  key('space', function (e) {
	    e.preventDefault();
	    if (this.playing) {
	      cannonball.fire();
	    }
	  }.bind(this));
	
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
	
	Game.prototype.draw = function (context) {
	  context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  context.fillStyle = '#ccc';
	  context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  context.font = "16px Arial";
	  context.fillStyle = "black";
	
	  if (this.playing) {
	    if (this.blocks.length > 0) {
	      this.allObjects().forEach(function(obj) {
	        obj.draw(context);
	      });
	      this.score.draw(context);
	
	      context.fillText("Lives:", 525, 15);
	      context.fillText(this.lives, 575, 15);
	    }
	  } else {
	    if (this.gameStarted) {
	      context.fillStyle = 'blue';
	      context.font = '36px monospace';
	      if (this.gameWon) {
	        context.fillText('You Won!!!', 210, 75);
	      } else {
	        context.fillText('You Lost', 210, 75);
	      }
	
	      context.font = '24px monospace';
	      context.fillText('Score: ' + (localStorage.getItem("currentScore") || 0), 130, 100);
	      context.fillText('Hit enter to play again', 130, 130);
	    } else {
	      context.fillStyle = 'blue';
	      context.font = '36px monospace';
	      context.fillText('Javanoid', 210, 75);
	
	      context.font = '24px monospace';
	      context.fillText('Hit enter to start the game', 100, 100);
	      context.fillText('Rules', 50, 130);
	
	      context.font = '16px Arial';
	      context.fillText('1. Hit space to launch a cannonball', 50, 150);
	      context.fillText('2. Use the left and right arrows to move the paddles', 50, 168);
	      context.fillText('3. Grab the falling prizes', 50, 186);
	      context.fillText('Purple makes the paddle bigger', 75, 204);
	      context.fillText('Yellow gives you extra balls', 75, 222);
	      context.fillText('Orange gives you an extra life', 75, 240);
	    }
	  }
	};
	
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
	  }
	
	  return result;
	};
	
	Game.prototype.blockBounce = function (cannonball) {
	  var result = [];
	  for (var i = 0; i < this.blocks.length; i++) {
	    var block = this.blocks[i];
	    if (cannonball.y + cannonball.dy + cannonball.radius > block.top  && cannonball.y + cannonball.dy - cannonball.radius < block.top + block.height && cannonball.x + cannonball.dx + cannonball.radius > block.left  && cannonball.x + cannonball.dx - cannonball.radius < block.left + block.width) {
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
	
	Game.prototype.newGame = function (bool) {
	  paddle = this.addPaddle();
	  if (bool) { this.addBlocks(); }
	  this.addCannonball({
	    paddle: paddle,
	    x: paddle.left + (paddle.width / 2),
	    y: paddle.top
	  });
	};
	
	Game.prototype.gameOver = function () {
	  localStorage.setItem("currentScore", this.score.current * (this.lives + 1));
	  localStorage.setItem("personalBest", this.score.high);
	  if (this.blocks.length === 0) {
	    this.gameWon = true;
	  }
	  this.allObjects().forEach(function (obj) {
	    this.remove(obj);
	  }.bind(this));
	  this.playing = false;
	  this.score.current = 0;
	  this.lives = 3;
	  this.newGame(true);
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
	    this.gameWon = false;
	    this.gameOver();
	  } else {
	    this.paddles = [];
	    this.newGame(false);
	  }
	};
	
	Game.prototype.remove = function (object) {
	  if (object.type === "Paddle") {
	    this.paddles.splice(this.paddles.indexOf(object), 1);
	  } else if (object.type === "Cannonball") {
	    this.cannonballs.splice(this.cannonballs.indexOf(object), 1);
	  } else if (object.type === "Block") {
	    this.blocks.splice(this.blocks.indexOf(object), 1);
	    if (this.blocks.length === 0) {
	    }
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	
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
	  if (rand < 0.1) {
	    return {prize: "extraLife", color: "orange"};
	  } else if (rand < 0.2) {
	    return {prize: "extraCannonballs", color: "yellow"};
	  } else if (rand < 0.3) {
	    return {prize: "longer", color: "purple"};
	  }
	};
	
	Block.prototype.type = "Block";
	
	module.exports = Block;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Bonus = function (options) {
	  this.x = options.x;
	  this.y = options.y;
	  this.prize = options.prize;
	  this.color = options.color || '#fff';
	  this.radius = options.radius || Bonus.radius;
	  this.fill = options.fill || Bonus.fill;
	  this.game = options.game;
	};
	
	Bonus.radius = 6;
	Bonus.fill = [0, Math.PI * 2];
	
	Bonus.prototype.draw = function (context) {
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Cannonball = function (options) {
	  this.x = options.x;
	  this.y = options.y - Cannonball.radius;
	  this.dx = 3;
	  this.dy = -3;
	  this.radius = options.radius || Cannonball.radius;
	  this.fill = options.fill || Cannonball.fill;
	  this.released = options.released || false;
	  this.game = options.game;
	  this.paddle = options.paddle;
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
	
	};
	
	Cannonball.prototype.move = function (timeChange) {
	  if (!this.released) {
	    this.x += this.paddle.goRight;
	    this.x -= this.paddle.goLeft;
	  } else {
	    if (this.game.sideBorderBounce(this.x, this.dx, this.radius)) {
	      this.dx = -this.dx;
	    }
	
	    if (this.game.topBorderBounce(this.y, this.dy, this.radius)) {
	      this.dy = -this.dy;
	    }
	
	    if (this.game.paddleBounce(this).length > 0) {
	      if (this.game.paddleBounce(this).indexOf('dy') !== -1) {
	        this.dy = -this.dy;
	      }
	      if (this.dx < 4) {
	        this.dx += (0.1 * this.paddle.goRight);
	      }
	      if (this.dx > -4) {
	        this.dx -= (0.1 * this.paddle.goLeft);
	      }
	    }
	
	    var bounceDirection = this.game.blockBounce(this);
	
	    if (bounceDirection) {
	
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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

	
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	var GameView = function (game, context) {
	  this.game = game;
	  this.context = context;
	};
	
	GameView.prototype.start = function () {
	  localStorage.setItem("currentScore", 0);
	  key('enter', function (e) {
	    e.preventDefault();
	    this.game.gameStarted = true;
	    this.game.playing = true;
	    this.game.won = false;
	  }.bind(this));
	  this.game.newGame(true);
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time) {
	  var timeChange = time - this.lastTime;
	  this.game.step(timeChange);
	  this.game.draw(this.context);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map