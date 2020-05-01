# http
提供了HTTP 服务器和客户端相关接口

HTTP API 都非常底层。 它仅进行流处理和消息解析。 它将消息解析为消息头和消息主体，但不会解析具体的消息头或消息主体。



## http.Agent 类
Agent 负责管理 HTTP 客户端的连接持久性和重用。 它为给定的主机和端口维护一个待处理请求队列，为每个请求重用单独的套接字连接，直到队列为空，此时套接字被销毁或放入连接池，以便再次用于请求到同一个主机和端口。 销毁还是放入连接池取决于 keepAlive 选项。

连接池中的连接已启用 TCP Keep-Alive，但服务器仍可能关闭空闲连接，在这种情况下，它们将从连接池中删除，并且当为该主机和端口发出新的 HTTP 请求时将建立新连接。 服务器也可以拒绝通过同一连接允许多个请求，在这种情况下，必须为每个请求重新建立连接，并且不能放入连接池。 Agent 仍将向该服务器发出请求，但每个请求都将通过新连接发生。

当客户端或服务器关闭连接时，它将从连接池中删除。 连接池中任何未使用的套接字都将被销毁，以便当没有未完成的请求时不用保持 Node.js 进程运行。

当不再使用时最好 `destroy()` Agent 实例，因为未使用的套接字会消耗操作系统资源。

当套接字触发 'close' 事件或 'agentRemove' 事件时，则套接字将从代理中删除。

代理也可以用于单个请求。 通过提供 {agent: false} 作为 `http.get()` 或 `http.request()` 函数的选项，则将使用一次性的具有默认选项的 Agent 用于客户端连接。
+ agent.requests 个对象，包含尚未分配给套接字的请求队列。 不要修改。
+ agent.sockets 一个对象，包含当前代理正在使用的套接字数组。 不要修改。
+ agent.maxSockets 默认情况下设置为 Infinity。 决定代理可以为每个来源打开多少并发套接字。 来源是 `agent.getName()` 的返回值。
+ agent.maxFreeSockets 认设置为 256。 对于启用了 keepAlive 的代理，这将设置在空闲状态下保持打开的最大套接字数。
+ agent.freeSockets 个对象，其中包含当启用 keepAlive 时代理正在等待使用的套接字数组。 不要修改。freeSockets 列表中的 socket 会在 `'timeout' 时自动被销毁并从数组中删除。
+ `new Agent([options])`
    + `options <Object>` 要在代理上设置的可配置选项集。可以包含以下字段：
        + `keepAlive <boolean>` 即使没有未完成的请求，也要保持套接字，这样它们就可以被用于将来的请求而无需重新建立 TCP 连接。 不要与 Connection 请求头的 keep-alive 值混淆。 Connection: keep-alive 请求头始终在使用代理时发送，除非明确指定 Connection 请求头、或者 keepAlive 和 maxSockets 选项分别设置为 false 和 Infinity，在这种情况下将会使用 Connection: close。 默认值: false。
        + `keepAliveMsecs <number>` 当使用 keepAlive 选项时，指定用于 TCP Keep-Alive 数据包的初始延迟。当 keepAlive 选项为 false 或 undefined 时则忽略。默认值: 1000。
        + `maxSockets <number>` 每个主机允许的套接字的最大数量。默认值: Infinity。
        + `maxFreeSockets <number>` 在空闲状态下保持打开的套接字的最大数量。仅当 keepAlive 被设置为 true 时才相关。默认值: 256。
        + `timeout <number>` 套接字的超时时间，以毫秒为单位。这会在套接字被连接之后设置超时时间。
    + `socket.connect()` 中的 options 也受支持。
    + `http.request（）`使用的默认 `http.globalAgent` 将所有这些值设置为各自的默认值。
    + 要配置其中任何一个，则必须创建自定义的 http.Agent 实例。
        <pre><code>const http = require('http');
      const keepAliveAgent = new http.Agent({ keepAlive: true });
      options.agent = keepAliveAgent;
      http.request(options, onResponseCallback);</code></pre>

+ `agent.createConnection(options[, callback])` 生成用于 HTTP 请求的套接字或流。
    + `options <Object>` 包含连接详细信息的选项。 查看 `net.createConnection()` 以获取选项的格式。
    + `callback <Function>` 接收创建的套接字的回调函数。参数是 (err, stream)
    + 返回: `<stream.Duplex>`
    + 默认情况下，此函数与`net.createConnection（）`相同。 但是，如果需要更大的灵活性，定制代理可以覆盖此方法。
    + 可以通过以下两种方式之一提供套接字/流：通过从此函数返回套接字/流，或将套接字/流传递给callback。
    + 此方法保证返回 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。

+ `agent.keepSocketAlive(socket)`
    + 当 socket 与请求分离并且可以由 Agent 保留时调用。
    + 此方法可以由特定的 Agent 子类重写。 如果此方法返回一个假值，则将销毁套接字而不是将其保留以用于下一个请求。
    + socket 参数可以是 `<net.Socket>`（`<stream.Duplex>` 的子类）的实例。

+ `agent.reuseSocket(socket, request)` 由于 `keep-alive` 选项而在持久化后将 socket 附加到 request 时调用。
    + `socket <stream.Duplex>`
    + `request <http.ClientRequest>`
    + 此方法可以由特定的 Agent 子类重写。
    + socket 参数可以是 `<net.Socket>`（`<stream.Duplex>` 的子类）的实例。

+ `agent.destroy()` 销毁代理当前使用的所有套接字。通常没有必要这样做。 但是，如果使用启用了 keepAlive 的代理，则最好在代理不再使用时显式关闭代理。 否则，在服务器终止套接字之前，套接字可能会挂起很长时间。

+ `agent.getName(options)` 获取一组请求选项的唯一名称，以判定一个连接是否可以被重用。
    + `options <Object>` 一组选项，为生成名称提供信息。
        + `host <string>` 请求发送至的服务器的域名或 IP 地址。
        + `port <number>` 远程服务器的端口。
        + `localAddress <string>` 为网络连接绑定的本地接口。
        + `family <integer>` 如果不等于 undefined，则必须为 4 或 6。
    + 返回: `<string>`
    + 对于 HTTP 代理，这返回 `host:port:localAddress` 或 `host:port:localAddress:family`。 对于 HTTPS 代理，该名称包括 CA、证书、密码、以及其他可判定套接字可重用性的 HTTPS/TLS 特有的选项。

## http.ClientRequest 类
此对象由 `http.request()` 内部创建并返回。 它代表正在进行中的请求，其请求头已进入队列。 请求头仍然可以使用 `setHeader(name, value)`、`getHeader(name)` 或 `removeHeader(name)` API 进行改变。 实际的请求头将会与第一个数据块一起发送，或者当调用 `request.end()` 时发送。

要获得响应，则为请求对象添加 'response' 事件监听器。 当接收到响应头时，会从请求对象中触发 'response' 事件。 'response' 事件执行时具有一个参数，该参数是 `http.IncomingMessage` 的实例。

在 'response' 事件期间，可以添加监听器到响应对象，比如监听 'data' 事件。

如果没有添加 'response' 事件处理函数，则响应将会被完全地丢弃。 如果添加了 'response' 事件处理函数，则必须消费完响应对象中的数据，每当有 'readable' 事件时调用 `response.read()`、或添加 'data' 事件处理函数、或通过调用 `.resume()` 方法。 在消费完数据之前，不会触发 'end' 事件。 此外，在读取数据之前，它将会占用内存，这最终可能导致进程内存不足的错误。

与 request 对象不同，如果响应过早地关闭，则 response 对象不会触发 'error' 事件而是触发 'aborted' 事件。

Node.js 不会检查 `Content-Length` 和已传输的请求体的长度是否相等。

+ #### 属性
    + `request.destroyed` 在调用了 `request.destroy()` 之后为 true。
    + `request.path` 请求的路径。
    + `request.reusedSocket`
    + `request.socket`
    + `request.writableEnded`
    + `request.writableFinished`
    + `request.aborted` 如果请求已中止，则 request.aborted 属性将会为 true。
    + `request.maxHeadersCount` 限制最大响应头数。 如果设置为 0，则不会应用任何限制。

+ #### 方法
    + request.abort() 将请求标记为中止。 调用此方法将导致响应中剩余的数据被丢弃并且套接字被销毁。
    + `request.end([data[, encoding]][, callback])` 完成发送请求。如果部分请求主体还未发送，则将它们刷新到流中。 如果请求被分块，则发送终止符 '0\r\n\r\n'。
        + `data <string> | <Buffer>` 如果指定了 data，则相当于调用 `request.write(data, encoding)` 之后再调用 `request.end(callback)`。
        + `encoding <string>`
        + `callback <Function>` 如果指定了 `callback`，则当请求流完成时将调用它。
        + 返回: `<this>`
    + `request.destroy([error])` 销毁请求。调用此命令将导致响应中的剩余数据被丢弃并销毁套接字
        + `error <Error>` 可选参数，会触发'error'和'close'事件
        + 返回: `<this>`
    + `request.flushHeaders()` 刷新请求头。
        + Node.js 通常会缓冲请求头，直到调用 `request.end()` 或写入第一个请求数据块。 然后，它尝试将请求头和数据打包到单个 TCP 数据包中。这通常是期望的（它节省了 TCP 往返），但是可能很晚才发送第一个数据。 `request.flushHeaders()` 绕过优化并启动请求。
    + `request.getHeader(name)` 读取请求中的一个请求头。 该名称不区分大小写。 返回值的类型取决于提供给 `request.setHeader()` 的参数。
    + `request.removeHeader(name)` 移除已定义到请求头对象中的请求头。
    + `request.setHeader(name, value)`
    + `request.setNoDelay([noDelay])`
    + `request.setSocketKeepAlive([enable][, initialDelay])`
    + `request.setTimeout(timeout[, callback])`
    + `request.write(chunk[, encoding][, callback])`

+ #### 事件
    + 'abort' 事件 当请求被客户端中止时触发。 此事件仅在第一次调用 abort() 时触发。
    + 'connect' 事件 每次服务器使用 CONNECT 方法响应请求时都会触发。如果未监听此事件，则接收 CONNECT 方法的客户端将关闭其连接。
        + `response <http.IncomingMessage>`
        + `socket <stream.Duplex>`
        + `head <Buffer>`
        + 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
    + 'continue' 事件 当服务器发送 100 Continue HTTP 响应时触发，通常是因为请求包含 Expect: 100-continue。 这是客户端应发送请求主体的指令。
    + 'information' 事件 服务器发送 1xx 中间响应（不包括 101 Upgrade）时触发。
        + `info <Object>`
            + `httpVersion <string>` HTTP 版本
            + `httpVersionMajor <integer>`
            + `httpVersionMinor <integer>`
            + `statusCode <integer>` 状态码
            + `statusMessage <string>`
            + `headers <Object>` 键值对请求头对象
            + `rawHeaders <string[]>` 具有原始请求头名称和值的数组
        + 101 Upgrade 状态不会触发此事件，因为它们与传统的 HTTP 请求/响应链断开，例如 Web 套接字、现场 TLS 升级、或 HTTP 2.0。 要收到 101 Upgrade 的通知，请改为监听 'upgrade' 事件。

    + 'response' 事件 当收到此请求的响应时触发。 此事件仅触发一次。s
    + 'socket' 事件 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
    + 'timeout' 事件 当底层套接字因不活动而超时时触发。 这只会通知套接字已空闲。 必须手动中止请求。
    + 'upgrade' 事件 每次服务器响应升级请求时发出。如果未监听此事件且响应状态码为 101 Switching Protocols，则接收升级响应头的客户端将关闭其连接。此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
        + `response <http.IncomingMessage>`
        + `socket <stream.Duplex>`
        + `head <Buffer>`

## http.Server 类
+ #### 属性
    + server.headersTimeout
    + server.listening
    + server.maxHeadersCount
    + server.timeout
    + server.keepAliveTimeout

+ #### 方法
+ server.close([callback])
+ server.listen()
+ server.setTimeout([msecs][, callback])

+ #### 事件
    + 'checkContinue' 事件
    + 'checkExpectation' 事件
    + 'clientError' 事件
    + 'close' 事件
    + 'connect' 事件
    + 'connection' 事件
    + 'request' 事件
    + 'upgrade' 事件

## http.ServerResponse 类
+ #### 属性
    + response.sendDate
    + response.socket
    + response.statusCode
    + response.statusMessage
    + response.writableEnded
    + response.writableFinished
    + response.headersSent

+ #### 方法
    + response.addTrailers(headers)
    + response.cork()
    + response.end([data[, encoding]][, callback])
    + response.flushHeaders()
    + response.getHeader(name)
    + response.getHeaderNames()
    + response.getHeaders()
    + response.hasHeader(name)
    + response.removeHeader(name)
    + response.setHeader(name, value)
    + response.setTimeout(msecs[, callback])
    + response.uncork()
    + response.write(chunk[, encoding][, callback])
    + response.writeContinue()
    + response.writeHead(statusCode[, statusMessage][, headers])
    + response.writeProcessing()

+ #### 事件
    + 'close' 事件
    + 'finish' 事件

## http.IncomingMessage 类
+ message.aborted
+ message.complete
+ message.headers
+ message.httpVersion
+ message.method
+ message.rawHeaders
+ message.rawTrailers
+ message.socket
+ message.statusCode
+ message.statusMessage
+ message.trailers
+ message.url
+ message.destroy([error])
+ message.setTimeout(msecs[, callback])
+ 'aborted' 事件
+ 'close' 事件

+ http.METHODS
+ http.STATUS_CODES
+ http.createServer([options][, requestListener])
+ http.get(options[, callback])
+ http.get(url[, options][, callback])
+ http.globalAgent
+ http.maxHeaderSize
+ http.request(options[, callback])
+ http.request(url[, options][, callback])


