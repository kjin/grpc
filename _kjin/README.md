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
