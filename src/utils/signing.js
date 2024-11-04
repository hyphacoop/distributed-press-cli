const { createHash, createSign } = require('crypto')
const { URL } = require('url')

async function generateSignedHeaders (keypair, url, method, body) {
  const parsedUrl = new URL(url)
  const date = new Date().toUTCString()
  const digest = createDigestHeader(body)

  const headersToSign = ['(request-target)', 'host', 'date', 'digest']

  const signingString = createSigningString(method, parsedUrl, date, digest, headersToSign)

  const signer = createSign('RSA-SHA256')
  signer.update(signingString)
  signer.end()

  const signature = signer.sign(keypair.privateKeyPem).toString('base64')

  const signatureHeader = `keyId="${keypair.publicKeyId}",algorithm="rsa-sha256",headers="${headersToSign.join(
    ' '
  )}",signature="${signature}"`

  const signedHeaders = {
    Date: date,
    Host: parsedUrl.host,
    Digest: digest,
    Signature: signatureHeader
  }

  return signedHeaders
}

function createDigestHeader (body) {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body)
  const hash = createHash('sha256').update(bodyString).digest('base64')
  return `SHA-256=${hash}`
}

function createSigningString (method, url, date, digest, headers) {
  const signingParts = headers.map((header) => {
    switch (header.toLowerCase()) {
      case '(request-target)':
        return `(request-target): ${method.toLowerCase()} ${url.pathname}`
      case 'host':
        return `host: ${url.host}`
      case 'date':
        return `date: ${date}`
      case 'digest':
        return `digest: ${digest}`
      default:
        throw new Error(`Unsupported header ${header} for signing`)
    }
  })
  return signingParts.join('\n')
}

module.exports = {
  generateSignedHeaders
}
