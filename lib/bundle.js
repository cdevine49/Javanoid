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
	var GameView = __webpack_require__(6);
	
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
	var Cannonball = __webpack_require__(3);
	var Paddle = __webpack_require__(5);
	
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
	        this.remove(cannonball);
	        j -= 1;
	      }
	    }
	  }
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
	
	};
	
	Game.prototype.moveCannonball = function (timeChange) {
	  this.cannonballs.forEach(function (cannonball) {
	     cannonball.move();
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Cannonball = function (options) {
	  this.x = options.x;
	  this.y = options.y - Cannonball.radius;
	  this.radius = options.radius || Cannonball.radius;
	  this.fill = options.fill || Cannonball.fill;
	  this.released = false;
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
	  this.dx = 3;
	  this.dy = -3;
	};
	
	Cannonball.prototype.move = function (direction) {
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
	
	    if (this.game.paddleBounce(this.x, this.dx, this.y, this.dy, this.radius)) {
	      this.dy = -this.dy;
	      if (this.dx < 4) {
	        this.dx += (0.1 * this.paddle.goRight);
	      }
	      if (this.dx > -4) {
	        this.dx -= (0.1 * this.paddle.goLeft);
	      }
	    }
	
	    var bounceDirection = this.game.blockBounce(this.x, this.dx, this.y, this.dy, this.radius);
	
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
/* 4 */,
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	var GameView = function (game, context) {
	  this.game = game;
	  this.context = context;
	};
	
	GameView.prototype.start = function () {
	  paddle = this.game.addPaddle();
	  this.game.addCannonball({
	    paddle: paddle,
	    x: paddle.left + (paddle.width / 2),
	    y: paddle.top
	  });
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