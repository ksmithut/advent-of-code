'use strict'

const path = require('path')
const fs = require('fs')
const debug = require('./util/debug')
const { readFile, writeFile, access, mkdirp } = require('./util/fs')

const init = config => {
  debug(`Checking for existing file: ${config.dayFilepath}`)
  return Promise.all([
    readFile(config.templateFile, 'utf8'),
    access(config.dayFilepath, fs.constants.R_OK)
      .then(() => true)
      .catch({ code: 'ENOENT' }, () => false)
  ]).then(([template, existingFile]) => {
    if (existingFile) {
      debug('Found existing file. Ignoring.')
      return
    }
    debug(
      'Day file not found, generating %s from %s',
      config.dayFilepath,
      config.templateFile
    )
    const directory = path.dirname(config.dayFilepath)
    return mkdirp(directory)
      .then(() => writeFile(config.dayFilepath, template, 'utf8'))
      .then(() => {
        debug('Generated %s successfully', config.dayFilepath)
      })
  })
}

module.exports = init
