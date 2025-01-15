const fs = require('fs');
const path = require("path");

const pathToFile = path.join(__dirname, 'text.txt');
const text = fs.createReadStream(pathToFile, 'utf-8');

text.on('data', (elem) => {
    console.log(elem);
});