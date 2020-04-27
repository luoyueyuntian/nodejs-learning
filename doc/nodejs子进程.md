# 子进程 `child_process`
概要：子进程模块主要是用来创建一个新的进程。当我们启动一个nodejs进程时，会创建一个新的主进程，在这个主进程中，我们可以通过`child_process.spawn()`去创建新的进程。

`child_process.spawnSync()` 函数则以同步的方式提供了等效的功能，但会阻塞事件循环直到衍生的进程退出或终止。

`child_process.spawn()`和`child_process.spawnSync()`是创建进程的基本的方式，nodejs中其他创建进程都是基于这两个实现的。


## 创建异步的进程
`child_process.spawn()`、`child_process.fork()`、`child_process.exec()` 和 `child_process.execFile()` 方法都遵循其他 Node.js API 惯用的异步编程模式。

每个方法都返回一个 ChildProcess 实例。 这些对象实现了 Node.js 的 EventEmitter API，允许父进程注册监听器函数，在子进程的生命周期中当发生某些事件时会被调用。

`child_process.exec()` 和 `child_process.execFile()` 方法还允许指定可选的 callback 函数，当子进程终止时会被调用。

### `child_process.spawn(command[, args][, options])`
`child_process.spawn()` 方法异步地衍生子进程，且不阻塞 Node.js 事件循环。 
+ `command <string>` 要运行的命令。
+ `args <string[]>` 字符串参数的列表。
+ `options <Object>`
    + `cwd <string>` 子进程的当前工作目录。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `argv0 <string>` 显式地设置发送给子进程的 argv[0] 的值。如果没有指定，则将会被设置为 command 的值。
    + `stdio <Array> | <string>` 子进程的 stdio 配置。参见 options.stdio。
    + `detached <boolean>` 准备子进程独立于其父进程运行。具体行为取决于平台，参见options.detached。
    + `uid <number>` 设置进程的用户标识，参见 setuid(2)。
    + `gid <number>` 设置进程的群组标识，参见 setgid(2)。
    + `serialization <string>` 指定用于在进程之间发送消息的序列化类型。可能的值为 'json' 和 'advanced'。有关更多详细信息，请参见高级序列化。默认值: 'json'。
    + `shell <boolean> | <string>` 如果为 true，则在 shell 中运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 参见 shell 的要求与 Windows 默认的 shell。 默认值: false（没有 shell）。
    + `windowsVerbatimArguments <boolean>` 在 Windows 上不为参数加上引号或转义。在 Unix 上忽略。如果指定了 shell 并且是 CMD，则自动设为 true。默认值: false。
    + `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。默认值: false。
+ 返回: `<ChildProcess>`


参数说明：
`child_process.spawn()` 方法使用给定的 command 衍生一个新进程，并带上 args 中的命令行参数。 如果省略 args，则其默认为一个空数组。

如果启用了 shell 选项，则不要将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

第三个参数可用于指定额外的选项，具有以下默认值：
<pre><code>const defaults = {
  cwd: undefined,
  env: process.env
};</code></pre>

使用 `options.cwd` 指定衍生进程的工作目录。 如果没有给定，则默认为继承当前工作目录。

使用 `options.env` 指定新进程的可见的环境变量，默认为 `process.env`。`options.env` 中的 undefined 值将会被忽略。

某些平台（macOS、Linux）使用 `options.argv[0]` 的值作为进程的标题，其他平台（Windows、SunOS）则使用 command。Node.js 在启动时会使用 process.execPath 覆盖 `options.argv[0]`，因此 Node.js 子进程的 `process.argv[0]` 与从父进程传给 spawn 的 argv0 参数不会匹配，可以使用 process.argv0 属性获取。

`options.detached`用来设置是否分离父子进程。

在 Windows 上，设置 options.detached 为 true 可以使子进程在父进程退出后继续运行。 子进程有自己的控制台窗口。 一旦为子进程启用它，则无法被禁用。

在非 Windows 平台上，如果 options.detached 设为 true，则子进程将会成为新的进程组和会话的主导者。 子进程在父进程退出后可以继续运行，不管它们是否被分离。

默认情况下，父进程将会等待被分离的子进程退出。 为了防止父进程等待 subprocess，可以使用 subprocess.unref() 方法。 这样做将会导致父进程的事件循环不会将子进程包含在其引用计数中，使得父进程可以独立于子进程退出，除非子进程和父进程之间建立了 IPC 通道。

当使用 detached 选项来启动一个长期运行的进程时，该进程在父进程退出后将不会保持在后台运行，除非提供一个不连接到父进程的 stdio 配置。 如果父进程的 stdio 是继承的，则子进程将会保持绑定到控制终端。

`options.stdio` 用于配置在父进程和子进程之间建立的管道。 默认情况下，子进程的 stdin、 stdout 和 stderr 会被重定向到 ChildProcess 对象上相应的 subprocess.stdin、subprocess.stdout 和 subprocess.stderr 流。 这相当于将 options.stdio 设置为 ['pipe', 'pipe', 'pipe']。

默认情况下， stdin、 stdout 和 stderr 的管道会在父 Node.js 进程和衍生的子进程之间建立。 这些管道具有有限的（且平台特定的）容量。 如果子进程写入 stdout 时超出该限制且没有捕获输出，则子进程将会阻塞并等待管道缓冲区接受更多的数据。 这与 shell 中的管道的行为相同。 如果不消费输出，则使用 { stdio: 'ignore' } 选项。

options.stdio 可以是以下字符串之一：
+ 'pipe' - 相当于 ['pipe', 'pipe', 'pipe']（默认值）。
+ 'ignore' - 相当于 ['ignore', 'ignore', 'ignore']。
+ 'inherit' - 相当于 ['inherit', 'inherit', 'inherit'] 或 [0, 1, 2]。

也可以是一个数组，其中每个索引对应于子进程中的 fd。 fd 0、1 和 2 分别对应于 stdin、stdout 和 stderr。 可以指定其他 fd 以便在父进程和子进程之间创建额外的管道。 值可以是以下之一：
+ 1、'pipe' - 在子进程和父进程之间创建一个管道。 管道的父端作为 child_process 对象上的 subprocess.stdio[fd] 属性暴露给父进程。 为 fd 0 - 2 创建的管道也可分别作为 subprocess.stdin、subprocess.stdout 和 subprocess.stderr 使用。
+ 2、'ipc' - 创建一个 IPC 通道，用于在父进程和子进程之间传递消息或文件描述符。 一个 ChildProcess 最多可以有一个 IPC stdio 文件描述符。 设置此选项会启用 subprocess.send() 方法。 如果子进程是一个 Node.js 进程，则 IPC 通道的存在将会启用 process.send() 和 process.disconnect() 方法、以及子进程内的 'disconnect' 和 'message' 事件。
以 process.send() 以外的任何方式访问 IPC 通道的 fd、或者在一个不是 Node.js 实例的子进程中使用 IPC 通道，都是不支持的。
+ 3、'ignore' - 指示 Node.js 忽略子进程中的 fd。 虽然 Node.js 将会始终为它衍生的进程打开 fd 0 - 2，但将 fd 设置为 'ignore' 将会导致 Node.js 打开 /dev/null 并将其附加到子进程的 fd。
+ 4、'inherit' - 将相应的 stdio 流传给父进程或从父进程传入。 在前三个位置中，这分别相当于 process.stdin、 process.stdout 和 process.stderr。 在任何其他位置中，则相当于 'ignore'。
+ 5、<Stream> 对象 - 与子进程共享指向 tty、文件、 socket 或管道的可读或可写流。 流的底层文件描述符在子进程中会被复制到与 stdio 数组中的索引对应的 fd。 该流必须具有一个底层的描述符（文件流直到触发 'open' 事件才需要）。
+ 6、正整数 - 整数值会被解释为当前在父进程中打开的文件描述符。 它与子进程共享，类似于共享 <Stream> 对象的方式。 在 Windows 上不支持传入 socket。
+ 7、null 或 undefined - 使用默认值。 对于 stdio 的 fd 0、1 和 2（换句话说，stdin、stdout 和 stderr），将会创建一个管道。 对于 fd 3 及更大的值，则默认为 'ignore'。

当在父进程和子进程之间建立 IPC 通道，并且子进程是一个 Node.js 进程时，则子进程启动时不会指向 IPC 通道（使用 `unref()`），直到子进程为 'disconnect' 事件或 'message' 事件注册了事件处理函数。 这允许子进程正常退出而不需要通过开放的 IPC 通道保持打开该进程。

在类 Unix 操作系统上，`child_process.spawn()` 方法在将事件循环与子进程解耦之前会同步地执行内存操作。 具有大内存占用的应用程序可能会发现频繁的 `child_process.spawn()` 调用成为瓶颈。

### `child_process.fork(modulePath[, args][, options])`
`child_process.fork()` 方法是 `child_process.spawn()` 的一个特例，专门用于衍生新的 Node.js 进程。 与 `child_process.spawn()` 一样返回 `ChildProcess` 对象。 返回的 `ChildProcess` 将会内置一个额外的通信通道，允许消息在父进程和子进程之间来回传递。

child_process.fork() 不会克隆当前的进程。

衍生的 Node.js 子进程独立于父进程，但两者之间建立的 IPC 通信通道除外。 每个进程都有自己的内存，带有自己的 V8 实例。 由于需要额外的资源分配，因此不建议衍生大量的 Node.js 子进程。

+ `modulePath <string>` 要在子进程中运行的模块。
+ `args <string[]>` 字符串参数的列表。
+ `options <Object>`
    + `cwd <string>` 子进程的当前工作目录。
    + `detached <boolean>` 准备子进程独立于其父进程运行。具体行为取决于平台，参见 options.detached。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `execPath <string>` 用于创建子进程的可执行文件。
    + `execArgv <string[]>` 传给可执行文件的字符串参数的列表。默认值: process.execArgv。
    + `serialization <string>` 指定用于在进程之间发送消息的序列化类型。可能的值为 'json' 和 'advanced'。有关更多详细信息，请参见高级序列化。默认值: 'json'。
    + `silent <boolean>` 如果为 true，则子进程的 stdin、stdout 和 stderr 将会被输送到父进程，否则它们将会继承自父进程，详见 child_process.spawn() 的 stdio 中的 'pipe' 和 'inherit' 选项。默认值: false。
    + `stdio <Array> | <string>` 参见 child_process.spawn() 的 stdio。当提供此选项时，则它覆盖 silent 选项。如果使用了数组变量，则它必须包含一个值为 'ipc' 的元素，否则将会抛出错误。例如 [0, 1, 2, 'ipc']。
    + `windowsVerbatimArguments <boolean>` 在 Windows 上不为参数加上引号或转义。在 Unix 上则忽略。默认值: false。
    + `uid <number>` 设置进程的用户标识，参见 setuid(2)。
    + `gid <number>` 设置进程的群组标识，参见 setgid(2)。
    + 返回: `<ChildProcess>`

默认情况下， child_process.fork() 将会使用父进程的 process.execPath 来衍生新的 Node.js 实例。 options 对象中的 execPath 属性允许使用其他的执行路径。

使用自定义的 execPath 启动的 Node.js 进程将会使用文件描述符（在子进程上使用环境变量 NODE_CHANNEL_FD 标识）与父进程通信。

`child_process.spawn()` 中可用的 shell 选项在 `child_process.fork()` 中不支持，如果设置则将会被忽略。

### `child_process.exec(command[, options][, callback])`
衍生一个 shell 然后在该 shell 中执行 command，并缓冲任何产生的输出。 

child_process.exec() 不会替换现有的进程，且使用 shell 来执行命令。

+ `command <string>` 要运行的命令，并带上以空格分隔的参数。
+ `options <Object>`
    + `cwd <string>` 子进程的当前工作目录。默认值: null。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `encoding <string>` 默认值: 'utf8'。
    + `shell <string>` 用于执行命令的 shell。参见 shell 的要求与 Windows 默认的 shell。 默认值: Unix 上是 '/bin/sh'，Windows 上是 process.env.ComSpec。
    + `timeout <number>` 默认值: 0。
    + `maxBuffer <number>` stdout 或 stderr 上允许的最大字节数。如果超过限制，则子进程会被终止并且截断任何输出。参见 maxBuffer 与 Unicode 中的警告。默认值: 1024 * 1024。
    + `killSignal <string> | <integer>` 默认值: 'SIGTERM'。
    + `uid <number>` 设置进程的用户标识
    + `gid <number>` 设置进程的群组标识
    + `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。）。默认值: false。
+ `callback <Function>` 当进程终止时调用并带上输出。
    + `error <Error>`
    + `stdout <string> | <Buffer>`
    + `stderr <string> | <Buffer>`
+ 返回: `<ChildProcess>`

传给 exec 函数的 command 字符串由 shell 直接处理，特殊字符（因 shell 而异）需要相应地处理。切勿将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

如果 timeout 大于 0，则当子进程运行时间超过 timeout 毫秒时，父进程将会发送带 killSignal 属性（默认为 'SIGTERM'）的信号。

如果提供了 callback，则调用时传入参数 (error, stdout, stderr)。 当成功时，则 error 将会为 null。 当出错时，则 error 将会是 Error 的实例。 error.code 属性将会是子进程的退出码， error.signal 将会被设为终止进程的信号。 除 0 以外的任何退出码都被视为出错。

传给回调的 stdout 和 stderr 参数将会包含子进程的 stdout 和 stderr 输出。 默认情况下，Node.js 会将输出解码为 UTF-8 并将字符串传给回调。 encoding 选项可用于指定用于解码 stdout 和 stderr 输出的字符编码。 如果 encoding 是 'buffer' 或无法识别的字符编码，则传给回调的将会是 Buffer 对象。

如果调用此方法的 util.promisify() 版本，则返回的 Promise 会返回具有 stdout 属性和 stderr 属性的 Object。 返回的 ChildProcess 实例会作为 child 属性附加到该 Promise。 如果出现错误（包括导致退出码不是 0 的任何错误），则返回被拒绝的 Promise，并带上与回调中相同的 error 对象，但是还有两个另外的属性 stdout 和 stderr。

### `child_process.execFile(file[, args][, options][, callback])`
`child_process.execFile()` 函数类似于 `child_process.exec()`，但默认情况下不会衍生 shell。 相反，指定的可执行文件 file 会作为新进程直接地衍生，使其比 `child_process.exec()` 稍微更高效。

支持与 child_process.exec() 相同的选项。 由于没有衍生 shell，因此不支持 I/O 重定向和文件通配等行为。

+ `file <string>` 要运行的可执行文件的名称或路径。
+ `args <string[]>` 字符串参数的列表。
+ `options <Object>`
    + `cwd <string>` 子进程的当前工作目录。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `encoding <string>` 字符编码。默认值: 'utf8'。
    + `timeout <number>` 默认值: 0。
    + `maxBuffer <number>` stdout 或 stderr 上允许的最大字节数。如果超过限制，则子进程会被终止并且截断任何输出。参见 maxBuffer 与 Unicode 中的警告。默认值: 1024 * 1024。
    + `killSignal <string> | <integer>` 默认值: 'SIGTERM'。
    + `uid <number>` 设置进程的用户标识
    + `gid <number>` 设置进程的群组标识
    + `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。默认值: false。
    + `windowsVerbatimArguments <boolean>` 在 Windows 上不为参数加上引号或转义。在 Unix 上忽略。默认值: false。
    + `shell <boolean> | <string>` 如果为 true，则在 shell 中运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 参见 shell 的要求与 Windows 默认的 shell。 默认值: false（没有 shell）。
`callback <Function>` 当进程终止时调用并带上输出。
    + `error <Error>`
    + `stdout <string> | <Buffer>`
    + `stderr <string> | <Buffer>`
返回: `<ChildProcess>`

如果启用了 shell 选项，则不要将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

传给回调的 stdout 和 stderr 参数将会包含子进程的 stdout 和 stderr 输出。 默认情况下，Node.js 会将输出解码为 UTF-8 并将字符串传给回调。 encoding 选项可用于指定用于解码 stdout 和 stderr 输出的字符编码。 如果 encoding 是 'buffer' 或无法识别的字符编码，则传给回调的将会是 Buffer 对象。

如果调用此方法的 `util.promisify()` 版本，则返回的 Promise 会返回具有 stdout 属性和 stderr 属性的 Object。 返回的 ChildProcess 实例会作为 child 属性附加到该 Promise。 如果出现错误（包括导致退出码不是 0 的任何错误），则返回被拒绝的 Promise，并带上与回调中相同的 error 对象，但是还有两个另外的属性 stdout 和 stderr。






这些进程都是主进程的子进程。主进程与子进程之间可以通过IPC管道相互传递信息。子进程退出后由父进程负责回收子进程，如果父进程未回收子进程，则子进程会变成僵尸进程，无法正常结束，其占用的资源不会被释放（释放终止进程所使用的所有存储区，关闭所有打开的文件等），即使通过root身份kill也不能杀死僵尸进程，唯一的补救办法就是把主进程（僵尸进程的父进程）杀死，僵尸进程自动变为“孤儿进程”，过继给1号进程init，init始终会负责清理僵死进程。
