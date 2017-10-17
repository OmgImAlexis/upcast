'use strict';

// Guard a 'type' argument
const guardTypeArg = type => {
    if (typeof type !== 'string') {
        throw new TypeError('Invalid argument: type is expected to be a string');
    }
};

class Upcast {
    constructor() {
		// Define aliases
        this.alias = {
            a: 'array',
            arr: 'array',
            array: 'array',
            b: 'boolean',
            bool: 'boolean',
            boolean: 'boolean',
            null: 'null',
            n: 'number',
            num: 'number',
            number: 'number',
            o: 'object',
            obj: 'object',
            object: 'object',
            s: 'string',
            str: 'string',
            string: 'string',
            undefined: 'undefined'
        };

		// Default casters
        this.cast = {
            array(val) {
                return [val];
            },
            boolean(val) {
                return (Boolean(val));
            },
            function(val) {
                return function() {
                    return val;
                };
            },
            null: () => null,
            number: val => Number(val),
            object: val => new Object(val), // eslint-disable-line no-new-object
            string: val => String(val),
            undefined: () => undefined
        };

		// Special casters
        this.cast.array.null = () => [];
        this.cast.array.undefined = () => [];
        this.cast.array.string = val => val.split('');
        this.cast.boolean.array = val => val.length > 0;
        this.cast.number.array = val => this.to(this.to(val, 'string'), 'number');
        this.cast.number.string = val => {
            const num = Number(val, 10);
            return (isNaN(num) ? 0 : num);
        };
        this.cast.number.undefined = () => 0;
        this.cast.string.array = val => val.join('');
        this.cast.string.null = () => '';
        this.cast.string.undefined = () => '';
    }

	// Resolve type aliases
    resolve(val) {
        return this.alias[val] || val;
    }

	// Get an object's type
    type(val) {
        if (val === null) {
            return 'null';
        }
        if (Object.prototype.toString.call(val) === '[object Array]') {
            return 'array';
        }
        return typeof val;
    }

	// Check whether an object is of a certain type
    is(val, type) {
        guardTypeArg(type);
        return (this.type(val) === this.resolve(type));
    }

	// Cast an object to a given type
    to(val, type) {
        guardTypeArg(type);

		// Get type and return if already correct
        type = this.resolve(type);
        const from = this.type(val);
        if (type === from) {
            return val;
        }

		// Get a caster and cast!
        if (!this.cast[type]) {
            return val;
        }
        const caster = this.cast[type][from] || this.cast[type];
        return caster(val);
    }
}

module.exports = new Upcast();
