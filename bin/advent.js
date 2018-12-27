#!/usr/bin/env node
'use strict'

const cli = require('../src/cli')
const debug = require('../src/util/debug')

process.title = 'advent'

cli()
  .then(output => {
    if (typeof output !== 'undefined') console.log(output)
  })
  .catch(err => {
    debug('error running advent')
    console.error(err.stack)
  })
