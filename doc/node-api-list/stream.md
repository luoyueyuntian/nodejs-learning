<ul>
<li>stream (流)
<ul>
<ul>
<li>本文档的组织</li>
<li>流的类型
<ul>
<ul>
<li>对象模式</li>
<li>缓冲</li>
</ul>
</ul>
</li>
<li>流消费者的 API
<ul>
<ul>
<li>可写流
<ul>
<ul>
<li>stream.Writable 类
<ul>
<ul>
<li>'close' 事件</li>
<li>'drain' 事件</li>
<li>'error' 事件</li>
<li>'finish' 事件</li>
<li>'pipe' 事件</li>
<li>'unpipe' 事件</li>
<li>writable.cork()</li>
<li>writable.end([chunk][, encoding][, callback])</li>
<li>writable.setDefaultEncoding(encoding)</li>
<li>writable.uncork()</li>
<li>writable.write(chunk[, encoding][, callback])</li>
<li>writable.destroy([error])</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
<li>可读流
<ul>
<ul>
<li>两种模式</li>
<li>三种状态</li>
<li>选择一种</li>
<li>stream.Readable 类
<ul>
<ul>
<li>'close' 事件</li>
<li>'data' 事件</li>
<li>'end' 事件</li>
<li>'error' 事件</li>
<li>'readable' 事件</li>
<li>readable.isPaused()</li>
<li>readable.pause()</li>
<li>readable.pipe(destination[, options])</li>
<li>readable.read([size])</li>
<li>readable.resume()</li>
<li>readable.setEncoding(encoding)</li>
<li>readable.unpipe([destination])</li>
<li>readable.unshift(chunk)</li>
<li>readable.wrap(stream)</li>
<li>readable.destroy([error])</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
<li>Duplex 流与 Transform 流
<ul>
<ul>
<li>stream.Duplex 类</li>
<li>stream.Transform 类
<ul>
<ul>
<li>transform.destroy([error])</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
<li>API for Stream Implementers
<ul>
<ul>
<li>Simplified Construction</li>
<li>Implementing a Writable Stream
<ul>
<ul>
<li>Constructor: new stream.Writable([options])</li>
<li>writable._write(chunk, encoding, callback)</li>
<li>writable._writev(chunks, callback)</li>
<li>writable._destroy(err, callback)</li>
<li>writable._final(callback)</li>
<li>Errors While Writing</li>
<li>一个可写流的例子</li>
</ul>
</ul>
</li>
<li>Implementing a Readable Stream
<ul>
<ul>
<li>new stream.Readable([options])</li>
<li>readable._read(size)</li>
<li>readable._destroy(err, callback)</li>
<li>readable.push(chunk[, encoding])</li>
<li>Errors While Reading</li>
<li>一个数流的例子</li>
</ul>
</ul>
</li>
<li>Implementing a Duplex Stream
<ul>
<ul>
<li>new stream.Duplex(options)</li>
<li>An Example Duplex Stream</li>
<li>Object Mode Duplex Streams</li>
</ul>
</ul>
</li>
<li>Implementing a Transform Stream
<ul>
<ul>
<li>new stream.Transform([options])</li>
<li>Events: 'finish' and 'end'</li>
<li>transform._flush(callback)</li>
<li>transform._transform(chunk, encoding, callback)</li>
<li>Class: stream.PassThrough</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
<li>Additional Notes
<ul>
<ul>
<li>Compatibility with Older Node.js Versions</li>
<li>readable.read(0)</li>
<li>readable.push('')</li>
<li>highWaterMark discrepency after calling readable.setEncoding()</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
</ul>
