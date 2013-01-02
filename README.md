
Upcast
======

Upcast is a low-level JavaScript type checking and casting library.

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

Todo...


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
