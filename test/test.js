var duck = require('../lib/rubberduck'),
events = require('events');

exports.wrapAnonymus = function (test) {
	test.expect(4);
	emitter = new events.EventEmitter();
	
	var fn = function(arg) {
		test.ok(true, 'Fn called');
		return 'testing';
	}
	
	var wrapped = duck.wrap(emitter, fn);
	
	emitter.on('before', function(args) {
		test.equal(args[0], 'test');
	});
	
	emitter.on('after', function(result) {
		test.equal(result, 'testing');
	});
	
	test.equal(wrapped('test'), 'testing');
	test.done();
};

/*
exports.wrapScope = function (test) {
	test.fail('Test proper scoping');
	test.done();
};
*/

exports.wrapNamed = function (test) {
	test.expect(8);
	emitter = new events.EventEmitter();
	
	var fn = function(arg) {
		test.ok(true, 'Fn called');
		return 'testing';
	}
	
	var wrapped = duck.wrap(emitter, fn, 'quack');
	
	emitter.on('before', function(args, method) {
		test.equal(args[0], 'test');
		test.equal(method, 'quack');
	});
	
	emitter.on('beforeQuack', function(args) {
		test.equal(args[0], 'test');
	});

	emitter.on('after', function(result, args, method) {
		test.equal(result, 'testing');
		test.equal(method, 'quack');
	});
	
	emitter.on('afterQuack', function(result) {
		test.equal(result, 'testing');
	});
	
	test.equal(wrapped('test'), 'testing');
	test.done();
};

exports.wrapAsync = function (test) {
	test.expect(5);
	emitter = new events.EventEmitter();
	
	var asyncFn = function(cb, arg) {
		test.ok(true, 'Fn called');
		cb('testing');
	}
	
	var wrapped = duck.wrapAsync(emitter, asyncFn);

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

exports.duck = function(test)
{
	var obj = {
		number : 42,
		method : function()
		{
			return this.number;
		}
	};
	
	test.equal(obj.method(), 42);
	
	var emitter = new duck.Duck(obj);
	
	emitter.on('before', function() {
		console.log('Before');
	});
	
	test.equal(obj.method(), 42);

	test.done();
};
