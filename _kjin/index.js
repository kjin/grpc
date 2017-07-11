// Usage
const [_bin, _script, mode, impl, creds, ...methodCalls] = process.argv

// Alias this host to loopback in /etc/hosts
const host = 'waterzooi.test.google.be'
const port = 8080

if (!methodCalls.length) {
  console.log(`Usage: node ${__filename} mode=(server|client|both) impl=(ccore|experimental) creds=(insecure|ssl|googleAuth) ...methodCalls=(unary|clientStream|serverStream|bidiStream|all)`)
  process.exit(0)
}

if (methodCalls[0] === 'all') {
  methodCalls.length = 0;
  methodCalls.push('unary', 'clientStream', 'serverStream', 'bidiStream');
}

global[impl] = true
const grpc = require('..')
const fs = require('fs')
const util = require('util')

const protobufjsVersion = 5
const proto = getProto(protobufjsVersion).nodetest

const [keyData, pemData, caData] = [
  '../src/node/test/data/server1.key',
  '../src/node/test/data/server1.pem',
  '../src/node/test/data/ca.pem'
].map(a => fs.readFileSync(a))

let serverShutdown = () => {}

if (mode === 'server' || mode === 'both') {
  const serverCredentials = (() => {
    switch (creds) {
      case 'ssl':
        return grpc.ServerCredentials.createSsl(null, [{private_key: keyData, cert_chain: pemData}])
      default: 
        return grpc.ServerCredentials.createInsecure()
    }
  })()
  const server = new grpc.Server()
  server.addProtoService(proto.Tester.service, {
    testUnary: (call, cb) => {
      const input = call.request
      const output = { n: input.n }
      cb(null, output)
    },
    testClientStream: (readable, cb) => {
      const output = { n: 0 }
      readable.on('data', input => {
        output.n += input.n
      })
      readable.on('end', () => {
        cb(null, output)
      })
    },
    testServerStream: (writable) => {
      const input = writable.request
      for (let i = input.n; i > 0; i >>= 1) {
        const output = { n: i }
        writable.write(output)
      }
      writable.end()
    },
    testBidiStream: (duplex) => {
      duplex.on('data', input => {
        duplex.write({ n: input.n })
      })
      duplex.on('end', () => {
        duplex.end()
      })
    }
  })
  server.bind(`${host}:${port}`, serverCredentials)
  server.start()
  serverShutdown = () => server.tryShutdown()
}
if (mode === 'client' || mode === 'both') {
  const clientCredentials = (() => {
    switch (creds) {
      case 'ssl':
        return grpc.credentials.createSsl(caData)
      default:
        return grpc.credentials.createInsecure()
    }
  })()
  const client = new proto.Tester(`${host}:${port}`, clientCredentials)
  const clientMethods = {
    unary: () => new Promise((resolve, reject) => {
      client.testUnary({ n: 42 }, (err, result) => {
        if (err) {
          reject(err)
        }
        console.log(`client: ${util.inspect(result)}`)
        resolve()
      })
    }),
    clientStream: () => new Promise((resolve, reject) => {
      const writable = client.testClientStream((err, result) => {
        if (err) {
          reject(err)
        }
        console.log(`client: ${util.inspect(result)}`)
        resolve()
      })
      for (let n = 0; n < 10; n++) {
        writable.write({ n })
      }
      writable.end()
    }),
    serverStream: () => new Promise((resolve, reject) => {
      const readable = client.testServerStream({ n: 42 })
      readable.on('data', result => {
        console.log(`client: ${util.inspect(result)}`)
      })
      readable.on('error', err => {
        reject(err)
      })
      readable.on('end', () => {
        resolve()
      })
    }),
    bidiStream: () => new Promise((resolve, reject) => {
      const duplex = client.testBidiStream()
      duplex.on('data', result => {
        console.log(`client: ${util.inspect(result)}`)
      })
      duplex.on('error', err => {
        reject(err)
      })
      for (let n = 0; n < 10; n++) {
        duplex.write({ n })
      }
      duplex.end()
    })
  }

  methodCalls.reduce((p, methodCall) => {
    return p.then(clientMethods[methodCall])
  }, Promise.resolve()).then(() => {
    serverShutdown()
  }).catch(e => console.error(e))
}

// data

function getProto(protobufjsVersion) {
  const protobufjs = require('protobufjs')
  if (protobufjsVersion === 5) {
    const json = '{"package":"nodetest","syntax":"proto2","messages":[{"name":"TestRequest","syntax":"proto3","fields":[{"rule":"optional","type":"int32","name":"n","id":1}]},{"name":"TestReply","syntax":"proto3","fields":[{"rule":"optional","type":"int32","name":"n","id":1}]}],"services":[{"name":"Tester","options":{},"rpc":{"TestUnary":{"request":"TestRequest","request_stream":false,"response":"TestReply","response_stream":false,"options":{}},"TestClientStream":{"request":"TestRequest","request_stream":true,"response":"TestReply","response_stream":false,"options":{}},"TestServerStream":{"request":"TestRequest","request_stream":false,"response":"TestReply","response_stream":true,"options":{}},"TestBidiStream":{"request":"TestRequest","request_stream":true,"response":"TestReply","response_stream":true,"options":{}}}}],"isNamespace":true}'
    return grpc.loadObject(protobufjs.loadJson(json), { protobufjsVersion })
  } else if (protobufjsVersion === 6) {
    const json = '{"nested":{"nodetest":{"nested":{"Tester":{"methods":{"TestUnary":{"requestType":"TestRequest","responseType":"TestReply"},"TestClientStream":{"requestType":"TestRequest","requestStream":true,"responseType":"TestReply"},"TestServerStream":{"requestType":"TestRequest","responseType":"TestReply","responseStream":true},"TestBidiStream":{"requestType":"TestRequest","requestStream":true,"responseType":"TestReply","responseStream":true}}},"TestRequest":{"fields":{"n":{"type":"int32","id":1}}},"TestReply":{"fields":{"n":{"type":"int32","id":1}}}}}}}'
    return grpc.loadObject(protobufjs.Root.fromJSON(json), { protobufjsVersion })
  }
}
