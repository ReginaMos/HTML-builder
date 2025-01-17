const fs = require('fs');
const path = require("path");

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, 
    { withFileTypes: true },
    (err, files) => {
        if (err) console.log(err);
        else {
            files.forEach(file => {
                if(file.isFile()) {
                    const filePath = path.join(dirPath, file.name);
                    fs.stat(filePath, (err, data) => {
                        if (err) console.log(err);
                        else console.log(`${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${data.size}`);
                    })
                }
            })
        }
  })