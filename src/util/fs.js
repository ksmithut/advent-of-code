'use strict'

const Bluebird = require('bluebird')
const fs = require('fs')
const mkdirp = require('mkdirp')

/**
 * Exported fs functions promisified. Done here so when multiple files need
 * promisified fs files that we only do it once to speed up startup time.
 */
exports.readFile = Bluebird.promisify(fs.readFile.bind(fs))
exports.writeFile = Bluebird.promisify(fs.writeFile.bind(fs))
exports.access = Bluebird.promisify(fs.access.bind(fs))
exports.mkdirp = Bluebird.promisify(mkdirp)
