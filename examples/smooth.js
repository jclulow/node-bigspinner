#!/usr/bin/env node

var bigspinner = require('../index.js');

var S = bigspinner.createSpinner({
        delay: 40,
        height: process.stdout.rows - 1,
        width: process.stdout.columns - 1,
        positions: 40
});

setTimeout(function () {
        S.destroy();
}, 45000);

process.on('SIGINT', function () {
        S.destroy();
        process.exit(1);
});
