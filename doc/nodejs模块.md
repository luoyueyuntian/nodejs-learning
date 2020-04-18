在 Node.js 模块系统中，每个文件都视为独立的模块

模块内的本地变量是私有的，因为模块被 Node.js 包装在一个函数中。
## nodejs模块实现原理 —— 模块包装器
在执行模块代码之前，Node.js 会使用一个如下的函数包装器将其包装：
<pre><code>(function(exports, require, module, __filename, __dirname) {
// 模块的代码实际上在这里
});</code></pre>
通过这样做，Node.js 实现了以下几点：

+ 它保持了顶层的变量（用 var、const 或 let 定义）作用在模块范围内，而不是全局对象。
+ 它有助于提供一些看似全局的但实际上是模块特定的变量，例如：<br/>
+ + 实现者可以用于从模块中导出值的 module 和 exports 对象。<br/>
+ + 包含模块绝对文件名和目录路径的快捷变量 __filename 和 __dirname 。

## module 作用域
从模块包装器可以看出，模块内有以下五个入参：
### __dirname
当前模块的目录名。相当于 __filename 的 path.dirname()。

### __filename
当前模块的文件名（处理后的绝对路径）。不一定与命令行中使用的名称一致。

### require
用于引入模块、JSON 文件、或本地模块。 可以引入 node_modules 中的模块。 使用相对路径（比如 ./、./foo、./bar/baz、../foo）引入本地模块或 JSON 文件时，会根据 __dirname 定义的目录名或当前工作目录进行处理。

#### require.cache
被引入的模块将被缓存在这个对象中。从此对象中删除键值对将会导致下一次 require 重新加载被删除的模块。注意不能删除 native addons（原生插件），因为它们的重载将会导致错误。

#### require.main
当 Node.js 直接运行一个文件时，require.main 会被设为它的 module。

### exports
对 module.exports 的更简短的引用形式。

module.exports 用于指定一个模块所导出的内容，即可以通过 require() 访问的内容。

### module
在每个模块中，module 的自由变量是一个指向表示当前模块的对象的引用。 为了方便，module.exports 也可以通过全局模块的 exports 对象访问。 module 实际上不是全局的，而是每个模块本地的。

#### module.children
被该模块引用的模块对象。

#### module.filename
模块的完全解析后的文件名。

#### module.id
模块的标识符。 通常是完全解析后的文件名。

#### module.loaded
模块是否已经加载完成，或正在加载中。

#### module.parent
最先引用该模块的模块。

#### module.paths
模块的搜索路径。

#### module.exports
module.exports 对象是由模块系统创建的。如果期望模块成为某个类的实例，需要将期望导出的对象赋值给 module.exports。
注意事项：
+ 将对象赋值给 exports 会简单地重新绑定本地 exports 变量，只在模块内有效，不导出
+ 对 module.exports 的赋值必须立即完成，即必须是同步的,在异步代码里赋值将是无效的。

### module.exports 与 exports
exports 变量是在模块的文件级别作用域内有效的，它在模块被执行前被赋予 module.exports 的值，也就是在模块执行前exports持有module.exports的引用。在exports添加的属性和方法也会添加到module.exports上。

如果在模块内将exports赋予一个新的值，则exports不再引用module.exports，此时exports将变成一个局部变量，上面添加的属性和方法不会被导出。

如果在模块内将module.exports属性被一个新的对象完全替代时，exports将于module.exports断开连接，exports的值将指向module.exports被重新赋值前的对象。

**require() 的实现原理大致如下：**
<pre><code>function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // 模块代码在这。在这个例子中，定义了一个函数。
    function someFunc() {}
    exports = someFunc;
    // 此时，exports 不再是一个 module.exports 的快捷方式，
    // 且这个模块依然导出一个空的默认对象。
    module.exports = someFunc;
    // 此时，该模块导出 someFunc，而不是默认对象。
  })(module, module.exports);
  return module.exports;
}</code></pre>

## 文件模块
如果按确切的文件名没有找到模块，则 Node.js 会尝试带上 .js、.json 或 .node 拓展名再加载。

.js 文件会被解析为 JavaScript 文本文件，.json 文件会被解析为 JSON 文本文件。 .node 文件会被解析为通过 dlopen 加载的编译后的插件模块。

以 '/' 为前缀的模块是文件的绝对路径。 例如，require('/home/marco/foo.js') 会加载 /home/marco/foo.js 文件。

以 './' 为前缀的模块是相对于调用 require() 的文件的。 也就是说，circle.js 必须和 foo.js 在同一目录下以便于 require('./circle') 找到它。

当没有以 '/'、'./' 或 '../' 开头来表示文件时，这个模块必须是一个核心模块或加载自 node_modules 目录。

如果给定的路径不存在，则 require() 会抛出一个 code 属性为 'MODULE_NOT_FOUND' 的 Error。

## 目录作为模块
可以把程序和库放到一个单独的目录，然后提供一个单一的入口来指向它。 把目录递给 require() 作为一个参数，有三种方式。

### 通过 package.json 来指定入口文件
在根目录下创建一个 package.json 文件，并指定一个 main 模块。 例子，package.json 文件类似：
<pre><code>{
    "name" : "some-library",
    "main" : "./lib/some-library.js"
}</code></pre>
如果这是在 ./some-library 目录中，则 require('./some-library') 会试图加载 ./some-library/lib/some-library.js。

注意：如果 package.json 中 "main" 入口指定的文件不存在，则无法解析，Node.js 会将模块视为不存在，并抛出默认错误：
<pre><code>Error: Cannot find module 'some-library'</code></pre>
如果目录里没有 package.json 文件，则 Node.js 就会试图加载目录下的 index.js 或 index.node 文件。 例如，如果上面的例子中没有 package.json 文件，则 require('./some-library') 会试图加载：
+ ./some-library/index.js
+ ./some-library/index.node

### 从 node_modules 目录加载
如果传递给 require() 的模块标识符不是一个核心模块，也没有以 '/' 、 '../' 或 './' 开头，则 Node.js 会从当前模块的父目录开始，尝试从它的 /node_modules 目录里加载模块。 Node.js 不会附加 node_modules 到一个已经以 node_modules 结尾的路径上。

如果还是没有找到，则移动到再上一层父目录，直到文件系统的根目录。

例如：如果在 '/home/ry/projects/foo.js' 文件里调用了 require('bar.js')，则 Node.js 会按以下顺序查找：
+ /home/ry/projects/node_modules/bar.js
+ /home/ry/node_modules/bar.js
+ /home/node_modules/bar.js
+ /node_modules/bar.js
这使得程序本地化它们的依赖，避免它们产生冲突。

通过在模块名后包含一个路径后缀，可以请求特定的文件或分布式的子模块。 例如，require('example-module/path/to/file') 会把 path/to/file 解析成相对于 example-module 的位置。 后缀路径同样遵循模块的解析语法。

### 从全局目录加载
如果 NODE_PATH 环境变量被设为一个以冒号分割的绝对路径列表，则当在其他地方找不到模块时 Node.js 会搜索这些路径。注意：在 Windows 系统中，NODE_PATH 是以分号间隔的。

此外，Node.js 还会搜索以下位置：
+ 1: $HOME/.node_modules
+ 2: $HOME/.node_libraries
+ 3: $PREFIX/lib/node

其中 $HOME 是用户的主目录，$PREFIX 是 Node.js 里配置的 node_prefix。

在当前的模块解析算法运行之前，NODE_PATH 最初是创建来支持从不同路径加载模块的。

注意：以上主要是历史原因，有时当人们没意识到 NODE_PATH 必须被设置时，依赖 NODE_PATH 的部署会出现意料之外的行为。 有时一个模块的依赖会改变，导致在搜索 NODE_PATH 时加载了不同的版本（甚至不同的模块）。强烈建议将所有的依赖放在本地的 node_modules 目录。 这样将会更快地加载，且更可靠。

## 模块解析顺序
+ 如果是核心模块，则直接返回对应模块
+ 如果是以'/'开始的路径，则从根目录开始查找
+ 如果是以'./' 、 '/' 、'../' 开头，则先以当前目录加路径解析出要查找的路径，然后先按文件来解析，再使用目录来解析
+ 从当前目录依次往上查找node_modules，直到找到对应的包
+ 以上方法都无法找到对应模块时，就会抛出模块未找到异常

## 模块缓存
模块在第一次加载后会被缓存。 这也意味着（类似其他缓存机制）如果每次调用 require('foo') 都解析到同一文件，则返回相同的对象。

多次调用 require(foo) 不会导致模块的代码被执行多次。 这是一个重要的特性。 借助它, 可以返回“部分完成”的对象，从而允许加载依赖的依赖, 即使它们会导致循环依赖。

如果想要多次执行一个模块，可以导出一个函数，然后调用该函数。

**注意事项**
+ 模块是基于其解析的文件名进行缓存的。 由于调用模块的位置的不同，模块可能被解析成不同的文件名（比如从 node_modules 目录加载），这样就不能保证 require('foo') 总能返回完全相同的对象。
+ 在不区分大小写的文件系统或操作系统中，被解析成不同的文件名可以指向同一文件，但缓存仍然会将它们视为不同的模块，并多次重新加载。例如，require('./foo') 和 require('./FOO') 返回两个不同的对象，而不会管 ./foo 和 ./FOO 是否是相同的文件。

## 模块循环依赖问题
当循环调用 require() 时，一个模块可能在未完成执行时被返回。

例如：当 main.js 加载 a.js 时，a.js 又加载 b.js。 此时，b.js 会尝试去加载 a.js。 为了防止无限的循环，会返回一个 a.js 的 exports 对象的 未完成的副本 给 b.js 模块。 然后 b.js 完成加载，并将 exports 对象提供给 a.js 模块。

对于循环依赖需要仔细的规划, 以允许循环模块依赖在应用程序内正常工作

## 包管理技巧
假设想要在 /usr/lib/node/<some-package>/<some-version> 目录中保存一个特定版本的包的内容。

包可以依赖于其他包。 为了安装包 foo，可能需要安装一个指定版本的 bar 包。 bar 包也可能有依赖，且在某些情况下，依赖可能有冲突或形成循环。

因为 Node.js 会查找它所加载的模块的实际路径（也就是说会解析符号链接），然后在 node_modules 目录中寻找它们的依赖，如下所述，这种情况使用以下体系结构很容易解决：
+ /usr/lib/node/foo/1.2.3/ - foo 包的内容，版本 1.2.3。
+ /usr/lib/node/bar/4.3.2/ - foo 依赖的 bar 包的内容。
+ /usr/lib/node/foo/1.2.3/node_modules/bar - /usr/lib/node/bar/4.3.2/ 的符号链接。
+ /usr/lib/node/bar/4.3.2/node_modules/* - bar 所依赖的包的符号链接

因此，即便存在循环依赖或依赖冲突，每个模块还是可以获得它所依赖的包的一个可用版本。

当 foo 包中的代码调用 require('bar')，它会获得符号链接 /usr/lib/node/foo/1.2.3/node_modules/bar 指向的版本。 然后，当 bar 包中的代码调用 require('queue')，它会获得符号链接 /usr/lib/node/bar/4.3.2/node_modules/quux 指向的版本。

此外，为了进一步优化模块查找过程，不要将包直接放在 /usr/lib/node 目录中，而是将它们放在 /usr/lib/node_modules/\<name>/\<version> 目录中。 这样 Node.js 就不会在 /usr/node_modules 或 /node_modules 目录中查找缺失的依赖。

为了使模块在 Node.js 的 REPL 中可用，可能需要将 /usr/lib/node_modules 目录添加到 $NODE_PATH 环境变量中。 由于在 node_modules 目录中查找模块使用的是相对路径，而调用 require() 的文件是基于实际路径的，因此包本身可以放在任何地方。