<ul>
<li>tls (安全传输层)
<ul>
<ul>
<li>TLS/SSL 概念
<ul>
<ul>
<li>Perfect Forward Secrecy</li>
<li>ALPN, NPN and SNI</li>
<li>Client-initiated renegotiation attack mitigation</li>
</ul>
</ul>
</li>
<li>Modifying the Default TLS Cipher suite</li>
<li>Class: tls.Server
<ul>
<ul>
<li>Event: 'newSession'</li>
<li>Event: 'OCSPRequest'</li>
<li>Event: 'resumeSession'</li>
<li>Event: 'secureConnection'</li>
<li>Event: 'tlsClientError'</li>
<li>server.addContext(hostname, context)</li>
<li>server.address()</li>
<li>server.close([callback])</li>
<li>server.getTicketKeys()</li>
<li>server.listen()</li>
<li>server.setTicketKeys(keys)</li>
</ul>
</ul>
</li>
<li>Class: tls.TLSSocket
<ul>
<ul>
<li>new tls.TLSSocket(socket[, options])</li>
<li>Event: 'OCSPResponse'</li>
<li>Event: 'secureConnect'</li>
<li>tlsSocket.address()</li>
<li>tlsSocket.authorizationError</li>
<li>tlsSocket.authorized</li>
<li>tlsSocket.disableRenegotiation()</li>
<li>tlsSocket.encrypted</li>
<li>tlsSocket.getCipher()</li>
<li>tlsSocket.getEphemeralKeyInfo()</li>
<li>tlsSocket.getPeerCertificate([detailed])</li>
<li>tlsSocket.getProtocol()</li>
<li>tlsSocket.getSession()</li>
<li>tlsSocket.getTLSTicket()</li>
<li>tlsSocket.localAddress</li>
<li>tlsSocket.localPort</li>
<li>tlsSocket.remoteAddress</li>
<li>tlsSocket.remoteFamily</li>
<li>tlsSocket.remotePort</li>
<li>tlsSocket.renegotiate(options, callback)</li>
<li>tlsSocket.setMaxSendFragment(size)</li>
</ul>
</ul>
</li>
<li>tls.connect(options[, callback])</li>
<li>tls.connect(path[, options][, callback])</li>
<li>tls.connect(port[, host][, options][, callback])</li>
<li>tls.createSecureContext(options)</li>
<li>tls.createServer([options][, secureConnectionListener])</li>
<li>tls.getCiphers()</li>
<li>tls.DEFAULT_ECDH_CURVE</li>
<li>Deprecated APIs
<ul>
<ul>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
</ul>
