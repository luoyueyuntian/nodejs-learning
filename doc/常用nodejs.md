## Web 应用程序开发框架
#### express
Express 是一个保持最小规模的灵活的 Node.js Web 应用程序开发框架，为 Web 和移动应用程序提供一组强大的功能。
+ [Express —— 官方文档](http://www.expressjs.com.cn/)
+ [github地址](https://github.com/expressjs/express)

风格类似的框架还有：Connect、Express、Restify

#### koa
Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。
+ [Koa —— 官方文档](https://koa.bootcss.com/)

类似的还有Daruk、ThiksJs、Egg.js、MIdway。其中Daruk是最“中立”的Typescript框架，不大不小，刚刚好，支持KOA，支持IoC。

#### egg
Egg.js，为企业级框架和应用而生，是阿里开源的企业级 Node.js 框架
+ [egg —— 官方文档](https://eggjs.org/zh-cn/index.html)
+ [egg —— 源码](https://github.com/eggjs/egg)

#### Sails
奉行『约定优于配置』的框架，扩展性也非常好，支持 Blueprint REST API、WaterLine 这样可扩展的 ORM、前端集成、WebSocket 等
+ [Sails —— 官方文档](https://sailsjs.com/)
+ [Sails —— 源码](https://github.com/balderdashy/sails/)


#### ThinkJS
ThinkJS 是一款面向未来开发的 Node.js 框架，整合了大量的项目最佳实践，让企业级开发变得更简单、高效。从 3.0 开始，框架底层基于 Koa 2.x 实现，兼容 Koa 的所有功能。
+ [文档](https://thinkjs.org/)
+ [github地址](https://github.com/thinkjs/thinkjs)

#### Restify
restify是一个基于Nodejs的REST应用框架，支持服务器端和客户端。restify比起express更专注于REST服务，去掉了express中的template, render等功能，同时强化了REST协议使用，版本化支持，HTTP的异常处理。

restify提供了DTrace功能，为程序调式带来新的便利！
+ [restify —— 官方文档](http://restify.com/)

#### feathers
为现代化应用而设计的网络架构。它具有面向服务，实时性，简单抽象的特点。
+ [FeathersJS  —— 官方文档](https://docs.feathersjs.com/)

#### moleculer
基于 Node.js 的响应式微服务框架
+ [Moleculer  —— 官方文档](https://moleculer.services/zh/)

#### pomelo
由网易开发的基于node.js开发的高性能、分布式游戏服务器框架， 也可作为高实时web应用框架。

#### Meteor.JS
NodeJS 的全栈框架，允许用户构建实时应用程序。用于创建基于移动和基于 Web 的 javascript 应用。

#### Loopback/MEAN.js/Blitz.js
全栈整合型框架。
基于Express 的web架构、提供一套ORM解决方案、结合Express提供便捷的RESTFul接入

#### NestJS
NestJS 框架-一种渐进式的 NodeJS 框架，用于构建高效、可靠和可扩展的服务器端应用程序

### Next.js/ykfe/ssr
服务端渲染框架。next.js经过调整后不再只是服务端渲染框架，而是一个通用的基于React的框架

### Redwood
基于JAMStack理念架构的框架

### strapi
Nodejs版的Headless CMS，关注的是数据到API的标准化过程，没有传统CMS系统中的view层，是一个干干净净的数据和API管理框架



## 数据库相关
#### Cassandra
Cassandra 是一个来自 Apache 的分布式数据库，具有高度可扩展性，可用于管理大量的结构化数据。它提供了高可用性，没有单点故障。
+ [关于cassandra](https://zhuanlan.zhihu.com/p/78255146)
+ [cassandra - 源码](https://github.com/datastax/nodejs-driver)

#### Couchbase
CouchBase是一款开源的，分布式的nosql数据库，主要用于分布式缓存和数据存储领域。能够通过manage cache提供快速的亚毫米级别的k-v存储操作，并且提供快速的查询和其功能强大的能够指定SQL-like查询的查询引擎。
+ [Couchbase —— 文档](https://docs.couchbase.com/nodejs-sdk/3.0/hello-world/start-using-sdk.html)
+ [Couchbase - 源码](https://github.com/datastax/nodejs-driver)
+ [Couchbase - 相关介绍](https://sq.163yun.com/blog/article/189804692240617472)

#### CouchDB
+ [CouchDB - 源码](https://github.com/apache/couchdb-nano)
+ [couchDB官方网站](http://couchdb.apache.org/)
+ [couchDB wiki](http://wiki.apache.org/couchdb/)
+ [couchDB上手指南](http://erlang-china.org/study/couchdb-guide.html)
+ [couchDB相关介绍](https://feeler.blog.csdn.net/article/details/103212979)

#### LevelDB
LevelDB是Google开源的持久化KV单机数据库，具有很高的随机写，顺序读/写性能，但是随机读的性能很一般，也就是说，LevelDB很适合应用在查询较少，而写很多的场景。
+ [LevelDB - 源码](https://github.com/Level/levelup)
+ [LevelDB 介绍1](https://www.jianshu.com/p/223f0c73ddc2)
+ [LevelDB 介绍2](https://blog.csdn.net/qq_26222859/article/details/79645203)

#### - MongoDB
MongoDB是一个基于分布式文件存储的数据库。由C++语言编写。旨在为WEB应用提供可扩展的高性能数据存储解决方案。
MongoDB是一个介于关系数据库和非关系数据库(nosql)之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
+ [mongodb —— 官网](https://www.mongodb.org.cn/)
+ [mongodb —— 文档](https://docs.mongodb.com/manual/introduction/)
+ [mongodb - 教程](https://www.mongodb.org.cn/tutorial/)
+ [Mongoose 文档](http://www.mongoosejs.net/docs/index.html):为模型提供了一种直接的，基于scheme结构去定义你的数据模型。它内置数据验证， 查询构建，业务逻辑钩子等，开箱即用。
+ [Mongoose - 源码](https://github.com/mongodb/node-mongodb-native)

##### 相关工具
+ mongodump:MongoDB数据备份工具
+ mongosniff:MongoDB 的抓包工具
+ mongoimport:Mongodb数据导入工具
+ mongoexport:Mongodb数据导出工具
+ bsondump:将 bson 格式的文件转储为 json 格式的数据
+ mongoperf:测试磁盘 IO 性能的工具
+ mongorestore:MongoDB数据恢复工具
+ mongod.exe:MongoDB服务启动工具
+ mongostat:mongodb自带的状态检测工具，能查看MongoDB 实时的增删改查操作的 pqs、以及内存使用、网络吞吐的信息
+ mongofiles:gridfs 的命令行客户端，用于向 MongoDB 存储、读取文件，mongofiles 支持put、get、list等接口。
+ mongooplog:可以用于2个独立的 MongoDB 实例间的数据同步，它会不断的从源实例拉取 oplog（tailable cursor），然后重放到目标实例。
+ mongotop:跟踪一个MongoDB的实例，查看哪些大量的时间花费在读取和写入数据
+ mongos:分片路由，如果使用了 sharding 功能，则应用程序连接的是 mongos 而不是 mongod
+ mongo:客户端命令行工具，其实也是一个 js 解释器，支持 js 语法


#### 数据库链接 - sequelize
Sequelize 是 Node 的一个 ORM(Object-Relational Mapping) 框架，用来方便数据库操作。
+ [Sequelize —— 文档](https://sequelize.org/)

#### mysql
关系型数据库管理系统
+ [mysql - 源码](https://github.com/mysqljs/mysql)

#### mysql2
适用于Node.js的MySQL客户端，侧重于性能。 支持预备语句，非utf8编码，二进制日志协议，压缩，ssl等
+ [mysql2 —— 源码](https://github.com/mysqljs/mysql)

#### elasticsearch-js
适用于Node.js的官方Elasticsearch客户端库
+ [官方github](https://github.com/elastic/elasticsearch-js)
+ [elasticsearch —— 文档](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)

#### Neo4j
Neo4j是一个高性能的,NOSQL图形数据库，它将结构化数据存储在网络上而不是表中。
+ [Neo4j —— 源码](https://github.com/hacksparrow/apoc)
+ [Neo4j —— 介绍](https://www.cnblogs.com/jpfss/p/10874001.html)

#### oracledb
一种适用于大型、中型和微型计算机的关系数据库管理系统,它使用SQL(Structured guery language)作为它的数据库语言。
+ [oracledb —— 源码](https://github.com/oracle/node-oracledb)
+ [oracledb —— 文档](http://oracle.github.io/node-oracledb/)
+ [oracledb —— 介绍1](https://www.jianshu.com/p/83833b86eeca)
+ [oracledb —— 介绍2](https://cloud.tencent.com/developer/news/348741)

#### PostgreSQL
一个功能强大的开源对象关系数据库管理系统。 用于安全地存储数据; 支持最佳做法，并允许在处理请求时检索它们。
+ [PostgreSQL —— 源码](https://github.com/vitaly-t/pg-promise)
+ [PostgreSQL —— 文档](http://vitaly-t.github.io/pg-promise/)
+ [PostgreSQL —— 介绍](https://blog.csdn.net/puss0/article/details/80412401)
+ [PostgreSQL —— 社区主页](http://www.postgres.cn/index.php/v2/home)
+ [PostgreSQL新手入门](http://www.ruanyifeng.com/blog/2013/12/getting_started_with_postgresql.html)

#### node_redis
node的redis客户端
+ [github地址](https://github.com/NodeRedis/node_redis)

#### SQL Server
SqlServer驱动模块
+ [github地址](https://github.com/tediousjs/tedious)
+ [在线文档](http://tediousjs.github.io/tedious/)

#### SQLite
+ [SQLite —— 源码](https://github.com/mapbox/node-sqlite3)
+ [SQLite —— api文档](https://github.com/mapbox/node-sqlite3/wiki)


#### typeorm
一个ORM框架，它可以运行在NodeJS、浏览器、Cordova、PhoneGap、Ionic、React Native、Expo和Electron平台上，可以与TypeScript和JavaScript (ES5, ES6, ES7)一起使用。
+ [typeorm开发文档](https://typeorm.io/)

## 请求连接
#### Web Socket - Socket.IO
Socket.IO支持实时，双向和基于事件的通信。
它适用于所有平台，浏览器或设备，并同时关注可靠性和速度。
+ [Socket.IO —— 文档](https://socket.io/)
+ [github地址](https://github.com/socketio/socket.io)

#### ws
最广泛的WebSocket模块，用来创建WebSocket的服务器
+ [github地址](https://github.com/websockets/ws)

#### Request
Request被设计为进行http调用的最简单方法。 它支持HTTPS，默认情况下遵循重定向。

#### axios
Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。
+ [axios —— 文档](https://ejs.bootcss.com/)

## 前端模板 
#### EJS
EJS 是一套简单的模板语言，帮你利用普通的 JavaScript 代码生成 HTML 页面。EJS 没有如何组织内容的教条；也没有再造一套迭代和控制流语法；有的只是普通的 JavaScript 代码而已。
+ [EJS —— 官方文档](http://restify.com/)
+ [EJS —— 源码](https://github.com/mde/ejs)


## 日志
#### morgan
morgan是Node.js中间件，用来记录日志，Express使用的就是该中间件记录日志。

#### Log4js
log4js是javascript的log框架

## 生成文档：
#### apidoc
apiDoc通过源代码中的API注释创建文档。
+ [apidoc —— 文档](https://apidocjs.com/)

#### slate
Slate可帮助您创建美观，智能，响应迅速的API文档。
+ [github地址](https://github.com/slatedocs/slate)

#### swagger-node：api文档生成工具

## 应用管理
+ nodemon
文件变动监控(自动重启)，(启动服务器脚本中替换 node 即可)

+ strong-pm
进程管理Node.js 应用[github](https://github.com/strongloop/strong-pm/)、[官方文档](http://strong-pm.io/)


+ pm2
进程管理:

+ forever
部署

+ supervisior
监控进程并重启服务

+ node-dev
监控进程并重启服务

+ serve-favicon
带重启(nodemon用于开发环境)，日志，负载均衡

+ SystemD


## 加密
+ md5加密
[md5加密](https://www.npmjs.com/package/md5)

+ aes 加解密
crypto-js

+ 创建uuid
[创建uuid](https://www.npmjs.com/package/uuid)

anywhere
+ 静态服务器
[anywhere](https://www.npmjs.com/package/anywhere)

+ node-cron

定时任务[node-cron](https://www.npmjs.com/package/cron)

## 工具
+ emailjs：可使用nodejs发送邮件
+ node-qrcode：二维码生成器
+ webdriverio：自动化测试框架
+ Node.js-FriendlyMai
一个简洁现代且易于使用的Nodejs邮件发送包

+ Sinon 模拟输入

+ faker 数据伪造:

+ mockjs 模拟接口数据

+ lodash 实用工具库，封装了诸多对字符串、数组、对象等常见数据类型的处理函数

+ moment 日期处理库

+ 单元测试 Mocha,Karma,Jasmine。

+ Async 异步流程控制

+ js-cookie 操作cookie [js-cookie](https://github.com/js-cookie/js-cookie)

+ express-validator
数据验证:

+ exceljs
操作Excel，[文档](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md)

+ chokidar
对nodejs的fs.watch / fs.watchFile / FSEvents 的包装
[源码](https://github.com/paulmillr/chokidar)

+ node-html-pdf
将HTML到成pdf， 内如使用phantomjs。
[源码](https://github.com/marcbachmann/node-html-pdf)

+ md5-password-cracker.js
使用JavaScript Web Workers破解MD5密码
[源码](https://github.com/feross/md5-password-cracker.js)
+ psd.js：用于处理photoshop生成的psd文件
+ nodenv：用来管理多个nodejs版本
+ dotenv：加载文件中的环境变量到进程中
+ node-canvas：在node环境中使用canvas

+ jsdom：由 javascript实现的一系列web标准，特别是 WHATWG 组织制定的DOM和 HTML 标准，用于在 nodejs 中使用
+ node-lru-cache：Nodejs基于LRU算法实现的缓存
+ inquirer.js：一个用户与命令行交互的工具
+ json-server：一个 Node 模块，运行 Express 服务器，你可以指定一个 json 文件作为 api 的数据源。
+ nodejs-dashboard：用于终端应用的遥测仪表板 
+ chalk：一个颜色的插件，可以控制命令行中文本的颜色
+ commander：一个轻巧的nodejs模块，提供了用户命令行输入和参数解析强大功能。这个工具主要是用来实现用户在命令的交互。
+ mocha：JavaScript的一种单元测试框架，既可以在浏览器环境下运行，也可以在Node.js环境下运行。
+ serialize-json：json数据的序列化和解析

## 中间件
+ body-parser

body-parser是一个HTTP请求体解析的中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体，

+ helmet

设置 HTTP 头(提高安全性)

+ cors

允许 cors 请求

+ response-time

记录服务响应时间，从请求进入该中间件到响应头写入客户端所经过的时间

+ compression

压缩请求

+ serve-favicon

serve-favicon是Node.js中间件，用于服务图标。

+ koa-jwt
用于校验 JSON Web Tokens (JWT) koa中间件


更多中间件可参看[Nodejs基础中间件Connect](https://www.cnblogs.com/chris-oil/p/5625437.html)
