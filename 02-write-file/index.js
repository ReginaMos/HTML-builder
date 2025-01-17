const { stdout, stdin } = process;
const fs = require('fs');
const path = require("path");

const filepath = path.join(__dirname, '02text.txt');
const output = fs.createWriteStream(filepath);

stdout.write('Please, write text for file, if you want to end - write "exit + enter" or use "ctrl+c"\n');
stdin.on("data", (data) => {
    let input = data.toString();
    if (input.trim() === 'exit') {
        process.exit();
    }
    
    output.write(input);
});

process.on('SIGINT', () => {
    process.exit();
});

process.on("exit", () => {
    stdout.write('Thank you!');;
});