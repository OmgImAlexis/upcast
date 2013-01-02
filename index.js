(function (exports) {
    'use strict';


    // Get an object's type
    function type (val) {
        var str = Object.prototype.toString.call(val);
        switch (str) {
            case '[object Array]':
                return 'array';
            case '[object Null]':
                return 'null';
            default:
                return typeof val;
        }
    }
    exports.type = type;


    // Check whether an object is of a certain type
    function is (val, type) {
        return (exports.type(val) === type);
    }
    exports.is = is;


    // Cast an object to a given type
    function to (val, type) {

        // Get type and return if already correct
        var from = exports.type(val);
        if (type === from) {
            return val;
        }

        // Todo: guarding

        // Get a caster and cast!
        var caster = to.cast[type][from] || to.cast[type]._default;
        return caster(val);

    }
    exports.to = to;

    // Default casters
    to.cast = {
        array: {
            'null': function () { return []; },
            string: function (val) { return val.split(''); },
            undefined: function () { return []; },
            _default: function (val) { return [val]; }
        },
        boolean: {
            array: function (val) { return val.length > 0; },
            _default: function (val) { return (val ? true : false); }
        },
        'function': {
            _default: function (val) { return function () { return val; }; }
        },
        'null': {
            _default: function () { return null; }
        },
        number: {
            array: function (val) { return to(to(val, 'string'), 'number'); },
            string: function (val) {
                var num = parseInt(val, 10);
                return (isNaN(num) ? 0 : num);
            },
            undefined: function () { return 0; },
            _default: function (val) { return Number(val); }
        },
        object: {
            _default: function (val) { return new Object(val); }
        },
        string: {
            array: function (val) { return val.join(''); },
            'null': function () { return ''; },
            undefined: function () { return ''; },
            _default: function (val) { return val + ''; }
        },
        undefined: {
            _default: function () { return void 0; }
        }
    };


    // Check/cast shortcuts
    function shortcut (type, alias) {
        is[alias] = function (val) {
            return exports.is(val, type);
        };
        to[alias] = function (val) {
            return exports.to(val, type);
        };
    }
    shortcut('array', 'arr');
    shortcut('boolean', 'bool');
    shortcut('function', 'fn');
    shortcut('null', 'nul');
    shortcut('number', 'num');
    shortcut('object', 'obj');
    shortcut('string', 'str');
    shortcut('undefined', 'und');


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));