#!/usr/bin/env node

'use strict'

process.title = 'advent'

const program = require('commander')
const debug = require('debug')('advent')
const messages = require('../lib/messages')
const getConfig = require('../lib/get-config')
const parseNum = require('../lib/utils/parse-num')
const pkg = require('../package.json')

program.version(pkg.version)

program
  .command('help', messages.help.description)
  .action(() => program.help())

program
  .command('run <day> <part> <input>')
  .description(messages.run.description)
  .option('-y, --year [year]', messages.run.year)
  .option('-s, --session [cookie]', messages.run.session)
  .action((day, part, input, command) => {
    const runDay = require('../lib/run-day') // eslint-disable-line global-require
    part = parseNum(part)
    day = parseNum(day)
    const config = getConfig({
      year: command.year,
      day,
      part,
      session: command.session,
      part1: part === 1,
      part2: part === 2,
    })
    debug('running part %s day %s year %s...',
      config.part,
      config.day,
      config.year
    )
    runDay(input, config)
  })
  .on('--help', () => console.log(messages.run.help)) // eslint-disable-line no-console

program
  .command('init <day>')
  .description(messages.init.description)
  .option('-y, --year [year]', messages.init.year)
  .action((day, command) => {
    const initDay = require('../lib/init-day') // eslint-disable-line global-require
    const config = getConfig({
      year: command.year,
      day: parseNum(day),
      session: command.session,
    })
    debug('initializing day %s year %s', config.day, config.year)
    initDay(config)
  })
  .on('--help', () => console.log(messages.init.help)) // eslint-disable-line no-console

program.parse(process.argv)
