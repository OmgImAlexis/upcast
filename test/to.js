const test = require('ava');
const upcast = require('..');

const testFn = function() {};
testFn.foo = 'bar';

test('should be a function', t => {
    t.true(typeof upcast.to === 'function');
});

const testTo = (t, inputs, expected) => {
    inputs.forEach(input => {
        if (expected === 'function') {
            return t.deepEqual(upcast.to(input, 'function')(), input);
        }

        if (isNaN(input.to)) {
            return t.true(isNaN(upcast.to(input.from, expected)));
        }

        t.deepEqual(upcast.to(input.from, expected), input.to);
    });
};

test('should convert to arrays correctly', testTo, [
    {from: ['a', 'b', 'c'], to: ['a', 'b', 'c']},
    {from: [1, 2, 3], to: [1, 2, 3]},
    {from: [], to: []},
    {from: true, to: [true]},
    {from: false, to: [false]},
    {from: testFn, to: [testFn]},
    {from: null, to: []},
    {from: 123, to: [123]},
    {from: NaN, to: [NaN]},
    {from: Infinity, to: [Infinity]},
    {from: {foo: 'bar'}, to: [{foo: 'bar'}]},
    {from: 'foo', to: ['f', 'o', 'o']},
    {from: '', to: []},
    {from: undefined, to: []}
], 'array');

test('should convert to booleans correctly', testTo, [
    {from: ['a', 'b', 'c'], to: true},
    {from: [1, 2, 3], to: true},
    {from: [], to: false},
    {from: true, to: true},
    {from: false, to: false},
    {from: testFn, to: true},
    {from: null, to: false},
    {from: 123, to: true},
    {from: 0, to: false},
    {from: NaN, to: false},
    {from: Infinity, to: true},
    {from: {foo: 'bar'}, to: true},
    {from: 'foo', to: true},
    {from: '', to: false},
    {from: undefined, to: false}
], 'boolean');

test('should convert to functions correctly', testTo, [
    ['a', 'b', 'c'],
    [1, 2, 3],
    [],
    true,
    false,
    null,
    123,
    0,
    NaN,
    Infinity,
    {foo: 'bar'},
    'foo',
    '',
    undefined
], 'function');

test('should convert to null correctly', testTo, [
    {from: ['a', 'b', 'c'], to: null},
    {from: [1, 2, 3], to: null},
    {from: [], to: null},
    {from: true, to: null},
    {from: false, to: null},
    {from: testFn, to: null},
    {from: null, to: null},
    {from: 123, to: null},
    {from: 0, to: null},
    {from: NaN, to: null},
    {from: Infinity, to: null},
    {from: {foo: 'bar'}, to: null},
    {from: 'foo', to: null},
    {from: '', to: null},
    {from: undefined, to: null}
], 'null');

test('should convert to numbers correctly', testTo, [
    {from: ['a', 'b', 'c'], to: 0},
    {from: [1, 2, 3], to: 123},
    {from: [], to: 0},
    {from: true, to: 1},
    {from: false, to: 0},
    {from: testFn, to: NaN},
    {from: null, to: 0},
    {from: 123, to: 123},
    {from: 1.23, to: 1.23},
    {from: '123', to: 123},
    {from: '1.23', to: 1.23},
    {from: NaN, to: NaN},
    {from: Infinity, to: Infinity},
    {from: {foo: 'bar'}, to: NaN},
    {from: 'foo', to: 0},
    {from: '', to: 0},
    {from: undefined, to: 0}
], 'number');

/* eslint-disable no-new-object */
test('should convert to objects correctly', testTo, [
    {from: ['a', 'b', 'c'], to: {0: 'a', 1: 'b', 2: 'c'}},
    {from: [1, 2, 3], to: {0: 1, 1: 2, 2: 3}},
    {from: [], to: []},
    {from: true, to: new Object(true)},
    {from: false, to: new Object(false)},
    {from: testFn, to: testFn},
    {from: null, to: {}},
    {from: 123, to: new Object(123)},
    {from: NaN, to: {}},
    {from: Infinity, to: new Object(Infinity)},
    {from: {foo: 'bar'}, to: {foo: 'bar'}},
    {from: 'foo', to: {0: 'f', 1: 'o', 2: 'o'}},
    {from: '', to: new Object('')},
    {from: undefined, to: {}}
], 'object');
/* eslint-enable */

test('should convert to strings correctly', testTo, [
    {from: ['a', 'b', 'c'], to: 'abc'},
    {from: [1, 2, 3], to: '123'},
    {from: [], to: ''},
    {from: true, to: 'true'},
    {from: false, to: 'false'},
    {from: testFn, to: 'function () {}'},
    {from: null, to: ''},
    {from: 123, to: '123'},
    {from: NaN, to: 'NaN'},
    {from: Infinity, to: 'Infinity'},
    {from: {foo: 'bar'}, to: '[object Object]'},
    {from: 'foo', to: 'foo'},
    {from: '', to: ''},
    {from: undefined, to: ''}
], 'string');

test('should convert to undefined correctly', testTo, [
    {from: ['a', 'b', 'c'], to: undefined},
    {from: [1, 2, 3], to: undefined},
    {from: [], to: undefined},
    {from: true, to: undefined},
    {from: false, to: undefined},
    {from: testFn, to: undefined},
    {from: null, to: undefined},
    {from: 123, to: undefined},
    {from: 0, to: undefined},
    {from: NaN, to: undefined},
    {from: Infinity, to: undefined},
    {from: {foo: 'bar'}, to: undefined},
    {from: 'foo', to: undefined},
    {from: '', to: undefined},
    {from: undefined, to: undefined}
], 'undefined');

test('should throw when called with a non-string type', t => {
    t.throws(() => {
        upcast.to('bar', 123);
    }, /invalid argument: type/i);
});

test('should resolve type aliases', t => {
    upcast.alias.seq = 'array';
    t.deepEqual(upcast.to('foo', 'seq'), ['f', 'o', 'o']);
});

test('should guard against types without casters', t => {
    t.is(upcast.to('foo', 'poo'), 'foo');
});
