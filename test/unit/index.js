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

            testType('should return the expected type when called with an array', 'array', [
                [1, 2, 3], new Array(1, 2, 3), []
            ]);

            testType('should return the expected type when called with a boolean', 'boolean', [
                true, false, new Boolean(true)
            ]);

            testType('should return the expected type when called with a function', 'function', [
                function () {}, new Function()
            ]);

            testType('should return the expected type when called with null', 'null', [null]);

            testType('should return the expected type when called with a number', 'number', [
                12, 1.2, new Number(123), NaN, Infinity
            ]);

            testType('should return the expected type when called with an object', 'object', [
                {}, new Object()
            ]);

            testType('should return the expected type when called with a string', 'string', [
                'foo', new String('bar'), ''
            ]);

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

            test('should have shortcut functions for all core types', function () {
                assert.isFunction(upcast.is.arr);
                assert.isFunction(upcast.is.bool);
                assert.isFunction(upcast.is.fn);
                assert.isFunction(upcast.is.nul);
                assert.isFunction(upcast.is.num);
                assert.isFunction(upcast.is.obj);
                assert.isFunction(upcast.is.str);
                assert.isFunction(upcast.is.und);
            });

            suite('shortcut functions:', function () {

                setup(function () {
                    sinon.stub(upcast, 'is');
                });

                teardown(function () {
                    upcast.is.restore();
                });

                function testShortcut (desc, type, fn) {
                    test(desc, function () {
                        fn('foo');
                        upcast.is.withArgs('foo', type).calledOnce;
                    });
                }

                testShortcut('is.arr should call is with the expected arguments', 'array', upcast.is.arr);

                testShortcut('is.bool should call is with the expected arguments', 'boolean', upcast.is.bool);

                testShortcut('is.fn should call is with the expected arguments', 'function', upcast.is.fn);

                testShortcut('is.nul should call is with the expected arguments', 'null', upcast.is.nul);

                testShortcut('is.num should call is with the expected arguments', 'number', upcast.is.num);

                testShortcut('is.obj should call is with the expected arguments', 'object', upcast.is.obj);

                testShortcut('is.str should call is with the expected arguments', 'string', upcast.is.str);

                testShortcut('is.und should call is with the expected arguments', 'undefined', upcast.is.und);

            });

        });

    });

} ());