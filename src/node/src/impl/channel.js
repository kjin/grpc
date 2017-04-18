'use strict';

const h2 = require('http2');

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

    // TODO: only support client at the moment.

    this.target = address;
    options = options || {};

    // TODO
    // options = extend({'grpc.primary_user_agent': 'grpc-node-h2/0.0.1'}, options);

    if (credentials) {
      console.log('TODO: right now we only support insecure channels');
      // TODO: implement this.
    }

    // TODO: make sure the options are all int32 or string values
    // c.f. ParseChannelArgs

    // create a channel and asynchronously
    // - resolve target
    // - connect to it (trying alternatives as presented)
    // - perform handshake

    // c.f. create_channel_factory_create_channel
    options['grpc.server_uri'] = `dns:///${address}`; // TODO: only add prefix
    // when needed.

    // TODO: too hacky at the moment:
    const matches = address.match(/(.*):(\d+)/);
    const hostname = matches[1];
    const port = matches[2];

    this.h2session = h2.connect({
      protocol: 'http:', // TODO: also https
      hostname: hostname,
      port: port
    }/*, (client, socket) => {}*/);

    // grpc runs some {client,server} channel plugins at this point
    // see: grpc_channel_init_create_stack
    // - set_default_host_if_unset
    // - prepend_filter
    // - append_filter
    // - maybe_add_census_filter
  }

  close() {
    this.h2session.destroy();
  }

  getTarget() {
    return this.target;
  }

  getConnectivityState(tryToConnect) {
    // TODO
  }

  watchConnectivityState(lastState, deadline, cb) {
    // TODO
  }
};