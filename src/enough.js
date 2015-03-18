;(function() {
  'use strict';

  class Event {
    constructor() {
      this.__hash = {};
    }
    on(id, handle) {
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
    off(id, handle) {
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
    emit(id, ...data) {
      var that = this;
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
  }

  class Model extends Event {
    constructor() {
      super();
      this.__lib = {};
    }
    gets(k) {
      return this.__lib.hasOwnProperty(k) ? this.__lib[k] : undefined;
    }
    sets(k, v) {
      var that = this;
      if(typeof k === 'object') {
        Object.keys(k).forEach(function(item) {
          that.sets(item, k[item]);
        });
      }
      else {
        var oldValue = that.gets(k);
        if(oldValue === v) {
          return;
        }
        that.__lib[k] = v;
        that.emit('change:' + k, v);
        that.emit('change', v);
      }
    }
    remove(k) {
      var that = this;
      if(typeof k === 'undefined') {
        Object.keys(that.__lib).forEach(function(item) {
          that.remove(item);
        });
      }
      else if(that.__lib.hasOwnProperty(k)) {
        delete that.__lib[k];
        that.emit('change:' + k);
        that.emit('change');
      }
    }
  }

  var Enough = {
    Event: Event,
    Model: Model
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