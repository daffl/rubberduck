var duck = require('./lib/rubberduck'),
events = require('events'),
emitter = new events.EventEmitter();

var fn = function() {
	console.log('test');
	return 'testing';
}

var wrapped = duck.wrap(emitter, fn, 'test');

emitter.on('before', function(method) {
	console.log('Pre ' + method);
});

emitter.on('beforeTest', function(args) {
	console.log('preTest');
});


emitter.on('afterTest', function(result) {
	console.log('Got ' + result);
});

wrapped();

/*
var test = {
	log : function()
	{
		
	}
}

var duck = require('./lib/rubberduck.js');

var emitter = duck.punch(test);

emitter.on('before', function(method, args) {
	
});

emiter.on('after', function(method, result, args) {
	
});

emitter.on('beforeLog', function(method, args) {
	
});

emiter.on('afterLog', function(method, result, args) {
	
});
*/