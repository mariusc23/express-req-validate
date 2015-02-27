'use strict';

/**
 * Determine whether value passes required requirement. True if defined or optional.
 * @param             value     - Value of field.
 * @param  {Boolean}  required  - Model required value. Boolean or Error object for custom error message.
 * @return {Boolean}
 * @private
*/
function validateRequired(value, required) {
  return typeof value !== 'undefined' || !required;
}

/**
 * Determine whether value is of correct type. Attempts to parseInt strings if type === Number.
 * @param                 value  - Value of field.
 * @param  {Constructor}  type   - Model type value.
 * @return {Boolean}
 * @private
*/
function validateType(value, type) {
  return typeof value === 'undefined' || value.constructor === type;
}

/**
 * Determines whether value or value.length is greater than or equal to model.min.
 * @param  {Number|String|Array}  value  - Value of field.
 * @param  {Number}               min    - Model min value.
 * @return {Boolean}
 * @private
*/
function validateMin(value, min) {
  if (!Array.isArray(value) && !isNaN(parseInt(value, 10))) {
    value = parseInt(value);
  }
  else if (typeof value === 'string') {
    value = value.length;
  }
  else if (Array.isArray(value)) {
    value = value.length;
  }
  return value >= min;
}

/**
 * Determines whether value or value.length is less than or equal to model.max.
 * @param  {Number|String|Array}  value  - Value of field.
 * @param  {Number}               max    - Model max value.
 * @return {Boolean}
 * @private
*/
function validateMax(value, max) {
  if (!Array.isArray(value) && !isNaN(parseInt(value, 10))) {
    value = parseInt(value);
  }
  else if (typeof value === 'string') {
    value = value.length;
  }
  else if (Array.isArray(value)) {
    value = value.length;
  }
  return value <= max;
}

/**
 * Determines whether each value passes model-provided validator.
 * @param  {Object|Array}  value      - Object/Array to iterate over.
 * @param  {Function}      validator  - Model each value.
 * @return {Boolean}
 * @private
*/
function validateEach(value, validator) {
  var result,
      key;

  for (key in value) {
    if (value.hasOwnProperty(key)) {
      result = validator.call(null, value[key]);
      if (result) {
        break;
      }
    }
  }

  if (result.constructor === Error) {
    result.key = key;
  }

  return result;
}

/**
 * Determines whether value passes model-provided validator.
 * @param              value  - Value of field.
 * @param  {Function}  max    - Model validate value.
 * @return {Boolean|Error}
 * @private
*/
function validateValidator(value, validator) {
  return validator.call(null, value);
}

exports.required = validateRequired;
exports.type = validateType;
exports.min = validateMin;
exports.max = validateMax;
exports.each = validateEach;
exports.validator = validateValidator;
