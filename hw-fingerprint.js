"use strict"

const { EOL, endianness } = require('os')
const { createHash } = require('crypto')
const {
  system,
  bios,
  baseboard,
  cpu,
  mem,
  osInfo,
  blockDevices
} = require('systeminformation')

const FINGERPRINTING_INFO = (async function() {
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
    speedmax,
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
    endianess: endianness(),
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
    speedmax,
    cores,
    physicalCores,
    socket,
    memTotal,
    platform,
    arch,
    hdds
  }
})()

const FINGERPRINT = (async function() {
  const fingerprintingInfo = await FINGERPRINTING_INFO
  const fingerprintString = Object.values(fingerprintingInfo).join('')
  const fingerprintHash = createHash('sha512').update(fingerprintString)
  return fingerprintHash.digest()
})()

function getFingerprint() {
  return FINGERPRINT
}

function getFingerprintingInfo() {
  return FINGERPRINTING_INFO
}

module.exports = { getFingerprint, getFingerprintingInfo }
