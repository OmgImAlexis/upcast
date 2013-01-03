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
        var caster = to.cast[type][from] || to.cast[type];
        return caster(val);

    }
    exports.to = to;

    // Default casters
    var cast = to.cast = {
        array: function (val) {
            return [val];
        },
        boolean: function (val) {
            return (val ? true : false);
        },
        'function': function (val) {
            return function () { return val; };
        },
        'null': function () {
            return null;
        },
        number: function (val) {
            return Number(val);
        },
        object: function (val) {
            return new Object(val);
        },
        string: function (val) {
            return val + '';
        },
        'undefined': function () {
            return void 0;
        }
    };

    // Special casters
    cast.array['null'] = cast.array['undefined'] = function () {
        return [];
    };
    cast.array.string = function (val) {
        return val.split('');
    };
    cast.boolean.array = function (val) {
        return val.length > 0;
    };
    cast.number.array = function (val) {
        return to(to(val, 'string'), 'number');
    };
    cast.number.string = function (val) {
        var num = parseInt(val, 10);
        return (isNaN(num) ? 0 : num);
    };
    cast.number['undefined'] = function () {
        return 0;
    };
    cast.string.array = function (val) {
        return val.join('');
    };
    cast.string['null'] = cast.string['undefined'] = function () {
        return '';
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
    shortcut('number', 'num');
    shortcut('object', 'obj');
    shortcut('string', 'str');


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));