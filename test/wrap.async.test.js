var duck = require('../lib/rubberduck');
var events = require('events');
var emitter;

exports.wrapAsync = function(test) {
  test.expect(5);
  emitter = new events.EventEmitter();

  var asyncFn = function(cb) {
    test.ok(true, 'Fn called');
    cb('testing');
  };

  var wrapped = duck.wrap.async(emitter, asyncFn);

  var callback = function(result) {
    test.equal(result, 'testing');
  };

  emitter.on('before', function(args) {
    test.equal(args[1], 42);
  });

  emitter.on('after', function(results, args) {
    test.equal(args[1], 42);
    test.equal(results[0], 'testing');
  });

  wrapped(callback, 42);

  test.done();
};

exports.wrapAsyncLast = function(test) {
  test.expect(5);
  emitter = new events.EventEmitter();

  var asyncFn = function(arg, other, cb) {
    test.ok(true, 'Fn called');
    cb('testing');
  };

  var wrapped = duck.wrap.async(emitter, asyncFn, -1);

  var callback = function(result) {
    test.equal(result, 'testing');
  };

  emitter.on('before', function(args) {
    test.equal(args[0], 42);
  });

  emitter.on('after', function(results, args) {
    test.equal(args[0], 42);
    test.equal(results[0], 'testing');
  });

  wrapped(42, 'test', callback);

  test.done();
};

