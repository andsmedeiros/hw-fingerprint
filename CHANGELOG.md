# Changelog

## v3.1.0

- Updates `systeminformation` to version 5.21.8
- Adds a `FINGERPRINTING_PARAMETERS` constant export that holds `Object.keys(FINGERPRINTING_INFO)`
- Adds better type definitions with JSDoc
- Updates README.md

## v3.0.1

- Updates README.md

## v3.0.0

- Switches from CommonJS to ESM
- Uses top-level `await` to provide sync functions
- Makes `getFingerprint()` function accept an optional object with two properties: `only` and `except`. Each is an array of properties to filter which system parameters to use in fingerprint calculation.
- Corrects `FINGERPRINTING_INFO` property for system endianness being incorrectly spelled `endianess`
- Provided JSDoc annotations