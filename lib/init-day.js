'use strict'

const path = require('path')
const Bluebird = require('bluebird')
const debug = require('./utils/debug')
const fs = require('./utils/fs')
const getDayPath = require('./get-day-path')

const DAY_TEMPLATE_PATH = path.join(__dirname, 'templates', 'day.js')

module.exports = function initDay (options) {
  const dayFilepath = getDayPath(options.day)
  debug('checking for existing file: %s', dayFilepath)
  return Bluebird.all([
    fs.readFileAsync(DAY_TEMPLATE_PATH, 'utf8'),
    fs.readFileAsync(dayFilepath, 'utf8').catch({ code: 'ENOENT' }, () => null)
  ]).spread((template, existingFile) => {
    if (existingFile) {
      return debug('found existing file. ignoring')
    }
    debug('day file not found, generating: %s', dayFilepath)
    return fs.writeFileAsync(dayFilepath, template, 'utf8')
  })
}
