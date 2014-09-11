#!/usr/bin/env node

var bigspinner = require('../index.js');

var S = bigspinner.createSpinner({
        delay: 100
});

setTimeout(function () {
        S.destroy();
}, 2000);
