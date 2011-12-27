var events = require('events');

var wrap = exports.wrap = {
	/**
	 * Wrap an anonymous or named function to notify an Emitter and
	 * return the wrapper function.
	 * @param {events.EventEmitter} emitter The emitter to notify
	 * @param {Function} fn The function to wrap
	 * @param {String} name The optional name
	 */
	fn : function(emitter, fn, name, scope) {
		var ucName = name ? name.replace(/^\w/, function($0) {
			return $0.toUpperCase();
		}) : null;
		return function() {
			emitter.emit('before', arguments, this, name);
			ucName && emitter.emit('before' + ucName, arguments, this, name);
			var result = fn.apply(scope || this, arguments);
			ucName && emitter.emit('after' + ucName, result, arguments, this, name);
			emitter.emit('after', result, arguments, this, name);
			return result;
		}
	},
	/**
	 * Wrap an anonymous or named function that calls a callback asynchronously
	 * to notify an Emitter and return the wrapper function.
	 * @param {events.EventEmitter} emitter The emitter to notify
	 * @param {Function} fn The function to wrap
	 * @param {Integer} position The position of the callback in the arguments
	 * array (defaults to 0). Set to -1 if the callback is the last argument.
	 * @param {String} name The optional name
	 */
	async : function(emitter, fn, position, name, scope) {
		var ucName = name ? name.replace(/^\w/, function($0) {
			return $0.toUpperCase();
		}) : null;
		return function() {
			var pos = position == -1 ? arguments.length - 1 : (position || 0), //
			callback = arguments[pos], context = this, methodArgs = arguments, //
			callbackWrapper = function() {
				callback.apply(callback, arguments);
				ucName && emitter.emit('after' + ucName, arguments, methodArgs, context, name);
				emitter.emit('after', arguments, methodArgs, context, name);
			};
			emitter.emit('before', arguments, this, name);
			ucName && emitter.emit('before' + ucName, arguments, this, name);
			arguments[pos] = callbackWrapper;
			fn.apply(scope || this, arguments);
		}
	}
};

var Emitter = exports.Emitter = function(obj) {
	this.obj = obj;
}

Emitter.prototype = new events.EventEmitter();

/**
 * Punch a method with the given name, with 
 * @param {String | Array} method The name of the method or a list of
 * method names.
 * @param {Integer} position The optional position of the asynchronous callback
 * in the arguments list.
 */
Emitter.prototype.punch = function(method, position) {
	if(Array.isArray(method)) {
		var self = this;
		method.forEach(function(method) {
			self.punch(method);
		});
	} else {
		var old = this.obj[method];
		if( typeof old == 'function') {
			this.obj[method] = (!position && position !== 0) ?
				wrap.fn(this, old, method) :
				wrap.async(this, old, position, method)
		}
	}
	return this;
};

exports.emitter = function(obj) {
	return new Emitter(obj);
};
