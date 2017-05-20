// Usage
const [bin_, script_, nodeCoreHttp2, mode, ...methodCalls] = process.argv

global.nodeCoreHttp2 = !!parseInt(nodeCoreHttp2)
const grpc = require('.')
const fs = require('fs')
const util = require('util')
const proto = grpc.loadObject(require('protobufjs').Root.fromJSON(JSON.parse('{"nested":{"nodetest":{"nested":{"Tester":{"methods":{"TestUnary":{"requestType":"TestRequest","responseType":"TestReply"},"TestClientStream":{"requestType":"TestRequest","requestStream":true,"responseType":"TestReply"},"TestServerStream":{"requestType":"TestRequest","responseType":"TestReply","responseStream":true},"TestBidiStream":{"requestType":"TestRequest","requestStream":true,"responseType":"TestReply","responseStream":true}}},"TestRequest":{"fields":{"n":{"type":"int32","id":1}}},"TestReply":{"fields":{"n":{"type":"int32","id":1}}}}}}}')), { protobufjsVersion: 6 }).nodetest

const [keyData, pemData, caData] = [
  './src/node/test/data/server1.key',
  './src/node/test/data/server1.pem',
  './src/node/test/data/ca.pem'
].map(a => fs.readFileSync(a))

const port = 8080

let serverShutdown = () => {}

if (mode === 'server' || mode === 'both') {
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
  server.bind(`localhost:${port}`, grpc.ServerCredentials.createInsecure())
  server.start()
  serverShutdown = () => server.tryShutdown()
}
if (mode === 'client' || mode === 'both') {
  const client = new proto.Tester(`localhost:${port}`, grpc.credentials.createInsecure())
  const clientMethods = {
    unary: () => new Promise(resolve => {
      client.testUnary({ n: 42 }, (err, result) => {
        console.log(`client: ${util.inspect(result)}`)
        resolve()
      })
    }),
    clientStream: () => new Promise(resolve => {
      const writable = client.testClientStream((err, result) => {
        console.log(`client: ${util.inspect(result)}`)
        resolve()
      })
      for (let n = 0; n < 10; n++) {
        writable.write({ n })
      }
      writable.end()
    }),
    serverStream: () => new Promise(resolve => {
      const readable = client.testServerStream({ n: 42 })
      readable.on('data', result => {
        console.log(`client: ${util.inspect(result)}`)
      })
      readable.on('end', () => {
        resolve()
      })
    }),
    bidiStream: () => new Promise(resolve => {
      const duplex = client.testBidiStream()
      duplex.on('data', result => {
        console.log(`client: ${util.inspect(result)}`)
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
  }).catch(console.error)
}
