'use strict'

const getStdin = require('get-stdin')
const timing = require('./lib/timing')
const advent = require('./lib/advent-api')
const cache = require('./util/cache')
const debug = require('./util/debug')

const getInput = (input, config) => {
  let inputPromise
  if (input === '-') {
    // If input is `-`, get from stdin
    debug('Input is stdin, reading stdin')
    inputPromise = getStdin()
  } else if (input === '+') {
    // If input is `+`, get from adventofcode
    const cacheKey = `${config.year}:${config.day}`
    debug(`Input is from adventofcode.com. Checking cache.`)
    const cachedValue = cache.get(cacheKey)
    if (cachedValue) {
      debug(`Cache found! Returning cached value`)
      inputPromise = Promise.resolve(cachedValue)
    } else {
      debug('Cache not found. Retrieving from adventofcode.com.')
      inputPromise = advent
        .getInput({
          year: config.year,
          day: config.day,
          session: config.session
        })
        .then(input => {
          cache.set(cacheKey, input)
          return input
        })
    }
  } else {
    // Otherwise, just use raw input value
    debug('Getting raw input from argument')
    inputPromise = Promise.resolve(input)
  }
  return inputPromise.then(val => val.trim()).then(input => {
    debug('Successfully got input')
    return input
  })
}

const run = (rawInput, config) => {
  let time
  return getInput(rawInput, config)
    .then(input => {
      debug(`Getting day module at ${config.dayFilepath}`)
      const dayModule = require(config.dayFilepath)
      if (config.part === 1) {
        debug(`Running part 1`)
        time = timing()
        return dayModule.part1(input)
      }
      if (config.part === 2) {
        debug(`Running part 2`)
        time = timing()
        return dayModule.part2(input)
      }
      throw new RangeError('Not a valid part. Must be 1 or 2.')
    })
    .then(output => {
      const end = time()
      debug(`Got output in ${end}ms`)
      console.log(output)
    })
    .catch(err => {
      debug('error running advent run')
      console.error(err.stack)
    })
}

module.exports = run
