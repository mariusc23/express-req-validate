'use strict';

var express = require('express');
var morgan = require('morgan');

var bodyParser = require('body-parser');
var queryParser = require('express-query-int');
var reqValidate = require('../');

// var routes = require('./routes/index');

var app = express();

/**
 * Logs
*/
app.use(morgan('dev'));

/**
 * Parse content
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser());
app.use(reqValidate());

/**
 * Routes
*/

app.route('/required').get(function(req, res, next) {
  req.validate({
    a: {
      required: true
    }
  });
  res.json(req.validateError);
});

app.route('/omitted').get(function(req, res, next) {
  req.validate({
    a: {
      omitted: true
    }
  });
  res.json(req.validateError);
});

app.route('/type/number').get(function(req, res, next) {
  req.validate({
    a: {
      type: Number
    }
  });
  res.json(req.validateError);
});

app.route('/type/string').get(function(req, res, next) {
  req.validate({
    a: {
      type: String
    }
  });
  res.json(req.validateError);
});

app.route('/min/number').get(function(req, res, next) {
  req.validate({
    a: {
      type: Number,
      min: 10
    }
  });
  res.json(req.validateError);
});

app.route('/max/number').get(function(req, res, next) {
  req.validate({
    a: {
      type: Number,
      max: 10
    }
  });
  res.json(req.validateError);
});

app.route('/min/string').get(function(req, res, next) {
  req.validate({
    a: {
      type: String,
      min: 10
    }
  });
  res.json(req.validateError);
});

app.route('/max/string').get(function(req, res, next) {
  req.validate({
    a: {
      type: String,
      max: 10
    }
  });
  res.json(req.validateError);
});

app.route('/each/valid').get(function(req, res, next) {
  req.validate({
    a: {
      each: function(value) {
        return true;
      }
    }
  });
  res.json(req.validateError);
});


app.route('/each/error').get(function(req, res, next) {
  req.validate({
    a: {
      each: function(value) {
        return false;
      }
    }
  });
  res.json(req.validateError);
});

app.route('/each/custom/validator').get(function(req, res, next) {
  req.validate({
    a: {
      each: function(value) {
        return new Error('50 Shades of Fail');
      }
    }
  });
  res.json(req.validateError);
});

app.route('/each/custom/model').get(function(req, res, next) {
  req.validate({
    a: {
      each: {
        value: function(value) {
          return false;
        },
        message: '50 Shades of Fail'
      }
    }
  });
  res.json(req.validateError);
});

app.route('/validator/valid').get(function(req, res, next) {
  req.validate({
    a: {
      validat: function(value) {
        return true;
      }
    }
  });
  res.json(req.validateError);
});

app.route('/validator/error').get(function(req, res, next) {
  req.validate({
    a: {
      validate: function(value) {
        return false;
      }
    }
  });
  res.json(req.validateError);
});

app.route('/validator/custom/validator').get(function(req, res, next) {
  req.validate({
    a: {
      validate: function(value) {
        return new Error('50 Shades of Fail');
      }
    }
  });
  res.json(req.validateError);
});

app.route('/validator/custom/model').get(function(req, res, next) {
  req.validate({
    a: {
      validate: {
        value: function(value) {
          return false;
        },
        message: '50 Shades of Fail'
      }
    }
  });
  res.json(req.validateError);
});

/**
 * Error handlers
*/
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
