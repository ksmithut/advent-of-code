'use strict'

const getStdin = require('get-stdin')
const debug = require('debug')('advent')
const api = require('./api')

const trim = val => val.trim()

module.exports = function getInput (input, options) {
  if (input === '-') {
    debug('pulling input from stdin')
    return getStdin().then(trim)
  }
  if (input === '+') {
    debug('pulling input from official source')
    return api.getInput(options).then(trim)
  }
  debug('pulling input from argument')
  return Promise.resolve(input)
}
