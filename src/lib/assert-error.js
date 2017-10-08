'use strict'

const notContains = searchStr => fullStr => fullStr.indexOf(searchStr) === -1

/**
 * @function assertError
 * @param {Mixed} value - The value to assert. If truthy, nothing happens
 * @param {Error} ErrorClass - The error class to use if the value if falsy
 * @param {Mixed} [args] - The arguments to pass to the error class
 */
const assertError = (value, ErrorClass = Error, ...args) => {
  if (value) return
  const error = new ErrorClass(...args)
  if (error.stack) {
    error.stack = error.stack
      .split('\n')
      .filter(notContains(__filename))
      .join('\n')
  }
  throw error
}

module.exports = assertError
