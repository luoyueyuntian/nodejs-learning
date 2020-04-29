# stream（流）
流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。

流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。

<pre><code>// 访问 stream 模块： 
const stream = require('stream');</code></pre>

### 四种基本的流类型
+ `Writable` - 可写入数据的流（例如 `fs.createWriteStream()`）。
+ `Readable` - 可读取数据的流（例如 `fs.createReadStream()`）。
+ `Duplex` - 可读又可写的流（例如 `net.Socket`）。
+ `Transform` - 在读写过程中可以修改或转换数据的 Duplex 流（例如 `zlib.createDeflate()`）。

> #### 对象模式
> Node.js 创建的流都是运作在字符串和 Buffer（或 Uint8Array）上。 当然，流的实现也可以使用其它类型的 JavaScript 值（除了 null）。 这些流会以“对象模式”进行操作。
> 当创建流时，可以使用 objectMode 选项把流实例切换到对象模式。 将已存在的流切换到对象模式是不安全的。

> #### 缓冲
> 可写流和可读流都会在内部的缓冲器中存储数据，可以分别使用的 `writable.writableBuffer` 或 `readable.readableBuffer` 来获取。<br/>
> 可缓冲的数据大小取决于传入流构造函数的 `highWaterMark` 选项。 对于普通的流， `highWaterMark` 指定了字节的总数。 对于对象模式的流， `highWaterMark` 指定了对象的总数。<br/>
> 当调用 `stream.push(chunk)` 时，数据会被缓冲在可读流中。 如果流的消费者没有调用 `stream.read()`，则数据会保留在内部队列中直到被消费。<br/>
> 一旦内部的可读缓冲的总大小达到 `highWaterMark` 指定的阈值时，流会暂时停止从底层资源读取数据，直到当前缓冲的数据被消费 （也就是说，流会停止调用内部的用于填充可读缓冲的 `readable._read()`）。<br/>
> 当调用 `writable.write(chunk)` 时，数据会被缓冲在可写流中。 当内部的可写缓冲的总大小小于 `highWaterMark` 设置的阈值时，调用 `writable.write()` 会返回 true。 一旦内部缓冲的大小达到或超过 `highWaterMark` 时，则会返回 false。<br/>
> stream API 的主要目标，特别是 `stream.pipe()`，是为了限制数据的缓冲到可接受的程度，也就是读写速度不一致的源头与目的地不会压垮内存。<br/>
> 因为 `Duplex` 和 `Transform` 都是可读又可写的，所以它们各自维护着两个相互独立的内部缓冲器用于读取和写入， 这使得它们在维护数据流时，读取和写入两边可以各自独立地运作。 例如，`net.Socket` 实例是 `Duplex` 流，它的可读端可以消费从 socket 接收的数据，而可写端则可以将数据写入到 socket。 因为数据写入到 socket 的速度可能比接收数据的速度快或者慢，所以读写两端应该独立地进行操作（或缓冲）。

## 可读流
可读流是对提供数据的来源的一种抽象。所有可读流都实现了 stream.Readable 类定义的接口。

#### 两种读取模式
可读流运作于两种模式之一：流动模式（flowing）或暂停模式（paused）。 这些模式独立与对象模式。 无论是否处于流动模式或暂停模式，可读流都可以处于对象模式。

在流动模式中，数据自动从底层系统读取，并通过 EventEmitter 接口的事件尽可能快地被提供给应用程序。

在暂停模式中，必须显式调用 `stream.read()` 读取数据块。

所有可读流都开始于暂停模式，可以通过以下方式切换到流动模式：
+ 添加 'data' 事件句柄。
+ 调用 `stream.resume()` 方法。
+ 调用 `stream.pipe()` 方法将数据发送到可写流。
+ 可读流可以通过以下方式切换回暂停模式：

如果没有管道目标，则调用 `stream.pause(`)。

如果有管道目标，则移除所有管道目标。调用 `stream.unpipe()` 可以移除多个管道目标。

只有提供了消费或忽略数据的机制后，可读流才会产生数据。 如果消费的机制被禁用或移除，则可读流会停止产生数据。

为了向后兼容，移除 'data' 事件句柄不会自动地暂停流。 如果有管道目标，一旦目标变为 drain 状态并请求接收数据时，则调用 `stream.pause()` 也不能保证流会保持暂停模式。

如果可读流切换到流动模式，且没有可用的消费者来处理数据，则数据将会丢失。 例如，当调用 `readable.resume()` 时，没有监听 'data' 事件或 'data' 事件句柄已移除。

添加 'readable' 事件句柄会使流自动停止流动，并通过 `readable.read()` 消费数据。 如果 'readable' 事件句柄被移除，且存在 'data' 事件句柄，则流会再次开始流动。

#### 三种状态
可读流的两种模式是对发生在可读流中更加复杂的内部状态管理的一种简化的抽象。

在任意时刻，可读流会处于以下三种状态之一：
+ readable.readableFlowing === null
+ readable.readableFlowing === false
+ readable.readableFlowing === true

当 readable.readableFlowing 为 null 时，没有提供消费流数据的机制，所以流不会产生数据。 在这个状态下，监听 'data' 事件、调用 readable.pipe()、或调用 readable.resume() 都会使 readable.readableFlowing 切换到 true，可读流开始主动地产生数据并触发事件。

调用 readable.pause()、 readable.unpipe()、或接收到背压，则 readable.readableFlowing 会被设为 false，暂时停止事件流动但不会停止数据的生成。 在这个状态下，为 'data' 事件绑定监听器不会使 readable.readableFlowing 切换到 true。

当 readable.readableFlowing 为 false 时，数据可能会堆积在流的内部缓冲中。

### stream.Readable 类
#### 属性
+ `readable.readable` 如果可以安全地调用 readable.read()（这意味着流没有被破坏或触发 'error' 或 'end'），则为 true。
+ `readable.readableObjectMode` 获取用于给定可读流的 objectMode 属性。
+ `readable.readableHighWaterMark` 构造可读流时传入的 highWaterMark 的值。
readable.readableEncoding 获取用于给定可读流的 encoding 属性。 可以使用 readable.setEncoding() 方法设置 encoding 属性。
+ `readable.readableLength` 此属性包含准备读取的队列中的字节数（或对象数）。 该值提供有关 highWaterMark 状态的内省数据。
+ `readable.readableEnded` 当 'end' 事件被触发时变为 true。
+ `readable.readableFlowing`
+ `readable.destroyed` 在调用 readable.destroy() 之后为 true。

#### 方法
+ `readable.setEncoding(encoding)`
+ `readable.pipe(destination[, options])`
+ `readable.unpipe([destination])`
+ `readable.read([size])`
+ `readable.unshift(chunk[, encoding])`
+ `readable.wrap(stream)`
+ `readable[Symbol.asyncIterator]()`
+ `readable.pause()`
+ `readable.resume()`
+ `readable.isPaused()`
+ `readable.destroy([error])`

#### 事件
+ 'close' 事件
    + 当流或其底层资源（比如文件描述符）被关闭时触发 'close' 事件。 该事件表明不会再触发其他事件，也不会再发生操作。
    + 如果使用 emitClose 选项创建可读流，则它将会始终发出 'close' 事件。
+ 'data' 事件
    + 当流将数据块传送给消费者后触发。 当调用 readable.pipe()， readable.resume() 或绑定监听器到 'data' 事件时，流会转换到流动模式。 当调用 readable.read() 且有数据块返回时，也会触发 'data' 事件。
    + 将 'data' 事件监听器附加到尚未显式暂停的流将会使流切换为流动模式。 数据将会在可用时立即传递。
    + 如果使用 readable.setEncoding() 为流指定了默认的字符编码，则监听器回调传入的数据为字符串，否则传入的数据为 Buffer。
+ 'end' 事件
    + 当流中没有数据可供消费时触发。
    + 'end' 事件只有在数据被完全消费掉后才会触发。 要想触发该事件，可以将流转换到流动模式，或反复调用 stream.read() 直到数据被消费完。
+ 'error' 事件
    + 'error' 事件可能随时由 Readable 实现触发。 通常，如果底层的流由于底层内部的故障而无法生成数据，或者流的实现尝试推送无效的数据块，则可能会发生这种情况。
    + 监听器回调将会传入一个 Error 对象。
+ 'pause' 事件
    + 当调用 stream.pause() 并且 readsFlowing 不为 false 时，就会触发 'pause' 事件。
+ 'readable' 事件
    + 当有数据可从流中读取时，就会触发 'readable' 事件。 在某些情况下，为 'readable' 事件附加监听器将会导致将一些数据读入内部缓冲区。
    + 当到达流数据的尽头时， 'readable' 事件也会触发，但是在 'end' 事件之前触发。
    + 'readable' 事件表明流有新的动态：要么有新的数据，要么到达流的尽头。 对于前者，stream.read() 会返回可用的数据。 对于后者，stream.read() 会返回 null。
    + 通常情况下， readable.pipe() 和 'data' 事件的机制比 'readable' 事件更容易理解。 处理 'readable' 事件可能造成吞吐量升高。
    + 如果同时使用 'readable' 事件和 'data' 事件，则 'readable' 事件会优先控制流，也就是说，当调用 stream.read() 时才会触发 'data' 事件。 readableFlowing 属性会变成 false。 当移除 'readable' 事件时，如果存在 'data' 事件监听器，则流会开始流动，也就是说，无需调用 .resume() 也会触发 'data' 事件。
+ 'resume' 事件
    + 当调用 stream.resume() 并且 readsFlowing 不为 true 时，将会触发 'resume' 事件。


## 可写流
可写流是对数据要被写入的目的地的一种抽象。所有可写流都实现了 stream.Writable 类定义的接口。

### stream.Writable 类


writable.writable
writable.writableObjectMode
writable.writableHighWaterMark
writable.writableLength
writable.writableCorked
writable.writableEnded
writable.writableFinished
writable.destroyed
writable.cork()
writable.destroy([error])
writable.end([chunk[, encoding]][, callback])
writable.setDefaultEncoding(encoding)
writable.uncork()
writable.write(chunk[, encoding][, callback])
'close' 事件
'drain' 事件
'error' 事件
'finish' 事件
'pipe' 事件
'unpipe' 事件

## 双工流与转换流

### stream.Duplex 类

### stream.Transform 类
    transform.destroy([error])
## 实用函数

stream.finished(stream[, options], callback)
stream.pipeline(source[, ...transforms], destination, callback)
stream.Readable.from(iterable, [options])










