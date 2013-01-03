
Upcast
======

Upcast is a low-level JavaScript type checking and casting library. Upcast simplifies type-checking and converts between types in a more sensible and predictable way than using plain ol' JavaScript.

**Current Version:** *0.0.0*  
**Automated Build Status:** [![Build Status][travis-status]][travis]  
**Node Support:** *0.6, 0.8*  
**Browser Support:** *Untested*


Getting Started
---------------

You can use Upcast on the server side with [Node.js][node] and npm:

```sh
$ npm install upcast
```

On the client side, you can either install Upcast through [Component][component]:

```sh
$ component install rowanmanning/upcast
```

or by simply including `index.js` in your page:

```html
<script src="path/to/upcast/index.js"></script>
```


Usage
-----

Upcast exposes three simple functions:

* **[type](#upcasttype)**: get the type of an object
* **[is](#upcastis)**: check whether an object is of a given type
* **[to](#upcastto)**: convert an object to a specific type

In Node.js or using Component, you can include Upcast in your script by using require:

```js
var upcast = require('upcast');
```

If you're just including with a `<script>`, `upcast` is available in the global namespace:

```js
var upcast = window.upcast;
```

The rest of the examples assume you've got the `upcast` variable already.


### upcast.type

Get the type of an object. This accepts a single argument:  
**val:** *(mixed)* The object to get the type of.

Types in Upcast are different to `typeof` in what is reported for arrays and `null`. See the example below:

```js
upcast.type([]); // 'array'
upcast.type(true); // 'boolean'
upcast.type(function () {}); // 'function'
upcast.type(null); // 'null'
upcast.type(123); // 'number'
upcast.type({}); // 'object'
upcast.type('foo'); // 'string'
upcast.type(undefined); // 'undefined'
```


### upcast.is

Check whether an object is of a given type. This accepts two arguments:  
**val:** *(mixed)* The object to check the type of.  
**type:** *(string)* The type to check for. One of `array`, `boolean`, `function`, `null`, `number`, `object`, `string` or `undefined`.

upcast.is.arr([]);
upcast.is.bool(true);
upcast.is.fn(function () {});
upcast.is.nul(null);
upcast.is.num(123);
upcast.is.obj({});
upcast.is.str('foo');
upcast.is.und(undefined);

This function follows the same rules outlined in [`upcast.type`](#upcasttype).

```js
upcast.is('foo', 'string'); // true
upcast.is(123, 'string'); // false

upcast.is([], 'array'); // true
upcast.is([], 'object'); // false

upcast.is(null, 'null'); // true
upcast.is(null, 'object'); // false
```


### upcast.is shortcuts

There are also a number of convenience methods for checking core types:

```js
upcast.is.arr([]);
upcast.is.bool(true);
upcast.is.fn(function () {});
upcast.is.nul(null);
upcast.is.num(123);
upcast.is.obj({});
upcast.is.str('foo');
upcast.is.und(undefined);
```


### upcast.to

Convert an object to a specific type. This accepts two arguments:  
**val:** *(mixed)* The object to convert.  
**type:** *(string)* The type to convert to. One of `array`, `boolean`, `function`, `null`, `number`, `object`, `string` or `undefined`.

The way types are converted aims to be sensible and allow easy switching back-and-forth of common types. For example, switching between strings and arrays is quite fluid:

```js
upcast.to('foo', 'array'); // ['f', 'o', 'o']
upcast.to(['f', 'o', 'o'], 'string'); // 'foo'
```

The examples below illustrate the way types are converted.

#### Converting to an array

Converting to an array from a boolean, function, number or object simply wraps the value in an array:

```js
upcast.to('123', 'array'); // [123]
```

Strings are handled differently, an array is returned with each character in the string as an item:

```js
upcast.to('foo', 'array'); // ['f', 'o', 'o']
```

Null and undefined are converted to an empty array:

```js
upcast.to(null, 'array'); // []
```

#### Converting to a boolean

Boolean conversion simply converts to `true` or `false` based on whether the value is truthy or not. The only case where this doesn't follow JavaScript's standard behaviour is with empty arrays which are converted to `false`:

```js
upcast.to([1, 2, 3], 'boolean') // true
upcast.to([], 'boolean') // false
```

#### Converting to a function

When converting to a function, the original value is simply wrapped in a new function. This function returns the original value:

```js
upcast.to('foo', 'function'); // function () { return 'foo'; }
```

#### Converting to null

As expected, converting to null will always return `null`:

```js
upcast.to('foo', 'null'); // null
```

#### Converting to a number

Converting to a number from a boolean, function, null or object simply calls `Number` with the original value as an argument, returning the expected value:

```js
upcast.to('true', 'number'); // 1
```

Arrays and strings are handled differently, an array is joined to create a string, then evaluated with `parseInt`; strings are simply evaluated with `parseInt`:

```js
upcast.to([1, 2, 3], 'number'); // 123
upcast.to('123', 'number'); // 123
upcast.to('foo', 'number'); // 0
```

Undefined is converted to `0` rather than `NaN`:

```js
upcast.to(undefined, 'number'); // 0
```

#### Converting to an object

Converting to an object simply calls `Object` with the value as a first argument. The following are equivalent:

```js
upcast.to('foo', 'object');
Object('foo');
```

#### Converting to a string

Converting to a string from a boolean, function, number or object simply returns the value added to an empty string, using JavaScript's default type conversion:

```js
upcast.to(true, 'string'); // 'true'
upcast.to(123, 'string'); // '123'
```

Arrays are handled differently, they are joined with an empty string:

```js
upcast.to(['f', 'o', 'o'], 'string'); // 'foo'
```

Null and undefined are converted to an empty string rather than `'null'` and `'undefined'`:

```js
upcast.to(null, 'string'); // ''
```

#### Converting to undefined

As expected, converting to undefined will always return `undefined`:

```js
upcast.to('foo', 'undefined'); // undefined
```


### upcast.to shortcuts

There are also a number of convenience methods for converting between core types:

```js
upcast.to.arr('foo');  // ['f', 'o', 'o']
upcast.to.bool('foo'); // true
upcast.to.fn('foo');   // function () { return 'foo'; }
upcast.to.nul('foo');  // null
upcast.to.num('foo');  // 0
upcast.to.obj('foo');  // Object('foo')
upcast.to.str('foo');  // 'foo'
upcast.to.und('foo');  // undefined
```


Development
-----------

To develop Upcast, you'll need to clone the repo and install dependencies:

```sh
$ npm install
```

No code will be accepted unless all tests are passing and there are no lint errors. Commands are outlined below:

### Lint code

Run JSHint with the correct config against the code-base:

```sh
$ npm run-script lint
```

### Run unit tests (CLI)

Run unit tests on the command line in a Node environment:

```sh
$ npm test
```


License
-------

Upcast is licensed under the [MIT][mit] license.



[component]: https://github.com/component/component
[mit]: http://opensource.org/licenses/mit-license.php
[node]: http://nodejs.org/
[travis]: https://secure.travis-ci.org/rowanmanning/upcast
[travis-status]: https://secure.travis-ci.org/rowanmanning/upcast.png?branch=master
