# worker_threads（工作线程）
nodejs支持多线程，通过 `worker_threads` 可以启动新的工作线程。

`worker_threads` 可以共享内存，它们通过传输 ArrayBuffer 实例或共享 SharedArrayBuffer 实例来实现，而由 `child_process` 和 `cluster` 创建的进程是不能共享内存的。

工作线程对于执行 CPU 密集型的 JavaScript 操作非常有用。 它们在 I/O 密集型的工作，Node.js 的内置的异步 I/O 操作比工作线程效率更高。

创建工作线程存在一定消耗，在实际的实践中，应根据情况使用**工作线程池代**。 否则，创建工作线程的开销可能会超出其收益。

默认情况下，工作线程继承非特定于进程的选项。

+ `worker.threadId` 当前线程的ID，同时在工作线程上，每个worker实例也都有唯一的ID。
+ `worker.isMainThread` 是否是主线程，工作线程值为false
+ `worker.parentPort` 如果当前线程为Worker工作线程, 该MessagePort端口作用于与主线交换信息。通过该端口`parentPort.postMessage()`发送的消息在主线程中将可以通过`worker.on('message')`接收。主线程中通过worker.postMessage()发送的消息将可以在工作线程中通过parentPort.on('message')接收。
+ `worker.resourceLimits` 在Worker线程内提供JS引擎资源约束的集合。如果在`Worker`构造函数传入资源“限制”选项，这里将获得的值将与传入的值一致。
+ `worker.SHARE_ENV` 传递给构造函数Worker选项对象env属性的值，用以指定主线程与工作线程将可共享环境变量的读写。
+ `worker.workerData` （工作线程中可用）指代通过主线程中传递过来的数据。 它可以是任意的JavaScript值，通过主线程构造函数中的选项对象的workerData传递。 这个数据类似`Web Worker中postMessage()`机制，它是拷贝传递的（不推荐通过此方法传递较大的数据）。
+ `worker.moveMessagePortToContext(port, contextifiedSandbox)`
+ `worker.receiveMessageOnPort(port)`

### MessageChannel 类

### MessagePort 类
+ port.start()
+ port.postMessage(value[, transferList])
+ port.ref()
+ port.unref()
+ port.close()
+ **'message' 事件**
+ **'close' 事件**

### Worker 类
Worker 类代表一个独立的 JavaScript 执行线程。 大多数 Node.js API 都在其中可用。

工作线程环境中的显着差异是：
+ 父线程可以重定向 `process.stdin`、`process.stdout` 和 `process.stderr`。
+ `require('worker_threads').isMainThread` 属性被设置为 false。
+ `require('worker_threads').parentPort` 消息端口可用。
+ `process.exit()` 不会停止整个程序，仅停止单个线程，且 `process.abort()` 不可用。
+ `process.chdir()` 和设置群组或用户标识的 process 方法不可用。
+ `process.env` 是父线程的环境变量的副本，除非另外指定。 对一个副本的更改将会在其他线程中不可见，并且对原生插件也不可见（除非 `worker.SHARE_ENV` 作为 `env` 选项传给 Worker 的构造函数）。
+ `process.title` 无法被修改。
+ 信号将不会通过 `process.on('...')` 传递。
+ 调用 `worker.terminate()` 可能会随时停止执行。
+ 无法访问父进程的 IPC 通道。
+ 不支持 `trace_events` 模块。
+ 如果原生插件满足特定条件，则只能从多个线程中加载它们。

可以在其他 Worker 实例中创建 Worker 实例。

与 Web 工作线程和 cluster 模块一样，可以通过线程间的消息传递来实现双向通信。 在内部，一个 Worker 具有一对内置的 `MessagePort`，在创建该 `Worker` 时它们已经相互关联。 虽然父端的 `MessagePort` 对象没有直接公开，但其功能是通过父线程的 `Worker` 对象上的 `worker.postMessage()` 和 `worker.on('message')` 事件公开的。

要创建自定义的消息传递通道（建议使用默认的全局通道，因为这样可以促进关联点的分离），用户可以在任一线程上创建一个 `MessageChannel` 对象，并将该 `MessageChannel` 上的 `MessagePort` 中的一个通过预先存在的通道传给另一个线程，例如全局的通道。

+ `new Worker(filename[, options])`
    + `filename <string> `工作线程主脚本的路径。必须是以 ./ 或 ../ 开头的绝对路径或相对路径（即相对于当前工作目录）、或者使用 file: 协议的 WHATWG URL 对象。 如果 options.eval 为 true，则这是一个包含 JavaScript 代码而不是路径的字符串。
    + `options <Object>`
        + `argv <any[]>` 参数列表，其将会被字符串化并附加到工作线程中的 `process.argv`。 这大部分与 workerData 相似，但是这些值将会在全局的 `process.argv` 中可用，就好像它们是作为 CLI 选项传给脚本一样。
        + `env <Object>` 如果设置，则指定工作线程中 `process.env` 的初始值。 作为一个特殊值，worker.SHARE_ENV 可以用于指定父线程和子线程应该共享它们的环境变量。 在这种情况下，对一个线程的 `process.env` 对象的更改也会影响另一个线程。 默认值: `process.env`。
        + `eval <boolean>` 如果为 true 且第一个参数是一个 string，则将构造函数的第一个参数解释为工作线程联机后执行的脚本。
        + `execArgv <string[]>` 传递给工作线程的 node CLI 选项的列表。 不支持 V8 选项（例如 `--max-old-space-size`）和影响进程的选项（例如 --title）。 如果设置，则它将会作为工作线程内部的 `process.execArgv` 提供。 默认情况下，选项将会从父线程继承。
        + `stdin <boolean>` 如果将其设置为 true，则 `worker.stdin` 将会提供一个可写流，其内容将会在工作线程中以 `process.stdin` 出现。 默认情况下，不提供任何数据。
        + `stdout <boolean>` 如果将其设置为 true，则 `worker.stdout` 将不会自动地通过管道传递到父线程中的 `process.stdout`。
        + `stderr <boolean>` 如果将其设置为 true，则 `worker.stderr` 将不会自动地通过管道传递到父线程中的 `process.stderr`。
        + `workerData <any>` 能被克隆并作为 `require('worker_threads')`.workerData 的任何 JavaScript 值。 克隆将会按照 HTML 结构化克隆算法中描述的进行，如果对象无法被克隆（例如，因为它包含 function），则会抛出错误。
        + `transferList <Object[]>` 如果在workerData中传递了一个或多个类似于MessagePort的对象，则这些项目需要一个transferList，否则将抛出ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST。
        + `resourceLimits <Object>` 新的 JS 引擎实例的一组可选的资源限制。 达到这些限制将会导致终止 Worker 实例。 这些限制仅影响 JS 引擎，并且不影响任何外部数据，包括 ArrayBuffers。 即使设置了这些限制，如果遇到全局内存不足的情况，该进程仍可能中止。
            + `maxOldGenerationSizeMb <number>` 主堆的最大大小，以 MB 为单位。
            + `maxYoungGenerationSizeMb <number>` 最近创建的对象的堆空间的最大大小。
            + `codeRangeSizeMb <number>` 用于生成代码的预分配的内存范围的大小。

+ `worker.threadId`
+ `worker.resourceLimits`
+ `worker.stderr`
+ `worker.stdin`
+ `worker.stdout`
+ `worker.getHeapSnapshot()`
+ `worker.postMessage(value[, transferList])`
+ `worker.ref()`
+ `worker.unref()`
+ `worker.terminate()`
+ **'message' 事件** 当工作线程执行了`require('worker_threads').parentPort.postMessage()`，将触发'message' 事件。从工作线程发送的所有消息都将在Worker对象上发出“退出”事件之前发出。
+ **'online' 事件** 当工作线程开始执行代码的时候触发'online' 事件
+ **'error' 事件** 如果辅助线程抛出未捕获的异常，则发出“错误”事件。 在这种情况下，工作线程将会被终止。
+ **'exit' 事件** 一旦工作线程停止，就会发出“退出”事件。 如果工作线程通过调用`process.exit()` 退出，则`exitCode`参数将是传递的退出code。 如果工作程序已终止，则`exitCode`参数将为1。这是Worker实例发出的最终事件。