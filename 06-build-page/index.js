const fs = require('fs');
const path = require("path");

const dirPath = path.join(__dirname, 'project-dist');

const assetsCopyDirPath = path.join(dirPath, 'assets');
const assetsDirPath = path.join(__dirname, 'assets');

fs.mkdir(dirPath, (err) => {
    if (err) console.log(err);
});

function copyDir(copyDirPath, dirPath) {
    fs.stat(copyDirPath, (err, stats) => {
        if (!err) {
            fs.rm(copyDirPath, {recursive: true, force: true}, (err) => {
                if (err) console.log(err);
            });
        }

        fs.mkdir(copyDirPath, (err) => {
            if (err) console.log(err);
        });
    });

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
}

copyDir(assetsCopyDirPath, assetsDirPath);

const stylePath = path.join(dirPath, 'style.css');
const styleAssetsPath = path.join(__dirname, 'styles');
const output = fs.createWriteStream(stylePath);

fs.readdir(styleAssetsPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
        files.forEach(file => {
            fileName = file.name.toString();
            if (fileName.split('.')[1] === 'css') {
                const pathToFile = path.join(styleAssetsPath, file.name); 
                const text = fs.createReadStream(pathToFile, 'utf-8');

                text.on('data', (elem) => {
                    output.write(elem);
                });
            }
        });
    }
});

const indexPath = path.join(dirPath, 'index.html'); 
const textFromTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const outputIndex = fs.createWriteStream(indexPath);

textFromTemplate.on('data', (data) => {
    outputIndex.write(data);
});

async function readFileAndProcess(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) reject(err);
            else resolve(content);
        });
    });
}

async function replaceComponents(match) {
    let textFromComponent = '';
    const componentName = match.split('{{')[1].split('}}')[0] + '.html';
    const componentPath = path.join(__dirname, 'components', componentName);

    textFromComponent = await readFileAndProcess(componentPath);
    return textFromComponent;
}

async function change() {
    const contents = await readFileAndProcess(indexPath);
    const matches = contents.match(/\{\{([a-zA-Zа-яА-Я]+)\}\}/gi);
    
    let updated = contents;
    for(const match of matches) {
        const replacement = await replaceComponents(match);
        updated = updated.replace(match, replacement);
    }

    fs.writeFile(indexPath, updated, 'utf-8', err => {
        if (err) console.log(err)
    });
}

change();


