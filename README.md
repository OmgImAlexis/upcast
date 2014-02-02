
Upcast
======

Upcast is a low-level JavaScript type checking and casting library. Upcast simplifies type-checking and converts between types in a more sensible and predictable way than using plain ol' JavaScript.

**Current Version:** *1.0.4*  
**Automated Build Status:** [![Build Status][travis-status]][travis]  
**Node Support:** *0.6, 0.8, 0.10*  
**Browser Support:** *Android Browser 2.2–4.2, Firefox 3.6, Firefox 4–19, Google Chrome 14–25, Internet Explorer 6–10, Mobile Safari iOS 3–6, Opera 12.10, Safari 5–6*


Getting Started
---------------

You can use Upcast on the server side with [Node.js][node] and npm:

```sh
$ npm install upcast
```

On the client side, you can either install Upcast through [Bower][bower]/[Component][component]:

```sh
$ bower install upcast
$ component install rowanmanning/upcast
```

or by simply including `upcast.js` in your page:

```html
<script src="path/to/lib/upcast.js"></script>
```


Usage
-----

In Node.js or using Component, you can include Upcast in your script by using require:

```js
var upcast = require('upcast');
```

Upcast also works with AMD-style module loaders, just specify it as a dependency.

If you're just including with a `<script>`, `upcast` is available as a global variable.

Upcast exposes three simple functions:

- **[type](#upcasttype)**: get the type of an object
- **[is](#upcastis)**: check whether an object is of a given type
- **[to](#upcastto)**: convert an object to a specific type


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

This function follows the same rules outlined in [`upcast.type`](#upcasttype) and allows you to use [type aliases](#type-aliases).

```js
upcast.is('foo', 'string'); // true
upcast.is(123, 'string'); // false

upcast.is([], 'array'); // true
upcast.is([], 'object'); // false

upcast.is(null, 'null'); // true
upcast.is(null, 'object'); // false
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

You can use [type aliases](#type-aliases) with this function. The examples below illustrate the way types are converted.

#### Converting to an array

Converting to an array from a boolean, function, number or object simply wraps the value in an array:

```js
upcast.to(123, 'array'); // [123]
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


### Type aliases

The [`is`](#upcastis) and [`to`](#upcastto) functions allow you to use aliases to certain core types. The following are equivalent:

```js
upcast.is([], 'array');
upcast.is([], 'arr');
upcast.is([], 'a');
```

The aliases available by default are:

* **array:** `arr`, `a`
* **boolean:** `bool`, `b`
* **function:** `fn`, `f`
* **number:** `num`, `n`
* **object:** `obj`, `o`
* **string:** `str`, `s`


Development
-----------

To develop Upcast, you'll need to clone the repo and install dependencies with `make deps`. If you're on Windows, you'll also need to install [Make for Windows][make].

Once you're set up, you can run the following commands:

```sh
$ make deps         # Install dependencies
$ make lint         # Run JSHint with the correct config
$ make test         # Run unit tests in Node
$ make test-server  # Run a server for browser unit testing (visit localhost:3000)
```

When no build target is specified, make will run `deps lint test`. This means you can use the following command for brevity:

```sh
$ make
```

Code with lint errors or no/failing tests will not be accepted, please use the build tools outlined above.


License
-------

Upcast is licensed under the [MIT][mit] license.



[bower]: http://bower.io/
[component]: https://github.com/component/component
[make]: http://gnuwin32.sourceforge.net/packages/make.htm
[mit]: http://opensource.org/licenses/mit-license.php
[node]: http://nodejs.org/
[travis]: https://travis-ci.org/rowanmanning/upcast
[travis-status]: https://travis-ci.org/rowanmanning/upcast.png?branch=master
