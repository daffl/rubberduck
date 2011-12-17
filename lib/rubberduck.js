var events = require('events');

var wrap = exports.wrap = function(emitter, fn, name) {
	var ucName = name ? name.replace(/^\w/, function($0) {
		return $0.toUpperCase();
	}) : null;
	return function() {
		emitter.emit('before', arguments, this, name);
		ucName && emitter.emit('before' + ucName, arguments, this);
		var result = fn.apply(this, arguments);
		ucName && emitter.emit('after' + ucName, result, arguments, this);
		emitter.emit('after', result, arguments, this, name);
		return result;
	}
};

var wrapAsync = exports.wrapAsync = function(emitter, fn, position, name) {
	var ucName = name ? name.replace(/^\w/, function($0) {
		return $0.toUpperCase();
	}) : null;
	return function() {
		var pos = position == -1 ? arguments.length - 1 : (position || 0), //
		callback = arguments[pos], context = this, methodArgs = arguments, //
		callbackWrapper = function() {
			callback.apply(callback, arguments);
			ucName && emitter.emit('after' + ucName, arguments, methodArgs, context);
			emitter.emit('after', arguments, methodArgs, context, name);
		};
		emitter.emit('before', arguments, this, name);
		ucName && emitter.emit('before' + ucName, arguments, this);
		arguments[pos] = callbackWrapper;
		fn.apply(this, arguments);
	}
};

var Duck = exports.Duck = function(obj, methods) {
	if(!methods) {
		methods = [];
		for(var method in obj) {
			if(obj.hasOwnProperty(method)) {
				methods.push(method);
			}
		}
	}

	if(!Array.isArray(methods)) {
		methods = [methods];
	}

	var self = this;

	methods.forEach(function(method) {
		var old = obj[method];
		if( typeof old == 'function') {
			obj[method] = wrap(self, old, method);
		}
	});
}

Duck.prototype = new events.EventEmitter();
