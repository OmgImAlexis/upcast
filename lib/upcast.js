/*global define */
(function (root, upcast) {
    'use strict';


    // Utilities
    // ------------

    // Guard a 'type' argument
    function guardTypeArg (type) {
        if (typeof type !== 'string') {
            throw new Error('Invalid argument: type is expected to be a string');
        }
    }


    // Type aliases
    // ------------

    // Define aliases
    var alias = upcast.alias = {};
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
        return upcast.alias[type] || type;
    }
    upcast.resolve = resolve;


    // Get type
    // --------

    // Get an object's type
    function type (val) {
        if (val === null) {
            return 'null';
        }
        if (Object.prototype.toString.call(val) === '[object Array]') {
            return 'array';
        }
        return typeof val;
    }
    upcast.type = type;


    // Check type
    // ----------

    // Check whether an object is of a certain type
    function is (val, type) {
        guardTypeArg(type);
        return (upcast.type(val) === upcast.resolve(type));
    }
    upcast.is = is;


    // Cast
    // ----

    // Cast an object to a given type
    function to (val, type) {
        guardTypeArg(type);

        // Get type and return if already correct
        type = upcast.resolve(type);
        var from = upcast.type(val);
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
    upcast.to = to;

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
        var num = Number(val, 10);
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


    // Exports
    // -------

    // AMD
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return upcast;
        });
    }
    // CommonJS
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = upcast;
    }
    // Script tag
    else {
        root.upcast = upcast;
    }


} (this, {}));