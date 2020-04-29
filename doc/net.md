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

## net.Socket 类
#### `new net.Socket([options])`

创建一个 socket 对象。 新创建的 socket 可以是 TCP socket 也可以是 IPC 端点流，取决于它连接 connect() 到什么。

+ `options <Object>` 可用选项有
    + `fd <number>` 如果指定了该参数，则使用一个给定的文件描述符包装一个已存在的 socket，否则将创建一个新的 socket。
    + `allowHalfOpen <boolean>` 指示是否允许半打开的 TCP 连接。默认值: false。
    + `readable <boolean>` 当传递了 fd 时允许读取 socket，否则忽略。默认值: false。
    + `writable <boolean>` 当传递了 fd 时允许写入 socket，否则忽略。默认值: false。
+ 返回: `<net.Socket>`

+ `socket.localAddress <string>` 远程客户端连接的本地 IP 地址字符串
+ `socket.localPort <integer>` 用数字表示的本地端口
+ `socket.connecting <boolean>` `socket.connect(options[, connectListener])` 被调用到 socket 连接之间为true，连接后设置为 false 并触发 'connect' 事件
+ `socket.bufferSize <integer>` 写入而缓冲的字符数。 缓冲器中可能包含字符串，其编码后的长度是未知的。 因此，此数字仅是缓冲器中字节数的近似值。<br/>
net.Socket 具有该属性时，则 socket.write() 始终可用。 这是为了帮助用户快速启动并运行。 计算机不能总是跟上写入套接字的数据量。 网络连接也可能太慢。 Node.js 将会在内部将写入套接字的数据进行排队，并在可能的情况下将其发送出去。<br/>
这种内部缓冲的结果是内存可能会增加。 对于遇到 bufferSize 太大或不断增加的用户，应尝试使用 socket.pause() 和 socket.resume() 来对其程序中的数据流进行节流。
+ `socket.bytesWritten <integer>` 发送的字节数量
+ `socket.bytesRead <integer>` 接收的字节数量
+ `socket.remoteAddress <string>` 用字符串表示的远程 IP 地址
+ `socket.remoteFamily <string>` 用字符串表示的远程 IP 协议族
+ `socket.remotePort <integer>` 用数字表示的远程端口
+ `socket.pending <boolean>` 如果 socket 尚未连接，则为 true，因为尚未调用 .connect() 或者因为它仍处于连接过程中
+ `socket.destroyed <boolean>` 连接是否已经被销毁，一旦连接被销毁就不能再使用它传输任何数据
+ `socket.address()` 操作系统报告的 socket 的 address、地址的 family 名称、以及 port
+ `socket.connect()` 在给定的套接字上启动一个连接。该方法是异步的。

    当连接建立了的时候，'connect' 事件将会被触发。如果连接过程中有问题，'error' 事件将会代替 'connect' 事件被触发，并将错误信息传递给 'error' 监听器
    + `socket.connect(options[, connectListener])` 在给定的套接字上启动连接。通常不需要此方法，应该使用 net.createConnection() 来创建和打开套接字。 仅在实现自定义的套接字时才使用此方法。
        + `options <Object>`
            + 对于 TCP 连接，可用的 options 有：
                + `port <number>` 必须。套接字要连接的端口。
                + `host <string>` 套接字要连接的主机。默认值: 'localhost'。
                + `localAddress <string>` 套接字要连接的本地地址。
                + `localPort <number>` 套接字要连接的本地端口。
                + `family <number>` IP 栈的版本。必须为 4、 6 或 0。0 值表示允许 IPv4 和 IPv6 地址。默认值: 0。
                + `hints <number>` 可选的 dns.lookup() 提示。
                + `lookup <Function>` 自定义的查找函数。默认值: dns.lookup()。
            + 对于 IPC 连接，可用的 options 有：
                + `path <string>` 必须。客户端要连接的路径。参见识别 IPC 连接的路径。如果提供了，则忽略上面的 TCP 特定的选项。
            对于这两种类型，可用 options 包括：
                + `onread <Object>` 如果指定，则传入的数据会存储在单个 buffer 中，并在数据到达套接字时传给提供的 callback。 这将会导致流式的功能不会提供任何数据。 该套接字将会正常触发 'error'、 'end' 和 'close' 之类的事件。 诸如 pause() 和 resume() 之类的方法也将会按预期运行。
                    + `buffer <Buffer> | <Uint8Array> | <Function>` 用于存储传入数据的可复用的内存块、或返回此类数据的函数。
                    + `callback <Function>` 为每个传入的数据块调用此函数。有两个参数传给它：写入 buffer 的字节数和对 buffer 的引用。从此函数返回 false 可以隐式地 pause() 套接字。该函数将会在全局的上下文中执行。
        + `connectListener <Function>`  'connect' 事件的监听器。
        + 返回: `<net.Socket>` 套接字自身。
    + `socket.connect(path[, connectListener])` 在给定的套接字上启动 IPC 连接。使用 `{ path: path }` 作为 options 调用 `socket.connect(options[, connectListener])` 的别名
        + `path <string>` 客户端要连接的路径。参见识别 IPC 连接的路径。
        + `connectListener <Function>` 'connect' 事件的监听器。
        + 返回: `<net.Socket>` 套接字自身。
    + `socket.connect(port[, host][, connectListener])` 在给定的套接字上启动 TCP 连接。使用 `{port: port, host: host}` 作为 options 调用 `socket.connect(options[, connectListener])` 的别名
        + `port <number>` 客户端要连接的端口。
        + `host <string>` 客户端要连接的主机。
        + `connectListener <Function>` 'connect' 事件的监听器。
        + 返回: `<net.Socket>` 套接字自身。

+ `socket.setEncoding([encoding])` 设置作为可读流的编码
+ `socket.setKeepAlive([enable][, initialDelay])` 启用/禁用长连接功能， 并且在第一个长连接探针被发送到一个空闲的 socket 之前可选则配置初始延迟。
+ `socket.setNoDelay([noDelay])` 启用或禁用 Nagle 算法的使用。
+ `socket.setTimeout(timeout[, callback])` 当 socket 在 timeout 毫秒不活动之后将其设置为超时状态。默认 net.Socket 没有超时。当一个闲置的超时被触发，socket 将会收到一个 'timeout' 事件，但连接不会被断开。用户必须手动调用 socket.end() 或 socket.destroy() 来断开连接。
+ `socket.write(data[, encoding][, callback])` 在 socket 上发送数据。
    + `data <string> | <Buffer> | <Uint8Array>`
    + `encoding <string>` 仅在数据为 string 时使用。默认值: utf8。
    + `callback <Function>`
    + 返回: `<boolean>`
    
    如果全部数据都成功刷新到内核的缓冲则返回 true。如果全部或部分数据在用户内中排队，则返回 false。当缓冲再次空闲的时候将触发 'drain' 事件。<br/>
    当数据最终都被写出之后，可选的 callback 参数将会被执行（可能不会立即执行）。
+ `socket.end([data[, encoding]][, callback])`
+ `socket.destroy([error])`
+ `socket.pause()` 暂停读写数据。也就是说，'data' 事件将不会再被触发。可以用于上传节流。
+ `socket.resume()` 在调用 socket.pause() 之后恢复读取数据。
+ `socket.ref()` 与 unref() 相反，在一个已经调用 unref 的 socket 中调用 ref()，如果 socket 是仅存的 socket，则程序不会退出（默认）。 对一个已经调用 ref 的 socket 再次调用 ref 将不会再有效果。s
+ `socket.unref()` 如果活跃的 socket 是事件系统中仅存的 socket，则调用 unref() 将会允许程序退出。对一个已经调用了 unref 的 socket 再调用 unref() 无效。
+ `net.createConnection()` 用于创建 `net.Socket` 的工厂函数，创建`net.Socket`后立即使用 `socket.connect()` 初始化链接，然后返回启动连接的 `net.Socket`。当连接建立之后，在返回的 socket 上将触发一个 'connect' 事件。
    + `net.createConnection(options[, connectListener])`
    + `options <Object>` 必须
        + `new net.Socket([options])` 和 `socket.connect(options[, connectListener])` 所有可用的option，在调用 `new net.Socket([options])` 和 `socket.connect(options[, connectListener])` 方法会传入这个参数。
        + `timeout <number>` 如果设置，将会用来在 socket 创建之后连接开始之前调用 socket.setTimeout(timeout)。
    + `connectListener <Function>` 'connect' 事件的监听器。
    + 返回: `<net.Socket>` 新创建的 socket，用于开始连接。
    可选的选项，查看 new net.Socket([options]) 和 socket.connect
    + `net.createConnection(path[, connectListener])` 初始化一个 IPC 连接。该方法使用所有默认选项创建一个新的 `net.Socket`，使用 `socket.connect(path[, connectListener])` 立即初始化连接，然后返回初始化连接的 `net.Socket`。
        + `path <string>` Socket 应该被连接到的路径。将会被传入到 `socket.connect(path[, connectListener])`。查看识别 IPC 连接的路径。
        + `connectListener <Function>` 'connect' 事件的监听器。
        + 返回: `<net.Socket>` 新创建的 socket，用来开始连接。
    + `net.createConnection(port[, host][, connectListener])` 初始化一个 TCP 连接。这个函数用默认配置创建一个新的 net.Socket，然后 `socket.connect(port[, host][, connectListener])` 初始化一个连接，并返回开启连接的那个 `net.Socket`。
        + `port <number>` 套接字应该连接的端口号。会传给`socket.connect(port[, host][, connectListener])`。
        + `host <string>` 套接字应该连接的主机名。会传给socket.connect(port[, host][, connectListener])。默认值: 'localhost'。
        + `connectListener <Function>` 'connect' 事件的监听器。
        + 返回: `<net.Socket>` 用于开启连接的新创建的套接字。
+ `net.connect()` `net.createConnection()` 的别名。
    + `net.connect(options[, connectListener])`
        + `options <Object>`
        + `connectListener <Function>`
        + 返回: `<net.Socket>`
    + `net.connect(path[, connectListener])`
        + `path <string>`
        + `connectListener <Function>`
        + 返回: `<net.Socket>`
    + `net.connect(port[, host][, connectListener])`
        + `port <number>`
        + `host <string>`
        + `connectListener <Function>`
        + 返回: `<net.Socket>`
+ `net.createServer([options][, connectionListener])` 创建一个新的 TCP 或 IPC 服务器。服务器可以是一个 TCP 服务器或 IPC 服务器，这取决于 listen() 监听什么。
    + `options <Object>`
        + `allowHalfOpen <boolean>` 表明是否允许半开的 TCP 连接。默认值: false。如果 allowHalfOpen 被设置为 true，则当套接字的另一端发送 FIN 数据包时，服务器将仅在 socket.end() 被显式调用发回 FIN 数据包，直到此时连接为半封闭状态（不可读但仍然可写）。
        + `pauseOnConnect <boolean>` 表明是否应在传入连接上暂停套接字。默认值: false。如果 pauseOnConnect 被设置为 true，则与每个传入连接关联的套接字会被暂停，并且不会从其句柄读取任何数据。 这允许在进程之间传递连接，而原始进程不会读取任何数据。 要从暂停的套接字开始读取数据，则调用 `socket.resume()`。
    + `connectionListener <Function>` 自动设置为 'connection' 事件的监听器。
    + 返回: `<net.Server>`
+ `net.isIP(input)` 测试输入是否是 IP 地址。无效的字符串则返回 0，IPv4 地址则返回 4，IPv6 的地址则返回 6。
+ `net.isIPv4(input)` 如果输入是 IPv4 地址则返回 true，否则返回 false。
+ `net.isIPv6(input)` 如果输入是 IPv6 地址则返回 true，否则返回 false。

+ 'lookup' 事件 在找到主机之后创建连接之前触发。不可用于 Unix socket。
    + `err <Error> | <null>` 错误对象。
    + `address <string>` IP 地址。
    + `family <string> | <null>` 地址类型。
    + `host <string> `主机。
+ 'connect' 事件 当一个 socket 连接成功建立的时候触发该事件。
+ 'ready' 事件 套接字准备好使用时触发。'connect' 后立即触发。
+ 'timeout' 事件 当 socket 超时的时候触发。该事件只是用来通知 socket 已经闲置。用户必须手动关闭。
+ 'data' 事件 当接收到数据的时触发该事件。data 参数是一个 Buffer 或 String。数据编码由 socket.setEncoding() 设置。当 Socket 触发 'data' 事件的时候，如果没有监听器则数据将会丢失。
+ 'end' 事件 当 socket 的另一端发送一个 FIN 包的时候触发，从而结束 socket 的可读端。默认情况下（allowHalfOpen 为 false），socket 将发送一个 FIN 数据包，并且一旦写出它的等待写入队列就销毁它的文件描述符。 当然，如果 allowHalfOpen 为 true，socket 就不会自动结束 end() 它的写入端，允许用户写入任意数量的数据。 用户必须调用 end() 显式地结束这个连接（例如发送一个 FIN 数据包）。s
+ 'drain' 事件 当写入缓冲区变为空时触发。可以用来做上传节流。
+ 'close' 事件 一旦 socket 完全关闭就发出该事件。参数 had_error 是 boolean 类型，表明 socket 被关闭是否取决于传输错误。
+ 'error' 事件 当错误发生时触发。'close' 事件也会紧接着该事件被触发。