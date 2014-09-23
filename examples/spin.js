#!/usr/bin/env node

var bigspinner = require('../index.js');

var S = bigspinner.createSpinner({
        delay: 100,
        height: 18,
        width: 48
});

setTimeout(function () {
        S.destroy();
}, 2000);

process.on('SIGINT', function () {
        S.destroy();
        process.exit(1);
});
