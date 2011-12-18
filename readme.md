# Rubberduck - Evented AOP for NodeJS

Rubberduck punches JavaScript objects and adds the ability to receive events
before or after a method executes.

## Simple punching

First we need to load the library and create a simple object to be punched.

	var rubber = require('rubberduck'),
		object = {
			number : 42,
			answer : function()
			{
				return this.number;
			}
		};

Create an event emitter with rubberduck for that object and tell it to listen for
events on the _answer_ method.

	var emitter = rubber.duck(object).punch('answer');
	
Lets add some event handlers. The *before* handler will fire before every
punched method with the method arguments, the context (this reference of
the method) and the name of the method as parameters:

	emitter.on('before', function(args, context, name) {
		console.log('Running before method ' + name);
		console.log(args);
		console.log(context);
	});
	
*after* will fire after every punched method with the result returned by the method,
the arguments, its context and the name of the method:
	
	emitter.on('after', function(result, args, context, name) {
		console.log('Got general after method event');
		console.log(result);
	});
	
You can also listen to events of specific punched methods. The name convention follows
the camelCased names for Events as recommended in the NodeJS documentation. E.g. for the
method _answer_ the *beforeAnswer* and *afterAnswer* events will fire:
	
	emitter.on('afterAnswer', function(result, args, context, name) {
		console.log('Got afterAnswer event and the answer is ' + result);
	});
	
Now you can just call the punched method and should see a bunch of output on the console.
	
	object.answer();

## Asynchronous punching

We can also punch asynchronous methods, that execute a callback instead of returning the value.
For this to happen, you have to tell Rubberduck the position of the callback in your arguments list.

## But this is not really AOP

Not really. But rubber ducks aren't really ducks either.
