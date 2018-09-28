import test from 'ava';
import Upcast from '../main';

test('should be a function', t => {
    t.true(typeof Upcast.resolve === 'function');
});

test('should return type assigned to alias', t => {
    Upcast.alias.x = 'string';
    t.true(Upcast.resolve('x') === 'string');
});
