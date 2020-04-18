<ul>
<li>net (网络)
<ul>
<ul>
<li>IPC Support
<ul>
<ul>
<li>Identifying paths for IPC connections</li>
</ul>
</ul>
</li>
<li>net.Server 类
<ul>
<ul>
<li>new net.Server([options][, connectionListener])</li>
<li>'close' 事件</li>
<li>'connection' 事件</li>
<li>'error' 事件</li>
<li>'listening' 事件</li>
<li>server.address()</li>
<li>server.close([callback])</li>
<li>server.getConnections(callback)</li>
<li>server.listen()
<ul>
<ul>
<li>server.listen(handle[, backlog][, callback])</li>
<li>server.listen(options[, callback])</li>
<li>server.listen(path[, backlog][, callback])</li>
<li>server.listen([port][, host][, backlog][, callback])</li>
</ul>
</ul>
</li>
<li>server.listening</li>
<li>server.maxConnections</li>
<li>server.ref()</li>
<li>server.unref()</li>
</ul>
</ul>
</li>
<li>net.Socket 类
<ul>
<ul>
<li>new net.Socket([options])</li>
<li>'close' 事件</li>
<li>'connect' 事件</li>
<li>'data' 事件</li>
<li>'drain' 事件</li>
<li>'end' 事件</li>
<li>'error' 事件</li>
<li>'lookup' 事件</li>
<li>'timeout' 事件</li>
<li>socket.address()</li>
<li>socket.bufferSize</li>
<li>socket.bytesRead</li>
<li>socket.bytesWritten</li>
<li>socket.connect()
<ul>
<ul>
<li>socket.connect(options[, connectListener])</li>
<li>socket.connect(path[, connectListener])</li>
<li>socket.connect(port[, host][, connectListener])</li>
</ul>
</ul>
</li>
<li>socket.connecting</li>
<li>socket.destroy([exception])</li>
<li>socket.destroyed</li>
<li>socket.end([data][, encoding])</li>
<li>socket.localAddress</li>
<li>socket.localPort</li>
<li>socket.pause()</li>
<li>socket.ref()</li>
<li>socket.remoteAddress</li>
<li>socket.remoteFamily</li>
<li>socket.remotePort</li>
<li>socket.resume()</li>
<li>socket.setEncoding([encoding])</li>
<li>socket.setKeepAlive([enable][, initialDelay])</li>
<li>socket.setNoDelay([noDelay])</li>
<li>socket.setTimeout(timeout[, callback])</li>
<li>socket.unref()</li>
<li>socket.write(data[, encoding][, callback])</li>
</ul>
</ul>
</li>
<li>net.connect()
<ul>
<ul>
<li>net.connect(options[, connectListener])</li>
<li>net.connect(path[, connectListener])</li>
<li>net.connect(port[, host][, connectListener])</li>
</ul>
</ul>
</li>
<li>net.createConnection()
<ul>
<ul>
<li>net.createConnection(options[, connectListener])</li>
<li>net.createConnection(path[, connectListener])</li>
<li>net.createConnection(port[, host][, connectListener])</li>
</ul>
</ul>
</li>
<li>net.createServer([options][, connectionListener])</li>
<li>net.isIP(input)</li>
<li>net.isIPv4(input)</li>
<li>net.isIPv6(input)</li>
</ul>
</ul>
</li>
</ul>
