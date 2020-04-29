# net（网络）
用于创建基于流的 TCP 或 IPC 的服务器（`net.createServer()`）与客户端（`net.createConnection()`）

net 模块在 Windows 上支持命名管道 IPC，在其他操作系统上支持 Unix 域套接字。

> #### IPC 连接的识别路径
> `net.connect()`, `net.createConnection()`, `server.listen()` 和 `socket.connect()` 使用一个 path 参数来识别 IPC 端点。
> 在 Unix 上，本地域也称为 Unix 域。 参数 path 是文件系统路径名。 它会被截断为依赖于系统的 `sizeof(sockaddr_un.sun_path) - 1` 的长度。 典型值在 Linux 上为 107，在 macOS 上为 103。 如果一个 Node.js API 的抽象创建了 Unix 域 socket，则它也可以 unlink 该 Unix 域 socket。 例如，`net.createServer()` 可以创建 Unix 域 socket，而 `server.close()` 可以 unlink 它。 但是，如果用户在这些抽象之外创建 Unix 域 socket，则用户需要自己删除它。 当 Node.js API 创建 Unix 域 socket 但该程序随后崩溃时，情况也是如此。 简而言之，Unix 域 socket 会在文件系统中可见，且持续到被 unlink。<br/>
> 在 Windows 上，本地域通过命名管道实现。路径必须是以 `\\?\pipe\` 或 `\\.\pipe\` 为入口。路径允许任何字符，但后面的字符可能会对管道名称进行一些处理，例如解析 .. 序列。尽管如此，管道空间是平面的。管道不会持续，当最后一次引用关闭时，管道就会被删除。

## net.Server 类
用于创建 TCP 或 IPC 服务器。net.Server 是 TCP 或 IPC 服务器，具体取决于它监听的内容。

#### `new net.Server([options][, connectionListener])`
+ options <Object> 参见 net.createServer([options][, connectionListener])。
+ connectionListener <Function> 自动设置为 'connection' 事件的监听器。
+ 返回: <net.Server>

net.Server 是一个 EventEmitter，实现了以下事件:
+ 'close' 事件
    + 当 server 关闭的时候触发。 如果有连接存在，直到所有的连接结束才会触发这个事件。

+ 'connection' 事件
    + 当一个新的连接建立的时候触发。 socket 是一个 net.Socket 实例。

+ 'error' 事件
    + 当错误出现的时候触发。 不同于 net.Socket，'close' 事件不会在这个事件触发后继续触发，除非 server.close() 是手动调用。 

+ 'listening' 事件
    + 当调用 server.listen() 绑定服务器之后触发

##### 属性
+ `server.listening <boolean>` 表明 server 是否正在监听连接。
+ `server.maxConnections <integer>` 设置该属性使得当 server 连接数过多时拒绝连接。一旦将一个 socket 发送给 child_process.fork() 生成的子进程，就不推荐使用该选项。

##### 方法
+ `server.address()`
    + 如果在 IP socket 上监听，则返回操作系统报告的绑定的 address、地址 family 名称、以及服务器 port（用于查找在获取操作系统分配的地址时分配的端口）
    + 对于在管道或 Unix 域套接字上监听的 server，该名称将返回为字符串。
    + 在 'listening' 事件被触发之前、或在调用 server.close() 之后， server.address() 返回 null。

+ `server.close([callback])`
    + 阻止 server 接受新的连接并保持现有的连接。 该函数是异步的，server 将在所有连接结束后关闭并触发 'close' 事件。 可选的 callback 将在 'close' 事件发生时被调用。 与 'close' 事件不同的是，如果 server 在关闭时未打开，回调函数被调用时会传入一个 Error 对象作为唯一参数。

+ `server.getConnections(callback)`
    + 异步获取服务器的当前并发连接数。当 socket 被传递给子进程时工作。

+ `server.listen()`: 启动一个服务器来监听连接
    + 这个函数是异步的。当服务器开始监听时，会触发 'listening' 事件。 最后一个参数 callback 将被添加为 'listening' 事件的监听器。
    + 所有的 listen() 方法都可以使用一个 backlog 参数来指定待连接队列的最大长度。 实际的长度将由操作系统的 sysctl 设置决定。
    + 所有的 net.Socket 都被设置为 SO_REUSEADDR 。
    + 当且仅当上次调用 server.listen() 发生错误或已经调用 server.close() 时，才能再次调用 server.listen() 方法。否则将抛出 ERR_SERVER_ALREADY_LISTEN 错误。
    + 监听时最常见的错误之一是 EADDRINUSE。 这是因为另一个服务器已正在监听请求的 port/path/handle。 处理此问题的一种方法是在一段时间后重试。

    + #### `server.listen`有以下四种签名：

    + `server.listen(handle[, backlog][, callback])`
        + `handle <Object>`
        + `backlog <number>` server.listen() 函数的通用参数。
        + `callback <Function>`
        + 返回: `<net.Server>`
        + 启动一个服务器，监听已经绑定到端口、Unix 域套接字或 Windows 命名管道的给定 handle 上的连接。
        + handle 对象可以是服务器、套接字（任何具有底层 _handle 成员的东西），也可以是具有 fd 成员的对象，该成员是一个有效的文件描述符。

        + 在 Windows 上不支持在文件描述符上进行监听。
    + `server.listen(options[, callback])`
        + `options <Object>` 必须。支持以下参数属性
            + `port <number>`
            + `host <string>`
            + `path <string>` 如果指定了 port 参数则会被忽略。查看识别 IPC 连接的路径。。
            + `backlog <number>` server.listen() 函数的通用参数。
            + `exclusive <boolean>` 默认值: false。
            + `readableAll <boolean>` 对于 IPC 服务器，使管道对所有用户都可读。默认值: false。
            + `writableAll <boolean>` 对于 IPC 服务器，使管道对所有用户都可写。默认值: false。
            + `ipv6Only <boolean>` 对于 TCP 服务器，将 ipv6Only 设置为 true 将会禁用双栈支持，即绑定到主机 :: 不会使 0.0.0.0 绑定。默认值: false。
        + `callback <Function>`
        + 返回: `<net.Server>`
        + 如果指定了 port 参数，该方法的行为跟 server.listen([port[, host[, backlog]]][, callback]) 一样。 否则，如果指定了 path 参数，该方法的行为与 server.listen(path[, backlog][, callback]) 一致。 如果没有 port 或者 path 参数，则会抛出一个错误。
        + 如果 exclusive 是 false（默认），则集群的所有进程将使用相同的底层句柄，允许共享连接处理任务。如果 exclusive 是 true，则句柄不会被共享，如果尝试端口共享将导致错误。
        + 以 root 身份启动 IPC 服务器可能导致无特权用户无法访问服务器路径。 使用 readableAll 和 writableAll 将使所有用户都可以访问服务器。

    + `server.listen(path[, backlog][, callback])`
        + path <string> 服务器需要监听的路径。查看 识别 IPC 连接的路径。。
        + backlog <number> server.listen() 函数的通用参数。
        + callback <Function>
        + 返回: <net.Server>
        + 启动一个 IPC 服务器监听给定 path 的连接。

    + `server.listen([port[, host[, backlog]]][, callback])`
        + port <number>
        + host <string>
        + backlog <number> server.listen() 函数的通用参数。
        callback <Function>
        + 返回: <net.Server>
        + 启动一个 TCP 服务监听输入的 port 和 host。
        + 如果 port 省略或是 0，系统会随意分配一个在 'listening' 事件触发后能被 server.address().port 检索的无用端口。
        + 如果 host 省略，如果 IPv6 可用，服务器将会接收基于未指定的 IPv6 地址 (::) 的连接，否则接收基于未指定的 IPv4 地址 (0.0.0.0) 的连接。
        + 在大多数的系统, 监听未指定的 IPv6 地址 (::) 可能导致 net.Server 也监听未指定的 IPv4 地址 (0.0.0.0)。

+ `server.ref()`
    + 在一个已经调用 unref 的 server 中调用 ref()，如果 server 是仅存的 server，则程序不会退出（默认）。对一个已经调用 ref 的 server 再次调用 ref() 将不会再有效果。

+ `server.unref()`
    + 如果这个 server 在事件系统中是唯一有效的，那么对 server 调用 unref() 将允许程序退出。 如果这个 server 已经调用过 unref 那么再次调用 unref() 将不会再有效果。




