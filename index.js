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


    // Cast an object to a given type
    function to () {}
    exports.to = to;


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));