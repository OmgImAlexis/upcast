import test from 'ava';
import upcast from '../main';

test('should be an object', t => {
    t.true(typeof upcast === 'object');
});
