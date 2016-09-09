/* global process */
/**
 * Main application file
 */

'use strict';


var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./res/config.js'),
    http = require('http');

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error : ' + err);
    process.exit(-1);
});

// Setup server
var app = express(),
    server = http.createServer(app);

require('./express')(app);
require('./routes')(app);

// Start server
function startServer() {
    server.listen(config.port, config.ip, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
