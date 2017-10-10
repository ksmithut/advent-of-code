'use strict'

const ConfigStore = require('configstore')
const pkg = require('../../package.json')

const cache = new ConfigStore(pkg.name, {})

module.exports = cache
