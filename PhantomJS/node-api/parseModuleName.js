const fs = require('fs');
const apiUrlList = JSON.parse(fs.readFileSync('./moduleUrlList.json'));
const len = apiUrlList.length;
const parseApiNameFromUrl = (url) => {
    let start, end;
    let apiName = '';
    end = url.lastIndexOf('.html');
    apiName = url.slice(0, end);
    start = apiName.lastIndexOf('/');
    if (start === -1) {
        return apiName;
    } else {
        return apiName.slice(start + 1);
    }
};
let apiList = [];
for (let i = 0; i < len; i++) {
    apiList.push(parseApiNameFromUrl(apiUrlList[i]));
}
fs.writeFileSync('./moduleList.json', JSON.stringify(apiList));