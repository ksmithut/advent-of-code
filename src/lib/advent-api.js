'use strict'

const request = require('request-promise')
const assertError = require('./assert-error')
const pkg = require('../../package.json')

const ADVENT_HOST = 'http://adventofcode.com'
const USER_AGENT = `node/${process.version} ${pkg.name}/${pkg.version}`

/**
 * @function getInput
 * Gets the input from the advent of code website
 * @param {Object} options
 * @param {String|Number} options.year - The year to pull input from
 * @param {String|Number} options.day - The day to pull input from
 * @param {String} options.session - The advent session cookie to use
 */
const getInput = ({ year, day, session }) => {
  assertError(year, ReferenceError, 'You must provide a year')
  assertError(day, ReferenceError, 'You must provide a day')
  assertError(session, ReferenceError, 'You must provide your own session')
  const inputUri = `${ADVENT_HOST}/${year}/day/${day}/input`
  const headers = {
    'User-Agent': USER_AGENT,
    Cookie: session
  }
  return request({ method: 'GET', uri: inputUri, headers })
}

module.exports = {
  ADVENT_HOST,
  USER_AGENT,
  getInput
}
