'use strict'

module.exports = function parseNum (num) {
  num = String(num).replace(/^[^\d]*/, '')
  return parseInt(num, 10)
}
