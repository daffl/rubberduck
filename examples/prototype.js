// Load the library
var rubber = require('../lib/rubberduck'),

Thing = function(name) {
	this.name = name;
}

Thing.prototype.getName = function() {
	return this.name;
}

emitter = rubber.duck(Thing.prototype).punch('getName');

// Create a new emitter
emitter.on('before', function(args, context, name) {
	console.log('Running before method ' + name);
	console.log(context);
});

var inst = new Thing('Duck');
console.log(inst.getName());

var other = new Thing('Goose');
console.log(other.getName());
