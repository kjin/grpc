/*
 *
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

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
