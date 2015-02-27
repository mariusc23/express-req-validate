express-req-validate
====================

> Mongoose-inspired req.query and req.body validator for express/connect servers.

[![npm](https://img.shields.io/npm/v/express-req-validate.svg)](https://www.npmjs.com/package/express-req-validate)
[![build status](https://travis-ci.org/mariusc23/express-req-validate.svg)](https://travis-ci.org/mariusc23/express-req-validate)


## Installation

    npm install --save express-req-validate

Load the validator middleware after the body parser.

```js
var bodyParser = require('body-parser');
var queryParser = require('express-query-int');
var reqValidate = require('express-req-validate');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser());
app.use(reqValidate());
```


## Validating `req.body`
By default the module will only attempt to validate `req.query`. To validate `req.body`:

```js
req.validate(req.body, {
  // your model here...
});
```

To validate both `req.query` and `req.body`:

```js
req.validate([req.query, req.body], {
  // your model here...
});
```


## Model

### model.type
Checks if request parameter is created by the specified constructor.

```js
req.validate({
  a: {
    type: String
  }
});
// ?a=b     => true
// ?a[0]=b  => false
```

**Note:** By default, numbers in query parameters will be strings. To use `{ type: Number }` you will need a parser such as [express-query-int](https://www.npmjs.com/package/express-query-int).


### model.required
Checks if request parameter is present.

```js
req.validate({
  a: {
    required: true
  }
});
// ?a    => true
// ?a=0  => true
// ?a=b  => true
```

### model.min
If parameter is a Number, checks that it is greater than or equal to `min`.

```js
req.validate({
  a: {
    type: Number,
    min: 10
  }
});
// ?a=10  => true
// ?a=11  => true
// ?a=9   => false
```

If parameter is a String, checks that the string is longer or equal length to `min`.

```js
req.validate({
  a: {
    type: String,
    min: 3
  }
});
// ?a=abc   => true
// ?a=abcd  => true
// ?a=ab    => false
```

If parameter is an Array, checks that the array.length is greater than or equal to `min`.

```js
req.validate({
  a: {
    type: Array,
    min: 2
  }
});
// ?a[0]=b&a[1]=c         => true
// ?a[0]=b&a[1]=c&a[2]=d  => true
// ?a[0]=b                => false
```

If no type is specified, validator will do its best to guess. To ensure that you get the expected result, it is recommended to provide a type.


### model.max
If parameter is a Number, checks that it is less than or equal to `max`.

```js
req.validate({
  a: {
    type: Number,
    max: 10
  }
});
// ?a=10  => true
// ?a=9   => true
// ?a=11  => false
```

If parameter is a String, checks that the string is shorter or equal length to `max`.

```js
req.validate({
  a: {
    type: String,
    max: 3
  }
});
// ?a=abc   => true
// ?a=ab    => true
// ?a=abcd  => false
```

If parameter is an Array, checks that the array.length is less than or equal to `max`.

```js
req.validate({
  a: {
    type: Array,
    max: 2
  }
});
// ?a[0]=b&a[1]=c         => true
// ?a[0]=b                => true
// ?a[0]=b&a[1]=c&a[2]=d  => false
```

### model.each
Checks that each value of the Object/Array meets condition. Return:

- `true`             - passes validation
- `false`            - fails validation
- `new Error('msg')` - fails validation with custom message

```js
req.validate({
  a: {
    each: function(value) {
      return value > 3;
    }
  }
});
// ?a[0]=b&a[4]=c  => true
// ?a[0]=b&a[2]=c  => false
```

If no type is specified, validator will do its best to guess. To ensure that you get the expected result, it is recommended to provide a type.


### model.validator
Checks that value passes custom function validation. Return:

- `true`             - passes validation
- `false`            - fails validation
- `new Error('msg')` - fails validation with custom message

```js
req.validate({
  a: {
    validate: function(value) {
      return new Error('You shall not pass!');
    }
  }
});
// ?a  => false
```

**Note:** You could use a custom validation library like [Validator.js](https://github.com/chriso/validator.js) for `each` and `validate`.

```js
var validator = require('validator');
req.validate({
  a: {
    validate: validator.isCreditCard
  }
});
// ?a  => false
```

## Errors
The validator will not throw an error, instead it will set `req.validateError` to an error object. If there are no validation errors, `req.validateError` will be `null`.

```js
req.validate(...)

if (req.validateError) {
  return yourOwnErrorHandler(res, req.validateError);
}
```

### Custom Error Format
You can set a custom error format when initializing the module. See [lib/error.js](lib/error.js) for the default constructor.

```js
function ErrorGenerator(message, options) {
  this.message = message;
}

ErrorGenerator.prototype = Error.prototype;

app.use(reqValidate({
  ErrorGenerator: ErrorGenerator
}))
```

## License
Copyright (c) 2015 Marius Craciunoiu. Licensed under the MIT license.
