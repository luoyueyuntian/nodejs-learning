### 使用前
+ 安装了较新版本的nodejs
+ 安装了PhantomJS，并将PhantomJS添加到环境变量

### 使用
双击`fetch.bat`即可获取或更新数据

### 文件实现功能
loadModuleUrl.js —— 获取所有api的URL

parseModuleName.js —— 将URL中html的文件名

loadModuleApi.js —— 将api列表解析成树形json数据

parseModuleApi.js —— 根据json数据生成markdown文档

### bat脚本
依次运行脚本文件，生成最终结果
<pre><code>call phantomjs loadModuleUrl.js
call node parseModuleName.js
call phantomjs loadModuleApi.js
call node parseModuleApi.js</code></pre>

> 说明：以上代码做简单修改即可增加把nodejs的完整api转换成本地的pdf文档功能，相当于生成离线版，但是每个页面要生成一个pdf文件。
