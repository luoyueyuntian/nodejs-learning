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
    + `request.reusedSocket` 请求是否是通过一个重用的socket发送。当请求是通过开启`keep-alive`发送时，在底层，这个socket会被复用。如果服务端关闭了连接，客户端可能会触发'ECONNRESET'异常
    + `request.socket` 指向底层套接字。也可以通过 request.connection 访问 socket。
    + `request.writableEnded` 在调用 `request.end()` 之后为 true。 此属性不表明是否已刷新数据，对于这种应该使用 `request.writableFinished`。
    + `request.writableFinished` 如果在触发 'finish' 事件之前，所有数据都已刷新到底层系统，则为 true。
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
    + `request.setHeader(name, value)` 为请求头对象设置单个请求头的值。如果此请求头已存在于待发送的请求头中，则其值将被替换。 这里可以使用字符串数组来发送具有相同名称的多个请求头。 非字符串值将被原样保存。 因此 `request.getHeader()` 可能会返回非字符串值。 但是非字符串值将转换为字符串以进行网络传输。
    + `request.setNoDelay([noDelay])` 一旦将套接字分配给此请求并且连接了套接字，就会调用 `socket.setNoDelay()`。
    + `request.setSocketKeepAlive([enable][, initialDelay])` 一旦将套接字分配给此请求并连接了套接字，就会调用 `socket.setKeepAlive()`。
    + `request.setTimeout(timeout[, callback])` 一旦将套接字分配给此请求并且连接了套接字，就会调用 `socket.setTimeout()`。
    + `request.write(chunk[, encoding][, callback])` 发送一个请求主体的数据块。通过多次调用此方法，可以将请求主体发送到服务器。 在这种情况下，建议在创建请求时使用 `['Transfer-Encoding', 'chunked']` 请求头行。s
        + `chunk <string> | <Buffer>`
        + `encoding <string>` 可选，仅当 chunk 是字符串时才适用。 默认为 'utf8'。
        + `callback <Function>` 可选，当刷新此数据块时调用，但仅当数据块非空时才会调用。
        + 返回: `<boolean>` 如果将整个数据成功刷新到内核缓冲区，则返回 true。 如果全部或部分数据在用户内存中排队，则返回 false。
        + 当缓冲区再次空闲时，则触发 'drain' 事件。
        + 当使用空字符串或 buffer 调用 write 函数时，则什么也不做且等待更多输入。

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
    + `server.listening` 服务器是否正在监听连接
    + `server.maxHeadersCount` 限制最大传入请求头数。 如果设置为 0，则不会应用任何限制。
    + `server.headersTimeout` 限制解析器等待接收完整 HTTP 请求头的时间。
        + 如果不活动，则适用 `server.timeout` 中定义的规则。 但是，如果请求头发送速度非常慢（默认情况下，每 2 分钟最多一个字节），那么基于不活动的超时仍然允许连接保持打开状态。 为了防止这种情况，每当请求头数据到达时，进行额外的检查，自建立连接以来，没有超过 `server.headersTimeout` 毫秒。 如果检查失败，则在服务器对象上触发 'timeout' 事件，并且销毁套接字（默认情况下）。
    + `server.keepAliveTimeout` 服务器在完成写入最后一个响应之后，在销毁套接字之前需要等待其他传入数据的非活动毫秒数。 如果服务器在保持活动超时被触发之前接收到新数据，它将重置常规非活动超时，即 `server.timeout`。
        + 值为 0 将禁用传入连接上的保持活动超时行为。 值为 0 使得 http 服务器的行为与 8.0.0 之前的 Node.js 版本类似，后者没有保持活动超时。
        + 套接字超时逻辑在连接时设置，因此更改此值仅影响到服务器的新连接，而不影响任何现有连接。
    + `server.timeout` 认定套接字超时的不活动毫秒数。
        + `<number>` 超时时间（以毫秒为单位）。默认值: 120000（2 分钟）。
        + 值为 0 将禁用传入连接的超时行为。
        + 套接字超时逻辑在连接时设置，因此更改此值仅影响到服务器的新连接，而不影响任何现有连接。

+ #### 方法
    + `server.listen()` 启动 HTTP 服务器监听连接。 此方法与 `net.Server `中的 `server.listen()` 相同。
    + `server.setTimeout([msecs][, callback])` 设置套接字的超时值，并在服务器对象上触发 'timeout' 事件，如果发生超时，则将套接字作为参数传入。
        + `msecs <number>` 默认值: 120000（2 分钟）。
        + `callback <Function>`
        + 返回: `<http.Server>`
        + 如果服务器对象上有 'timeout' 事件监听器，则将使用超时的套接字作为参数调用它。
        + 默认情况下，服务器不会使 socket 超时。 但是，如果将回调分配给服务器的 'timeout' 事件，则必须显式处理超时。
    + `server.close([callback])` 停止服务器接受新连接

+ #### 事件
    + 'connection' 事件 建立新的 TCP 流时会触发此事件
        + socket 通常是 net.Socket 类型的对象。 通常用户无需访问此事件。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。 也可以通过 request.connection 访问 socket。
        + 用户也可以显式触发此事件，以将连接注入 HTTP 服务器。 在这种情况下，可以传入任何 Duplex 流。
        + 如果在此处调用 `socket.setTimeout()`，则当套接字已提供请求时（如果 server.keepAliveTimeout 为非零），超时将会被 server.keepAliveTimeout 替换。
        + 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
    + 'connect' 事件  每次客户端请求 HTTP CONNECT 方法时触发。 如果未监听此事件，则请求 CONNECT 方法的客户端将关闭其连接。
        + 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex> `的子类）的实例，除非用户指定了 · 以外的套接字类型。
        + 触发此事件后，请求的套接字将没有 'data' 事件监听器，这意味着它需要绑定才能处理发送到该套接字上的服务器的数据。
    + 'upgrade' 事件 每次客户端请求 HTTP 升级时发出。 监听此事件是可选的，客户端无法坚持更改协议。
        + `request <http.IncomingMessage>` HTTP 请求的参数，与 'request' 事件中的一样。
        + `socket <stream.Duplex>` 服务器与客户端之间的网络套接字。
        + `head <Buffer>` 升级后的流的第一个数据包（可能为空）。
        + 触发此事件后，请求的套接字将没有 'data' 事件监听器，这意味着它需要绑定才能处理发送到该套接字上的服务器的数据。
        + 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
    + 'request' 事件 每次有请求时都会触发。 每个连接可能有多个请求（在 `HTTP Keep-Alive` 连接的情况下）。
    + 'checkContinue' 事件 每次收到 `HTTP Expect: 100-continue` 的请求时都会触发。 如果未监听此事件，服务器将自动响应 100 Continue。
        + 处理此事件时，如果客户端应继续发送请求主体，则调用 `response.writeContinue()`，如果客户端不应继续发送请求主体，则生成适当的 HTTP 响应（例如 400 Bad Request）。
        + 在触发和处理此事件时，不会触发 'request' 事件。
    + 'checkExpectation' 事件 每次收到带有 HTTP Expect 请求头的请求时触发，其中值不是 `100-continue`。 如果未监听此事件，则服务器将根据需要自动响应 417 Expectation Failed。
        + 在触发和处理此事件时，不会触发 'request' 事件。
    + 'clientError' 事件 如果客户端连接触发 'error' 事件，则会在此处转发。
        + `exception <Error>`
        + `socket <stream.Duplex>` 发生错误的 `net.Socket` 对象
        +  此事件的监听器负责关闭或销毁底层套接字。
        + 此事件保证传入 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
        + 默认行为是尝试使用 `HTTP 400 Bad Request `关闭套接字、或者在 `HPE_HEADER_OVERFLOW` 错误的情况下尝试关闭 `HTTP 431 Request Header Fields Too Large`。 如果套接字不可写，则会被立即销毁。
    + 'close' 事件 每次客户端请求 HTTP

## http.ServerResponse 类
+ #### 属性
    + `response.socket` 指向底层的套接字。 通常用户不需要访问此属性。 特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 'readable' 事件。 在调用 `response.end()` 之后，此属性将为空。 也可以通过 `response.connection` 访问 socket。
    + `response.statusCode` 当使用隐式的响应头时（没有显式地调用 `response.writeHead()`），此属性控制在刷新响应头时将发送到客户端的状态码。响应头发送到客户端后，此属性表示已发送的状态码。
    + `response.statusMessage` 当使用隐式的响应头时（没有显式地调用 `response.writeHead()`），此属性控制在刷新响应头时将发送到客户端的状态消息。 如果保留为 `undefined`，则将使用状态码的标准消息。响应头发送到客户端后，此属性表示已发送的状态消息。
    + `response.writableEnded` 在调用 `response.end()` 之后为 true。 此属性不表明数据是否已刷新，对于这种应该使用 `response.writableFinished`。
    + `response.writableFinished` 如果在触发 'finish' 事件之前，所有数据都已刷新到底层的系统，则为 true。
    + `response.headersSent`  如果已发送响应头，则为 true，否则为 false。
    + `response.sendDate` 如果为 true，则 Date 响应头将自动生成并在响应中发送（如果响应头中尚不存在）。 默认为 true。这应该仅在测试时才禁用，HTTP 响应需要 Date 响应头。

+ #### 方法
    + `response.hasHeader(name)` 如果当前在传出的响应头中设置了由 name 标识的响应头，则返回 true。 响应头名称匹配不区分大小写。
    + `response.getHeader(name)` 读出已排队但未发送到客户端的响应头。 该名称不区分大小写。 返回值的类型取决于提供给 `response.setHeader()` 的参数。
    + `response.getHeaderNames()` 返回一个数组，其中包含当前传出的响应头的唯一名称。 所有响应头名称都是小写的。
    + `response.getHeaders()` 返回当前传出的响应头的浅拷贝。 由于使用浅拷贝，因此可以更改数组的值而无需额外调用各种与响应头相关的 http 模块方法。 返回对象的键是响应头名称，值是各自的响应头值。 所有响应头名称都是小写的。
        + `response.getHeaders()` 方法返回的对象不是从 JavaScript Object 原型继承的。 这意味着典型的 Object 方法，如 `obj.toString()`、 `obj.hasOwnProperty()` 等都没有定义并且不起作用。
    + `response.setHeader(name, value)` 为隐式响应头设置单个响应头的值。 如果此响应头已存在于待发送的响应头中，则其值将被替换。 在这里可以使用字符串数组来发送具有相同名称的多个响应头。 非字符串值将被原样保存。 因此 `response.getHeader()` 可能返回非字符串值。 但是非字符串值将转换为字符串以进行网络传输。
        + 尝试设置包含无效字符的响应头字段名称或值将导致抛出 `TypeError`。
        + 当使用 `response.setHeader()` 设置响应头时，它们将与传给 `response.writeHead()` 的任何响应头合并，其中 `response.writeHead()` 的响应头优先。
        + 如果调用了 `response.writeHead()` 方法并且尚未调用此方法，则它将直接将提供的响应头值写入网络通道而不在内部进行缓存，并且响应头上的 `response.getHeader()` 将不会产生预期的结果。 如果需要渐进的响应头填充以及将来可能的检索和修改，则使用 response.setHeader() 而不是 `response.writeHead()`。
    + `response.addTrailers(headers)` 将 HTTP 尾部响应头（一种在消息末尾的响应头）添加到响应中。
        + 只有在使用分块编码进行响应时才会发出尾部响应头; 如果不是（例如，如果请求是 HTTP/1.0），它们将被静默丢弃。
        + HTTP 需要发送 Trailer 响应头才能发出尾部响应头，并在其值中包含响应头字段列表。
        + 尝试设置包含无效字符的响应头字段名称或值将导致抛出 TypeError。
    + `response.removeHeader(name)` 移除排队等待中的隐式发送的响应头。
    + `response.flushHeaders()` 刷新响应头
    + `response.setTimeout(msecs[, callback])` 将套接字的超时值设置为 msecs。 如果提供了回调，则会将其作为监听器添加到响应对象上的 'timeout' 事件中。
        + 如果没有 'timeout' 监听器添加到请求、响应、或服务器，则套接字在超时时将被销毁。 如果有回调处理函数分配给请求、响应、或服务器的 'timeout' 事件，则必须显式处理超时的套接字。
    + `response.writeHead(statusCode[, statusMessage][, headers])` 向请求发送响应头。
        + `statusCode <number>` 一个 3 位的 HTTP 状态码
        + `statusMessage <string>`
        + `headers <Object>` 响应头
        + 返回: `<http.ServerResponse>` 返回对 ServerResponse 的引用，以便可以链式调用。
        + 此方法只能在消息上调用一次，并且必须在调用 `response.end()` 之前调用。
        + 如果在调用此方法之前调用了 `response.write()` 或 `response.end()`，则将计算隐式或可变的响应头并调用此函数。
        + 当使用 `response.setHeader()` 设置响应头时，则与传给 `response.writeHead()` 的任何响应头合并，且 `response.writeHead()` 的优先。
        + 如果调用此方法并且尚未调用 `response.setHeader()`，则直接将提供的响应头值写入网络通道而不在内部进行缓存，响应头上的 `response.getHeader()` 将不会产生预期的结果。 如果需要渐进的响应头填充以及将来可能的检索和修改，则改用 `response.setHeader()`。
        + `Content-Length` 以字节而非字符为单位。 使用 `Buffer.byteLength()` 来判断主体的长度（以字节为单位）。 Node.js 不检查 `Content-Length` 和已传输的主体的长度是否相等。
        + 尝试设置包含无效字符的响应头字段名称或值将导致抛出 `TypeError`。
    + `response.write(chunk[, encoding][, callback])`
        + `chunk <string> | <Buffer>`
        + `encoding <string>` 默认值: 'utf8'。
        + `callback <Function>`
        + 返回: `<boolean>`
        + 如果调用此方法并且尚未调用 `response.writeHead()`，则将切换到隐式响应头模式并刷新隐式响应头。
        + 这会发送一块响应主体。 可以多次调用该方法以提供连续的响应主体片段。
        + 在 http 模块中，当请求是 HEAD 请求时，则省略响应主体。 同样地， 204 和 304 响应不得包含消息主体。
        + chunk 可以是字符串或 buffer。 如果 chunk 是一个字符串，则第二个参数指定如何将其编码为字节流。 当刷新此数据块时将调用 callback。
        + 这是原始的HTTP正文，与可能使用的高级多部分正文编码无关。
        + 第一次调用 response.write() 时，它会将缓冲的响应头信息和主体的第一个数据块发送给客户端。 第二次调用 response.write() 时，Node.js 假定数据将被流式传输，并单独发送新数据。 也就是说，响应被缓冲到主体的第一个数据块。
        + 如果将整个数据成功刷新到内核缓冲区，则返回 true。 如果全部或部分数据在用户内存中排队，则返回 false。 当缓冲区再次空闲时，则触发 'drain' 事件。
    + `response.writeContinue()` 向客户端发送 HTTP/1.1 100 Continue 消息，表示应发送请求主体。
    + `response.writeProcessing()` 向客户端发送 `HTTP/1.1 102` 处理消息，表明可以发送请求主体。
    + `response.cork()` 强制把所有写入的数据都缓冲到内存中
    + `response.uncork()` 将调用 `response.cork()` 后缓冲的所有数据输出到目标。
    + `response.end([data[, encoding]][, callback])` 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 `response.end()` 方法。
        + `data <string> | <Buffer>`
        + `encoding <string>`
        + `callback <Function>`
        + 返回: `<this>`
        + 如果指定了 data，则相当于调用 `response.write(data, encoding)` 之后再调用 `response.end(callback)`。
        + 如果指定了 callback，则当响应流完成时将调用它。

+ #### 事件
    + 'close' 事件 表明底层的连接已被终止
    + 'finish' 事件 响应发送后触发。 更具体地说，当响应头和主体的最后一段已经切换到操作系统以通过网络传输时，触发该事件。 这并不意味着客户端已收到任何信息。

## http.IncomingMessage 类
+ #### 属性
    + `message.url` 请求的 URL 字符串。 它仅包含实际的 HTTP 请求中存在的 URL。仅对从 `http.Server` 获取的请求有效。
    + `message.method` 请求方法为字符串。 只读。仅对从 http.Server 获取的请求有效。
    + `message.httpVersion` 在服务器请求情况下，表示客户端发送的 HTTP 版本。 在客户端响应的情况下，表示连接到的服务器的 HTTP 版本。 
        + `message.httpVersionMajor` 是第一个整数
        + `message.httpVersionMinor` 是第二个整数
    + `message.headers` 请求或响应的消息头对象。
        + 消息头的名称和值的键值对。 消息头的名称都是小写的。
        + 原始消息头中的重复项会按以下方式处理，具体取决于消息头的名称
            + 重复的 `age`、 `authorization`、 `content-length`、 `content-type`、 `etag`、 `expires`、 `from`、 `host`、 `if-modified-since`、 `if-unmodified-since`、 `last-modified`、 `location`、 `max-forwards`、 `proxy-authorization`、 `referer`、 `retry-after`、 `server` 或 `user-agent` 会被丢弃。
            + `set-cookie` 始终是一个数组。重复项都会添加到数组中。对于重复的 cookie 消息头，其值会使用与 '; ' 连接到一起。
            + 对于所有其他消息头，其值会使用 ', ' 连接到一起。
    + `message.rawHeaders` 原始请求头/响应头的列表，与接收到的完全一致。
        + 键和值位于同一列表中。 它不是元组列表。 因此，偶数偏移是键值，奇数偏移是关联的值。
        + 消息头名称不是小写的，并且不会合并重复项。
    + `message.trailers` 请求/响应的尾部消息头对象。 仅在 'end' 事件中填充。
    + `message.rawTrailers` 原始的请求/响应的尾部消息头的键和值，与接收到的完全一致。 仅在 'end' 事件中填充。
    + `message.statusCode` 3 位 HTTP 响应状态码。仅对从 `http.ClientRequest` 获取的响应有效。
    + `message.statusMessage` HTTP 响应状态消息（原因短语）。仅对从 `http.ClientRequest` 获取的响应有效。
    + `message.socket` 与连接关联的 net.Socket 对象
        + 通过 HTTPS 的支持，使用 `request.socket.getPeerCertificate()` 获取客户端的身份验证详细信息。
        + 此属性保证是 `<net.Socket>` 类（`<stream.Duplex>` 的子类）的实例，除非用户指定了 `<net.Socket>` 以外的套接字类型。
    + `message.complete` 此属性可用于判断客户端或服务器在连接终止之前是否完全传输消息。如果已收到并成功解析完整的 HTTP 消息，则 `message.complete` 属性将为 true。
    + `message.aborted` 如果请求已中止，则 `message.aborted` 属性为 true。
+ #### 方法
    + `message.setTimeout(msecs[, callback])`
        + 调用 `message.connection.setTimeout(msecs, callback)`。
    + `message.destroy([error])` 在接收到 IncomingMessage 的套接字上调用 destroy()。如果提供了 error，则会在套接字上触发 'error' 事件，并将 error 作为参数传给该事件上的所有监听器。
+ #### 事件
    + 'aborted' 事件 当请求中止时触发。
    + 'close' 事件 表明底层连接已关闭。

+ `http.METHODS` 解析器支持的 HTTP 方法列表。
+ `http.STATUS_CODES` 所有标准 HTTP 响应状态码的集合，以及每个状态码的简短描述。
+ `http.maxHeaderSize` 只读属性，HTTP 消息头的最大允许大小（以字节为单位）。 默认为 8KB。
    + 可使用 `--max-http-header-size` 命令行选项进行配置。
    + 通过传入 `maxHeaderSize` 选项，可以为服务器和客户端的请求重写此值。
+ `http.globalAgent` Agent 的全局实例，作为所有 HTTP 客户端请求的默认值。
+ `http.createServer([options][, requestListener])`
    + `options <Object>`
        + `IncomingMessage <http.IncomingMessage>` 指定要使用的 IncomingMessage 类。用于扩展原始的 IncomingMessage。默认值: IncomingMessage。
        + `ServerResponse <http.ServerResponse>` 指定要使用的 ServerResponse 类。用于扩展原始的 ServerResponse。默认值: ServerResponse。
        + `insecureHTTPParser <boolean>` 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 请求头。应避免使用不安全的解析器。默认值: false。
        + `maxHeaderSize <number>` 可选地，重写此服务器接收的请求的 请求头的最大长度（以字节为单位）。 默认值: 16384（16KB）。
    + `requestListener <Function>` 自动添加到 'request' 事件的函数
    + 返回: `<http.Server>`
+ `http.get(options[, callback])`、`http.get(url[, options][, callback])`
有主体的 GET 请求的便捷方法
    + `url <string> | <URL>`
    + `options <Object>` 接受与 `http.request()` 相同的 options，且 method 始终设置为 GET。从原型继承的属性将被忽略。
    + `callback <Function>` callback 调用时只有一个参数，该参数是 `http.IncomingMessage` 的实例。
    + 返回: `<http.ClientRequest>`
    + 与 `http.request()` 的唯一区别是它将方法设置为 GET 并自动调用 `req.end()`
    + 回调必须注意消费响应数据
+ `http.request(options[, callback])`、`http.request(url[, options][, callback])`
    + `url <string> | <URL>`
    + `options <Object>`
    + `agent <http.Agent> | <boolean>` 控制 Agent 的行为。可能的值有：
        + undefined (默认): 对此主机和端口使用 http.globalAgent。
        + Agent 对象: 显式地使用传入的 Agent。
        + false: 使用新建的具有默认值的 Agent。
    + `auth <string>` 基本的身份验证，即 'user:password'，用于计算授权请求头。
    + `createConnection <Function>` 当 agent 选项未被使用时，用来为请求生成套接字或流的函数。这可用于避免创建自定义的 Agent 类以覆盖默认的 createConnection 函数。任何双工流都是有效的返回值。
    + `defaultPort <number>` 协议的默认端口。 如果使用 Agent，则默认值为 agent.defaultPort，否则为 undefined。
    + `family <number>` 当解析 host 或 hostname 时使用的 IP 地址族。有效值为 4 或 6。如果没有指定，则同时使用 IP v4 和 v6。
    + `headers <Object>` 包含请求头的对象。
    + `host <string>` 请求发送至的服务器的域名或 IP 地址。默认值: 'localhost'。
    + `hostname <string>` host 的别名。为了支持 `url.parse()`，如果同时指定 host 和 hostname，则使用 hostname。
    + `insecureHTTPParser <boolean>` 使用不安全的 HTTP 解析器，当为 true 时接受无效的 HTTP 请求头。应避免使用不安全的解析器。默认值: false。
    + `localAddress <string>` 为网络连接绑定的本地接口。
    + `lookup <Function>` 自定义的查找函数。 默认值: `dns.lookup()`。
    + `maxHeaderSize <number>` 可选地，重写此服务器接收的请求的 `--max-http-header-size` 值，即请求头的最大长度（以字节为单位）。 默认值: 16384（16KB）。
    + `method <string>` 一个字符串，指定 HTTP 请求的方法。默认值: 'GET'。
    + `path <string>` 请求的路径。应包括查询字符串（如果有）。当请求的路径包含非法的字符时，则抛出异常。目前只有空格被拒绝，但未来可能会有所变化。默认值: '/'。
    + `port <number>` 远程服务器的端口。默认值: defaultPort（如果有设置）或 80。
    + `protocol <string>` 使用的协议。默认值: 'http:'。
    + `setHost <boolean>`: 指定是否自动添加 Host 请求头。默认值: true。
    + `socketPath <string>` Unix 域套接字。如果指定了 host 或 port 之一（它们指定了 TCP 套接字），则不能使用此选项。
    + `timeout <number>`: 指定套接字超时的数值，以毫秒为单位。这会在套接字被连接之前设置超时。
    + `callback <Function>` 作为单次监听器被添加到 'response' 事件。
    + 返回: `<http.ClientRequest>`

url 可以是字符串或 URL 对象。 如果 url 是一个字符串，则会自动使用 [url.URL()] 解析它。 如果它是一个 URL 对象，则会自动转换为普通的 options 对象。

如果同时指定了 url 和 options，则对象会被合并，其中 options 属性优先。

 使用 `http.request()` 时，必须始终调用 `req.end()` 来表示请求的结束，即使没有数据被写入请求主体。

如果在请求期间遇到任何错误（DNS 解析错误、TCP 层的错误、或实际的 HTTP 解析错误），则会在返回的请求对象上触发 'error' 事件。 与所有 'error' 事件一样，如果没有注册监听器，则会抛出错误。

#### 需要注意的一些特殊的请求头:
+ 发送 'Connection: keep-alive' 会通知 Node.js 与服务器的连接应该持续到下一个请求。
+ 发送 'Content-Length' 请求头会禁用默认的分块编码。
+ 发送 'Expect' 请求头会立即发送请求头。通常情况下，当发送 'Expect: 100-continue' 时，应设置超时时间和 'continue' 事件的监听器。详见 RFC 2616 的第 8.2.3 节。
+ 发送授权请求头会使用 auth 选项覆盖以计算基本的身份验证。

#### 在成功的请求中，会按以下顺序触发以下事件：
+ 'socket' 事件
+ 'response' 事件
    + res 对象上任意次数的 'data' 事件（如果响应主体为空，则根本不会触发 'data' 事件，例如在大多数重定向中）
    + res 对象上的 'end' 事件
+ 'close' 事件

#### 如果出现连接错误，则触发以下事件：
+ 'socket' 事件
+ 'error' 事件
+ 'close' 事件

#### 如果收到响应之前过早关闭连接，则按以下顺序触发以下事件：
+ 'socket' 事件
+ 'error' 事件并带上错误信 'Error: socket hang up' 和错误码 'ECONNRESET'
+ 'close' 事件

#### 如果收到响应之后过早关闭连接，则按以下顺序触发以下事件：
+ 'socket' 事件
+ 'response' 事件
    + res 对象上任意次数的 'data' 事件
+ （此处连接已关闭）
+ res 对象上的 'aborted' 事件
+ 'close'
+ res 对象上的 'close' 事件

#### 在分配socket 前调用`req.destroy()`，则按以下顺序触发以下事件：
+ (此处调用`req.destroy()`)
+ 'error' 事件并带上错误信  'Error: socket hang up' 和错误码 'ECONNRESET'
+ 'close' 事件

####  连接成功前调用`req.destroy()`，则按以下顺序触发以下事件：
+ 'socket' 事件
+ (此处调用`req.destroy()`)
+ 'error' 事件并带上错误信  'Error: socket hang up' 和错误码 'ECONNRESET'
+ 'close' 事件

#### 在接收到响应前调用`req.destroy()`，则按以下顺序触发以下事件：
+ 'socket' 事件
+ 'response' 事件
    + res 对象上任意次数的 'data' 事件
+ (此处调用`req.destroy()`)
+ res 对象上的 'aborted' 事件
+ 'close' 事件
+ res 对象上的 'close' 事件

#### 在分配socket 前调用`req.abort()`，则按以下顺序触发以下事件：
+ (此处调用`req.abort()`)
+ 'abort' 事件
+ 'close' 事件

#### 如果在连接成功之前调用 req.abort()，则按以下顺序触发以下事件：
+ 'socket' 事件
+ (在这里调用 req.abort())
+ 'abort' 事件
+ 'error' 事件并带上错误信息 'Error: socket hang up' 和错误码 'ECONNRESET'
+ 'close' 事件

#### 如果在响应被接收之后调用 req.abort()，则按以下顺序触发以下事件：
+ 'socket' 事件
+ 'response' 事件
    + res 对象上任意次数的 'data' 事件
+ (在这里调用 req.abort())
+ 'abort' 事件
+ res 对象上的 'aborted' 事件
+ 'close' 事件
+ res 对象上的 'end' 事件
+ res 对象上的 'close' 事件