'use strict';

const constants = require('./constants.js');
const h2 = require('http2');
const ChannelCredentials = require('./channel_credentials.js');

const kOnChangeConnectivityState = Symbol('onChangeConnectivityState');

/**
 * This class maintains a connection, and should expose enough information to
 * start and transmit data over a stream.
 */
module.exports = class Channel {
  constructor(address/*:string*/, credentials/*:ChannelCredentials*/,
              options/*:object*/) {
    // I gathered these fields from the CPP implementation. Not sure which
    // are necessary.
    // this.isClient = null;
    // this.compressionOptions = null;
    // this.defaultAuthority = null;
    // this.callSizeEstimate = null;

    // This is a mutex. Not needed.
    // this.registeredCallMu = null;

    // this.registeredCalls = [];

    // Hack to close channel when last call is complete
    this.numOpenCalls = 0;

    var protocol = 'http:';
    var opts = {
      settings: {
        initialWindowSize: 1024
      }
    };

    if (credentials) {
      this.callCredentials = credentials.getCallCredentials();
      if (credentials.useTLS()) {
        protocol = 'https:';
        if (credentials.getSecureContext()) {
          opts.secureContext = credentials.getSecureContext();
        }
      }
    }

    this.watchingConnectionState = new Set();
    this.connectionState = constants.connectivityState.CONNECTING;
    this.addOpenCall = () => {
      if (this.numOpenCalls++ === 0) {
        this.h2session = h2.connect({
          protocol: protocol,
          hostname: hostname,
          port: port
        },
        opts /*, (client, socket) => {}*/);
        this.h2session.on('connect', () => {
          this[kOnChangeConnectivityState](constants.connectivityState.READY);
        });
        this.h2session.on('error', err => {
          console.error(err);
        });
      }
    }
    this.subtractOpenCall = () => {
      if (--this.numOpenCalls === 0) {
          this.close();
      }
    }

    // TODO: only support client at the moment.

    this.target = address;
    options = options || {};

    // TODO
    // options = extend({'grpc.primary_user_agent': 'grpc-node-h2/0.0.1'}, options);

    // TODO: make sure the options are all int32 or string values
    // c.f. ParseChannelArgs

    // create a channel and asynchronously
    // - resolve target
    // - connect to it (trying alternatives as presented)
    // - perform handshake

    // c.f. create_channel_factory_create_channel
    options['grpc.server_uri'] = `dns:///${address}`; // TODO: only add prefix
    // when needed.

    const matches = address.match(/(([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)(:(\d+))?/);
    if (!matches) {
      console.log(`Failed to match pattern for address: ${address}`);
    }
    const hostname = matches[1]; // (([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)
    const port = matches[4] || (protocol === 'https:' ? '443' : '80'); // (\d+)

    // grpc runs some {client,server} channel plugins at this point
    // see: grpc_channel_init_create_stack
    // - set_default_host_if_unset
    // - prepend_filter
    // - append_filter
    // - maybe_add_census_filter
  }

  [kOnChangeConnectivityState](newState) {
    this.connectionState = newState;
    this.watchingConnectionState.forEach(cb => cb(newState));
    this.watchingConnectionState.clear();
  }

  close() {
    if (!this.h2session.destroyed) {
      this.h2session.socket.destroy();
    }
    delete this.h2session;
    this[kOnChangeConnectivityState](constants.connectivityState.IDLE);
  }

  getTarget() {
    return this.target;
  }

  getConnectivityState(tryToConnect) {
    return this.connectionState;
  }

  watchConnectivityState(lastState, deadline, cb) {
    this.watchingConnectionState.add(cb);
    if (deadline !== Infinity) {
      setTimeout(() => {
        this.watchingConnectionState.delete(cb);
      }, Date.now() - deadline);
    }
  }
};
