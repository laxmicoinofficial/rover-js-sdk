---
title: orderbook()
---

## Overview

An orderbook is a summary of all offers for a given pair of [`Assets`](http://www.rover.network/developers/guides/concepts/assets.html).  In order to read information about an orderbook from a Orbit  server, the [`server`](./server.md) object provides the `orderbook()` function. `orderbook()` returns an `OrderbookCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

`orderbook()` must take two parameters to be valid. By passing it a `selling` Asset and a `buying` Asset,`orderbook()` gives you access to the [`orderbook_details`](http://www.rover.network/developers/orbit/reference/endpoints/orderbook-details.html) endpoint.

## Methods

| Method | Orbit  Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `orderbook(selling, buying)` | [`orderbook_details`](http://www.rover.network/developers/orbit/reference/endpoints/orderbook-details.html) | [`Asset`](https://github.com/laxmicoinofficial/rover-js-sdk/blob/master/src/asset.js), [`Asset`](https://github.com/laxmicoinofficial/rover-js-sdk/blob/master/src/asset.js) | Access orderbook summary of all offers with the assets `selling` and `buying`. 
| `.call()` | | | Triggers a HTTP Request to the Orbit  server based on the builder's current configuration.  Returns a `Promise` that resolves to the server's response.  For more on `Promise`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).|
| `.stream({options})` | | object of [properties](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Properties) | Creates an `EventSource` that listens for incoming messages from the server.  URL based on builder's current configuration.  For more on `EventSource`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). |

## Examples

```js
var RoverSdk = require('rover-network-sdk');
var server = new RoverSdk.Server('https://orbit-testnet.rover.network');

server.orderbook(new RoverSdk.Asset("EUR", "GCQPYGH4K57XBDENKKX55KDTWOTK5WDWRQOH2LHEDX3EKVIQRLMESGBG"), new RoverSdk.Asset("USD", "GC23QF2HUE52AMXUFUH3AYJAXXGXXV2VHXYYR6EYXETPKDXZSAW67XO4"))
  .trades()
  .call()
  .then(function(resp) { console.log(resp); })
  .catch(function(err) { console.log(err); })
```
