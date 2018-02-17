const test = require('ava');
const sinon = require('sinon');
const Upcast = require('../src');

test.beforeEach(t => {
    t.context.upcast = Upcast;

    sinon.stub(t.context.upcast, 'type');
    t.context.upcast.type.withArgs('foo').returns('type1');
    t.context.upcast.type.withArgs('bar').returns('type2');
});

test.afterEach.always(t => t.context.upcast.type.restore());

test('should be a function', t => {
    const {upcast} = t.context;
    t.true(typeof upcast.is === 'function');
});

test('should utilise the type function', t => {
    const {upcast} = t.context;
    upcast.is('foo', 'type1');
    t.true(upcast.type.calledOnce);
});

test('should return true when called with the correct type', t => {
    const {upcast} = t.context;
    t.true(upcast.is('foo', 'type1'));
});

test('should return false when called with the incorrect type', t => {
    const {upcast} = t.context;
    t.false(upcast.is('bar', 'type1'));
});

test('should throw when called with a non-string type', t => {
    const {upcast} = t.context;
    t.throws(() => {
        upcast.is('bar', 123);
    }, /invalid argument: type/i);
});

test('should resolve type aliases', t => {
    const {upcast} = t.context;
    upcast.type.withArgs([]).returns('array');
    upcast.alias.seq = 'array';
    t.true(upcast.is([], 'seq'));
});
