path 模块用于处理文件与目录的路径。
path 模块会因操作系统的差异而不同。

### Windows 和 POSIX 的区别
#### 路径分隔符：
+ Windows 上是 `;`
+ POSIX 上是 `:`

#### 获取平台特定的路径分隔符
<pre><code>path.delimiter</code></pre>

#### 路径片段分隔符：
+ Windows 上是 `\`
+ POSIX 上是 `/`

#### 获取平台特定的路径片段分隔符
<pre><code>path.sep</code></pre>

### 跨平台开发
+ 如果想在任何操作系统上处理 POSIX 文件路径时获得一致的结果，则使用 path.posix
+ 要想在任何操作系统上处理 Windows 文件路径时获得一致的结果，可以使用 path.win32

### 路径构成
Windows 上路径结构如下：
<pre><code>┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘</code></pre>
POSIX 上路径结构如下：
<pre><code>┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘</code></pre>

#### 获取 path 的目录名
<pre><code>path.dirname(path)</code></pre>

#### 获取 path 的最后一部分
<pre><code>path.basename(path[, ext])</code></pre>

#### 获取 path 的扩展名
<pre><code>path.extname(path)</code></pre>

### 绝对路径与相对路径
#### 判定 path 是否为一个绝对路径
<pre><code>path.isAbsolute(path)</code></pre>

#### 获取绝对路径
<pre><code>path.resolve([...paths])</code></pre>
把一个路径或路径片段的序列解析为一个绝对路径。

给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。

如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上。

生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。

长度为零的 path 片段会被忽略。

如果没有传入 path 片段，则 path.resolve() 会返回当前工作目录的绝对路径。

#### 获取相对路径
<pre><code>path.relative(from, to)</code></pre>
该方法返回从 from 到 to 的相对路径（基于当前工作目录）。 
+ 如果 from 和 to 各自解析到同一路径（调用 path.resolve()），则返回一个长度为零的字符串。
+ 如果 from 或 to 传入了一个长度为零的字符串，则当前工作目录会被用于代替长度为零的字符串。

### 规范化路径
#### path.join([...paths])
使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。

#### path.normalize(path)
该方法会规范化给定的 path，并解析 '..' 和 '.' 片段。

+ 当发现多个连续的路径分隔符时（如 POSIX 上的 / 与 Windows 上的 \ 或 /），它们会被单个的路径分隔符（POSIX 上是 /，Windows 上是 \）替换。 末尾的多个分隔符会被保留。
+ 如果 path 是一个长度为零的字符串，则返回 '.'，表示当前工作目录。

### 路径字符串与路径对象相互转换
#### 路径字符串转路径对象
<pre><code>path.parse(path)</code></pre>
路径对象有以下属性：
+ dir 目录名
+ root 根目录名
+ base
+ name
+ ext 扩展名

#### 路径对象转路径字符串
<pre><code>path.format(pathObject)</code></pre>


## 当前文件和目录所在位置
__dirname表示当前文件所在的位置，在一模块中，它属于“全局”变量，dirname表示行代码所在路径。
<pre><code>(function(exports, require, moudules, __filename, __dirname){})()</code></pre>
要获取安装后的文件目录，这个是最好的方式。

## 当前终端执行路径
获取当前终端执行路径时，可以使用process.cwd方法

## 当前系统用户主目录
获取当前系统用户主目录的方案很简单，主要是通过环境变量进行判断，代码如下：
<pre><code>function home() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}</code></pre>
还可以使用 os-homedir 这样的Nodejs模块，该模块兼容所有操作系统。
