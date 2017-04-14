/**
 * This class represents a single call, and is associated with a single stream
 * in an H2 connection.
 */
module.exports = class Call {
  constructor(channel, method, deadline, host, parentCall, propagationFlags) {
    // channel is implemented in ./channel.js
  }

  startBatch(obj, callback) {
    
  }

  cancel() {

  }

  cancelWithStatus() {

  }

  getPeer() {

  }

  setCredentials() {

  }
}