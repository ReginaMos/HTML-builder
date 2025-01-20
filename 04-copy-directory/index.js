const fs = require('fs');
const path = require("path");

function deleteFiles(dirPath) {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        else {
            files.forEach(file => {
                const filePath = path.join(dirPath, file.name);

                if (file.isDirectory()) {
                    deleteFiles(filePath);
                    
                    fs.rmdir(filePath, (err) => {
                        if (err) console.log(err);
                    });
                } else {
                    fs.unlink(filePath, (err) => {
                        if (err) console.log(err);
                    });
                }
        
            })
        }
    });
}

function copyDir(copyDirPath, dirPath) {
    fs.stat(copyDirPath, (err, stats) => {
        if (err) {
            fs.mkdir(copyDirPath, (err) => {
                if (err) console.log(err);
            });
        } else { 
            deleteFiles(copyDirPath);
        }

        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
            if (err) console.log(err);
            else {
                files.forEach(file => {
                    const filePath = path.join(dirPath, file.name);
                    if (file.isDirectory()) {
                        const dirForDirectory = path.join(copyDirPath, file.name);
                        copyDir(dirForDirectory, filePath);
                    }

                    fs.copyFile(filePath, path.join(copyDirPath, file.name), (err) => {
                        if (err) console.log(err);
                    })
                });
            }
        });
    });
}

copyDir(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));