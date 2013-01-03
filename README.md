
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
**type:** *(string)* The type to check for.

This function follows the same rules outlined in [`upcast.type`](#upcasttype).

```js
upcast.is('foo', 'string'); // true
upcast.is(123, 'string'); // false

upcast.is([], 'array'); // true
upcast.is([], 'object'); // false

upcast.is(null, 'null'); // true
upcast.is(null, 'object'); // false
```

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
