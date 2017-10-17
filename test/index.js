const test = require('ava');
const upcast = require('..');

test('should be an object', t => {
    t.true(typeof upcast === 'object');
});
