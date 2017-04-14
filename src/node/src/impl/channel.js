/**
 * This class maintains a connection, and should expose enough information to
 * start and transmit data over a stream.
 */
module.exports = class Channel {
  constructor(address, credentials, options) {
    // I gathered these fields from the CPP implementation. Not sure which
    // are necessary.
    // this.isClient = null;
    // this.compressionOptions = null;
    // this.defaultAuthority = null;
    // this.callSizeEstimate = null;
    // this.registeredCallMu = null;
    // this.registeredCalls = [];
    this.target = address;
  }

  close() {

  }

  getTarget() {
    return this.target;
  }

  getConnectivityState(tryToConnect) {

  }

  watchConnectivityState(lastState, deadline, cb) {

  }
};