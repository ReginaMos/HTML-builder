const fs = require('fs');
const path = require("path");

const dirPath = path.join(__dirname, 'styles');
const filepath = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(filepath);

fs.readdir(dirPath,
        { withFileTypes: true },
        (err, files) => {
            if (err) console.log(err);
            else {
                files.forEach(file => {
                    fileName = file.name.toString();
                    if (fileName.split('.')[1] === 'css') {
                        const pathToFile = path.join(dirPath, file.name); 
                        const text = fs.createReadStream(pathToFile, 'utf-8');

                        text.on('data', (elem) => {
                            output.write(elem);
                        });
                    }
                });
            }
        }
)

