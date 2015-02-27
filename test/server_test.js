'use strict';

var async = require('async');
var request = require('superagent');
var u = 'http://localhost:' + (process.env.PORT || 8000);
var v = require('../lib/validate');

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

exports.server = {
  setUp: function(done) {
    done();
  },

  required: function(test) {
    test.expect(3);

    async.parallel([
      function(next) {
        request.get(u + '/required', function(res) {
          test.equal(res.body.status, 400, 'Fails when required parameter missing.');
          next();
        });
      },
      function(next) {
        request.get(u + '/required?a', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when required parameter is present.');
          next();
        });
      },
      function(next) {
        request.get(u + '/required?a=0', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when required parameter has a value.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  typeNumber: function(test) {
    test.expect(3);

    async.parallel([
      function(next) {
        request.get(u + '/type/number?a=b', function(res) {
          test.equal(res.body.status, 400, 'Fails when Number is String, even if parameter is optional.');
          next();
        });
      },
      function(next) {
        request.get(u + '/type/number?a=1', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when Number is of correct type.');
          next();
        });
      },
      function(next) {
        request.get(u + '/type/number', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when Number is optional.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  typeString: function(test) {
    test.expect(3);

    async.parallel([
      function(next) {
        request.get(u + '/type/string?a=1', function(res) {
          test.equal(res.body.status, 400, 'Fails when String is Number, even if parameter is optional.');
          next();
        });
      },
      function(next) {
        request.get(u + '/type/string?a=b', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when String is of correct type.');
          next();
        });
      },
      function(next) {
        request.get(u + '/type/string', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when String is optional.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  minNumber: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/min/number?a=11', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is greater than min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/number?a=10', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is equal to min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/number?a=9', function(res) {
          test.equal(res.body.status, 400, 'Fails when number is less than min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/number', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is optional and omitted.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  maxNumber: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/max/number?a=11', function(res) {
          test.equal(res.body.status, 400, 'Fails when number is greater than max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/number?a=10', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is equal to max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/number?a=9', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is less than max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/number', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when number is optional and omitted.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  minString: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/min/string?a=b2345678901', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is greater than min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/string?a=b234567890', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is equal to min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/string?a=b23456789', function(res) {
          test.equal(res.body.status, 400, 'Fails when string.length is less than min.');
          next();
        });
      },
      function(next) {
        request.get(u + '/min/string', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is optional and omitted.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  maxString: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/max/string?a=b2345678901', function(res) {
          test.equal(res.body.status, 400, 'Fails when string.length is greater than max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/string?a=b234567890', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is equal to max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/string?a=b23456789', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is less than max.');
          next();
        });
      },
      function(next) {
        request.get(u + '/max/string', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when string.length is optional and omitted.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  each: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/each/valid?a[0]=b&a[1]=c', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when no error on all items.');
          next();
        });
      },
      function(next) {
        request.get(u + '/each/error?a[0]=b&a[1]=c', function(res) {
          test.equal(res.body.status, 400, 'Fails when there\'s an error in each.');
          next();
        });
      },
      function(next) {
        request.get(u + '/each/custom/validator?a[0]=b&a[1]=c', function(res) {
          test.equal(res.body.message, '50 Shades of Fail', 'Fails with custom validator message.');
          next();
        });
      },
      function(next) {
        request.get(u + '/each/custom/model?a[0]=b&a[1]=c', function(res) {
          test.equal(res.body.message, '50 Shades of Fail', 'Fails with custom model message.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

  validator: function(test) {
    test.expect(4);

    async.parallel([
      function(next) {
        request.get(u + '/validator/valid?a=0', function(res) {
          test.notEqual(res.body.status, 400, 'Passes when no error by validator.');
          next();
        });
      },
      function(next) {
        request.get(u + '/validator/error?a=0', function(res) {
          test.equal(res.body.status, 400, 'Fails when there\'s an error by validator.');
          next();
        });
      },
      function(next) {
        request.get(u + '/validator/custom/validator?a=0', function(res) {
          test.equal(res.body.message, '50 Shades of Fail', 'Fails with custom validator message.');
          next();
        });
      },
      function(next) {
        request.get(u + '/validator/custom/model?a=0', function(res) {
          test.equal(res.body.message, '50 Shades of Fail', 'Fails with custom model message.');
          next();
        });
      }
    ], function(err) {
      test.done();
    });
  },

};
