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
+ `readable[Symbol.asyncIterator]()` 

#### 方法
+ `readable.setEncoding(encoding)` 为从可读流读取的数据设置字符编码
    + `encoding <string>` 字符编码。
    + 返回: `<this>`
    + 默认情况下没有设置字符编码，流数据返回的是 Buffer 对象。 如果设置了字符编码，则流数据返回指定编码的字符串。 
    + 可读流将会正确地处理通过流传递的多字节字符，否则如果简单地从流中作为 Buffer 对象拉出，则会被不正确地解码。

+ `readable.read([size])` 从内部缓冲拉取并返回数据
    + `size <number>` 要读取的数据的字节数，size 参数必须小于或等于 1 GB
    + 返回: `<string> | <Buffer> | <null> | <any>` 如果没有可读的数据，则返回 null。 默认情况下， readable.read() 返回的数据是 Buffer 对象，除非使用 readable.setEncoding() 指定字符编码或流处于对象模式。
    + 如果没有指定 size 参数，则返回内部缓冲中的所有数据。
    + 如果无法读取 size 个字节，则除非流已结束，否则将会返回 null，在这种情况下，将会返回内部 buffer 中剩余的所有数据。
    + `readable.read()` 应该只对处于暂停模式的可读流调用。 在流动模式中， `readable.read()` 会自动调用直到内部缓冲的数据完全耗尽。<pre><code>const readable = getReadableStreamSomehow();
readable.on('readable', () => {
  let chunk;
  // while 循环是必需的。 只有在 readable.read() 返回 null 之后，才会触发 'readable'
  while (null !== (chunk = readable.read())) {
    console.log(`接收到 ${chunk.length} 字节的数据`);
  }
});</code></pre>
    + 对象模式下的可读流将会始终从调用 `readable.read(size)` 返回单个子项，而不管 size 参数的值如何。
    + 如果 readable.read() 返回一个数据块，则 'data' 事件也会触发。
    + 在 'end' 事件触发后再调用 stream.read([size]) 会返回 null。 不会引发运行时错误。

+ `readable.pipe(destination[, options])`
    + `destination <stream.Writable>` 数据写入的目标。
    + `options <Object>` 管道选项。
        + `end <boolean>` 当读取器结束时终止写入器。默认值: true。
    + 返回: `<stream.Writable>` 目标可写流，如果是 `Duplex` 流或 `Transform` 流则可以形成管道链。
    + `readable.pipe()` 方法绑定可写流到可读流，将可读流自动切换到流动模式，并将可读流的所有数据推送到绑定的可写流。 数据流会被自动管理，所以即使可读流更快，目标可写流也不会超负荷。
    + 可以在单个可读流上绑定多个可写流。
    + readable.pipe() 会返回目标流的引用，可以对流进行链式地管道操作
    + 默认情况下，当来源可读流触发 'end' 事件时，目标可写流也会调用 `stream.end()` 结束写入。 若要禁用这种默认行为， end 选项应设为 false，这样目标流就会保持打开
    + 如果可读流在处理期间发送错误，则可写流目标不会自动关闭。 如果发生错误，则需要手动关闭每个流以防止内存泄漏。
    + `process.stderr` 和 `process.stdout` 可写流在 Node.js 进程退出之前永远不会关闭，无论指定的选项如何。

+ `readable.unpipe([destination])` 解绑之前使用 stream.pipe() 方法绑定的可写流。
    + `destination <stream.Writable>` 要移除管道的可写流。如果没有指定 destination 则解绑所有管道。如果指定了 destination, 但它没有建立管道，则不起作用。
    + 返回: `<this>`

+ `readable.unshift(chunk[, encoding])` 将数据块推回内部缓冲
    + `chunk <Buffer> | <Uint8Array> | <string> | <null> | <any>` 要推回可读队列的数据块。 对于非对象模式的流， `chunk` 必须是字符串、 `Buffer`、 `Uint8Array` 或 `null`。 对于对象模式的流， `chunk` 可以是任何 `JavaScript` 值。
    + `encoding <string>` 字符串块的编码。 必须是有效的 `Buffer` 编码，例如 'utf8' 或 'ascii'。
    + 将 chunk 作为 null 传递信号表示流的末尾（EOF），其行为与 `readable.push(null)` 相同，之后不能再写入数据。 EOF 信号会被放在 buffer 的末尾，任何缓冲的数据仍将会被刷新。
    + `readable.unshift()` 方法将数据块推回内部缓冲。 可用于以下情景：正被消费中的流需要将一些已经被拉出的数据重置为未消费状态，以便这些数据可以传给其他方。
    + 触发 'end' 事件或抛出运行时错误之后，不能再调用 `stream.unshift()` 方法。
    + 使用 `stream.unshift()` 的开发者可以考虑切换到 Transform 流。
    + 与 `stream.push(chunk) `不同， `stream.unshift(chunk)` 不会通过重置流的内部读取状态来结束读取过程。 如果在读取期间调用 `readable.unshift()`（即从自定义的流上的 stream._read() 实现中调用），则会导致意外结果。 在使用立即的 `stream.push('')` 调用 `readable.unshift()` 之后，将适当地重置读取状态，但最好在执行读取的过程中避免调用 `readable.unshift()`。

+ `readable.wrap(stream)`


+ `readable.pause()` 使流动模式的流停止触发 'data' 事件，并切换出流动模式。 任何可用的数据都会保留在内部缓存中。
    + 如果存在 'readable' 事件监听器，则 readable.pause() 方法不起作用。

+ `readable.resume()` 被暂停的可读流恢复触发 'data' 事件，并将流切换到流动模式。
    + 可以用来充分消耗流中的数据，但无需实际处理任何数据
    + 当存在 'readable' 事件监听器时， `readable.resume()` 方法不起作用。

+ `readable.isPaused()` 返回可读流当前的操作状态。主要用于 readable.pipe() 底层的机制。 大多数情况下无需直接使用该方法。

+ `readable.destroy([error])` 销毁流
    + `error <Error>` 触发 'error' 事件，将'error' 传递给'error' 事件，并触发 'close' 事件（除非将 emitClose 设置为 false）
    + 返回: `<this>`
    + 此调用之后，可读流将会释放所有内部的资源，并且将会忽略对 push() 的后续调用。
    + 一旦调用 destroy()，则不会再执行任何其他操作，并且除了 _destroy 以外的其他错误都不会作为 'error' 触发。

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
#### 属性
+ `writable.writable` 如果调用 `writable.write()` 是安全的（这意味着流没有被破坏、报错、或结束），则为 true
+ `writable.writableObjectMode` 获取用于给定 Writable 流的 objectMode 属性
+ `writable.writableHighWaterMark` 返回构造可写流时传入的 highWaterMark 的值
+ `writable.writableLength` 准备写入的队列中的字节数（或对象）
+ `writable.writableCorked` 输出所有缓冲地数据需要调用`writable.uncork()`地次数
+ `writable.writableEnded` 在调用了 `writable.end()` 之后为 true。 此属性不表明数据是否已刷新，对此请使用 `writable.writableFinished`
+ `writable.writableFinished` 在触发 'finish' 事件之前立即设置为 true
+ `writable.destroyed` 在调用了 `writable.destroy()` 之后为 true。

#### 方法
+ `writable.setDefaultEncoding(encoding)` 为可写流设置默认的 encoding。

+ `writable.write(chunk[, encoding][, callback])`
    + `chunk <string> | <Buffer> | <Uint8Array> | <any>` 要写入的数据。  对于非对象模式的流， chunk 必须是字符串、 Buffer 或 Uint8Array。 对于对象模式的流， chunk 可以是任何 JavaScript 值，除了 null。
    + `encoding <string>` 如果 chunk 是字符串，则指定字符编码。对象模式下的该参数会被忽略
    + `callback <Function>` 当数据块被输出到目标后的回调函数。
    + 返回: `<boolean>` 如果流需要等待 'drain' 事件触发才能继续写入更多数据，则返回 false，否则返回 true。
    + `writable.write()` 写入数据到流，并在数据被完全处理之后调用 callback。 如果发生错误，则 callback 可能被调用也可能不被调用。 为了可靠地检测错误，可以为 'error' 事件添加监听器。 callback 会在触发 'error' 之前被异步地调用。
    + 在接收了 chunk 后，如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true 。 如果返回 false ，则应该停止向流写入数据，直到 'drain' 事件被触发。
    + 当流还未被排空时，调用 write() 会缓冲 chunk，并返回 false。 一旦所有当前缓冲的数据块都被排空了（被操作系统接收并传输），则触发 'drain' 事件。 建议一旦 `write()` 返回 false，则不再写入任何数据块，直到 'drain' 事件被触发。 当流还未被排空时，也是可以调用 `write()`，Node.js 会缓冲所有被写入的数据块，直到达到最大内存占用，这时它会无条件中止。 甚至在它中止之前， 高内存占用将会导致垃圾回收器的性能变差和 RSS 变高（即使内存不再需要，通常也不会被释放回系统）。 如果远程的另一端没有读取数据，TCP 的 socket 可能永远也不会排空，所以写入到一个不会排空的 socket 可能会导致远程可利用的漏洞。
    + 对于 Transform, 写入数据到一个不会排空的流尤其成问题，因为 Transform 流默认会被暂停，直到它们被 pipe 或者添加了 'data' 或 'readable' 事件句柄。
    + 如果要被写入的数据可以根据需要生成或者取得，建议将逻辑封装为一个可读流并且使用 stream.pipe()。 如果要优先调用 write()，则可以使用 'drain' 事件来防止背压与避免内存问题

+ `writable.cork()` 强制把所有写入的数据都缓冲到内存中。当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据才会被输出。
    + 主要目的是为了适应将几个数据快速连续地写入流的情况。 `writable.cork()` 不会立即将它们转发到底层的目标，而是缓冲所有数据块，直到调用 `writable.uncork()`，这会将它们全部传给 `writable._writev()`（如果存在）。 这可以防止出现行头阻塞的情况，在这种情况下，正在等待第一个数据块被处理的同时对数据进行缓冲。 但是，使用 `writable.cork()` 而不实现 `writable._writev()` 可能会对吞吐量产生不利影响

+ `writable.uncork()` `writable.uncork()` 方法将调用 `stream.cork()` 后缓冲的所有数据输出到目标
    + 当使用 `writable.cork()` 和 `writable.uncork()` 来管理流的写入缓冲时，建议使用 `process.nextTick()` 来延迟调用 `writable.uncork()`。 通过这种方式，可以对单个 Node.js 事件循环中调用的所有 `writable.write()` 进行批处理。
    + 如果一个流上多次调用 `writable.cork()`，则必须调用同样次数的 `writable.uncork()` 才能输出缓冲的数据

+ `writable.end([chunk[, encoding]][, callback])`
    + `chunk <string> | <Buffer> | <Uint8Array> | <any>` 要写入的数据。 对于非对象模式的流， chunk 必须是字符串、 Buffer、或 Uint8Array。 对于对象模式的流， chunk 可以是任何 JavaScript 值，除了 null。
    + `encoding <string>` 如果 chunk 是字符串，则指定字符编码。
    + `callback <Function>` 当流结束或报错时的回调函数。
    + 返回: `<this>`
    + 调用 `writable.end()` 表明已没有数据要被写入可写流。 可选的 chunk 和 encoding 参数可以在关闭流之前再写入一块数据。 如果传入了 callback 函数，则会做为监听器添加到 'finish' 事件和 'error' 事件。
    + 调用 `stream.end()` 之后再调用 `stream.write()` 会导致错误。

+ `writable.destroy([error])` 销毁流
    + `error <Error>` 可选，触发 'error'，并且触发 'close' 事件（除非将 emitClose 设置为 false）。
    + 返回: `<this>`
    + 调用该方法后，可写流就结束了，之后再调用 `write()` 或 `end()` 都会导致 `ERR_STREAM_DESTROYED` 错误。 这是销毁流的最直接的方式。 前面对 write() 的调用可能没有耗尽，并且可能触发 `ERR_STREAM_DESTROYED` 错误。 如果数据在关闭之前应该刷新，则使用 end() 而不是销毁，或者在销毁流之前等待 'drain' 事件。
    + 一旦调用 destroy()，则不会再执行任何其他操作，并且除了 _destroy 以外的其他错误都不会作为 'error' 触发。

#### 事件
+ 'close' 事件
    + 当流或其底层资源（比如文件描述符）被关闭时触发。
    + 不会再触发其他事件，也不会再发生操作。
    + 如果使用 emitClose 选项创建可写流，则它将会始终发出 'close' 事件。

+ 'drain' 事件
    + 如果调用 `stream.write(chunk)` 返回 false，则当可以继续写入数据到流时会触发 'drain' 事件

+ 'error' 事件
    + 如果在写入或管道数据时发生错误，则会触发 'error' 事件。 当调用时，监听器回调会传入一个 Error 参数。

+ 'finish' 事件
    + 调用 `stream.end()` 且缓冲数据都已传给底层系统之后触发

+ 'pipe' 事件
    + 参数：`src <stream.Readable>` 通过管道流入到可写流的来源流。
    + 当在可读流上调用 stream.pipe() 方法时会发出 'pipe' 事件，并将此可写流添加到其目标集

+ 'unpipe' 事件
    + 参数：`src <stream.Readable>` 要移除可写流管道的来源流
    + 在可读流上调用 `stream.unpipe()` 方法时会发出 'unpipe'事件，从其目标集中移除此可写流
    + 当可读流通过管道流向可写流发生错误时，也会触发此事件s

## 双工流与转换流
### stream.Duplex 类
双工流（Duplex）是同时实现了 Readable 和 Writable 接口的流。如：`TCP socket``、zlib` 流、`crypto` 流

### stream.Transform 类
转换流（Transform）是一种 Duplex 流，但它的输出与输入是相关联的。 与 Duplex 流一样， Transform 流也同时实现了 Readable 和 Writable 接口。如：`zlib` 流、`crypto` 流
+ `transform.destroy([error])` 销毁流
    + 如果传入了`error`则会触发 'error' 事件
    + 调用该方法后，transform 流会释放全部内部资源
    + 一旦调用 destroy()，则不会再执行任何其他操作，并且除了 _destroy 以外的其他错误都不会作为 'error' 触发。

## 实用函数
### `stream.finished(stream[, options], callback)`
当流不再可读、可写、或遇到错误、或过早关闭事件时，则该函数会获得通知

在错误处理场景中特别有用，该场景中的流会被过早地销毁（例如被终止的 HTTP 请求），并且不会触发 'end' 或 'finish' 事件。

+ `stream <Stream>` 可读和/或可写流。
+ `options <Object>`
    + `error <boolean>` 如果设置为 false，则对 emit('error', err) 的调用不会被视为已完成。 默认值: true。
    + `readable <boolean>` 当设置为 false 时，即使流可能仍然可读，当流结束时也将会调用回调。默认值: true。
    + `writable <boolean>` 当设置为 false 时，即使流可能仍然可写，当流结束时也将会调用回调。默认值: true。
+ `callback <Function>` 带有可选错误参数的回调函数。
+ 返回: `<Function>` 清理函数，它会移除所有已注册的监听器。

在调用 callback 之后， stream.finished() 会留下悬挂的事件监听器（特别是 'error'、 'end'、 'finish' 和 'close'）。 这样做的原因是，意外的 'error' 事件（由于错误的流实现）不会导致意外的崩溃。 如果这是不想要的行为，则需要在回调中调用返回的清理函数

### `stream.pipeline(source[, ...transforms], destination, callback)`
使用 pipeline API 轻松地将一系列的流通过管道一起传送，并在管道完全地完成时获得通知
+ `source <Stream> | <Iterable> | <AsyncIterable> | <Function>`
    + `Returns: <Iterable> | <AsyncIterable>`
+ `...transforms <Stream> | <Function>`
    + `source <AsyncIterable>`
    + `Returns: <AsyncIterable>`
+ `destination <Stream> | <Function>`
    + `source <AsyncIterable>`
    + `Returns: <AsyncIterable> | <Promise>`
`callback <Function>` 当管道完全地完成时调用。
    + `err <Error>`
    + `val destination` 返回的 Promise 的 resolve 的值。
+ 返回: `<Stream>`
+ stream.pipeline() 将会在所有的流上调用 stream.destroy(err)，除了：
    + 已触发 'end' 或 'close' 的 Readable 流。
    + 已触发 'finish' 或 'close' 的 Writable 流。
+ 在调用 callback 之后， stream.pipeline() 会将悬挂的事件监听器留在流上。 在失败后重新使用流的情况下，这可能导致事件监听器泄漏和误吞的错误。
### `stream.Readable.from(iterable, [options])` 从迭代器中创建可读流
+ `iterable <Iterable>` 实现 Symbol.asyncIterator 或 Symbol.iterator 可迭代协议的对象。
+ `options <Object>` 提供给 new stream.Readable([options]) 的选项。 默认情况下， Readable.from() 会将 options.objectMode 设置为 true，除非通过将 options.objectMode 设置为 false 显式地选择此选项。
+ 返回: `<stream.Readable>`
+ 出于性能原因，调用 `Readable.from(string)` 或 `Readable.from(buffer)` 将不会迭代字符串或 buffer 以匹配其他流的语义









