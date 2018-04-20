const test = require('ava');
const upcast = require('../src');

test('should be a function', t => {
    t.true(typeof upcast.add === 'function');
});

test('should convert to date with correct types', t => {
    upcast.add('date', v => new Date(v));

    t.true(typeof upcast.cast.date === 'function');
    t.deepEqual(upcast.to('1988-11-05', 'date'), new Date('1988-11-05'));
});

test('should throw when called with a non-handler method', t => {
    t.throws(() => {
        upcast.add('fo', 'bar');
    }, /invalid argument: handler/i);
});
