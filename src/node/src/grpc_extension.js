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

module.exports = binding;

if (!global.nodeCoreHttp2) {
  return;
}

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
