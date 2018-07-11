const express = require('express');
const opener = require('opener');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist/cashflow-visualization')));
let listener = app.listen(60123, '127.0.0.1', () => {
    const _addr = `http://localhost:${listener.address().port}/`;
    console.log(`App ready at ${_addr} , please check your firewalls before your access.`);
    opener(_addr);
});
