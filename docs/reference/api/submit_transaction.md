---
title: submitTransaction()
---

## Overview

You can build a transaction locally (see [this example](../readme.md#building-transactions)), but after you build it you have to submit it to the Rover network.  rover-js-sdk has a function `submitTransaction()` that sends your transaction to the Orbit  server (via the [`transactions_create`](http://www.rover.network/developers/orbit/reference/transactions-create.html) endpoint) to be broadcast to the Rover network.

## Methods

| Method | Orbit  Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `submitTransaction(Transaction)` | [`transactions_create`](http://www.rover.network/developers/orbit/reference/transactions-create.html) |  [`Transaction`](https://github.com/laxmicoinofficial/rover-js-sdk/blob/master/src/transaction.js) | Submits a transaction to the network.

## Example

```js
var RoverSdk = require('rover-js-sdk')
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');

var transaction = new RoverSdk.TransactionBuilder(account)
        // this operation funds the new account with XLM
        .addOperation(RoverSdk.Operation.payment({
            destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
            asset: RoverSdk.Asset.native(),
            amount: "20000000"
        }))
        .build();

transaction.sign(RoverSdk.Keypair.fromSeed(seedString)); // sign the transaction

server.submitTransaction(transaction)
    .then(function (transactionResult) {
        console.log(transactionResult);
    })
    .catch(function (err) {
        console.error(err);
    });
```
