#!/usr/bin/env node

var bigspinner = require('../index.js');

var S = bigspinner.createSpinner({
        delay: 100,
        height: process.stdout.rows - 1,
        width: process.stdout.columns - 1
});

setTimeout(function () {
        S.destroy();
}, 45000);

process.on('SIGINT', function () {
        S.destroy();
        process.exit(1);
});
