# hw-fingerprint

Hardware-based fingerprint for Node and Electron

## About

This library provides a `fingerprint()` function that produces a 512-bit signature based on the host machine's hardware information, suitable for use in Electron or Node client apps that require authentication against a server.

It uses information provided by [Node's OS module](https://nodejs.org/api/os.html) and [systeminformation](https://nodejs.org/api/os.html) library and has no other dependencies.


## Usage

`fingerprint()` is always **asynchronous** and returns a [Node Buffer](https://nodejs.org/api/buffer.html). The returned promise is internally cached, so the actual implementation gets called just once.

```js
  const { fingerprint } = require('hw-fingerprint')

  // with async/await
  async function(){
    const signature = await fingerprint()
    // do something
  }

  // with promises
  function(){
    fingerprint.then(function(signature){
      // do something
    })
  }
```
