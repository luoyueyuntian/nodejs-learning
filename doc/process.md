# process（进程）
#### 进程事件
+ 'beforeExit' 事件
+ 'disconnect' 事件
+ 'exit' 事件
+ 'message' 事件
+ 'multipleResolves' 事件
+ 'rejectionHandled' 事件
+ 'uncaughtException' 事件
    + 警告: 正确地使用 'uncaughtException'
+ 'uncaughtExceptionMonitor' 事件
+ 'unhandledRejection' 事件
+ 'warning' 事件
    + 触发自定义的告警
+ 信号事件


process.allowedNodeEnvironmentFlags
process.env
process.execArgv
process.execPath
process.arch
process.argv
process.argv0
process.exitCode
process.config
process.connected
process.noDeprecation
process.release
process.platform
process.version
process.versions
process.pid
process.ppid
process.stderr
    process.stderr.fd
process.stdin
    process.stdin.fd
process.stdout
    process.stdout.fd
进程 I/O 的注意事项
process.throwDeprecation
process.title
process.traceDeprecation
process.debugPort
process.channel
+ process.channel.ref()
+ process.channel.unref()
process.chdir(directory)
process.cpuUsage([previousValue])
process.cwd()
process.disconnect()
process.dlopen(module, filename[, flags])
process.emitWarning(warning[, options])
process.emitWarning(warning[, type[, code]][, ctor])
+ 避免重复告警
process.getegid()
process.setegid(id)
process.geteuid()
process.seteuid(id)
process.getgid()
process.setgid(id)
process.getgroups()
process.setgroups(groups)
process.getuid()
process.setuid(id)
process.initgroups(user, extraGroup)
process.hasUncaughtExceptionCaptureCallback()
process.setUncaughtExceptionCaptureCallback(fn)
process.hrtime([time])
process.hrtime.bigint()
process.kill(pid[, signal])
process.exit([code])
process.abort()
process.memoryUsage()
process.resourceUsage()
process.nextTick(callback[, ...args])
process.send(message[, sendHandle[, options]][, callback])

process.report
+ process.report.compact
+ process.report.directory
+ process.report.filename
+ process.report.getReport([err])
+ process.report.reportOnFatalError
+ process.report.reportOnSignal
+ process.report.reportOnUncaughtException
+ process.report.signal
+ process.report.writeReport([filename][, err])

process.umask(mask)
process.uptime()

退出码