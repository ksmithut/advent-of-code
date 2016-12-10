'use strict'

const path = require('path')
const leftPad = require('./utils/left-pad')

const DAY_NAME_TEMPLATE = 'day{{num}}.js'

module.exports = function getDayPath(day) {
  if (day < 1 || day > 25) {
    throw new Error('Day must be between 1 and 25 (inclusive)')
  }
  const strDay = leftPad(String(day), 2, '0')
  const dayFilename = DAY_NAME_TEMPLATE.replace('{{num}}', strDay)
  return path.resolve(dayFilename)
}
