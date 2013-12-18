var duck = require('../lib/rubberduck');
var events = require('events');
var emitter;

exports.wrapAnonymus = function(test) {
  test.expect(4);
  // Create an event emitter to attach to the wrapped function
  emitter = new events.EventEmitter();

  // The function to wrap
  var fn = function() {
    test.ok(true, 'Fn called');
    return 'testing';
  };

  var wrapped = duck.wrap.fn(emitter, fn);
  // Emitted before
  emitter.on('before', function(args) {
    test.equal(args[0], 'test');
  });
  // Emitted after
  emitter.on('after', function(result) {
    test.equal(result, 'testing');
  });

  test.equal(wrapped('test'), 'testing');
  test.done();
};

exports.wrapNamed = function(test) {
  test.expect(8);
  emitter = new events.EventEmitter();

  var fn = function() {
    test.ok(true, 'Fn called');
    return 'testing';
  };

  var wrapped = duck.wrap.fn(emitter, fn, false, 'quack');

  emitter.on('before', function(args, context, method) {
    test.equal(args[0], 'test');
    test.equal(method, 'quack');
  });

  emitter.on('beforeQuack', function(args) {
    test.equal(args[0], 'test');
  });

  emitter.on('after', function(result, args, context, method) {
    test.equal(result, 'testing');
    test.equal(method, 'quack');
  });

  emitter.on('afterQuack', function(result) {
    test.equal(result, 'testing');
  });

  test.equal(wrapped('test'), 'testing');
  test.done();
};

exports.wrapScope = function(test) {
  test.expect(2);

  var obj = {
    number: 42,
    method: function() {
      return this.number;
    }
  };

  emitter = new events.EventEmitter();

  var wrapped = duck.wrap.fn(emitter, obj.method, false, 'method', obj);

  emitter.on('after', function(result) {
    test.equal(result, 42);
  });

  test.equal(wrapped(), 42);

  test.done();
};
