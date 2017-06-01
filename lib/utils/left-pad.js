'use strict'

module.exports = function leftPad (string, minLength, char) {
  const diff = Math.max(minLength - string.length, 0)
  return char.repeat(diff) + string
}
