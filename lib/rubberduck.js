var events = require('events');

function toBase26(num) {
	var outString = '';
	var letters = 'abcdefghijklmnopqrstuvwxyz';
	while(num > 25) {
		var remainder = num % 26;
		outString = letters.charAt(remainder) + outString;
		num = Math.floor(num / 26) - 1;
	}
    outString = letters.charAt(num) + outString;
	return outString;
}

function makeFakeArgs(len) {
	var argArr = [];
	for(var i = 0; i < len; i++) {
		argArr.push(toBase26(i));
	}
	return argArr.join(",");
}

function addArgs(fnString, argLen)  {
	return fnString.replace(/function\s*\(\)/, 'function('+makeFakeArgs(argLen)+')');
}

var wrap = exports.wrap = {
	/**
	 * Wrap an anonymous or named function to notify an Emitter and
	 * return the wrapper function.
	 * @param {events.EventEmitter} emitter The emitter to notify
	 * @param {Function} fn The function to wrap
	 * @param {String} name The optional name
	 */
	fn : function(emitter, fn, strict, name, scope) {
		var ucName = name ? name.replace(/^\w/, function($0) {
			return $0.toUpperCase();
		}) : null;
		var wrapped = function() {
			var result;
			emitter.emit('before', arguments, this, name);
			ucName && emitter.emit('before' + ucName, arguments, this, name);
			try {
				result = fn.apply(scope || this, arguments);
			} catch(e) {
				ucName && emitter.emit('error' + ucName, e, arguments, this, name);
				emitter.emit('error', e, arguments, this, name);
				throw e;
			}
			ucName && emitter.emit('after' + ucName, result, arguments, this, name);
			emitter.emit('after', result, arguments, this, name);
			return result;
		};
		if(strict) eval('wrapped = ' + addArgs(wrapped.toString(), fn.length));
		return wrapped;
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
	async : function(emitter, fn, position, strict, name, scope) {
		var ucName = name ? name.replace(/^\w/, function($0) {
			return $0.toUpperCase();
		}) : null;
		var wrapped = function() {
			var pos = position == -1 ? arguments.length - 1 : (position || 0), //
			callback = arguments[pos], context = this, methodArgs = arguments, //
			callbackWrapper = function() {
				try {
					callback.apply(callback, arguments);
				} catch(e) {
					ucName && emitter.emit('error' + ucName, e, methodArgs, context, name);
					emitter.emit('error', e, methodArgs, context, name);
					throw e;
				}
				var eventType = arguments[0] instanceof Error ? 'error' : 'after';
				ucName && emitter.emit(eventType + ucName, arguments, methodArgs, context, name);
				emitter.emit(eventType, arguments, methodArgs, context, name);
			};
			emitter.emit('before', arguments, this, name);
			ucName && emitter.emit('before' + ucName, arguments, this, name);
			arguments[pos] = callbackWrapper;
			try {
				fn.apply(scope || this, arguments);
			} catch(e) {
				ucName && emitter.emit('error' + ucName, e, arguments, context, name);
				emitter.emit('error', e, arguments, context, name);
				throw e;
			}
		};
		if(strict) eval('wrapped = ' + addArgs(wrapped.toString(), fn.length));
		return wrapped;
	}
};

var Emitter = exports.Emitter = function(obj) {
	this.obj = obj;
}

Emitter.prototype = Object.create(events.EventEmitter.prototype);

/**
 * Punch a method with the given name, with 
 * @param {String | Array} method The name of the method or a list of
 * method names.
 * @param {Integer} position The optional position of the asynchronous callback
 * in the arguments list.
 */
Emitter.prototype.punch = function(method, position, strict) {
	if(Array.isArray(method)) {
		var self = this;
		method.forEach(function(method) {
			self.punch(method, position, strict);
		});
	} else {
		var old = this.obj[method];
		if( typeof old == 'function') {
			this.obj[method] = (!position && position !== 0) ?
				wrap.fn(this, old, strict, method) :
				wrap.async(this, old, position, strict, method)
		}
	}
	return this;
};

exports.emitter = function(obj) {
	return new Emitter(obj);
};
