1.0.0
=================

  * Browser detection behaviour has changed on environments that expose process.browser
    this might break your existing app specially if you used jsdom & browserify
    hence the version bump.

0.6.x
=================

 * Swapping old request module with superagent.

0.3.1 / 2014-01-13
==================
  * Fixing an issue where if the javascript is invalid for a passed in jsonp file, the callback could return twice.

0.3.0 / 2013-10-17
==================

* Preventing capturing exceptions on callbacks are reported on https://gist.github.com/cbeley/a000f95e8938a836abfc
* Removed window. function leaks. Warning, this might have break code where static jsonp callbacks are called concurrently.
* Reporting back whenever the wrong jsonp callback is used on the browser. On node we can infer the callback.

0.1.3 / 2013-05-14
==================

  * Parsing as string and falling back to VM on Node.js


0.1.0 / 2013-04-25
==================

  * Initial release