# hw-fingerprint

Hardware-based fingerprint for Node and Electron

## About

This library provides a `getFingerprint()` function that produces a 512-bit signature based on the host machine's hardware information, suitable for use in Electron or Node client apps that require authentication against a server. This signature is immutable as long as the underlying system is not changed, even across resets.

It uses information provided by [Node's OS module](https://nodejs.org/api/os.html) and [systeminformation](https://github.com/sebhildebrandt/systeminformation) library and has no other dependencies.


## Fingerprinting info

The information used for fingerprinting is:

- Operating system EOL (LF / CR+LF) and endianness (LE / BE)
- Computer manufacturer, model, serial and UUID
- BIOS vendor, version and release date
- Motherboard manufacturer, model and serial
- CPU manufacturer, brand, maximum speed, socket and number of cores and physical cores
- Total memory
- Platform and architecture
- HDDs model and serial

The library exports a constant `FINGERPRINTING_INFO`. This is an object that contains the raw information available for fingerprinting.


## Usage

`getFingerprint()` returns a [Node Buffer](https://nodejs.org/api/buffer.html) containing the 512-bit fingerprint. The returned buffer is internally cached, so the actual implementation gets called just once.

```js
import { getFingerprint } from 'hw-fingerprint'

const fingerprint = getFingerprint() /* Buffer */
```

To get the raw fingerprinting parameters, `import { FINGERPRINTING_INFO } from 'hw-fingerprint'`.

It is possible to filter on which parameters are actually used for fingerprint calculation:

```js
const fingerprint = getFingerprint({ 
    only: [ /* ... */ ],  // If specified, **only** these parameters will be taken in account
    except: [ /* ... */ ] // If specified, these parameters will **not** be taken in account
})
```

The available parameters' names are the same as `Object.keys(FINGERPRINTING_INFO)`:
```js
[ 'EOL', 'endianness', 'manufacturer', 'model', 'serial', 'uuid', 'vendor', 'biosVersion', 'releaseDate', 'boardManufacturer', 'boardModel', 'boardSerial', 'cpuManufacturer', 'brand', 'speedMax', 'cores', 'physicalCores', 'socket', 'memTotal', 'platform', 'arch', 'hdds' ]
```

Each combination of parameters will generate a different fingerprint. As long as the same set of parameters is always used, the fingerprint will always be the same.
Nonetheless, fingerprints are always cached internally.

## Upgrade v2.x -> v3.x

Back at v2.x, `getFingerprint()` was asynchronous, because the fingerprinting information depended on asynchronous functions. 

v3.x addresses this by raising the Node.js to a version that supports top-level `await`. This makes the `FINGERPRINTING_INFO` readily available in top-level and allows for synchronous fingerprinting.
Despite this, the `getFingerprint()` function signature is backwards compatible and the `getFingerprintingInfo()` function is still available.

The major breaking change in this release is dropping CJS in favour of ESM. 
Top-level await is only available in ES modules and I feel like it is necessary to push this boundary further already.

Also, fingerprinting parameter `endianess` (v2.x) was corrected to spell `endianness`.