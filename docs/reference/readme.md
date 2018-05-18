s---
title: Overview
---
The JavaScript Rover SDK facilitates integration with the [Rover Orbit  API server](https://github.com/stellar/horizon) and submission of Rover transactions, either on Node.js or in the browser. It has two main uses: [querying Orbit ](#querying-horizon) and [building, signing, and submitting transactions to the Rover network](#building-transactions).

[Building and installing rover-js-sdk](https://github.com/laxmicoinofficial/rover-js-sdk)<br>
[Examples of using rover-js-sdk](./examples.md)

# Querying Orbit 
rover-js-sdk gives you access to all the endpoints exposed by Orbit .

## Building requests
rover-js-sdk uses the [Builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) to create the requests to send
to Orbit . Starting with a [server](https://stellar.github.io/js-stellar-sdk/Server.html) object, you can chain methods together to generate a query.
(See the [Orbit  reference](https://www.rover.network/developers/reference/) documentation for what methods are possible.)
```js
var RoverSdk = require('rover-network-sdk');
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');
// get a list of transactions that occurred in ledger 1400
server.transactions()
    .forLedger(1400)
    .call().then(function(r){ console.log(r); });

// get a list of transactions submitted by a particular account
server.transactions()
    .forAccount('GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW')
    .call().then(function(r){ console.log(r); });
```

Once the request is built, it can be invoked with `.call()` or with `.stream()`. `call()` will return a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to the response given by Orbit .

## Streaming requests
Many requests can be invoked with `stream()`. Instead of returning a promise like `call()` does, `.stream()` will return an `EventSource`.
Orbit  will start sending responses from either the beginning of time or from the point specified with `.cursor()`.
(See the [Orbit  reference](https://www.rover.network/developers/reference/) documentation to learn which endpoints support streaming.)

For example, to log instances of transactions from a particular account:

```javascript
var RoverSdk = require('rover-network-sdk')
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');
var lastCursor=0; // or load where you left off

var txHandler = function (txResponse) {
    console.log(txResponse);
};

var es = server.transactions()
    .forAccount(accountAddress)
    .cursor(lastCursor)
    .stream({
        onmessage: txHandler
    })
```

## Handling responses

### XDR
The transaction endpoints will return some fields in raw [XDR](https://www.rover.network/developers/orbit/reference/xdr.html)
form. You can convert this XDR to JSON using the `.fromXDR()` method.

An example of re-writing the txHandler from above to print the XDR fields as JSON:

```javascript
var txHandler = function (txResponse) {
    console.log( JSON.stringify(RoverSdk.xdr.TransactionEnvelope.fromXDR(txResponse.envelope_xdr, 'base64')) );
    console.log( JSON.stringify(RoverSdk.xdr.TransactionResult.fromXDR(txResponse.result_xdr, 'base64')) );
    console.log( JSON.stringify(RoverSdk.xdr.TransactionMeta.fromXDR(txResponse.result_meta_xdr, 'base64')) );
};

```


### Following links
The links returned with the Orbit  response are converted into functions you can call on the returned object.
This allows you to simply use `.next()` to page through results. It also makes fetching additional info, as in the following example, easy:

```js
server.payments()
    .limit(1)
    .call()
    .then(function(response){
        // will follow the transactions link returned by Orbit 
        response.records[0].transaction().then(function(txs){
            console.log(txs);
        });
    });
```


# Transactions

## Building transactions

See the [Building Transactions](https://www.rover.network/developers/rover-js-base/reference/building-transactions.html) guide for information about assembling a transaction.

## Submitting transactions
Once you have built your transaction, you can submit it to the Rover network with `Server.submitTransaction()`.
```js
var RoverSdk = require('rover-network-sdk')
RoverSdk.Network.useTestNetwork();
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');

server
  .loadAccount(publicKey)
  .then(function(account){
  		var transaction = new RoverSdk.TransactionBuilder(account)
  				// this operation funds the new account with XLM
  				.addOperation(RoverSdk.Operation.payment({
  					destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
  					asset: RoverSdk.Asset.native(),
  					amount: "20000000"
  				}))
  				.build();

  		transaction.sign(RoverSdk.Keypair.fromSecret(secretString)); // sign the transaction

		return server.submitTransaction(transaction);
  })
  .then(function (transactionResult) {
    console.log(transactionResult);
  })
  .catch(function (err) {
  	console.error(err);
  });
```
