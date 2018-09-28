import test from 'ava';
import Upcast from '../main';

test('should be a function', t => {
    t.true(typeof Upcast.add === 'function');
});

test('should convert to date with correct types', t => {
    Upcast.add('date', v => new Date(v));

    t.true(typeof Upcast.cast.date === 'function');
    t.deepEqual(Upcast.to('1988-11-05', 'date'), new Date('1988-11-05'));
});

test('should throw when called with a non-handler method', t => {
    t.throws(() => {
        Upcast.add('fo', 'bar');
    }, /invalid argument: handler/i);
});
