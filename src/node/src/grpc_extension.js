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
if (!global.experimental && !process.env.GRPC_HTTP2) {
  var binary = require('node-pre-gyp/lib/pre-binding');
  var path = require('path');
  var binding_path =
      binary.find(path.resolve(path.join(__dirname, '../../../package.json')));
  var binding = require(binding_path);

  module.exports = binding;
  return;
}
console.error('Using prototype gRPC client built with Node.js experimental http2 implementation.');

// Defined constants
module.exports = Object.assign({}, require('./impl/constants.js'));

module.exports.Call = require('./impl/call.js');

module.exports.CallCredentials = require('./impl/call_credentials.js');

module.exports.Channel = require('./impl/channel.js');

module.exports.ChannelCredentials = require('./impl/channel_credentials.js');

module.exports.Server = function() {
  // TODO
  const args = Array.prototype.slice.apply(arguments).join(', ');
  throw new Error(`Server(${args}): not implemented`);
};

module.exports.ServerCredentials = function() {
  // TODO
  const args = Array.prototype.slice.apply(arguments).join(', ');
  throw new Error(`ServerCredentials(${args}): not implemented`);
};

module.exports.ServerCredentials.createSsl = function() {
  // TODO
  const args = Array.prototype.slice.apply(arguments).join(', ');
  throw new Error(`ServerCredentials.createSsl(${args}): not implemented`);
};

module.exports.ServerCredentials.createInsecure = function() {
  // TODO
  const args = Array.prototype.slice.apply(arguments).join(', ');
  throw new Error(`ServerCredentials.createInsecure(${args}): not implemented`);
};

const isLegal = (legalChars, s) => s
  .split('')
  .map(c => !!(1 << (c.charCodeAt(0) & 7) && legalChars[c.charCodeAt(0) >> 3]))
  .reduce((a, b) => a && b, true)

module.exports.metadataKeyIsLegal = function(key) {
  const legalChars = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0xff, 0x03, 0x00, 0x00, 0x00,
    0x80, 0xfe, 0xff, 0xff, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ];
  return isLegal(legalChars, key);
};

module.exports.metadataNonbinValueIsLegal = function(value) {
  const legalChars = [
    0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0xff, 0xff, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ];
  return isLegal(legalChars, value);
};

module.exports.metadataKeyIsBinary = function(key) {
  // TODO
  return key.endsWith('-bin');
};

module.exports.setDefaultRootsPem = function() {
  // noop
};

module.exports.setDefaultLoggerCallback = function() {
  // noop
};

module.exports.setLogVerbosity = function() {
  // noop
};
