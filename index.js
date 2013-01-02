(function (exports) {
    'use strict';


    // Get an object's type
    function type () {}
    exports.type = type;


    // Check whether an object is of a certain type
    function is () {}
    exports.is = is;


    // Cast an object to a given type
    function to () {}
    exports.to = to;


} (typeof exports === 'undefined' ? (this.upcast = this.upcast || {}) : exports));