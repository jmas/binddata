define('binddata', function() {

  var bindData = function(data, selector, config) {
    var elements = document.querySelectorAll(selector);
    
    var observeEvents = function(el) {
      var k, events, i, len;
      
      for (k in config.on) {
        events = k.split(' ');
        
        for (i=0, len=events.length; i<len; i++) {
          el.addEventListener(events[i], (function(data, el, binds) {
            if (binds instanceof Function) {
              return function(event) {
                return binds(el, event);
              };
            } else {
              return function(event) {
                var j;
              
                for (j in binds) {
                  if (binds[j] instanceof Function) {
                    return data.set(j, binds[j](el, event));
                  } else {
                    data.set(j, el[binds[j]]);
                  }
                }
              };
            }
          })(data, el, config.on[k]), false);
        }
      }
    };
    
    var observeAttrs = function(el) {   
      data.on('set', function(key, value) {
        populateAttr(el, key, value);
      });
    };
    
    var populateAttr = function(el, key, value) {
      if (key in config.binds) {
        if (config.binds[key] instanceof Function) {
          config.binds[key](el, value);
        } else {
          el[config.binds[key]] = value;
        }
      }
    };
    
    var i, len, tagName, k;
    
    for (i=0, len=elements.length; i<len; i++) {    
      observeEvents(elements[i]);
      
      if (config.binds) {
        observeAttrs(elements[i]);
        
        for (k in config.binds) {
          populateAttr(elements[i], k, data.get(k));
        }
      }
    }
  };

  return bindData;

});