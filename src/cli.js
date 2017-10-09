'use strict'

const path = require('path')
const { Command } = require('commander')
const softRequire = require('./lib/soft-require')
const assertError = require('./lib/assert-error')
const pkg = require('../package.json')
const getDayPath = require('./util/get-day-path')
const debug = require('./util/debug')

const DECEMBER = 11
const DEFAULT_TEMPLATE_FILE = path.resolve(__dirname, 'templates', 'day.js')

const parseDay = day => {
  day = day.replace(/^[^\d]*/, '')
  day = Number.parseInt(day, 10)
  assertError(
    day >= 1 && day <= 25,
    RangeError,
    'day must be between 1 and 25 inclusive'
  )
  return day
}

const parsePart = part => {
  part = part.replace(/^[^\d]*/, '')
  part = Number.parseInt(part, 10)
  assertError(part === 1 || part === 2, RangeError, 'part must be 1 or 2')
  return part
}

const main = (
  /* istanbul ignore next */ args = process.argv,
  program = new Command()
) => {
  const pkgPath = path.resolve('package.json')
  const userPkg = softRequire(pkgPath, { adventConfig: {} }).adventConfig || {}
  const now = new Date()
  const defaultYear =
    userPkg.year ||
    (now.getMonth() === DECEMBER ? now.getFullYear() : now.getFullYear() - 1)
  const defaultNameTemplate = userPkg.nameTemplate || 'day{{num}}.js'
  const defaultTemplateFile = userPkg.templateFile
    ? path.resolve(userPkg.templateFile)
    : DEFAULT_TEMPLATE_FILE

  const getConfig = args => {
    const config = {
      year: args.year,
      session: args.session || process.env.ADVENT_SESSION,
      day: args.day,
      part: args.part,
      nameTemplate: args.nameTemplate,
      templateFile: args.templateFile
    }
    const dayFilename = getDayPath(config.day, config.nameTemplate)
    config.dayFilepath = path.resolve(dayFilename)
    return config
  }

  program.version(pkg.version)

  program.on(
    '--help',
    /* istanbul ignore next */
    () =>
      console.log(
        [
          '',
          '  Examples:',
          '',
          "    advent run --day 1 --part 1 'this is my input'",
          '    cat input.txt | advent run -d 1 -p 1 -',
          '    advent run -d 1 -p 1 - < input.txt',
          "    advent run -d 1 -p 1 + --session 'session=asefsafes...'",
          '',
          '  Notes:',
          '',
          '    For anything that reaches out to advent-of-code.com, you need to',
          '    provide your session token. You can get this by opening up the',
          '    network tab in the devtools, logging into to adventofcode.com, then',
          '    viewing what gets sent as the `Cookie:` request header on',
          '    subsequent requests. You may pass in the required value using',
          '    `--session [value]` or using the `ADVENT_SESSION` environment',
          '    variable. Note that it likely starts with `session=`',
          ''
        ].join('\n')
      )
  )

  let action
  /**
   * advent run <input>
   */
  program
    .command('run <day> <part> <input>')
    .description('Runs a given day with the given input')
    .option(
      '-y, --year [year]',
      'Select the advent year you are running',
      defaultYear
    )
    .option('-s, --session [cookie]', 'Session cookie to make requests')
    .option(
      '-n, --name-template [template]',
      'The filename template to use when looking for day files',
      defaultNameTemplate
    )
    .action((day, part, input, command) => {
      const run = require('./run')
      command.day = parseDay(day)
      command.part = parsePart(part)
      const config = getConfig(command)
      debug('Running "run" with following config: %O', config)
      action = run(input, config)
    })

  /**
   * advent init
   */
  program
    .command('init <day>')
    .description('Initializes the file for a given day')
    .option(
      '-n, --name-template [template]',
      'The filename template to use when looking for day files',
      defaultNameTemplate
    )
    .option(
      '-t, --template-file [filepath]',
      'The path to a template file',
      defaultTemplateFile
    )
    .action((day, command) => {
      const init = require('./init')
      command.day = parseDay(day)
      command.part = parsePart('1')
      const config = getConfig(command)
      debug('Running "init" with following config: %O', config)
      action = init(config)
    })

  program.parse(args)

  /* istanbul ignore next */
  if (!action) return program.help() // NOTE this will terminate the program

  return action // This should be a promise of the action to take place
}

module.exports = main
