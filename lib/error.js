'use strict';

/* jshint unused:false */

/**
 * Generates req.validateError
 * @param  {String}  message             - Error message.
 * @param  {String}  options.property    - Property name that is being validated.
 * @param  {String}  options.value       - Field value.
 * @param  {String}  options.modelValue  - Model value.
 * @return {Object}
*/
function ErrorGenerator(message, options) {
  this.name = 'RequestValidationError';
  this.message = message;
  this.status = 400;

  if (options.property) {
    this.property = options.property;
  }

  if (options.value) {
    this.value = options.value;
  }

  if (options.modelValue) {
    this.modelValue = options.modelValue;
  }
}

ErrorGenerator.prototype = Error.prototype;

exports.Generator = ErrorGenerator;
