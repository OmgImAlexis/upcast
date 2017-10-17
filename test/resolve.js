const test = require('ava');
const upcast = require('..');

test('should be a function', t => {
    t.true(typeof upcast.resolve === 'function');
});

test('should return type assigned to alias', t => {
    upcast.alias.x = 'string';
    t.true(upcast.resolve('x') === 'string');
});
