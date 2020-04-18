里面是从nodejs中文api文档上爬到的，通过node自动生成了markdown文档。

里面只有api目录，没有具体内容，如需查看nodejs api文档，请点击这里[http://nodejs.cn/api/](http://nodejs.cn/api/)

以上功能用到的工具：
+ nodejs
+ PhantomJS

大概思路是先用PhantomJS把nodejs所有api的地址爬下来，然后一个一个的去爬，将里面的api解析成树形结构的数据，保存成json文件，然后用nodejs去将json文件解析出来，然后写成相应的markdown文档

[具体实现代码可以看这里](../../PhantomJS/node-api)