;(function() {
  'use strict';

  var _guid = 0;

  var _ = {
  };

  
    function Event() {
      this.__hash = {};
    }
    Event.prototype.on = function(id, handle) {
      var that = this;
      if(typeof id === 'string') {
        if(!that.__hash.hasOwnProperty(id)) {
          that.__hash[id] = [];
        }
        //遍历防止此handle被侦听过了
        for(var i = 0, item = that.__hash[id], len = item.length; i < len; i++) {
          if(item[i] === handle) {
            return;
          }
        }
        that.__hash[id].push(handle);
      }
      else {
        id.forEach(function(item) {
          that.on(item, handle);
        });
      }
    }
    Event.prototype.off = function(id, handle) {
      var that = this;
      if(typeof id === 'string') {
        if(!this.__hash.hasOwnProperty(id)) {
          if(handle) {
            for(var i = 0, item = that.__hash[id], len = item.length; i < len; i++) {
              if(item[i] === handle) {
                item.splice(i, 1);
                break;
              }
            }
          }
          //未定义为全部清除
          else {
            delete that.__hash[id];
          }
        }
      }
      else {
        id.forEach(function(item) {
          that.off(item, handle);
        });
      }
    }
    Event.prototype.emit = function(id, data) {
      if(data===void 0)data=[];var that = this;
      if(typeof id === 'string') {
        if(that.__hash.hasOwnProperty(id)) {
          that.__hash[id].forEach(function(item) {
            item.apply(that, data);
          });
        }
      }
      else {
        id.forEach(function(item) {
          that.emit(item, data);
        });
      }
    }
  

  var Enough = {
    _: _,
    Event: Event
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Enough;
    }
    exports.Enough = Enough;
  } else if (typeof define === 'function') {
    define(function() {
      return Enough;
    });
  } else {
    window.Enough = Enough;
  }

})();