#!/usr/bin/env node

'use strict'

process.title = 'advent'

const program = require('commander')
const messages = require('../lib/messages')
const getConfig = require('../lib/get-config')
const initDay = require('../lib/init-day')
const runDay = require('../lib/run-day')
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
    part = parseNum(part)
    const config = getConfig({
      year: command.year,
      day: parseNum(day),
      session: command.session,
      part1: part === 1,
      part2: part === 2,
    })
    runDay(input, config)
  })
  .on('--help', () => console.log(messages.run.help)) // eslint-disable-line no-console

program
  .command('init <day>')
  .description(messages.init.description)
  .option('-y, --year [year]', messages.init.year)
  .option('-s, --session [cookie]', messages.init.session)
  .action((day, command) => {
    const config = getConfig({
      year: command.year,
      day: parseNum(day),
      session: command.session,
    })
    initDay(config)
  })
  .on('--help', () => console.log(messages.init.help)) // eslint-disable-line no-console

program.parse(process.argv)
