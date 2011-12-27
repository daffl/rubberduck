Rubberduck punches JavaScript objects and lets you receive events before and after a method executes.
Install it using [NPM](http://npmjs.org)

> npm install rubberduck

or clone the [GitHub repository](git@github.com:daffl/rubberduck.git).

	var rubberduck = require('rubberduck');

## Simple punching

Lets punch the _push_ method of an array instance and log the element that gets
pushed before the method executes and the new length of the array (returned by Array.push)
and the pushed element when it returns.

	var rubberduck = require('rubberduck'),
		myarray = [],
		emitter = rubberduck.emitter(myarray).punch('push');
	
	emitter.on('beforePush', function(args, instance) {
		console.log('About to push ' + args[0]);
	});
	
	emitter.on('afterPush', function(result, args, instance) {
		console.log('Pushed ' + args[0] + ', the new length is ' + result);
	});
	
	myarray.push('Test');

## Listening to events

Once you picked the methods to be punched the emitter fires the following events:

	// Before any punched method executes
	emitter.on('before', function(args, instance, name) {
		// args : Array of function arguments
		// instance: The function context (this reference)
		// name : The function name
	});
	
	// After any punched method returned
	emitter.on('after', function(result, args, instance, name) {
		// result : The return value or an array of
		//	the callback arguments for asynchronous functions
		// args : Array of function arguments
		// instance: The function context (this reference)
		// name : The function name
	});

You can also listen to specific events by using camelcased event names.
To get an event only before the _test_ method, attach the following event listener:

	emitter.on('beforeTest', function(args, instance, name) {
	});
	
	emitter.on('afterTest', function(result, args, instance, name) {
	});
	
The parameters are the same as in the general event listeners.

## Asynchronous punching

You can also punch asynchronous methods, that execute a callback instead of returning the value.
In this case the _after_ events receives an array of the callback parameters instead of a single return value.
Just tell the event emitter the position of the callback in your arguments list when punching a method
(use -1 if the callback is at the end of the argument list):

	var rubberduck = require('../lib/rubberduck'),
	Duck = function(name) {
		this.name = name;
	}
	
	Duck.prototype.quack = function(callback)
	{
		callback(null, this.name + ' quacks!');
	}
	
	var donald = new Duck('Donald'),
		emitter = rubberduck.emitter(donald).punch('quack', 0);

	// Log the callback results for _quack_
	emitter.on('afterQuack', function(results) {
		// Results contains the callback arguments
		console.log(results);
	});

## Punching prototypes and selective punching

You can also punch an objects prototype to receive events about all its instances but it
is important to be selective about what methods to punch. Firing events on methods that get
called many times (e.g. attaching to the Array.prototype) might lead to big performance
hits and can quickly exceed the maximum call stack size.
