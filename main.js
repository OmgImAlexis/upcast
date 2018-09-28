/**
 * Guard a 'type' argument
 *
 * @param {String} type argument's type
 */
const guardTypeArg = type => {
    if (typeof type !== 'string') {
        throw new TypeError('Invalid argument: type is expected to be a string');
    }
};

/**
 * Guard a 'type' handler
 *
 * @param {String} type handler's type
 */
const guardTypeHandler = type => {
    if (typeof type !== 'function') {
        throw new TypeError('Invalid argument: handler is expected to be a function');
    }
};

/**
 * Upcast
 *
 * @class Upcast
 */
class Upcast {
    /**
     * Creates an instance of Upcast.
     * @memberof Upcast
     */
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
                return Boolean(val);
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
        this.cast.array.string = val => {
            if (val === 'false' || val === 'true') {
                return [this.cast.boolean.string(val)];
            }
            return val.split('');
        };
        this.cast.boolean.array = val => val.length > 0;
        this.cast.boolean.string = val => {
            if (val === 'false') {
                return false;
            }
            return this.cast.boolean(val);
        };
        this.cast.number.array = val => this.to(this.to(val, 'string'), 'number');
        this.cast.number.string = val => {
            if (val === 'false' || val === 'true') {
                val = this.cast.boolean.string(val);
            }
            const num = Number(val, 10);
            return (isNaN(num) ? 0 : num);
        };
        this.cast.number.undefined = () => 0;
        this.cast.string.array = val => val.join('');
        this.cast.string.null = () => '';
        this.cast.string.undefined = () => '';
        this.cast.object.string = val => {
            if (val === 'false' || val === 'true') {
                val = this.cast.boolean.string(val);
            }
            return this.cast.object(val);
        };
    }

    /**
     * Add custom cast
     *
     * @param {String} type cast type
     * @param {Function} handler cast handler
     * @memberof Upcast
     */
    add(type, handler) {
        guardTypeArg(type);
        guardTypeHandler(handler);

        this.cast[type] = handler.bind(this);
    }

    /**
     * Resolve type aliases
     *
     * @param {String} alias Alias name
     * @memberof Upcast
     */
    resolve(alias) {
        return this.alias[alias] || alias;
    }

    /**
     * Get a object's type
     *
     * @param {String} type Object's type
     * @returns
     * @memberof Upcast
     */
    type(type) {
        if (type === null) {
            return 'null';
        }
        if (Object.prototype.toString.call(type) === '[object Array]') {
            return 'array';
        }
        return typeof type;
    }

    /**
     * Check whether an object is of a certain type
     *
     * @param {Object} obj object to check
     * @param {String} type type to check
     * @returns {*}
     * @memberof Upcast
     */
    is(obj, type) {
        guardTypeArg(type);
        return (this.type(obj) === this.resolve(type));
    }

    /**
     * Cast an object to a given type
     *
     * @param {*} obj Object to cast
     * @param {*} type cast type
     * @returns {*}
     * @memberof Upcast
     */
    to(obj, type) {
        guardTypeArg(type);

        // Get type and return if already correct
        type = this.resolve(type);
        const from = this.type(obj);
        if (type === from) {
            return obj;
        }

        // Get a caster and cast!
        if (!this.cast[type]) {
            return obj;
        }
        const caster = this.cast[type][from] || this.cast[type];
        return caster(obj);
    }
}

export default new Upcast();
