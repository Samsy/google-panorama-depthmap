(function (root) {
  "use strict";

  var expect = root.expect || require('expect.js'),
    jsonpClient,
    isNode = (typeof window === 'undefined'),
    baseLocation = isNode ? __dirname + '/' : root.baseLocation || '';

  if (isNode) {
    root.jsonpClient = "original";
    jsonpClient = require('../');
  } else {
    jsonpClient = root.jsonpClient;
  }

  describe('jsonpClient', function () {
    before(function () {});

    describe('No conflict', function () {
      it('should restore original jsonpClient', function () {
        var b = jsonpClient.noConflict(),
          currentVersion = b.noConflict();
        expect(currentVersion).to.be(b);
        expect(root.jsonpClient).to.be("original");
      });
    });

    describe("When fetching jsonp from " + (isNode ? "Node.js" : "a browser"), function () {
      var expected_one = {"one": "First"},
        expected_two = {"two": "Second"};

      it('should get a list of URLS', function (done) {
        jsonpClient(baseLocation + 'fixtures/one.js?callback=one', baseLocation + 'fixtures/two.js?callback=two', function (err, one, two) {
          if (err) { throw err; }
          expect(one).to.be.eql(expected_one);
          expect(two).to.be.eql(expected_two);
          done();
        });
      });

      it('should get an array of URLS', function (done) {
        jsonpClient([baseLocation + 'fixtures/one.js?callback=one', baseLocation + 'fixtures/two.js?callback=two'], function (err, one, two) {
          if (err) { throw err; }
          expect(one).to.be.eql(expected_one);
          expect(two).to.be.eql(expected_two);
          done();
        });
      });

      it('should fail when no callback is provided', function () {
        expect(function () {
          jsonpClient('foo');
        }).to.throwException(/jsonpClient expects a callback/);
      });

      if (!isNode) {
        it('should fail when no callback is included on the URL', function (done) {
          jsonpClient(baseLocation + 'fixtures/one.js', function (err) {
            expect(err).to.be.a(Error);
            done();
          });
        });
      } else {
        it('should fall back to string parsing when the VM fails', function (done) {
          jsonpClient(baseLocation + 'fixtures/invalid_syntax.js?callback=recipe_5712', function (err, configure_recipe) {
            if (err) { throw err; }
            expect(configure_recipe).to.have.keys(['success', 'message']);
            done();
          });
        });
      }

      it('should fail when no file is found', function (done) {
        jsonpClient(baseLocation + 'error', function (err) {
          expect(err).to.be.a(Error);
          done();
        });
      });

      it('should fail and not callback twice with the retrieved file cannot be parsed', function (done) {
        // If this test fails, you'll get either a timeout or "error is null".  It seems mocha has weird behavior
        // if you try to call done a second time and throwing an error gets caught elsewhere because
        // this bug is a result of try catches surrounding big blocks of code.  To fix this issue, searching for callbacks
        // that may be within try, catch blocks.

        jsonpClient(baseLocation + 'fixtures/invalid_syntax2.js', function (err) {
          setTimeout(function () { // Timeout ensures the issue always occurs if present.
            expect(err).to.be.a(Error);
            done();
          }, 1000);
        });
      });

      if (!isNode) {
        it('should complain if no callback is found', function (done) {
          jsonpClient(baseLocation + 'fixtures/one.js?callback=invalid', function (err, data) {
            expect(data).to.be(undefined);
            expect(err).to.be.a(Error);
            done();
          });
        });
      }

    });

  });

}(this));