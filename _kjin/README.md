You will need a node binary built from the tip of tree in this PR:

https://github.com/nodejs/node/pull/14239

When running this binary, use the `--expose-http2` flag to enable http2.

In addition, the environmental variable `GRPC_HTTP2` should be set (to anything)
to make the grpc module use experimental http2. The server won't work at all
because it's not implemented. However, this does mean that building the core
library is not strictly necessary for the client.

So in essence:

```sh
alias node-h2=${NODE_H2_PATH}
GRPC_HTTP2=1 node-h2 --expose-http2 [...]
```

## Caveat: running `mocha` tests

Instead of running `$(npm bin)/mocha` with `node-h2`, try: `node-h2 --expose-http2 $(npm bin)/_mocha`, because `mocha` doesn't support relaying the `--expose-http2` flag to Node yet.

## Caveat: running `index.js` in this directory

To enable SSL out of the box I used certificates and private keys from elsewhere in this repository. To support this you'll need to first edit `/etc/hosts` to add the following line:

```
127.0.0.1 waterzooi.test.google.be
```

Otherwise you'll likely end up with an error message like this:

```
E0720 13:27:51.292141450  105381 server_chttp2.c:38]         {"created":"@1500582471.292102760","description":"getaddrinfo failed","file":"../src/core/lib/iomgr/resolve_address_uv.c","file_line":81,"os_error":"unknown node or service"}
```
