const test = require('ava');
const upcast = require('../src');

test('should be an object', t => {
    t.true(typeof upcast === 'object');
});
