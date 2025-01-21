const fs = require('fs');
const path = require("path");

const dirPath = path.join(__dirname, 'project-dist');

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

async function replaceTemplates(indexPath, updated) {
    fs.writeFile(indexPath, updated, 'utf-8', err => {
        if (err) console.log(err)
    });
}

async function createIndexFile() {
    const indexPath = path.join(dirPath, 'index.html'); 
    const contents = await readFileAndProcess(path.join(__dirname, 'template.html'));
    const matches = contents.match(/\{\{([^}]+)\}\}/g);
    
    let updated = contents;
    for(const match of matches) {
        const replacement = await replaceComponents(match);
        updated = updated.replace(match, replacement);
    }

    await replaceTemplates(indexPath, updated);
}

async function createStyleFile() {
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
}

async function createAssetsFolder() {
    const assetsCopyDirPath = path.join(dirPath, 'assets');
    const assetsDirPath = path.join(__dirname, 'assets');
    
    await copyDir(assetsCopyDirPath, assetsDirPath);
}

async function copyDir(copyDirPath, dirPath) {
    fs.mkdir(copyDirPath, { recursive: true }, (err) => {
        if (err) console.log(err);
    });

    fs.readdir(dirPath, { withFileTypes: true }, async (err, files) => {
        if (err) console.log(err);
        else {
            files.forEach(async (file) => {  
                const filePath = path.join(dirPath, file.name);
                if (file.isDirectory()) {
                    const dirForDirectory = path.join(copyDirPath, file.name);
                    await copyDir(dirForDirectory, filePath);
                }

                fs.copyFile(filePath, path.join(copyDirPath, file.name), (err) => {
                    if (err) console.log(err);
                });
            });
        }
    });
}

async function createHTMLPage() {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) console.log(err);
    });

    await createIndexFile();
    await createStyleFile();
    await createAssetsFolder();
}

createHTMLPage();


