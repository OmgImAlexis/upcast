/*jshint maxlen: 140 */
/*global setup, suite, teardown, test */
(function () {
    'use strict';
    
    // Dependencies
    var assert = require('chai').assert;
    var sinon = require('sinon');

    // Test subject
    var upcast = require('../..');

    // Test suite
    suite('upcast:', function () {

        test('should be an object', function () {
            assert.isObject(upcast);
        });

        test('should have a type function', function () {
            assert.isFunction(upcast.type);
        });

        test('should have an is function', function () {
            assert.isFunction(upcast.is);
        });

        test('should have a to function', function () {
            assert.isFunction(upcast.to);
        });

        suite('type function:', function () {

            function testType (desc, type, values) {
                test(desc, function () {
                    var i, len = values.length;
                    for (i = 0; i < len; i ++) {
                        assert.strictEqual(upcast.type(values[i]), type);
                    }
                });
            }

            testType('should return the expected type when called with an array', 'array', [[1, 2, 3], []]);
            testType('should return the expected type when called with a boolean', 'boolean', [true, false]);
            testType('should return the expected type when called with a function', 'function', [function () {}]);
            testType('should return the expected type when called with null', 'null', [null]);
            testType('should return the expected type when called with a number', 'number', [12, 1.2, NaN, Infinity]);
            testType('should return the expected type when called with an object', 'object', [{}]);
            testType('should return the expected type when called with a string', 'string', ['foo', '']);
            testType('should return the expected type when called with undefined', 'undefined', [undefined]);

        });

        suite('is function:', function () {

            setup(function () {
                sinon.stub(upcast, 'type');
                upcast.type.withArgs('foo').returns('type1');
                upcast.type.withArgs('bar').returns('type2');
            });

            teardown(function () {
                upcast.type.restore();
            });

            test('should utilise the type function', function () {
                upcast.is('foo', 'type1');
                assert.isTrue(upcast.type.calledOnce);
            });

            test('should return true when called with the correct type', function () {
                assert.isTrue(upcast.is('foo', 'type1'));
            });

            test('should return false when called with the incorrect type', function () {
                assert.isFalse(upcast.is('bar', 'type1'));
            });

            test('should resolve type aliases', function () {
                upcast.type.withArgs([]).returns('array');
                upcast.alias.seq = 'array';
                assert.isTrue(upcast.is([], 'seq'));
            });

        });

        suite('to function:', function () {
            var testFn = function () {};
            testFn.foo = 'bar';

            function testTo (desc, type, pairs) {
                test(desc, function () {
                    var i, len = pairs.length, pair;
                    for (i = 0; i < len; i ++) {
                        pair = pairs[i];
                        if (isNaN(pair.to)) {
                            assert.isTrue(isNaN(upcast.to(pair.from, type)));
                        } else {
                            assert.deepEqual(upcast.to(pair.from, type), pair.to);
                        }
                    }
                });
            }

            function testToFn (desc, pairs) {
                test(desc, function () {
                    var i, len = pairs.length, pair;
                    for (i = 0; i < len; i ++) {
                        pair = pairs[i];
                        if (isNaN(pair)) {
                            assert.isTrue(isNaN(upcast.to(pair, 'function')));
                        } else {
                            assert.deepEqual(upcast.to(pair, 'function')(), pair);
                        }
                    }
                });
            }

            testTo('should convert to arrays correctly', 'array', [
                { from: ['a', 'b', 'c'], to: ['a', 'b', 'c'] },
                { from: [1, 2, 3],       to: [1, 2, 3] },
                { from: [],              to: [] },
                { from: true,            to: [true] },
                { from: false,           to: [false] },
                { from: testFn,          to: [testFn] },
                { from: null,            to: [] },
                { from: 123,             to: [123] },
                { from: NaN,             to: [NaN] },
                { from: Infinity,        to: [Infinity] },
                { from: {foo: 'bar'},    to: [{foo: 'bar'}] },
                { from: 'foo',           to: ['f', 'o', 'o'] },
                { from: '',              to: [] },
                { from: undefined,       to: [] }
            ]);

            testTo('should convert to booleans correctly', 'boolean', [
                { from: ['a', 'b', 'c'], to: true },
                { from: [1, 2, 3],       to: true },
                { from: [],              to: false },
                { from: true,            to: true },
                { from: false,           to: false },
                { from: testFn,          to: true },
                { from: null,            to: false },
                { from: 123,             to: true },
                { from: 0,               to: false },
                { from: NaN,             to: false },
                { from: Infinity,        to: true },
                { from: {foo: 'bar'},    to: true },
                { from: 'foo',           to: true },
                { from: '',              to: false },
                { from: undefined,       to: false }
            ]);

            testToFn('should convert to functions correctly', [
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
            ]);

            testTo('should convert to null correctly', 'null', [
                { from: ['a', 'b', 'c'], to: null },
                { from: [1, 2, 3],       to: null },
                { from: [],              to: null },
                { from: true,            to: null },
                { from: false,           to: null },
                { from: testFn,          to: null },
                { from: null,            to: null },
                { from: 123,             to: null },
                { from: 0,               to: null },
                { from: NaN,             to: null },
                { from: Infinity,        to: null },
                { from: {foo: 'bar'},    to: null },
                { from: 'foo',           to: null },
                { from: '',              to: null },
                { from: undefined,       to: null }
            ]);

            testTo('should convert to numbers correctly', 'number', [
                { from: ['a', 'b', 'c'], to: 0 },
                { from: [1, 2, 3],       to: 123 },
                { from: [],              to: 0 },
                { from: true,            to: 1 },
                { from: false,           to: 0 },
                { from: testFn,          to: NaN },
                { from: null,            to: 0 },
                { from: 123,             to: 123 },
                { from: NaN,             to: NaN },
                { from: Infinity,        to: Infinity },
                { from: {foo: 'bar'},    to: NaN },
                { from: 'foo',           to: 0 },
                { from: '',              to: 0 },
                { from: undefined,       to: 0 }
            ]);

            testTo('should convert to objects correctly', 'object', [
                { from: ['a', 'b', 'c'], to: {0: 'a', 1: 'b', 2: 'c'} },
                { from: [1, 2, 3],       to: {0: 1, 1: 2, 2: 3} },
                { from: [],              to: [] },
                { from: true,            to: Object(true) },
                { from: false,           to: Object(false) },
                { from: testFn,          to: testFn },
                { from: null,            to: {} },
                { from: 123,             to: Object(123) },
                { from: NaN,             to: {} },
                { from: Infinity,        to: Object(Infinity) },
                { from: {foo: 'bar'},    to: {foo: 'bar'} },
                { from: 'foo',           to: {0: 'f', 1: 'o', 2: 'o'} },
                { from: '',              to: Object('') },
                { from: undefined,       to: {} }
            ]);

            testTo('should convert to strings correctly', 'string', [
                { from: ['a', 'b', 'c'], to: 'abc' },
                { from: [1, 2, 3],       to: '123' },
                { from: [],              to: '' },
                { from: true,            to: 'true' },
                { from: false,           to: 'false' },
                { from: testFn,          to: 'function () {}' },
                { from: null,            to: '' },
                { from: 123,             to: '123' },
                { from: NaN,             to: 'NaN' },
                { from: Infinity,        to: 'Infinity' },
                { from: {foo: 'bar'},    to: '[object Object]' },
                { from: 'foo',           to: 'foo' },
                { from: '',              to: '' },
                { from: undefined,       to: '' }
            ]);

            testTo('should convert to undefined correctly', 'undefined', [
                { from: ['a', 'b', 'c'], to: undefined },
                { from: [1, 2, 3],       to: undefined },
                { from: [],              to: undefined },
                { from: true,            to: undefined },
                { from: false,           to: undefined },
                { from: testFn,          to: undefined },
                { from: null,            to: undefined },
                { from: 123,             to: undefined },
                { from: 0,               to: undefined },
                { from: NaN,             to: undefined },
                { from: Infinity,        to: undefined },
                { from: {foo: 'bar'},    to: undefined },
                { from: 'foo',           to: undefined },
                { from: '',              to: undefined },
                { from: undefined,       to: undefined }
            ]);

            test('should resolve type aliases', function () {
                upcast.alias.seq = 'array';
                assert.deepEqual(upcast.to('foo', 'seq'), ['f', 'o', 'o']);
            });

        });

    });

} ());