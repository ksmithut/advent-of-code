'use strict'

const fs = require('fs')
const Bluebird = require('bluebird')

fs.readFileAsync = Bluebird.promisify(fs.readFile, { context: fs })
fs.writeFileAsync = Bluebird.promisify(fs.writeFile, { context: fs })

module.exports = fs
