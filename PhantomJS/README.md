### 使用PhantomJS爬取[Node.js 官方 api 文档](http://nodejs.cn/api/)，并将api列表提取出来保存到本地

PhantomJS可以用来爬取网页，区别于其它爬虫工具，PhantomJS可以爬取动态页面。

PhantomJS自身集成了WebKit，可以渲染web页面，但没有图形界面显示网页，是一个无界面的webkit内核浏览器。

对于一些动态的网页，其内容是通过ajax加载数据再动态生成内容的网页，使用传统的抓包技术显然不满足要求，因为抓到的HTML是一个没有实际内容的文档，PhantomJS可以在页面加载完成后再继续等待页面的ajax请求，并分析最终完成的页面。除此之外，PhantomJS还可以模拟页面点击操作，在页面中注入一些脚本，执行一些任务，可以把页面保存成图片或PDF。

这里我使用了`PhantomJS`来抓取Node.js官方api文档中的模块列表，并依次抓取每个模块里面的api列表。[点击这里查看详情](./node-api/readme.md)