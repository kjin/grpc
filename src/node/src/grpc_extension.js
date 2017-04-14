/**
 * @license
 * Copyright 2016 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * @module
 * @private
 */

'use strict';

var binary = require('node-pre-gyp/lib/pre-binding');
var path = require('path');
var binding_path =
    binary.find(path.resolve(path.join(__dirname, '../../../package.json')));
var binding = require(binding_path);

// Defined constants
module.exports = {
  status: {
    OK: 0,
    CANCELLED: 1,
    UNKNOWN: 2,
    INVALID_ARGUMENT: 3,
    DEADLINE_EXCEEDED: 4,
    NOT_FOUND: 5,
    ALREADY_EXISTS: 6,
    PERMISSION_DENIED: 7,
    UNAUTHENTICATED: 16,
    RESOURCE_EXHAUSTED: 8,
    FAILED_PRECONDITION: 9,
    ABORTED: 10,
    OUT_OF_RANGE: 11,
    UNIMPLEMENTED: 12,
    INTERNAL: 13,
    UNAVAILABLE: 14,
    DATA_LOSS: 15
  },
  callError: {
    OK: 0,
    ERROR: 1,
    NOT_ON_SERVER: 2,
    NOT_ON_CLIENT: 3,
    ALREADY_INVOKED: 5,
    NOT_INVOKED: 6,
    ALREADY_FINISHED: 7,
    TOO_MANY_OPERATIONS: 8,
    INVALID_FLAGS: 9
  },
  opType: {
    SEND_INITIAL_METADATA: 0,
    SEND_MESSAGE: 1,
    SEND_CLOSE_FROM_CLIENT: 2,
    SEND_STATUS_FROM_SERVER: 3,
    RECV_INITIAL_METADATA: 4,
    RECV_MESSAGE: 5,
    RECV_STATUS_ON_CLIENT: 6,
    RECV_CLOSE_ON_SERVER: 7
  },
  propagate: {
    DEADLINE: 1,
    CENSUS_STATS_CONTEXT: 2,
    CENSUS_TRACING_CONTEXT: 4,
    CANCELLATION: 8,
    DEFAULTS: 65535
  },
  connectivityState: {
    IDLE: 0,
    CONNECTING: 1,
    READY: 2,
    TRANSIENT_FAILURE: 3,
    FATAL_FAILURE: 4
  },
  writeFlags: {
    BUFFER_HINT: 1,
    NO_COMPRESS: 2
  },
  logVerbosity: {
    DEBUG: 0,
    INFO: 1,
    ERROR: 2
  }
};

module.exports.Call = function() {
  // TODO
  return binding.Call.apply(this, arguments);
};

module.exports.CallCredentials = function() {
  // TODO
  return binding.CallCredentials.apply(this, arguments);
};

module.exports.CallCredentials.createFromPlugin = function() {
  // TODO
  return binding.CallCredentials.createFromPlugin.apply(this, arguments);
};

module.exports.Channel = function(address, credentials, options) {
  // TODO
  return binding.Channel.apply(this, arguments);
};

module.exports.ChannelCredentials = function() {
  // TODO
  return binding.ChannelCredentials.apply(this, arguments);
};

module.exports.ChannelCredentials.createSsl = function() {
  // TODO
  return binding.ChannelCredentials.createSsl.apply(this, arguments);
};

module.exports.ChannelCredentials.createInsecure = function() {
  // TODO
  return binding.ChannelCredentials.createInsecure.apply(this, arguments);
};

module.exports.Server = function() {
  // TODO
  return binding.Server.apply(this, arguments);
};

module.exports.ServerCredentials = function() {
  // TODO
  return binding.ServerCredentials.apply(this, arguments);
};

module.exports.ServerCredentials.createSsl = function() {
  // TODO
  return binding.ServerCredentials.createSsl.apply(this, arguments);
};

module.exports.ServerCredentials.createInsecure = function() {
  // TODO
  return binding.ServerCredentials.createInsecure.apply(this, arguments);
};

module.exports.metadataKeyIsLegal = function() {
  // TODO
  return binding.metadataKeyIsLegal.apply(this, arguments);
};

module.exports.metadataNonbinValueIsLegal = function() {
  // TODO
  return binding.metadataNonbinValueIsLegal.apply(this, arguments);
};

module.exports.metadataKeyIsBinary = function() {
  // TODO
  return binding.metadataKeyIsBinary.apply(this, arguments);
};

module.exports.setDefaultRootsPem = function() {
  // TODO
  return binding.setDefaultRootsPem.apply(this, arguments);
};

module.exports.setDefaultLoggerCallback = function() {
  // TODO
  return binding.setDefaultLoggerCallback.apply(this, arguments);
};

module.exports.setLogVerbosity = function() {
  // TODO
  return binding.setLogVerbosity.apply(this, arguments);
};
