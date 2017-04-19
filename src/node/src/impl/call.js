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
  }

  startBatch(obj, callback) {
    const doWork = () => {
      // TODO obj[0] contains metadata, which are sent as custom headers.
      const headers = {
        ':method': 'POST',
        ':scheme': 'http', // TODO
        ':path': this.method,
        'te': 'trailers',
        'content-type': 'application/grpc',
        'user-agent': 'grpc-node-http2',
        'grpc-accept-encoding': 'identity,deflate,gzip'
      };
      const stream = this.channel.h2session.request(headers);
      // TODO We assume that a single data event is sufficient
      let responseData;
      let offset = 0;
      stream.on('data', data => {
        if (!responseData) {
          // TODO We assume first chunk is 5+ bytes
          const length = data.readInt32BE(1);
          responseData = Buffer.alloc(length + 5);
        }
        data.copy(responseData, offset);
        offset += data.length;
      });
      stream.on('error', err => {
        console.log(error);
      });
      stream.on('end', () => {
        const compressed = responseData.readInt8(0) & 1;
        const length = responseData.readInt32BE(1);
        const incomingData = Buffer.alloc(length);
        responseData.copy(incomingData, 0, 5);
        // TODO no error checking
        // setTimeout(this.channel.close.bind(this.channel), 200);
        callback(null, {
          read: incomingData,
          metadata: {},
          status: {
            metadata: {},
            code: constants.status.OK
          }
        });
      });
      // obj[constants.opType.SEND_MESSAGE] contains the data itself.
      const outgoingData = Buffer.alloc(obj[constants.opType.SEND_MESSAGE].length + 5);
      // byte 0 is compressed flag. TODO -- determine when this should be set
      outgoingData.writeInt8(0, 0);
      // bytes 1-4 represent the 4-byte data length.
      outgoingData.writeInt32BE(obj[constants.opType.SEND_MESSAGE].length, 1);
      // bytes 5+ are the data itself.
      obj[constants.opType.SEND_MESSAGE].copy(outgoingData, 5);
      stream.write(outgoingData);
      stream.end();
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

  setCredentials() {

  }
};