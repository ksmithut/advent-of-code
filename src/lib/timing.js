'use strict'

/**
 * @function timing
 */
const timing = (process = global.process) => {
  const start = process.hrtime()
  return () => {
    const [seconds, nanoseconds] = process.hrtime(start)
    return (seconds * 1e9 + nanoseconds) / 1e6
  }
}

module.exports = timing
