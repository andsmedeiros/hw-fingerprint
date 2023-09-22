import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { EOL, endianness } from 'node:os'
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
 * @typedef {Object} FingerprintingInfo An object that holds all the system information
 * used for fingerprinting
 *
 * @property {string} EOL - OS-defined end-of-line (typically LF or CR+LF)
 * @property {string} endianness - CPU and/or OS-defined multibyte integer endianness
 * @property {string} manufacturer - Computer manufacturer
 * @property {string} model - CPU model
 * @property {string} serial - CPU serial
 * @property {string} uuid - CPU UUID
 * @property {string} vendor - Bios vendor
 * @property {string} biosVersion - Bios version
 * @property {string} releaseDate - Bios release date
 * @property {string} boardManufacturer Board manufacturer
 * @property {string} boardModel Board model
 * @property {string} boardSerial Board serial
 * @property {string} cpuManufacturer CPU manufacturer
 * @property {string} brand CPU brand
 * @property {string} speedMax CPU speed max
 * @property {number} cores CPU cores
 * @property {number} physicalCores CPU physical cores
 * @property {string} socket CPU socket type
 * @property {number} memTotal Total system memory
 * @property {string} platform OS type
 * @property {string} arch OS architecture
 * @property {string[]} hdds List of HDDs concatenated model and serial
 */

/**
 * @constant FINGERPRINTING_INFO Available system parameters for fingerprint calculation
 * @type FingerprintingInfo
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
 * @constant FINGERPRINTING_PARAMETERS A list of string that names available parameters
 * to be considered during fingerprinting
 * @type {string[]}
 */
export const FINGERPRINTING_PARAMETERS = keys(FINGERPRINTING_INFO)

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
 * @param {object} [options={}] An object that controls which system parameters should be used for
 * fingerprint calculation
 * @param {string[]} [options.only=FINGERPRINTING_PARAMETERS] An inclusive property list; if provided,
 * only properties listed here are used for calculation
 * @param {string[]} [options.except=[]] An exclusive property list; if provided, all available properties
 * not listed here are used for calculation
 * @returns {Buffer} The 512-bit fingerprint as a `Buffer`
*/
export function getFingerprint({ only = FINGERPRINTING_PARAMETERS, except = [] } = {}) {
    const parameters = FINGERPRINTING_PARAMETERS
        .filter(key => only.includes(key) && !except.includes(key))
    const cacheKey = parameters.join('')
    if(cacheKey in cachedFingerprints === false) {
        cachedFingerprints[cacheKey] = calculateFingerprint(parameters)
    }
    return cachedFingerprints[cacheKey]
}

/**
* Gets the available system parameters to be used in fingerprinting calculation. 
* This parameters can be used in conjunction with the `getFingerprint()` function to customise fingerprint generation.
* @returns {FingerprintingInfo} An object containing all the available fingerprinting parameters
*/
export function getFingerprintingInfo() {
    return FINGERPRINTING_INFO
}