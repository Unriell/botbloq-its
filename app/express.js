/**
 * Express configuration
 */

'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

module.exports = function(app) {
    var env = app.get('env');

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        limit: '1mb'
    }));

    // Allow CORS
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    var cors = require('cors');

    app.use(cors());

    if ('production' === env) {
        app.use(morgan('dev'));
    }

    if ('development' === env) {}

    if ('development' === env || 'test' === env) {
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};