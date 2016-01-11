# jsonp-client

[![Build Status](https://secure.travis-ci.org/bermi/jsonp-client.png?branch=master)](http://travis-ci.org/bermi/jsonp-client) [![Dependency Status](https://david-dm.org/bermi/jsonp-client/status.png)](http://david-dm.org/bermi/jsonp-client)

jsonp minimal client for the browser (1.4K or 0.74K gzipped) and Node.js

On Node.js jsonp JavaScript code will run on a sandbox.

## Installation

    $ npm install jsonp-client

## Usage

Include the library on Node.js

    var jsonpClient = require('jsonp-client');

or include the script for browser usage

     <script src="https://raw.github.com/bermi/jsonp-client/master/dist/jsonp-client.min.js" type="text/javascript"></script>

On the browser you must supply a valid callback on the URL. On Node.js the callback
will be taken from the script contents.

Single jsonp resource URL

    jsonpClient(url, function (err, data) {
    });

Multiple URLs

    jsonpClient(url1, url2, function (err, data1, data2) {
    });

or as an array of URLs

    jsonpClient([url1, url2], function (err, data1, data2) {
    });


### Callbacks

jsonp-client assumes you will explicitly define a callback on the URL.
This is a design decistion aimed to simplify the interface of the jsonp-client library.

Here is a sample method for automatically add callbacks to your URL's

    function addCallback(url) {
        // The URL already has a callback
        if (url.match(/callback=[a-z]/i)) {
            return url;
        }
        return url + ("&callback=cb" + Math.random()).replace('.', '');
    }


## Testing

    $ make test

### On the browser

    $ make test-browser

### Code coverage

You will need to install https://github.com/visionmedia/node-jscoverage
and then run

    $ make test-coverage

## Development watcher and test runner

### Continuous linting

    $ make dev

### Continuous testing

    $ make test-watch

### Continuous linting + testing

    $ make dev-test


## License

(The MIT License)

Copyright (c) 2013 Bermi Ferrer &lt;bermi@bermilabs.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
