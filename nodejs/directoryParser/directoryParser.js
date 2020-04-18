const fs = require('fs');
const path = require('path');

//将文件目录解析成树形数据
let traverseFolder = (parentPath, treeDirectory) => {
    let directory = fs.readdirSync(parentPath);
    advanceFolder(directory, parentPath);
    let i, ii = directory.length;
    for (i = 0; i < ii; i++) {
        let iDirectory = {
            name: directory[i]
        };
        let iPath = parentPath + path.sep + iDirectory.name;
        let iFloderStatus = fs.statSync(iPath);
        if (iFloderStatus.isDirectory()) {
            iDirectory.type = 'folder';
            iDirectory.folder = traverseFolder(iPath, []);
        } else {
            iDirectory.type = 'file';
        }
        treeDirectory.push(iDirectory);
    }
    return treeDirectory;
};
let advanceFolder = (folders, basePath) => {
    folders.sort((pre, next) => {
        let preDirectory = isDirectory(pre, basePath);
        let nextDirectory = isDirectory(next, basePath)
        if (preDirectory === nextDirectory) {
            return pre.localeCompare(next);
        } else {
            return preDirectory ? -1 : 1;
        }
    })
}
let isDirectory = (pathName, basePath) => {
    let status = fs.statSync(basePath + path.sep + pathName);
    return status.isDirectory();
}

//将树形数据的目录结构生成可视化的列表
var TAB = '    ';
var FILE_PREFIX = '├── ';
var FOLDER_PREIX = '│   ';
var LAST_FILE_PREFIX = '└── ';
var FOLDER_SRRFFIX = '/';

function parseAndInjectPrefix(returnValue, directory, prefix) {
    var i, ii = directory.length;
    for (i = 0; i < ii; i++) {
        var iPrefix = [];
        //先把最前面的补上
        if (directory[i].prefix === undefined) {
            directory[i].prefix = [];
        }
        if (prefix != undefined && Array.isArray(prefix)) {
            directory[i].prefix = directory[i].prefix.concat(prefix);
            iPrefix = iPrefix.concat(prefix);
        }

        //处理中间的
        if (i + 1 === ii) { //如果是最后列
            directory[i].prefix.push(LAST_FILE_PREFIX);
            iPrefix.push(TAB);
        } else {
            directory[i].prefix.push(FILE_PREFIX);
            iPrefix.push(FOLDER_PREIX);
        }
        //处理末尾
        directory[i].prefix.push(directory[i].name);
        if (directory[i].type === 'folder') {
            directory[i].prefix.push(FOLDER_SRRFFIX);
        }
        returnValue.push(directory[i].prefix);
        //处理子级，如果存在
        if (directory[i].type === 'folder' && directory[i].folder && Array.isArray(directory[i].folder)) {
            parseAndInjectPrefix(returnValue, directory[i].folder, iPrefix);
        }
    }
    return returnValue;
}

function parseFolderList(folderTreeList) {
    var i, ii = folderTreeList.length;
    var codeStr = '<pre><code>';
    for (i = 0; i < ii; i++) {
        folderTreeList[i].shift();
        codeStr += folderTreeList[i].join('');
        codeStr += '\r\n';
    }
    codeStr += '</code></pre>';
    return codeStr;
}

generateTreeDirectory = (data) => {
    let result = parseFolderList(parseAndInjectPrefix([], data));
    return result;
}

let parentPath = process.cwd(); //脚本运行时的目录
console.log(parentPath);
console.log(path.parse(parentPath));
let outputFile = parentPath + path.sep + 'folderTree.md'; //结果输出的文件路径
let treeDirectory = generateTreeDirectory([{
    name: path.basename(parentPath),
    type: 'folder',
    folder: traverseFolder(parentPath, [])
}]);
fs.writeFileSync(outputFile, treeDirectory);
console.log(__dirname);