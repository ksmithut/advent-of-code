'use strict'

/**
 * @function softRequire
 * @param {string} packagePath - The absolute path to the module you would like
 *   to require
 * @param {Mixed} [defaultValue=null] - The value to return if the module cannot
 *   be included
 */
const softRequire = (packagePath, defaultValue = null) => {
  try {
    return require(packagePath)
  } catch (ex) {
    return defaultValue
  }
}

module.exports = softRequire
