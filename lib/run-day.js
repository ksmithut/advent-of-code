'use strict'

const debug = require('debug')('advent')
const getDayPath = require('./get-day-path')
const getInput = require('./get-input')

module.exports = function runDay (input, options) {
  const dayFilepath = getDayPath(options.day)
  const dayModule = require(dayFilepath) // eslint-disable-line global-require
  getInput(input, options)
    .then(val => {
      let trimmedInput = val.substr(0, 10)
      if (trimmedInput.length < val.length) trimmedInput += '...'
      debug('running with input: "%s"', trimmedInput)
      if (options.part1) return dayModule.part1(val)
      if (options.part2) return dayModule.part2(val)
      throw new Error('Pass -1/--part1 or -2/--part2 in order to run the part')
    })
    .then(console.log) // eslint-disable-line no-console
    .catch(err => console.log(err)) // eslint-disable-line no-console
}
