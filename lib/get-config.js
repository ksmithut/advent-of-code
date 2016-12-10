'use strict'

const PACKAGE_PATH = `${process.cwd()}/package.json`
const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const DEFAULT_YEAR = NOW.getMonth() === 11
  ? CURRENT_YEAR
  : CURRENT_YEAR - 1
const DEFAULT_CONFIG = {
  year: DEFAULT_YEAR,
  session: process.env.ADVENT_SESSION,
}

let PACKAGE = {}
try { PACKAGE = require(PACKAGE_PATH) } // eslint-disable-line global-require
catch (ex) { /* no-op */ }

module.exports = function getConfig(args) {
  return Object.assign(
    {},
    DEFAULT_CONFIG,
    PACKAGE.adventConfig,
    JSON.parse(JSON.stringify(args))
  )
}


