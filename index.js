(function (exports) {
    'use strict';


    // Type aliases
    var alias = exports.alias = {};
    alias.a = alias.arr = alias.array = 'array';
    alias.b = alias.bool = alias.boolean = 'boolean';
    alias.f = alias.fn = alias['function'] = 'function';
    alias['null'] = 'null';
    alias.n = alias.num = alias.number = 'number';
    alias.o = alias.obj = alias.object = 'object';
    alias.s = alias.str = alias.string = 'string';
    alias['undefined'] = 'undefined';

    // Resolve type aliases
    function resolve (type) {
        return exports.alias[type] || null;
    }
    exports.resolve = resolve;


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
        guardTypeArg(type);
        var valType = exports.type(val);
        return (valType === exports.resolve(type) || valType === type);
    }
    exports.is = is;


    // Cast an object to a given type
    function to (val, type) {
        guardTypeArg(type);

        // Get type and return if already correct
        type = exports.resolve(type) || type;
        var from = exports.type(val);
        if (type === from) {
            return val;
        }

        // Get a caster and cast!
        if (!to.cast[type]) {
            return val;
        }
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


    // Guarding functions
    function guardTypeArg (type) {
        if (typeof type !== 'string') {
            throw new Error('Invalid argument: type is expected to be a string');
        }
    }


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));