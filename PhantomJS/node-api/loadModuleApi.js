var fs = require('fs');
var webPage = require('webpage');
var index = 0;
var baseUrl = "http://nodejs.cn/api/";
var allPages = JSON.parse(fs.read('./moduleUrlList.json'));

function loadNextPage() {
    newParser(baseUrl + allPages[index]);
}

//捕获页面生成PDF文件
function newParser(pageUrl) {
    var page = webPage.create();
    console.log(pageUrl);
    page.open(pageUrl, function(status) {
        if (status === "success") {
            var pageUrl = page.evaluate(function() {
                return document.location.href;
            });
            //去掉页面名称的锚点
            function removeSuffix(pageName) {
                var endPos = pageName.indexOf('.');
                if (endPos === -1) {
                    return pageName;
                }
                return pageName.substring(0, endPos);
            }

            function parsePageName(pageUrl) {
                if (pageUrl) {
                    //提取出“/”与“.html”直接的字符串
                    var pathArr = pageUrl.split('/');
                    //去掉多余的锚点
                    if (pathArr[pathArr.length - 1] === '') {
                        return removeSuffix(pathArr[pathArr.length - 2]);
                    } else {
                        return removeSuffix(pathArr[pathArr.length - 1]);
                    }
                }
            }
            var pageName = parsePageName(pageUrl);
            console.log(pageName);
            var path = './module/' + pageName + '.json';
            var content = page.evaluate(function() {
                var containerElement = document.getElementById('toc').getElementsByTagName('ul')[0].firstElementChild;

                function parseApiTree(apiNode, apiElement) {
                    if (!Array.isArray(apiNode)) {
                        console.log('parseApiTree first parameter must be array');
                    }
                    if (apiElement === null) {
                        return apiNode;
                    }
                    //解析当前元素
                    var topic = apiElement.firstElementChild.firstElementChild.innerText;
                    var stability = apiElement.firstElementChild.className;
                    var apiObj = { topic: topic, stability: stability };
                    apiNode.push(apiObj);
                    //解析子集
                    var iApiElementsContainer = apiElement.firstElementChild.nextElementSibling
                    if (iApiElementsContainer !== null && iApiElementsContainer.nodeName === 'UL') {
                        apiObj.iApis = [];
                        var iApiElement = iApiElementsContainer.firstElementChild;
                        parseApiTree(apiObj.iApis, iApiElement);
                    }
                    //解析下一个元素
                    var nextApiElement = apiElement.nextElementSibling;
                    if (nextApiElement !== null && nextApiElement.nodeName === 'LI') {
                        return parseApiTree(apiNode, nextApiElement);
                    }
                    return apiNode;
                }
                return JSON.stringify(parseApiTree([], containerElement));
            });
            console.log('parse success');
            fs.write(path, content, 'w');
            //如果最后一个页面已经捕获完成，则退出
            if (index === allPages.length) {
                phantom.exit(0);
            }
            if (index < allPages.length) {
                loadNextPage();
            }
        } else {
            console.log(pageUrl);
        }
    });
    index++;
}

// 开始捕获页面
loadNextPage();