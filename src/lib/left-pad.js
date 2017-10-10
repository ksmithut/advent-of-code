'use strict'

/**
 * @function leftPad
 * @param {string} string
 * @param {number} minLength
 * @param {string} char
 */
const leftPad = (string, minLength, char) => {
  const diff = Math.max(minLength - string.length, 0)
  return char.repeat(diff) + string
}

module.exports = leftPad
