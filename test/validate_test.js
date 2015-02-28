'use strict';

var v = require('../lib/validators');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.parser = {
  setUp: function(done) {
    done();
  },

  required: function(test) {
    test.equal(v.required(undefined, true), false, 'Fails for undefined.');
    test.equal(v.required(null, true), true, 'Passes for null.');
    test.equal(v.required(0, true), true, 'Passes for 0.');
    test.equal(v.required(-1, true), true, 'Passes for negative number.');
    test.equal(v.required('', true), true, 'Passes for empty string.');
    test.equal(v.required(undefined, false), true, 'Passes for optional parameter.');

    test.done();
  },

  omitted: function(test) {
    test.equal(v.omitted(undefined, true), true, 'Passes undefined.');
    test.equal(v.omitted('', true), false, 'Fails for empty string.');
    test.equal(v.omitted(0, true), false, 'Fails for 0.');
    test.equal(v.omitted(-1, true), false, 'Fails for negative number.');
    test.equal(v.omitted(null, true), false, 'Fails for null.');
    test.equal(v.omitted(false, true), false, 'Fails for false.');
    test.equal(v.omitted(true, false), true, 'Passes for non-omitted.');
    test.equal(v.omitted(true, function(value) {
      return value;
    }), true, 'Passes custom function.');
    test.equal(v.omitted(true, function(value) {
      return new Error('Custom Message');
    }).message, 'Custom Message', 'Shows custom message.');

    test.done();
  },

  type: function(test) {
    test.equal(v.type(0, Number), true, 'Passes Number for 0.');
    test.equal(v.type('0', Number), false, 'Fails Number for "0".');
    test.equal(v.type('0', String), true, 'Passes String for "0".');
    test.equal(v.type([], Array), true, 'Passes Array for [].');
    test.equal(v.type({}, Object), true, 'Passes Object for {}.');
    test.equal(v.type(function() {}, Function), true, 'Passes Function for function() {}.');
    test.done();
  },

  min: function(test) {
    test.equal(v.min(10, 10), true, 'Passes min for same value.');
    test.equal(v.min(11, 10), true, 'Passes min for bigger value.');
    test.equal(v.min(9, 10), false, 'Fails min for smaller value.');
    test.equal(v.min('abc', 3), true, 'Passes min for same string length.');
    test.equal(v.min('abcd', 3), true, 'Passes min for bigger string length.');
    test.equal(v.min('ab', 3), false, 'Fails min for smaller string length.');
    test.equal(v.min([1, 2, 3], 3), true, 'Passes min for same array length.');
    test.equal(v.min([1, 2, 3, 4], 3), true, 'Passes min for bigger array length.');
    test.equal(v.min([1, 2], 3), false, 'Fails min for smaller array length.');
    test.done();
  },

  max: function(test) {
    test.equal(v.max(10, 10), true, 'Passes max for same value.');
    test.equal(v.max(9, 10), true, 'Passes max for smaller value.');
    test.equal(v.max(11, 10), false, 'Fails max for bigger value.');
    test.equal(v.max('abc', 3), true, 'Passes max for same string length.');
    test.equal(v.max('ab', 3), true, 'Passes max for smaller string length.');
    test.equal(v.max('abcd', 3), false, 'Fails max for bigger string length.');
    test.equal(v.max([1, 2, 3], 3), true, 'Passes max for same array length.');
    test.equal(v.max([1, 2], 3), true, 'Passes max for smaller array length.');
    test.equal(v.max([1, 2, 3, 4], 3), false, 'Fails max for smaller array length.');
    test.done();
  },

  each: function(test) {
    test.equal(v.each([false, true, true], function(value) {
      return value;
    }), '1', 'Fails on first truthy each.');

    test.equal(v.each([false], function(value) {
      return new Error('Custom Message');
    }).message, 'Custom Message', 'Shows custom message.');

    test.done();
  },

  validator: function(test) {
    test.equal(v.validator('I work!', function(value) {
      return value === 'I work!';
    }), true, 'Passes custom validator');

    test.done();
  }

};
