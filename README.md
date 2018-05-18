# rover-js-sdk

rover-js-sdk is a Javascript library for communicating with a [Rover Orbit  server](https://github.com/laxmicoinofficial/go/tree/master/services/orbit). It is used for building Rover apps either on Node.js or in the browser.

It provides:
- a networking layer API for Orbit  endpoints.
- facilities for building and signing transactions, for communicating with a Rover Orbit  instance, and for submitting transactions or querying network history.

> **Warning!** Node version of `rover-base` (`rover-sdk` dependency) package is using [`ed25519`](https://www.npmjs.com/package/ed25519) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies). This means that if for any reason installation of this package fails, `rover-base` (and `rover-sdk`) will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
>
> If you are using `rover-sdk`/`rover-base` in a browser you can ignore this. However, for production backend deployments you should definitely be using `ed25519`. If `ed25519` is successfully installed and working `RoverSdk.FastSigning` variable will be equal `true`. Otherwise it will be `false`.

### rover-js-sdk vs rover-js-sdk

rover-js-sdk is a high-level library that serves as client side API for [Orbit ](https://github.com/laxmicoinofficial/go/tree/master/services/orbit). This library makes extensive use of the lower-level [rover-js-sdk](https://github.com/laxmicoinofficial/rover-js-base) and exposes rover-js-sdk classes via its export object.  rover-js-sdk can be used as a standalone library for creating Rover primitive constructs via XDR helpers and wrappers. rover-js-sdk doesn't depend on connecting to Orbit .

rover-js-sdk exposes all rover-js-sdk classes so you don't have to install rover-js-sdk along rover-js-sdk.

## Quick start

Using npm to include rover-js-sdk in your own project:
```shell
npm install --save rover-sdk
```

For browsers, [use Bower to install rover-js-sdk](#to-self-host-for-use-in-the-browser). It exports a
variable `RoverSdk`. The example below assumes you have `rover-sdk.js`
relative to your html file.

```html
<script src="rover-sdk.js"></script>
<script>console.log(RoverSdk);</script>

```

## Install

### To use as a module in a Node.js project
1. Install it using npm:
  ```shell
  npm install --save rover-sdk
  ```

2. require/import it in your JavaScript:
  ```js
  var RoverSdk = require('rover-sdk');
  ```

#### Help! I'm having trouble installing the SDK on Windows

Unfortunately, the Rover platform development team mostly works on OS X and Linux, and so sometimes bugs creep through that are specific to windows.  When installing rover-sdk on windows, you might see an error that looks similar to the following:

```shell
error MSB8020: The build tools for v120 (Platform Toolset = 'v120 ') cannot be found. To build using the v120 build tools, please install v120 build tools.  Alternatively, you may upgrade to the current Visual Studio tools by selecting the Project menu or right-click the solution, and then selecting "Retarget solution"
```

To resolve this issue, you should upgrade your version of nodejs, node-gyp and then re-attempt to install the offending package using `npm install -g --msvs_version=2015 ed25519`.  Afterwards, retry installing rover-sdk as normal.

If you encounter the error: "failed to find C:\OpenSSL-Win64", You need to install OpenSSL. More information about this issue can be found [here](https://github.com/nodejs/node-gyp/wiki/Linking-to-OpenSSL).

In the event the above does not work, please join us on our community slack to get help resolving your issue.

### To self host for use in the browser
1. Install it using [bower](http://bower.io):

  ```shell
  bower install rover-sdk
  ```

2. Include it in the browser:

  ```html
  <script src="./bower_components/rover-sdk/rover-sdk.js"></script>
  <script>console.log(RoverSdk);</script>
  ```

If you don't want to use install Bower, you can copy built JS files from the [bower-rover-js-sdk repo](https://github.com/stellar/bower-js-stellar-sdk).

### To use the [cdnjs](https://cdnjs.com/libraries/stellar-sdk) hosted script in the browser
1. Instruct the browser to fetch the library from [cdnjs](https://cdnjs.com/libraries/stellar-sdk), a 3rd party service that hosts js libraries:

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/{version}/stellar-sdk.js"></script>
  <script>console.log(RoverSdk);</script>
  ```

Note that this method relies using a third party to host the JS library. This may not be entirely secure.

Make sure that you are using the latest version number. They can be found on the [releases page in Github](https://github.com/laxmicoinofficial/rover-js-sdk/releases).

### To develop and test rover-js-sdk itself
1. Clone the repo:
  ```shell
  git clone https://github.com/laxmicoinofficial/rover-js-sdk.git
  ```

2. Install dependencies inside rover-js-sdk folder:
  ```shell
  cd rover-js-sdk
  npm install
  ```

## Usage
For information on how to use rover-js-sdk, take a look at the [Developers site](http://www.rover.network/developers/rover-js-sdk/reference/index.html).

There is also API Documentation [here](http://www.rover.network/developers/reference).

## Testing
To run all tests:
```shell
gulp test
```

To run a specific set of tests:
```shell
gulp test:node
gulp test:browser
```

## Documentation
Documentation for this repo lives in [Developers site](http://www.rover.network/developers/rover-js-sdk/reference/index.html).

## Contributing
For information on how to contribute, please refer to our [contribution guide](https://github.com/laxmicoinofficial/rover-js-sdk/blob/master/CONTRIBUTING.md).

## Publishing to npm
```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```
A new version will be published to npm **and** Bower by Travis CI.

npm >=2.13.0 required.
Read more about [npm version](https://docs.npmjs.com/cli/version).

## License
rover-js-sdk is licensed under an Apache-2.0 license. See the [LICENSE](https://github.com/laxmicoinofficial/rover-js-sdk/blob/master/LICENSE) file for details.
