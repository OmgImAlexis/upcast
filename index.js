/* global define */
(function (root, upcast) {
	'use strict';

    // Utilities
    // ------------

    // Guard a 'type' argument
	const guardTypeArg = type => {
		if (typeof type !== 'string') {
			throw new TypeError('Invalid argument: type is expected to be a string');
		}
	};

    // Type aliases
    // ------------

    // Define aliases
	const alias = {
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
	upcast.alias = alias;

    // Resolve type aliases
	const resolve = type => upcast.alias[type] || type;
	upcast.resolve = resolve;

    // Get type
    // --------

    // Get an object's type
	const type = val => {
		if (val === null) {
			return 'null';
		}
		if (Object.prototype.toString.call(val) === '[object Array]') {
			return 'array';
		}
		return typeof val;
	};
	upcast.type = type;

    // Check type
    // ----------

    // Check whether an object is of a certain type
	const is = (val, type) => {
		guardTypeArg(type);
		return (upcast.type(val) === upcast.resolve(type));
	};
	upcast.is = is;

    // Cast
    // ----

    // Cast an object to a given type
	const to = (val, type) => {
		guardTypeArg(type);

        // Get type and return if already correct
		type = upcast.resolve(type);
		const from = upcast.type(val);
		if (type === from) {
			return val;
		}

        // Get a caster and cast!
		if (!to.cast[type]) {
			return val;
		}
		const caster = to.cast[type][from] || to.cast[type];
		return caster(val);
	};
	upcast.to = to;

    // Default casters
	const cast = {
		array(val) {
			return [val];
		},
		boolean(val) {
			return (Boolean(val));
		},
		function(val) {
			return function () {
				return val;
			};
		},
		null: () => null,
		number: val => Number(val),
		object: val => new Object(val), // eslint-disable-line no-new-object
		string: val => String(val),
		undefined: () => undefined
	};
	to.cast = cast;

    // Special casters
	cast.array.null = () => [];
	cast.array.undefined = () => [];
	cast.array.string = val => val.split('');
	cast.boolean.array = val => val.length > 0;
	cast.number.array = val => to(to(val, 'string'), 'number');
	cast.number.string = val => {
		const num = Number(val, 10);
		return (isNaN(num) ? 0 : num);
	};
	cast.number.undefined = () => 0;
	cast.string.array = val => val.join('');
	cast.string.null = () => '';
	cast.string.undefined = () => '';

    // Exports
    // -------

	if (typeof define !== 'undefined' && define.amd) {
		// AMD
		define([], () => {
			return upcast;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = upcast;
	} else {
		// Script tag
		root.upcast = upcast;
	}
})(this, {});
