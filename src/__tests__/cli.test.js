/* eslint-env jest */
'use strict'

// mocks
jest
  .mock('get-stdin', () => {
    let input = ''
    const getInput = () => Promise.resolve(input)
    getInput.__setInput = val => {
      input = val
    }
    getInput.__resetInput = getInput.__setInput.bind(null, '')
    return getInput
  })
  .mock('../util/cache', () => {
    let data = {}
    const cache = {
      get: key => data[key],
      set: (key, value) => {
        data[key] = value
        return value
      },
      clear: () => {
        data = {}
      }
    }
    return cache
  })
  .mock('../lib/advent-api', () => {
    let input = ''
    const getInput = jest.fn(() => Promise.resolve(input))
    const __setInput = val => {
      input = val
    }
    const __resetInput = __setInput.bind(null, '')
    return {
      getInput,
      __setInput,
      __resetInput
    }
  })

const fs = require('fs')
const path = require('path')
const Bluebird = require('bluebird')
const rimraf = require('rimraf')
const getStdin = require('get-stdin') // mocked above
const cache = require('../util/cache') // mocked above
const adventApi = require('../lib/advent-api') // mocked above
const cli = require('../cli')

Bluebird.promisifyAll(fs)
const rimrafAsync = Bluebird.promisify(rimraf)

const fixtures = path.resolve.bind(path, __dirname, '__fixtures__')
const createArgs = (...args) => [process.argv[0], __filename].concat(args)

describe('advent cli', () => {
  const cwd = process.cwd()
  afterEach(() => process.chdir(cwd))
  afterEach(() =>
    Promise.all([
      rimrafAsync(fixtures('blank', '*.js')),
      rimrafAsync(fixtures('blank', 'my')),
      rimrafAsync(fixtures('project', 'src'))
      // rimrafAsync(fixtures('project', 'my'))
    ])
  )
  afterEach(() => getStdin.__resetInput())
  afterEach(() => adventApi.__resetInput())
  afterEach(() => cache.clear())

  describe('init command', () => {
    test('inits file', () => {
      process.chdir(fixtures('blank'))
      return cli(createArgs('init', '5'))
        .then(() =>
          Promise.all([
            fs.readdirAsync(fixtures('blank')),
            fs.readFileAsync(fixtures('blank', 'day05.js'), 'utf8')
          ])
        )
        .then(results => {
          expect(results).toMatchSnapshot()
        })
    })

    test('keeps existing file in place', () => {
      const myfile = `'use strict'; console.log('hello')`
      process.chdir(fixtures('blank'))
      return cli(createArgs('init', '7'))
        .then(() => fs.writeFileAsync(fixtures('blank', 'day07.js'), myfile))
        .then(() => cli(createArgs('init', '7')))
        .then(() =>
          Promise.all([
            fs.readdirAsync(fixtures('blank')),
            fs.readFileAsync(fixtures('blank', 'day07.js'), 'utf8')
          ])
        )
        .then(results => {
          expect(results).toMatchSnapshot()
        })
    })

    test('overrides existing file if force command is sent', () => {
      const myfile = `'use strict'; console.log('hello')`
      process.chdir(fixtures('blank'))
      return cli(createArgs('init', '7'))
        .then(() => fs.writeFileAsync(fixtures('blank', 'day07.js'), myfile))
        .then(() => cli(createArgs('init', '7', '--force')))
        .then(() =>
          Promise.all([
            fs.readdirAsync(fixtures('blank')),
            fs.readFileAsync(fixtures('blank', 'day07.js'), 'utf8')
          ])
        )
        .then(results => {
          expect(results).toMatchSnapshot()
        })
    })

    test('it uses --name-template argument', () => {
      process.chdir(fixtures('blank'))
      return cli(
        createArgs(
          'init',
          '21',
          '--name-template',
          'my/deep/{{num}}/program.js'
        )
      )
        .then(() =>
          fs.readFileAsync(
            fixtures('blank', 'my', 'deep', '21', 'program.js'),
            'utf8'
          )
        )
        .then(file => {
          expect(file).toMatchSnapshot()
        })
    })

    test('it uses package.json configuration', () => {
      process.chdir(fixtures('project'))
      return cli(createArgs('init', '25'))
        .then(() =>
          fs.readFileAsync(fixtures('project', 'src', 'day25.js'), 'utf8')
        )
        .then(file => {
          expect(file).toMatchSnapshot()
        })
    })
  })

  describe('run command', () => {
    test('runs the given part', () => {
      process.chdir(fixtures('project'))
      const file = `
        exports.part1 = (input) => input + '--part1'
        exports.part2 = (input) => input + '--part2'
      `
      return cli(createArgs('init', '1'))
        .then(() =>
          fs.writeFileAsync(
            fixtures('project', 'src', 'day01.js'),
            file,
            'utf8'
          )
        )
        .then(() => cli(createArgs('run', '1', '1', 'myinput')))
        .then(output => {
          expect(output).toEqual('myinput--part1')
        })
        .then(() => cli(createArgs('run', '1', '2', 'myinput')))
        .then(output => {
          expect(output).toEqual('myinput--part2')
        })
    })
  })

  test('gets input from stdin', () => {
    process.chdir(fixtures('project'))
    getStdin.__setInput('myinput')
    const file = `
      exports.part1 = (input) => input + '--part1'
      exports.part2 = (input) => input + '--part2'
    `
    return cli(createArgs('init', '1'))
      .then(() =>
        fs.writeFileAsync(fixtures('project', 'src', 'day01.js'), file, 'utf8')
      )
      .then(() => cli(createArgs('run', '1', '1', '-')))
      .then(output => {
        expect(output).toEqual('myinput--part1')
      })
      .then(() => cli(createArgs('run', '1', '2', '-')))
      .then(output => {
        expect(output).toEqual('myinput--part2')
      })
  })

  test('gets input from adventofcode, and caches it', () => {
    process.chdir(fixtures('project'))
    adventApi.__setInput('myinput')
    const file = `
      exports.part1 = (input) => input + '--part1'
      exports.part2 = (input) => input + '--part2'
    `
    return cli(createArgs('init', '1'))
      .then(() =>
        fs.writeFileAsync(fixtures('project', 'src', 'day01.js'), file, 'utf8')
      )
      .then(() => cli(createArgs('run', '1', '1', '+', '--session', 'foobar')))
      .then(output => {
        expect(output).toEqual('myinput--part1')
        expect(adventApi.getInput).toHaveBeenCalledTimes(1)
      })
      .then(() => cli(createArgs('run', '1', '2', '+', '--session', 'foobar')))
      .then(output => {
        expect(output).toEqual('myinput--part2')
        expect(adventApi.getInput).toHaveBeenCalledTimes(1)
      })
  })
})
