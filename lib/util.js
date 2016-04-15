var Util = {
  direction: function(vector) {

  },

  randomStartVector: function () {
    
  },

  inherits: function (child, parent) {
    function Surrogate () { this.constructor = child; }
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
  },
};
