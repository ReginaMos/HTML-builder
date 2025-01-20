const fs = require('fs');
const path = require("path");

const dirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

fs.stat(copyDirPath, (err, stats) => {
    if (err) {
        fs.mkdir(copyDirPath, (err) => {
            if (err) console.log(err);
        });
    }

    fs.readdir(dirPath,
        { withFileTypes: true },
        (err, files) => {
            if (err) console.log(err);
            else {
                files.forEach(file => {
                    const filePath = path.join(dirPath, file.name);
                    fs.copyFile(filePath, path.join(copyDirPath, file.name), (err) => {
                        if (err) console.log(err);
                    })
                });
            }
      });
});

fs.readdir(copyDirPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
        files.forEach(file => {
            const filePath = path.join(dirPath, file.name);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    const deleteFilePath = path.join(copyDirPath, file.name);
                    fs.unlink(deleteFilePath, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
        });
    }
  });




