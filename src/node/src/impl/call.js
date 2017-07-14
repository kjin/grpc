const constants = require('./constants.js');

/**
 * This class represents a single call, and is associated with a single stream
 * in an H2 connection.
 */
module.exports = class Call {
  constructor(channel, method, deadline, host, parentCall, propagationFlags) {
    // channel is implemented in ./channel.js
    this.channel = channel;
    this.method = method;
    this.responses = [];
    this.responseCbs = [];
    this.initialized = false;
    this.status = {
      metadata: {},
      code: constants.status.OK
    };
    this.credentials = null;
    this.ended = false;
  }

  startBatch(obj, callback) {
    if (!this.initialized) {
      this.channel.addOpenCall();
      this.initialized = true;
    }
    const doWork = () => {
      let p = Promise.resolve();
      if (!this.stream) {
        if (this.credentials || this.channel.callCredentials) {
          const credentials = this.credentials || this.channel.callCredentials;
          p = p.then(() => new Promise((resolve, reject) => {
            const protocol = 'https://';
            const service = (() => {
              const uriComponents = this.method.split('/')
              uriComponents.pop()
              return uriComponents.join('/')
            })()
            const service_url = protocol + this.channel.target + this.method;
            // TODO: What is cb_data
            credentials.plugin(service_url, { cb: {}, user_data: {} },
              (code, message, metadata, cb_data) => {
                if (code !== constants.status.OK) {
                  reject({ code, message });
                } else {
                  resolve(metadata);
                }
              });
          }));
        }
        p = p.then(metadata => {
          const headers = {
            ':method': 'POST',
            ':scheme': 'https', // TODO
            ':path': this.method,
            ':authority': this.channel.target,
            'te': 'trailers',
            'content-type': 'application/grpc',
            'user-agent': 'grpc-node-http2',
            'grpc-accept-encoding': 'identity,deflate,gzip',
            'x-goog-api-client': 'gl-node/8.1.2 gccl/0.10.1 grpc/1.5.0-dev'
          };
          if (metadata) {
            for (const key in metadata) {
              headers[key] = metadata[key][0];
            }
          }
          this.stream = this.channel.h2session.request(headers);
          // TODO We assume that a single data event is sufficient
          this.stream.on('error', err => {
            console.log(error);
          });
          let responseData;
          let bytesRemaining = 0;
          this.stream.on('data', data => {
            let dataOffset = 0;
            while (dataOffset < data.length) {
              if (bytesRemaining === 0) {
                // TODO We assume first chunk is 5+ bytes
                const length = data.readInt32BE(1);
                bytesRemaining = length + 5;
                responseData = Buffer.alloc(bytesRemaining);
              }
              const bytesToCopy = Math.min(bytesRemaining, data.length);
              const offset = responseData.length - bytesRemaining;
              data.copy(responseData, offset, dataOffset);
              bytesRemaining -= bytesToCopy;
              dataOffset += bytesToCopy;
              if (bytesRemaining === 0) {
                const compressed = responseData.readInt8(0) & 1;
                const length = responseData.readInt32BE(1);
                const incomingData = Buffer.alloc(length);
                responseData.copy(incomingData, 0, 5);
                if (this.responseCbs.length > 0) {
                  this.responseCbs.shift().call(null, null, {
                    read: incomingData,
                    metadata: {},
                    status: this.status
                  });
                } else {
                  this.responses.push(incomingData);
                }
                responseData = null;
              }
            }
          });
          this.stream.on('end', () => {
            if (this.ended) {
              // TODO: figure out why 'end' event is being emitted twice.
              // console.trace('already ended');
              return;
            }
            this.ended = true;
            this.channel.subtractOpenCall();
            if (this.responseCbs.length > 0) {
              this.responseCbs.shift().call(null, null, {
                read: null,
                metadata: {},
                status: this.status
              });
            } else {
              this.responses.push(null);
            }
          });
        });
      }
      p.then(() => {
        // TODO We don't support the operations related to metadata or
        // server-side processing. But for the purposes of prototyping the client
        // what we have here should be sufficient
        if (obj[constants.opType.SEND_MESSAGE]) {
          // obj[constants.opType.SEND_MESSAGE] contains the data itself.
          const outgoingData = Buffer.alloc(obj[constants.opType.SEND_MESSAGE].length + 5);
          // byte 0 is compressed flag. TODO -- determine when this should be set
          outgoingData.writeInt8(0, 0);
          // bytes 1-4 represent the 4-byte data length.
          outgoingData.writeInt32BE(obj[constants.opType.SEND_MESSAGE].length, 1);
          // bytes 5+ are the data itself.
          obj[constants.opType.SEND_MESSAGE].copy(outgoingData, 5);
          this.stream.write(outgoingData);
        }
        if (obj[constants.opType.SEND_CLOSE_FROM_CLIENT]) {
          this.stream.end();
        }

        // all callbacks are down here
        if (obj[constants.opType.RECV_MESSAGE]) {
          if (this.responses.length > 0) {
            callback(null, {
              read: this.responses.shift(),
              metadata: {},
              status: this.status
            });
          } else {
            this.responseCbs.push(callback);
          }
        }
        if (obj[constants.opType.RECV_STATUS_ON_CLIENT]) {
          if (!obj[constants.opType.RECV_MESSAGE]) {
            // TODO This implementation is incorrect and likely to not work
            this.stream.once('trailers', (headers, flags) => {
              callback(null, {
                status: {
                  metadata: {},
                  code: parseInt(headers['grpc-status']),
                  message: headers['grpc-message']
                }
              });
            });
          } else {
            this.stream.once('trailers', (headers, flags) => {
              this.status = {
                metadata: {},
                code: parseInt(headers['grpc-status']),
                message: headers['grpc-message']
              };
            });
          }
        }
        if (!obj[constants.opType.RECV_MESSAGE] && !obj[constants.opType.RECV_STATUS_ON_CLIENT]) {
          callback(null, { metadata: {} });
        }
      }).catch(err => console.error(err));
    };
    const checkState = (err) => {
      const connectivityState = this.channel.getConnectivityState(true);
      if (connectivityState === constants.connectivityState.READY) {
        doWork();
      } else {
        this.channel.watchConnectivityState(connectivityState, Infinity, checkState);
      }
    };
    checkState();
  }

  cancel() {

  }

  cancelWithStatus() {

  }

  getPeer() {

  }

  setCredentials(credentials) {
    this.credentials = credentials;
  }
};
