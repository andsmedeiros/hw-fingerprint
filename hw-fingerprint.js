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
} = require('si')

const FINGERPRINT = (async function(){
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

  const fingerprintSegments = [
    EOL,
    endianness(),
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
    ...hdds
  ]
  const fingerprintString = fingerprintSegments.join('')
  const fingerprintHash = createHash('sha512').update(fingerprintString)
  return fingerprintHash.digest()
})()

function fingerprint(){
  return FINGERPRINT
}

export { fingerprint }
