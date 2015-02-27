'use strict';

var error = require('./lib/error');
var validate = require('./lib/validate').validate;

module.exports = function(options) {
  options = options || {};

  if (!options.ErrorGenerator) {
    options.ErrorGenerator = error.Generator;
  }

  return function(req, res, next) {
    req.validateError = null;
    req.validate = validate.bind(this, req, options.ErrorGenerator);
    next();
  };
};
