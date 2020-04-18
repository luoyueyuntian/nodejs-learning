const fs = require('fs');
const apis = JSON.parse(fs.readFileSync('./moduleList.json'));

//读取api json数据
const parseOriginApiData = (apiName) => {
    let path = './module/' + apiName + '.json';
    return JSON.parse(fs.readFileSync(path));
};

//将json格式的api数据转成md字符串
const transToMd = (apiData) => {
    const num = apiData.length;
    let mdStr = '<ul>\r\n';
    for (let i = 0; i < num; i++) {
        if (apiData[i].stability !== 'stability_0') {
            mdStr = mdStr + '<li>' + apiData[i].topic;
            if (apiData[i].iApis !== undefined) {
                const iApiData = apiData[i].iApis;
                mdStr += '\r\n' + transToMd(iApiData);
            }
            mdStr += '</li>\r\n';
        }
    }
    mdStr += '</ul>\r\n';
    return mdStr;
}

//依次读取数据并写到相应的markdown文件中
try {
    fs.mkdirSync('./moduleMarkDown');
} finally {
    let i;
    const ii = apis.length;
    for (i = 0; i < ii; i++) {
        let apiData = parseOriginApiData(apis[i]);
        let mdPath = './moduleMarkDown/' + apis[i] + '.md';
        fs.writeFileSync(mdPath, transToMd(apiData));
    }
}