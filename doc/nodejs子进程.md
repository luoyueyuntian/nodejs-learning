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

## 创建同步的进程
`child_process.spawnSync()`、`child_process.execSync()` 和 `child_process.execFileSync()` 方法是同步的，并且将会阻塞 Node.js 事件循环、暂停任何其他代码的执行，直到衍生的进程退出。

阻塞这些调用对于简化通用的脚本任务和简化应用程序配置在启动时的加载或处理都非常有用。

### `child_process.execFileSync(file[, args][, options])`
+ `file <string>` 要运行的可执行文件的名称或路径。
+ `args <string[]>` 字符串参数的列表。
+ `options <Object>`
    `cwd <string>` 子进程的当前工作目录。
    `input <string> | <Buffer> | <TypedArray> | <DataView>` 该值将会作为 stdin 传给衍生的进程。提供此值将会覆盖 stdio[0]。
    `stdio <string> | <Array>` 子进程的 stdio 配置。默认情况下，除非指定了 stdio，否则 stderr 将会被输出到父进程的 stderr。默认值: 'pipe'。
    `env <Object>` 环境变量的键值对。默认值: process.env。
    `uid <number>` 设置进程的用户标识，参见 setuid(2)。
    `gid <number>` 设置进程的群组标识，参见 setgid(2)。
    `timeout <number>` 允许进程运行的最长时间，以毫秒为单位。默认值: undefined。
    `killSignal <string> | <integer>` 当衍生的进程将被终止时使用的信号值。默认值: 'SIGTERM'。
    `maxBuffer <number>` stdout 或 stderr 上允许的最大字节数。如果超过限制，则子进程会被终止。参见 maxBuffer 与 Unicode 中的警告。默认值: 1024 * 1024。
    `encoding <string>` 用于所有 stdio 输入和输出的字符编码。默认值: 'buffer'。
    `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。默认值: false。
    `shell <boolean> | <string>` 如果为 true，则在 shell 中运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 参见 shell 的要求与 Windows 默认的 shell。 默认值: false（没有 shell）。
+ 返回: `<Buffer> | <string>` 命令的 stdout。

`child_process.execFileSync()` 方法通常与 `child_process.execFile()` 相同，但该方法在子进程完全关闭之前不会返回。 当遇到超时并发送 `killSignal` 时，该方法也需等到进程完全退出后才返回。

如果子进程拦截并处理了 `SIGTERM` 信号但未退出，则父进程仍将等待子进程退出。

如果进程超时或具有非零的退出码，则此方法将抛出一个 Error，其中包含底层 `child_process.spawnSync()` 的完整结果。

如果启用了 shell 选项，则不要将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

### `child_process.execSync(command[, options])`
+ command <string> 要运行的命令。
+ options <Object>
    + `cwd <string>` 子进程的当前工作目录。
    + `input <string> | <Buffer> | <TypedArray> | <DataView>` 该值将会作为 stdin 传给衍生的进程。提供此值将会覆盖 stdio[0]。
    + `stdio <string> | <Array>` 子进程的 stdio 配置。默认情况下，除非指定了 stdio，否则 stderr 将会被输出到父进程的 stderr。默认值: 'pipe'。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `shell <string>` 用于执行命令的 shell。参见 shell 的要求与 Windows 默认的 shell。 默认值: Unix 上是 '/bin/sh'，Windows 上是 process.env.ComSpec。
    + `uid <number>` 设置进程的用户标识，参见 setuid(2)。
    + `gid <number>` 设置进程的群组标识，参见 setgid(2)。
    + `timeout <number>` 允许进程运行的最长时间，以毫秒为单位。默认值: undefined。
    + `killSignal <string> | <integer>` 当衍生的进程将被终止时使用的信号值。默认值: 'SIGTERM'。
    + `maxBuffer <number>` stdout 或 stderr 上允许的最大字节数。如果超过限制，则子进程会被终止并且截断任何输出。参见 maxBuffer 与 Unicode 中的警告。默认值: 1024 * 1024。
    + `encoding <string>` 用于所有 stdio 输入和输出的字符编码。默认值: 'buffer'。
    + `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。默认值: false。
+ 返回: `<Buffer> | <string>` 命令的 stdout。

`child_process.execSync()` 方法通常与 `child_process.exec()` 相同，但该方法在子进程完全关闭之前不会返回。 当遇到超时并发送 `killSignal` 时，该方法也需等到进程完全退出后才返回。 如果子进程拦截并处理了 `SIGTERM` 信号但未退出，则父进程将会等待直到子进程退出。

如果进程超时或具有非零的退出码，则此方法将会抛出错误。 Error 对象将会包含 `child_process.spawnSync()` 的完整结果。

切勿将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

### `child_process.spawnSync(command[, args][, options])`
+ `command <string>` 要运行的命令。
+ `args <string[]>` 字符串参数的列表。
+ `options <Object>`
    + `cwd <string>` 子进程的当前工作目录。
    + `input <string> | <Buffer> | <TypedArray> | <DataView>` 该值将会作为 stdin 传给衍生的进程。提供此值将会覆盖 stdio[0]。
    + `argv0 <string>` 显式地设置发送给子进程的 argv[0] 的值。如果没有指定，则将会被设置为 command 的值。
    + `stdio <string> | <Array>` 子进程的 stdio 配置。
    + `env <Object>` 环境变量的键值对。默认值: process.env。
    + `uid <number>` 设置进程的用户标识，参见 setuid(2)。
    + `gid <number>` 设置进程的群组标识，参见 setgid(2)。
    + `timeout <number>` 允许进程运行的最长时间，以毫秒为单位。默认值: undefined。
    + `killSignal <string> | <integer>` 当衍生的进程将被终止时使用的信号值。默认值: 'SIGTERM'。
    + `maxBuffer <number>` stdout 或 stderr 上允许的最大字节数。如果超过限制，则子进程会被终止并且截断任何输出。参见 maxBuffer 与 Unicode 中的警告。默认值: 1024 * 1024。
    + `encoding <string>` 用于所有 stdio 输入和输出的字符编码。默认值: 'buffer'。
    + `shell <boolean> | <string>` 如果为 true，则在 shell 中运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 可以将不同的 shell 指定为字符串。 参见 shell 的要求与 Windows 默认的 shell。 默认值: false（没有 shell）。
    + `windowsVerbatimArguments <boolean>` 在 Windows 上不为参数加上引号或转义。在 Unix 上忽略。如果指定了 shell 并且是 CMD，则自动设为 true。默认值: false。
    + `windowsHide <boolean>` 隐藏子进程的控制台窗口（在 Windows 系统上通常会创建）。默认值: false。
+ 返回: `<Object>`
    + `pid <number>` 子进程的 pid。
    + `output <Array>` stdio 输出的结果数组。
    + `stdout <Buffer> | <string>` output[1] 的内容。
    + `stderr <Buffer> | <string>` output[2] 的内容。
    + `status <number>` 子进程的退出码，如果子进程因信号而终止，则为 null。
    + `signal <string>` 用于杀死子进程的信号，如果子进程不是因信号而终止，则为 null。
    + `error <Error>` 如果子进程失败或超时的错误对象。

`child_process.spawnSync()` 方法通常与 `child_process.spawn()` 相同，但在子进程完全关闭之前该函数不会返回。 当遇到超时并发送 `killSignal` 时，该方法也需等到进程完全退出后才返回。 如果进程拦截并处理了 SIGTERM 信号但未退出，则父进程将会等待直到子进程退出。

如果启用了 shell 选项，则不要将未经过处理的用户输入传给此函数。 包含 shell 元字符的任何输入都可用于触发任意命令的执行。

## ChildProcess 类
`ChildProcess` 的实例代表衍生的子进程。

`ChildProcess` 的实例不是直接创建的。 而是，使用 `child_process.spawn()`、`child_process.exec()`、`child_process.execFile()` 或 `child_process.fork()` 方法来创建 `ChildProcess` 的实例。

##### 属性
+ `subprocess.pid <integer>`:进程的进程标识符（PID）。
+ `subprocess.channel <Object>`:对子进程的 IPC 通道的引用。 如果当前没有 IPC 通道，则此属性为 undefined。
+ `subprocess.stdio <Array>`：一个到子进程的管道的稀疏数组，对应于传给 `child_process.spawn()` 的被设为 'pipe' 值的 stdio 选项中的位置。 `subprocess.stdio[0]`、 `subprocess.stdio[1]` 和 `subprocess.stdio[2]` 也分别可用作 `subprocess.stdin`、 `subprocess.stdout` 和 `subprocess.stderr`。
+ `subprocess.stderr <stream.Readable>`：子进程的 stderr 的可读流。
+ `subprocess.stdin <stream.Readable>`：子进程的 stdin 的可写流。
+ `subprocess.stdout <stream.Readable>`:子进程的 stdout 的可读流
+ `subprocess.spawnargs <Array>`：启动子进程时执行命名的所有参数列表
+ `subprocess.spawnfile <string>`：启动子进程时执行的文件名
+ `subprocess.signalCode <integer>`:表示子进程接受到的信号
+ `subprocess.connected <boolean>`:是否可以从子进程发送和接收消息。 当 subprocess.connected 为 false 时，则不能再发送或接收消息。
+ `subprocess.killed <boolean>`:子进程是否已成功接收到来着 subprocess.kill() 的信号。 killed 属性并不表明子进程是否已被终止。
+ `subprocess.exitCode <integer>`：子进程退出时的code，如果子进程还在运行，则该值为null

##### 方法
+ `subprocess.ref()`
    + 调用 subprocess.unref() 之后再调用 subprocess.ref() 将会为子进程恢复已删除的引用计数，强迫父进程在退出自身之前等待子进程退出。
+ `subprocess.unref()`
    + 使父进程的事件循环引用计数中不包括子进程，允许父进程独立于子进程退出，除非子进程与父进程之间已建立了 IPC 通道。
+ `subprocess.channel.ref()`
    + 在调用`.unref() `之前让父子进程间的IPC通道强制父进程的事件循环保持运行
+ `subprocess.channel.unref()`
    + 让父子进程间的IPC通道不再强制父进程的事件循环保持运行，即使这个通道是打开的
+ `subprocess.disconnect()`
    + 关闭父进程与子进程之间的 IPC 通道，一旦没有其他的连接使其保持活跃，则允许子进程正常退出。 调用该方法后，则父进程和子进程上各自的 subprocess.connected 和 process.connected 属性都会被设为 false，且进程之间不能再传递消息。
    + 当进程中没有正被接收的消息时，就会触发 'disconnect' 事件。 这经常在调用 subprocess.disconnect() 后被立即触发。
    + 当子进程是一个 Node.js 实例时（例如使用 child_process.fork() 衍生），也可以在子进程中调用 process.disconnect() 方法来关闭 IPC 通道。
+ `subprocess.kill([signal])`
    + 向子进程发送一个信号。 如果没有给定参数，则进程将会发送 'SIGTERM' 信号。
    + 如果 kill 成功，则此函数返回 true，否则返回 false。
    + 如果信号没有被送达，则 ChildProcess 对象可能会触发 'error' 事件。 向一个已经退出的子进程发送信号不是一个错误，但可能有无法预料的后果。 具体来说，如果进程的标识符 PID 已经被重新分配给其他进程，则信号将会被发送到该进程，而这可能产生意外的结果。
    + 虽然该函数被称为 kill，但传给子进程的信号可能实际上不会终止该进程。
    + 在 Linux 上，子进程的子进程在试图杀死其父进程时将不会被终止。 当在 shell 中运行新进程、或使用 ChildProcess 的 shell 选项时，可能会发生这种情况
+ `subprocess.send(message[, sendHandle[, options]][, callback])`

##### 事件
+ 'close' 事件
    + 调用父进程中的 subprocess.disconnect() 或子进程中的 process.disconnect() 后会触发 'disconnect' 事件。 断开连接后就不能再发送或接收信息，且 subprocess.connected 属性为 false。
+ 'disconnect' 事件
    + 调用父进程中的 subprocess.disconnect() 或子进程中的 process.disconnect() 后会触发 'disconnect' 事件。 断开连接后就不能再发送或接收信息，且 subprocess.connected 属性为 false。
+ 'error' 事件：
    + 每当出现以下情况时触发 'error' 事件：
        + 无法衍生进程；
        + 无法杀死进程；
        + 向子进程发送消息失败。
    + 发生错误后，可能会也可能不会触发 'exit' 事件。 当同时监听 'exit' 和 'error' 事件时，则需要防止意外地多次调用处理函数。

+ 'exit' 事件：
    + 当子进程结束后时会触发 'exit' 事件。 如果进程退出，则 code 是进程的最终退出码，否则为 null。 如果进程是因为收到的信号而终止，则 signal 是信号的字符串名称，否则为 null。 这两个值至少有一个是非 null 的。
    + 当 'exit' 事件被触发时，子进程的 stdio 流可能依然是打开的。
    + Node.js 为 SIGINT 和 SIGTERM 建立了信号处理程序，且 Node.js 进程收到这些信号不会立即终止。 相反，Node.js 将会执行一系列的清理操作，然后再重新提升处理后的信号。
+ 'message' 事件：
    + 当子进程使用 process.send() 发送消息时会触发 'message' 事件。
    + 消息通过序列化和解析进行传递。 收到的消息可能跟最初发送的不完全一样。
    + 如果在衍生子进程时使用了 serialization 选项设置为 'advanced'，则 message 参数可以包含 JSON 无法表示的数据。

#### maxBuffer 与 Unicode
在启动进程的选项中有一个`option.maxBuffer`参数，指定了 stdout 或 stderr 上允许的最大字节数。 如果超过这个值，则子进程会被终止。 这会影响多字节字符编码的输出，如 UTF-8 或 UTF-16。

#### shell 的要求
在启动进程的选项中有一个`option.shell`参数，当需要启动Shell时，Shell 需要能理解 -c 开关。 如果 shell 是 'cmd.exe'，则它需要能理解 /d /s /c 开关，且命令行解析需要能兼容。
