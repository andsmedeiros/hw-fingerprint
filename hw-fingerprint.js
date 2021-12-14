import { EOL, endianness } from 'node:os'
import { createHash } from 'node:crypto'
import {
    system,
    bios,
    baseboard,
    cpu,
    mem,
    osInfo,
    blockDevices
} from 'systeminformation'
const { keys } = Object

/**
* Available system parameters for fingerprint calculation.
*/
export const FINGERPRINTING_INFO = await (async function() {
    const { manufacturer, model, serial, uuid } = await system()
    const { vendor, version: biosVersion, releaseDate } = await bios()
    const {
        manufacturer: boardManufacturer,
        model: boardModel,
        serial: boardSerial
    } = await baseboard()
    const {
        manufacturer: cpuManufacturer,
        brand,
        speedMax,
        cores,
        physicalCores,
        socket
    } = await cpu()
    const { total: memTotal } = await mem()
    const { platform, arch } = await osInfo()
    const devices = await blockDevices()
    const hdds = devices
    .filter(({ type, removable }) => type === 'disk' && !removable)
    .map(({ model, serial }) => model + serial)
    
    return {
        EOL,
        endianness: endianness(),
        manufacturer,
        model,
        serial,
        uuid,
        vendor,
        biosVersion,
        releaseDate,
        boardManufacturer,
        boardModel,
        boardSerial,
        cpuManufacturer,
        brand,
        speedMax: speedMax.toFixed(2),
        cores,
        physicalCores,
        socket,
        memTotal,
        platform,
        arch,
        hdds
    }
})()

/**
* Calculates the fingerprint for given system parameters, ordered as 'FINGERPRINTING_INFO` properties
* @param {string[]} parameters System parameters to use for fingerprinting calculation
* @returns {Buffer} The 512-bit fingerprint as a `Buffer`
*/
function calculateFingerprint(parameters) {
    const fingerprintString = parameters.map(param => FINGERPRINTING_INFO[param]).join('')
    const fingerprintHash = createHash('sha512').update(fingerprintString)
    return fingerprintHash.digest()
}

const cachedFingerprints = {}

/**
* Calculates the 512-bit fingerprint using this system's parameters. 
* Additional customisation of which parameters are accounted for are available through the `options` parameter.
* @param {object} options An object that controls which system parameters should be used for fingerprint calculation 
* @param {string[]} options.only An inclusive property list; if provided, only properties listed here are used for calculation 
* @param {string[]} options.except An exclusive property list; if provided, all available properties not listed here are used for calculation
* @returns {Buffer} The 512-bit fingerprint as a `Buffer`
*/
export function getFingerprint({ only = keys(FINGERPRINTING_INFO), except = [] } = {}) {
    const parameters = keys(FINGERPRINTING_INFO)
        .filter(key => only.includes(key) && !except.includes(key))
    const cacheKey = parameters.join('')
    if(cacheKey in cachedFingerprints === false) {
        cachedFingerprints[cacheKey] = calculateFingerprint(parameters)
    }
    return cachedFingerprints[cacheKey]
}

/**
* Gets the available system parameters to be used in fingerprinting calculation. 
* This parameters can be used in conjuction with the `getFingerprint()` function to customise fingerprint generation.
* @returns An object containing all the available fingerprinting parameters
*/
export function getFingerprintingInfo() {
    return FINGERPRINTING_INFO
}