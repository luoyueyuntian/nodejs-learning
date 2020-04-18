<ul>
<li>http
<ul>
<ul>
<li>http.Agent 类
<ul>
<ul>
<li>new Agent([options])</li>
<li>agent.createConnection(options[, callback])</li>
<li>agent.keepSocketAlive(socket)</li>
<li>agent.reuseSocket(socket, request)</li>
<li>agent.destroy()</li>
<li>agent.freeSockets</li>
<li>agent.getName(options)</li>
<li>agent.maxFreeSockets</li>
<li>agent.maxSockets</li>
<li>agent.requests</li>
<li>agent.sockets</li>
</ul>
</ul>
</li>
<li>http.ClientRequest 类
<ul>
<ul>
<li>'abort' 事件</li>
<li>'connect' 事件</li>
<li>'continue' 事件</li>
<li>'response' 事件</li>
<li>'socket' 事件</li>
<li>Event: 'timeout'</li>
<li>'upgrade' 事件</li>
<li>request.abort()</li>
<li>request.aborted</li>
<li>request.connection</li>
<li>request.end([data[, encoding]][, callback])</li>
<li>request.flushHeaders()</li>
<li>request.getHeader(name)</li>
<li>request.removeHeader(name)</li>
<li>request.setHeader(name, value)</li>
<li>request.setNoDelay([noDelay])</li>
<li>request.setSocketKeepAlive([enable][, initialDelay])</li>
<li>request.setTimeout(timeout[, callback])</li>
<li>request.socket</li>
<li>request.write(chunk[, encoding][, callback])</li>
</ul>
</ul>
</li>
<li>http.Server 类
<ul>
<ul>
<li>'checkContinue' 事件</li>
<li>'checkExpectation' 事件</li>
<li>'clientError' 事件</li>
<li>'close' 事件</li>
<li>'connect' 事件</li>
<li>'connection' 事件</li>
<li>'request' 事件</li>
<li>'upgrade' 事件</li>
<li>server.close([callback])</li>
<li>server.listen()</li>
<li>server.listening</li>
<li>server.maxHeadersCount</li>
<li>server.setTimeout([msecs][, callback])</li>
<li>server.timeout</li>
<li>server.keepAliveTimeout</li>
</ul>
</ul>
</li>
<li>http.ServerResponse 类
<ul>
<ul>
<li>'close' 事件</li>
<li>'finish' 事件</li>
<li>response.addTrailers(headers)</li>
<li>response.connection</li>
<li>response.end([data][, encoding][, callback])</li>
<li>response.finished</li>
<li>response.getHeader(name)</li>
<li>response.getHeaderNames()</li>
<li>response.getHeaders()</li>
<li>response.hasHeader(name)</li>
<li>response.headersSent</li>
<li>response.removeHeader(name)</li>
<li>response.sendDate</li>
<li>response.setHeader(name, value)</li>
<li>response.setTimeout(msecs[, callback])</li>
<li>response.socket</li>
<li>response.statusCode</li>
<li>response.statusMessage</li>
<li>response.write(chunk[, encoding][, callback])</li>
<li>response.writeContinue()</li>
<li>response.writeHead(statusCode[, statusMessage][, headers])</li>
</ul>
</ul>
</li>
<li>http.IncomingMessage 类
<ul>
<ul>
<li>'aborted' 事件</li>
<li>'close' 事件</li>
<li>message.destroy([error])</li>
<li>message.headers</li>
<li>message.httpVersion</li>
<li>message.method</li>
<li>message.rawHeaders</li>
<li>message.rawTrailers</li>
<li>message.setTimeout(msecs, callback)</li>
<li>message.socket</li>
<li>message.statusCode</li>
<li>message.statusMessage</li>
<li>message.trailers</li>
<li>message.url</li>
</ul>
</ul>
</li>
<li>http.METHODS</li>
<li>http.STATUS_CODES</li>
<li>http.createServer([requestListener])</li>
<li>http.get(options[, callback])</li>
<li>http.globalAgent</li>
<li>http.request(options[, callback])</li>
</ul>
</ul>
</li>
</ul>
