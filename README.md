# hw-fingerprint

Hardware-based fingerprint for Node and Electron

## About

This library provides a `getFingerprint()` function that produces a 512-bit signature based on the host machine's hardware information, suitable for use in Electron or Node client apps that require authentication against a server.
To get the information used to generate the fingerprint, use `getFingerprintingInfo()`

It uses information provided by [Node's OS module](https://nodejs.org/api/os.html) and [systeminformation](https://github.com/sebhildebrandt/systeminformation) library and has no other dependencies.


## Usage

`getFingerprint()` is always **asynchronous** and returns a [Node Buffer](https://nodejs.org/api/buffer.html). The returned promise is internally cached, so the actual implementation gets called just once.

```js
  const { getFingerprint } = require('hw-fingerprint')

  // with async/await
  async function(){
    const fingerprint = await getFingerprint()
    // do something
  }

  // with promises
  function(){
    getFingerprint.then(function(fingerprint){
      // do something
    })
  }
```
