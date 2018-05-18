---
title: payments()
---

## Overview

In order to read information about payments from a Orbit  server, the [`server`](./server.md) object provides the `payments()` function. `payments()` returns an `TransactionCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `payments()` provides access to the [`payments_all`](http://www.rover.network/developers/orbit/reference/endpoints/payments-all.html) Orbit  endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method | Orbit  Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `payments()` | [`payments_all`](http://www.rover.network/developers/orbit/reference/endpoints/payments-all.html) |  | Access all payments.
| `.forAccount("address")` | [`payments_for_account`](http://www.rover.network/developers/orbit/reference/endpoints/payments-for-account.html) | `string` | Pass in the address of a particular account to access its payments.|
| `.forLedger("ledgerSeq")` | [`payments_for_ledger`](http://www.rover.network/developers/orbit/reference/endpoints/payments-for-ledger.html) | `string` | Pass in the sequence of a particular ledger to access its payments. |
| `.forTransaction("transactionHash")` | [`payments_for_transactions`](http://www.rover.network/developers/orbit/reference/endpoints/payments-for-transaction.html) | `string` |  Pass in the hash of a particular transaction to access its payments. |
| `.limit(limit)` | | `integer` | Limits the number of returned resources to the given `limit`.|
| `.cursor("token")` | | `string` | Return only resources after the given paging token. |
| `.order({"asc" or "desc"})` | | `string` |  Order the returned collection in "asc" or "desc" order. |
| `.call()` | | | Triggers a HTTP Request to the Orbit  server based on the builder's current configuration.  Returns a `Promise` that resolves to the server's response.  For more on `Promise`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).|
| `.stream({options})` | | object of [properties](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Properties) | Creates an `EventSource` that listens for incoming messages from the server.  URL based on builder's current configuration.  For more on `EventSource`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). |


## Examples

```js
var RoverSdk = require('rover-sdk');
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');

server.payments()
  .forAddress("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ")
  .call()
  .then(function (operationResult) {
    console.log(operationResult);
  })
  .catch(function (err) {
    console.error(err);
  })
```
