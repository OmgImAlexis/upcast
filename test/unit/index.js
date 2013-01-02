/*global suite, test */
(function () {
    'use strict';
    
    // Dependencies
    var assert = require('chai').assert;

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

    });

} ());