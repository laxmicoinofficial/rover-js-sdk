---
title: dakibot()
---

## Overview

Dakibot is an utility that funds a new account.  When you create a new account, that account has no balance and does not exist in the ledger until it is funded.  Dakibot fixes that problem.

The mechanics underlying Dakibot (i.e., how a new account is funded) are determined by each Orbit  server's administrator.

## Methods

| Method | Orbit  Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `dakibot("address")` | | `string` | Funds the new account with the given address.  Fails if account is already funded. |
| `.call()` |  | | Triggers a HTTP Request to the Orbit  server based on the builder's current configuration.  Returns a `Promise` that resolves to the server's response.  For more on `Promise`, see []().|
| `.stream(options)` | | object containing the optional functions `onmessage` and `onerror` | Creates an `Eventsource` that listens for incoming messages from the server.  URL based on builder's current configuration.  For more on `Eventsource`, see []() |


## Examples

```js
var RoverLib = require('rover-sdk');

var new_seed = RoverLib.Keypair.random()
var new_address = new_seed.accountId()

server.dakibot(new_address)
  .then(function(resp) {
    console.log(resp);
  })
  .catch(function(err) {
    console.log(err);
  });
```
