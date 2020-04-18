var fs = require('fs');
var webPage = require('webpage');
var baseUrl = "http://nodejs.cn/api/";
var page = webPage.create();
page.open(baseUrl, function(status) {
    if (status === "success") {
        var pageUrl = page.evaluate(function() {
            return document.location.href;
        });
        var path = './moduleUrlList.json';
        var content = page.evaluate(function() {
            var pageArr = [];
            var Arr = document.querySelectorAll("div#apicontent ul li a");
            var len = Arr.length;
            var i;
            for (i = 0; i < len; i++) {
                var url = Arr[i].getAttribute("href");
                if (url.indexOf('/api/') === 0) {
                    url = url.slice(5);
                }
                pageArr.push(url);
            }
            return JSON.stringify(pageArr);
        });
        fs.write(path, content, 'w');
    } else {
        console.log(pageUrl);
    }
    phantom.exit(0);
});