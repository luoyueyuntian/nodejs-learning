<ul>
<li>crypto (加密)
<ul>
<ul>
<li>Determining if crypto support is unavailable</li>
<li>Class: Certificate
<ul>
<ul>
<li>new crypto.Certificate()</li>
<li>certificate.exportChallenge(spkac)</li>
<li>certificate.exportPublicKey(spkac)</li>
<li>certificate.verifySpkac(spkac)</li>
</ul>
</ul>
</li>
<li>Class: Cipher
<ul>
<ul>
<li>cipher.final([outputEncoding])</li>
<li>cipher.setAAD(buffer)</li>
<li>cipher.getAuthTag()</li>
<li>cipher.setAutoPadding([autoPadding])</li>
<li>cipher.update(data[, inputEncoding][, outputEncoding])</li>
</ul>
</ul>
</li>
<li>Class: Decipher
<ul>
<ul>
<li>decipher.final([outputEncoding])</li>
<li>decipher.setAAD(buffer)</li>
<li>decipher.setAuthTag(buffer)</li>
<li>decipher.setAutoPadding([autoPadding])</li>
<li>decipher.update(data[, inputEncoding][, outputEncoding])</li>
</ul>
</ul>
</li>
<li>Class: DiffieHellman
<ul>
<ul>
<li>diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])</li>
<li>diffieHellman.generateKeys([encoding])</li>
<li>diffieHellman.getGenerator([encoding])</li>
<li>diffieHellman.getPrime([encoding])</li>
<li>diffieHellman.getPrivateKey([encoding])</li>
<li>diffieHellman.getPublicKey([encoding])</li>
<li>diffieHellman.setPrivateKey(privateKey[, encoding])</li>
<li>diffieHellman.setPublicKey(publicKey[, encoding])</li>
<li>diffieHellman.verifyError</li>
</ul>
</ul>
</li>
<li>Class: ECDH
<ul>
<ul>
<li>ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])</li>
<li>ecdh.generateKeys([encoding[, format]])</li>
<li>ecdh.getPrivateKey([encoding])</li>
<li>ecdh.getPublicKey([encoding][, format])</li>
<li>ecdh.setPrivateKey(privateKey[, encoding])</li>
</ul>
</ul>
</li>
<li>Class: Hash
<ul>
<ul>
<li>hash.digest([encoding])</li>
<li>hash.update(data[, inputEncoding])</li>
</ul>
</ul>
</li>
<li>Class: Hmac
<ul>
<ul>
<li>hmac.digest([encoding])</li>
<li>hmac.update(data[, inputEncoding])</li>
</ul>
</ul>
</li>
<li>Class: Sign
<ul>
<ul>
<li>sign.sign(privateKey[, outputFormat])</li>
<li>sign.update(data[, inputEncoding])</li>
</ul>
</ul>
</li>
<li>Class: Verify
<ul>
<ul>
<li>verify.update(data[, inputEncoding])</li>
<li>verify.verify(object, signature[, signatureFormat])</li>
</ul>
</ul>
</li>
<li>crypto module methods and properties
<ul>
<ul>
<li>crypto.constants</li>
<li>crypto.DEFAULT_ENCODING</li>
<li>crypto.fips</li>
<li>crypto.createCipher(algorithm, password[, options])</li>
<li>crypto.createCipheriv(algorithm, key, iv[, options])</li>
<li>crypto.createDecipher(algorithm, password[, options])</li>
<li>crypto.createDecipheriv(algorithm, key, iv[, options])</li>
<li>crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])</li>
<li>crypto.createDiffieHellman(primeLength[, generator])</li>
<li>crypto.createECDH(curveName)</li>
<li>crypto.createHash(algorithm[, options])</li>
<li>crypto.createHmac(algorithm, key[, options])</li>
<li>crypto.createSign(algorithm[, options])</li>
<li>crypto.createVerify(algorithm[, options])</li>
<li>crypto.getCiphers()</li>
<li>crypto.getCurves()</li>
<li>crypto.getDiffieHellman(groupName)</li>
<li>crypto.getHashes()</li>
<li>crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)</li>
<li>crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)</li>
<li>crypto.privateDecrypt(privateKey, buffer)</li>
<li>crypto.privateEncrypt(privateKey, buffer)</li>
<li>crypto.publicDecrypt(key, buffer)</li>
<li>crypto.publicEncrypt(key, buffer)</li>
<li>crypto.randomBytes(size[, callback])</li>
<li>crypto.randomFillSync(buffer[, offset][, size])</li>
<li>crypto.randomFill(buffer[, offset][, size], callback)</li>
<li>crypto.setEngine(engine[, flags])</li>
<li>crypto.timingSafeEqual(a, b)</li>
</ul>
</ul>
</li>
<li>Notes
<ul>
<ul>
<li>Legacy Streams API (pre Node.js v0.10)</li>
<li>Recent ECDH Changes</li>
<li>Support for weak or compromised algorithms</li>
</ul>
</ul>
</li>
<li>Crypto Constants
<ul>
<ul>
<li>OpenSSL Options</li>
<li>OpenSSL Engine Constants</li>
<li>Other OpenSSL Constants</li>
<li>Node.js Crypto Constants</li>
</ul>
</ul>
</li>
</ul>
</ul>
</li>
</ul>
