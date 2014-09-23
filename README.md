# node-bigspinner

Because if you are going to hide progress behind an opaque spinner, it
may as well be a _Big Spinner_.

## Usage

```javascript
var mod_bigspinner = require('bigspinner');

/*
 * Create the spinner object, which begins spinning immediately.  The
 * default options are shown below:
 */
var SPINNER = mod_bigspinner.createSpinner({
    delay: 250,
    stream: process.stderr,
    height: 8,
    width: 8,
    hideCursor: true,
    fontChar: '#'
});

/*
 * And, later, when you are done hand-waving:
 */

SPINNER.destroy();
```

## License

MIT.
