'use strict'

const getStdin = require('get-stdin')
const api = require('./api')

const trim = (val) => val.trim()

module.exports = function getInput(input, options) {
  if (input === '-') return getStdin().then(trim)
  if (input === '+') return api.getInput(options).then(trim)
  return Promise.resolve(input)
}
