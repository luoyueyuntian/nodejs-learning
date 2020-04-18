<ul>
<li>child_process (子进程)
<ul>
<ul>
<li>创建异步进程
<ul>
<ul>
<li>在 Windows 上衍生 .bat 和 .cmd 文件</li>
<li>child_process.exec(command[, options][, callback])</li>
<li>child_process.execFile(file[, args][, options][, callback])</li>
<li>child_process.fork(modulePath[, args][, options])</li>
<li>child_process.spawn(command[, args][, options])
<ul>
<ul>
<li>options.detached</li>
<li>options.stdio</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
<li>创建同步进程
<ul>
<ul>
<li>child_process.execFileSync(file[, args][, options])</li>
<li>child_process.execSync(command[, options])</li>
<li>child_process.spawnSync(command[, args][, options])</li>
</ul>
</ul>
</li>
<li>ChildProcess 类
<ul>
<ul>
<li>'close' 事件</li>
<li>'disconnect' 事件</li>
<li>'error' 事件</li>
<li>'exit' 事件</li>
<li>'message' 事件</li>
<li>subprocess.channel</li>
<li>subprocess.connected</li>
<li>subprocess.disconnect()</li>
<li>subprocess.kill([signal])</li>
<li>subprocess.killed</li>
<li>subprocess.pid</li>
<li>subprocess.send(message[, sendHandle[, options]][, callback])
<ul>
<ul>
<li>例子：发送一个 server 对象</li>
<li>例子：发送一个 socket 对象</li>
</ul>
</ul>
</li>
<li>subprocess.stderr</li>
<li>subprocess.stdin</li>
<li>subprocess.stdio</li>
<li>subprocess.stdout</li>
</ul>
</ul>
</li>
<li>maxBuffer 与 Unicode</li>
<li>Shell Requirements</li>
<li>Default Windows Shell</li>
</ul>
</ul>
</li>
</ul>
