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
    setTimeout(() => {
      // TODO obj[0] contains metadata, which are sent as custom headers.
      const headers = {
        ':method': 'POST',
        ':scheme': 'http', // TODO
        ':path': this.method,
        'te': 'trailers'
      };
      const stream = this.channel.h2session.request(headers);
      // TODO We assume that a single data event is sufficient
      let responseData;
      stream.on('data', data => {
        responseData = data;
      });
      stream.on('end', () => {
        const compressed = responseData.readInt8(0) === 1;
        const length = responseData.readInt32BE(1);
        const incomingData = Buffer.alloc(length);
        responseData.copy(incomingData, 0, 5);
        // TODO no error checking
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
    }, 200);
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