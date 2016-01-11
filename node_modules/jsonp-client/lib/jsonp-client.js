// jsonp-client
// -----------------
// Copyright(c) 2013 Bermi Ferrer <bermi@bermilabs.com>
// MIT Licensed

(function (root) {
  'use strict';

  var
    // Save the previous value of the `jsonpClient` variable.
    previousJsonpClient = root.jsonpClient,
    is_browser = (typeof process !== "undefined") ?
      // We are on a common js environment, we might be using browserify
      process.browser :
      (typeof window !== 'undefined'),
    getJsonpBrowser,
    getJsonp,
    CALLBACK_REGEXP = /[\?|&]callback=([a-z0-9_]+)/i,

    // Create a safe reference to the jsonpClient object for use below.
    jsonpClient = function () {
      var args = Array.prototype.slice.apply(arguments),
        callback,
        urls = args.slice(0, -1),
        i = 0,
        error,
        results = [],
        addUrl, returnResult;

      // Don't allows sync calls
      try {
        callback = args.slice(-1)[0];
        if (typeof callback !== 'function') {
          throw new Error('Callback not found');
        }
      } catch (e) {
        throw new Error("jsonpClient expects a callback");
      }


      // URL's provided as an array on the first parameter
      if (typeof urls[0] !== 'string') {
        urls = urls[0];
      }

      // Returns the results in the right order
      returnResult = function () {
        var i = 0;
        results = results.sort(function (a, b) {
          return a.position > b.position;
        });
        for (i = 0; results.length > i; i = i + 1) {
          results[i] = results[i].data;
        }
        results.unshift(null);
        callback.apply(null, results);
      };

      // Adds a URL to the queue
      addUrl = function (url, position) {
        getJsonp(urls[i], function (err, data) {
          if (error) {
            return;
          }
          error = err;
          if (err) {
            return callback(err);
          }
          results.push({
            data: data,
            position: position
          });
          if (results.length === urls.length) {
            returnResult();
          }
        });
      };

      // Pushes files to fetch
      for (i = 0; urls.length > i; i = i + 1) {
        addUrl(urls[i] + '', i);
      }
    };

  // Run jsonpClient in *noConflict* mode, returning the `jsonpClient`
  // variable to its previous owner. Returns a reference to
  // the jsonpClient object.
  jsonpClient.noConflict = function () {
    root.jsonpClient = previousJsonpClient;
    return jsonpClient;
  };

  // Browser only logic for including jsonp on the page
  getJsonpBrowser = function () {
    var getCallbackFromUrl,
      loadScript,
      head = document.getElementsByTagName('head')[0];

    loadScript = function (url, callback) {
      var script = document.createElement('script'),
        done = false;
      script.src = url;
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          callback();
        }
      };
      head.appendChild(script);
    };

    getCallbackFromUrl = function (url, callback) {
      var matches = url.match(CALLBACK_REGEXP);
      if (!matches) {
        return callback(new Error('Could not find callback on URL'));
      }
      callback(null, matches[1]);
    };

    return function (url, callback) {
      getCallbackFromUrl(url, function (err, callbackName) {
        var data,
          originalCallback = window[callbackName];
        if (err) {
          return callback(err);
        }
        window[callbackName] = function (jsonp_data) {
          data = jsonp_data;
        };
        loadScript(url, function (err) {
          if (!err && !data) {
            err = new Error("Calling to " + callbackName + " did not returned a JSON response." +
                            "Make sure the callback " + callbackName + " exists and is properly formatted.");
          }

          if (originalCallback) {
            window[callbackName] = originalCallback;
          } else {
            // Repeated calls to the same jsonp callback should be avoided
            // Unique callback names should be used.
            // Also, the try, catch here is to support issues in IE8/IE7 where you can not use delete on window.
            try {
              delete window[callbackName];
            }
            catch (ex) {
              window[callbackName] = undefined;
            }
          }

          callback(err, data);
        });
      });
    };
  };

  getJsonp = is_browser ? getJsonpBrowser() : require('./jsonp-node.js');

  // Export the jsonpClient object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `jsonpClient` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = jsonpClient;
  } else {
    // Set jsonpClient on the browser window
    root.jsonpClient = jsonpClient;
  }

  // Establish the root object, `window` in the browser, or `global` on the server.
}(this));