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

        // Check for caster
        // if (typeof to.cast[type] === 'undefined' || typeof to.cast[type]._default !== 'function') {
        //     throw new Error('Cannot cast to type: \'' + type + '\'');
        // }

        // Get a caster and cast!
        var caster = to.cast[type][from] || to.cast[type]._default;
        return caster(val);

    }
    exports.to = to;

    // Default casters
    to.cast = {
        array: {
            null: function () { return []; },
            string: function (val) { return val.split(''); },
            undefined: function () { return []; },
            _default: function (val) { return [val]; }
        },
        boolean: {
            array: function (val) { return val.length > 0; },
            _default: function (val) { return (val ? true : false); }
        },
        function: {
            _default: function (val) { return function () { return val; }; }
        },
        null: {
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
            null: function () { return ''; },
            undefined: function () { return ''; },
            _default: function (val) { return val + ''; }
        },
        undefined: {
            _default: function () { return void 0; }
        }
    };


    // Shortcut type checkers
    function isShortcut (type) {
        return function (val) {
            return exports.is(val, type);
        };
    }
    is.arr  = isShortcut('array');
    is.bool = isShortcut('boolean');
    is.fn   = isShortcut('function');
    is.nul  = isShortcut('null');
    is.num  = isShortcut('number');
    is.obj  = isShortcut('object');
    is.str  = isShortcut('string');
    is.und  = isShortcut('undefined');

    // Shortcut casters
    function toShortcut (type) {
        return function (val) {
            return exports.to(val, type);
        };
    }
    to.arr  = toShortcut('array');
    to.bool = toShortcut('boolean');
    to.fn   = toShortcut('function');
    to.nul  = toShortcut('null');
    to.num  = toShortcut('number');
    to.obj  = toShortcut('object');
    to.str  = toShortcut('string');
    to.und  = toShortcut('undefined');


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));