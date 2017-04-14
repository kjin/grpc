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

module.exports = binding;

// Uncomment this line to use vanilla implementation
// return;

// Defined constants
module.exports = Object.assign({}, require('./impl/constants.js'));

module.exports.Call = require('./impl/call.js');

module.exports.CallCredentials = function() {
  // TODO
  return binding.CallCredentials.apply(this, arguments);
};

module.exports.CallCredentials.createFromPlugin = function() {
  // TODO
  return binding.CallCredentials.createFromPlugin.apply(this, arguments);
};

module.exports.Channel = require('./impl/channel.js');

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
