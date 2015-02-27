'use strict';

var validators = require('./validators');

/**
 * Runs a validator and throws error if any problems.
 * @param  {Function}  validator           - Validator to call.
 * @param  {Object}    options             - Options to call validator with.
 * @param  {String}    options.message     - Default error message. Uses validator error message or model error message if provided.
 * @param  {String}    options.property    - The name of the property being checked.
 * @param              options.value       - Value of the property.
 * @param              options.modelValue  - Value on the model.
 * @return {Object}    Error object, if any.
 * @private
*/
function runValidator(validator, options) {
  var result = validator.call(null, options.value, options.modelValue.value || options.modelValue);

  if (result.constructor === Error) {
    throw new options.ErrorGenerator(result.message, options);
  }
  else if (!result) {
    throw new options.ErrorGenerator(options.modelValue.message || options.message, options);
  }
}

/**
 * Determines whether object passes validator. Sets req.validateError.
 * @param  {Object}        req             - Incoming request object.
 * @param  {Function}      ErrorGenerator  - Incoming request object.
 * @param  {Array|Object}  [objects]       - Object/s to check.
 * @param  {Object}        model           - Model.
 * @return {Object|null}
*/
function validate(req, ErrorGenerator, model) {
  var objects = [req.query],
      property,
      i,
      n;

  if (arguments.length === 4) {
    objects = arguments[2];
    model = arguments[3];
  }

  if (!Array.isArray(objects)) {
    objects = [objects];
  }

  try {
    for (i = 0, n = objects.length; i < n; i++) {

      for (property in model) {
        if (model.hasOwnProperty(property)) {

          // REQUIRED
          if (typeof model[property].required !== 'undefined') {
            runValidator(validators.required, {
              message: 'Missing parameter: ' + property,
              property: property,
              value: objects[i][property],
              modelValue: model[property].required,
              ErrorGenerator: ErrorGenerator
            });
          }

          // If object has model property, validate it...
          if (typeof objects[i][property] !== 'undefined') {

            // TYPE
            if (typeof model[property].type !== 'undefined') {
              runValidator(validators.type, {
                message: 'Invalid type for parameter: ' + property + '. Expected: ' + model[property].type.name,
                property: property,
                value: objects[i][property],
                modelValue: model[property].type,
                ErrorGenerator: ErrorGenerator
              });
            }

            // MIN
            if (typeof model[property].min !== 'undefined') {
              runValidator(validators.min, {
                message: 'Invalid min for parameter: ' + property + '. Expected: ' + model[property].min,
                property: property,
                value: objects[i][property],
                modelValue: model[property].min,
                ErrorGenerator: ErrorGenerator
              });
            }

            // MAX
            if (typeof model[property].max !== 'undefined') {
              runValidator(validators.max, {
                message: 'Invalid max for parameter: ' + property + '. Expected: ' + model[property].max,
                property: property,
                value: objects[i][property],
                modelValue: model[property].max,
                ErrorGenerator: ErrorGenerator
              });
            }

            // EACH
            if (typeof model[property].each !== 'undefined') {
              runValidator(validators.each, {
                message: 'Invalid parameter: ' + property,
                property: property,
                value: objects[i][property],
                modelValue: model[property].each,
                ErrorGenerator: ErrorGenerator
              });
            }

            // VALIDATOR
            if (typeof model[property].validate !== 'undefined') {
              runValidator(validators.validator, {
                message: 'Invalid parameter: ' + property,
                property: property,
                value: objects[i][property],
                modelValue: model[property].validate,
                ErrorGenerator: ErrorGenerator
              });
            }

          }

        }
      }

    }
  }
  catch (err) {
    req.validateError = err;
  }

  return req.validateError;
}

exports.validate = validate;
