(function () {
    'use strict';

    // Dependencies
    var browserify = require('browserify');
    var express = require('express');
    var path = require('path');

    // Initialise application
    var app = express();

    // Basic config
    var port = 3000;
    var dir = __dirname;
    var root = path.resolve(__dirname + '/../../');


    // Routes

    // Mocha files
    app.get('/', function (req, res) {
        res.sendfile(dir + '/index.html');
    });
    app.get(/^\/mocha\.(js|css)$/, function (req, res) {
        res.sendfile(root + '/node_modules/mocha/mocha.' + req.params[0]);
    });

    // JavaScript bundler
    app.get('/test.js', function (req, res) {
        var bundler = browserify();
        bundler.add(root + '/test/unit/upcast.js');
        res.type('js');
        bundler.bundle(function (err, src) {
            res.send(src);
        });
    });


    // Run application
    app.listen(port);
    console.log('\nTest server running!');
    console.log('View at http://localhost:%d/', port);

} ());