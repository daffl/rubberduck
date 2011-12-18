// Load the library
var rubber = require('../lib/rubberduck');

var object = {
	number : 42,
	answer : function()
	{
		return this.number;
	}
},

emitter = rubber.duck(object).punch('answer');

// Create a new emitter
emitter.on('before', function(args, context, name) {
	console.log('Running before method ' + name);
	console.log(args);
	console.log(context);
});

emitter.on('after', function(result, args, context, name) {
	console.log('Got general after method event');
});

emitter.on('afterAnswer', function(result, args, context) {
	console.log('Got afterAnswer event and the answer is ' + result);
});

object.answer();
