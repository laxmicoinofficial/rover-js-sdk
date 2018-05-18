---
title: operations()
---

## Overview

In order to read information about operations from a Orbit  server, the [`server`](./server.md) object provides the `operations()` function. `operations()` returns an `TransactionCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `operations()` provides access to the [`operations_all`](http://www.rover.network/developers/orbit/reference/endpoints/operations-all.html) Orbit  endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method | Orbit  Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `operations()` | [`operations_all`](http://www.rover.network/developers/orbit/reference/endpoints/operations-all.html) | | Access all operations. |
| `.operation("operationID")` | [`operations_single`](http://www.rover.network/developers/orbit/reference/endpoints/operations-single.html) | `string` | Pass in the ID of a particular operation to access its details. |
| `.forAccount("address")` | [`operations_for_account`](http://www.rover.network/developers/orbit/reference/endpoints/operations-all.html) | `string` | Pass in the address of a particular account to access its operations.|
| `.forLedger("ledgerSeq")` | [`operation_for_ledger`](http://www.rover.network/developers/orbit/reference/endpoints/operations-for-ledger.html) | `string` | Pass in the sequence of a particular ledger to access its operations. |
| `.forTransaction("transactionHash")` | [`operations_for_transaction`](http://www.rover.network/developers/orbit/reference/endpoints/operations-for-transaction.html) | `string` |  Pass in the hash of a particular transaction to access its operations. |
| `.limit(limit)` | | `integer` | Limits the number of returned resources to the given `limit`.|
| `.cursor("token")` | | `string` | Return only resources after the given paging token. |
| `.order({"asc" or "desc"})` | | `string` |  Order the returned collection in "asc" or "desc" order. |
| `.call()` | | | Triggers a HTTP Request to the Orbit  server based on the builder's current configuration.  Returns a `Promise` that resolves to the server's response.  For more on `Promise`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).|
| `.stream({options})` | | object of [properties](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Properties) | Creates an `EventSource` that listens for incoming messages from the server.  URL based on builder's current configuration.  For more on `EventSource`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). |


## Examples

```js
var RoverSdk = require('rover-network-sdk');
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');

server.operations()
  .forAddress("GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K")
  .order("desc")
  .call()
  .then(function (operationResult) {
    console.log(operationResult);
  })
  .catch(function (err) {
    console.error(err);
  })
```
