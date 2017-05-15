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

const tls = require('tls');

const kUseTLS = Symbol("UseTLS");
const kSecureContext = Symbol("SecurityContext");
const kCallCredentials = Symbol("CallCredentials");

class ChannelCredentials {
  constructor(useTLS) {
    this[kUseTLS] = useTLS;
  }

  useTLS() {
    return this[kUseTLS];
  }

  getSecureContext() {
    return this[kSecureContext];
  }

  getCallCredentials() {
    return this[kCallCredentials];
  }

  compose(callCredentials) {
    if (!this[kCallCredentials]) {
      this[kCallCredentials] = callCredentials;
    } else {
      this[kCallCredentials] = this[kCallCredentials].compose(
          callCredentials);
    }
    return this;
  }
};

ChannelCredentials.createSsl = function() {
  var creds = new ChannelCredentials(true);
  if (arguments.length > 0) {
    // C code requires ca/key/cert are buffers.
    var opts = {};
    if (arguments[0] !== undefined) {
      opts.ca = arguments[0];
    }
    if (arguments[1] !== undefined) {
      opts.key = arguments[1];
    }
    if (arguments[2] !== undefined) {
      opts.cert = arguments[2];
    }
    var context = tls.createSecureContext(opts);
    creds[kSecureContext] = context;
  }
  return creds;
};

ChannelCredentials.createInsecure = function() {
  return new ChannelCredentials(false);
};

module.exports = ChannelCredentials;
