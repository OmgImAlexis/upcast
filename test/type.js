import test from 'ava';
import upcast from '../main';

test('should be a function', t => {
    t.true(typeof upcast.type === 'function');
});

const testType = (t, inputs, expected) => {
    inputs = Array.isArray(inputs) ? inputs : [inputs];
    inputs.forEach(input => t.is(upcast.type(input), expected));
};

test('should return the expected type when called with an array', testType, [[1, 2, 3], []], 'array');
test('should return the expected type when called with a boolean', testType, [true, false], 'boolean');
test('should return the expected type when called with a function', testType, [function() {}], 'function');
test('should return the expected type when called with null', testType, [null], 'null');
test('should return the expected type when called with a number', testType, [12, 1.2, NaN, Infinity], 'number');
test('should return the expected type when called with an object', testType, [{}], 'object');
test('should return the expected type when called with a string', testType, ['foo', ''], 'string');
test('should return the expected type when called with undefined', testType, [undefined], 'undefined');
