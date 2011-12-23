var duck = require('../lib/rubberduck');

exports.duckPunchSimple = function(test)
{
	test.expect(4);
	var obj = {
		number : 42,
		method : function()
		{
			return this.number;
		}
	};
	
	var emitter = duck.duck(obj).punch('method');
	
	emitter.on('before', function() {
		test.ok(true, "before ran");
	});
	
	emitter.on('beforeMethod', function(args, context) {
		test.equal(context.number, 42);
		test.ok(true, "beforeMethod ran");
	});
	
	test.equal(obj.method(), 42);
	
	test.done();
};