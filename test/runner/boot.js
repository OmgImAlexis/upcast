/*jshint maxstatements: 100 */
(function () {
    'use strict';
    
    // Dependencies
    var browserify = require('browserify');
    var express = require('express');
    var glob = require('glob');
    var path = require('path');

    // Initialise application
    var app = express();

    // Basic config
    var port = 3893;
    var dir = __dirname;
    var root = path.resolve(__dirname + '/../../');
    var testPattern = root + '/test/unit/**.js';


    // Routes

    // Mocha files
    app.get('/', function (req, res) {
        res.sendfile(dir + '/index.html');
    });
    app.get(/^\/mocha\.(js|css)$/, function (req, res) {
        res.sendfile(root + '/node_modules/mocha/mocha.' + req.params[0]);
    });

    // IE lte8 test files
    app.get('/legacy', function (req, res) {
        res.sendfile(dir + '/legacy.html');
    });
    app.get('/index.js', function (req, res) {
        res.sendfile(root + '/index.js');
    });
    app.get('/json3.min.js', function (req, res) {
        res.sendfile(dir + '/json3.min.js');
    });

    // JavaScript bundler
    app.get('/test.js', function (req, res) {
        var bundler = browserify();
        glob(testPattern, function (err, files) {
            if (err) { throw err; }
            files.forEach(function (file) {
                bundler.addEntry(file);
            });
            res.type('js');
            res.send(bundler.bundle());
        });
    });


    // Run application
    app.listen(port);
    console.log('\nTest server running!');
    console.log('View at http://localhost:%d/', port);

} ());