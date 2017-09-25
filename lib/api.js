'use strict'

const request = require('request-promise')
const findCacheDir = require('find-cache-dir')
const debug = require('./utils/debug')
const fs = require('./utils/fs')
const pkg = require('../package.json')

const USER_AGENT = `node/${process.version} ${pkg.name}/${pkg.version}`
const getCacheDir = findCacheDir({ name: 'advent', create: true, thunk: true })

const HOST = 'http://adventofcode.com'

exports.getInput = options => {
  const year = options.year
  const day = options.day
  const INPUT_CACHE_PATH = getCacheDir(`input-${year}-${day}.txt`)
  debug('checking for cached input: %s', INPUT_CACHE_PATH)
  return fs
    .readFileAsync(INPUT_CACHE_PATH, 'utf8')
    .tap(() => debug('found caches input: %s', INPUT_CACHE_PATH))
    .catch(() => {
      const URI = `${HOST}/${year}/day/${day}/input`
      debug('could not find cached file')
      debug('attempting to fetch from source: %s', URI)
      if (!options.session) {
        throw new ReferenceError('You must provide your session cookie')
      }
      const reqOptions = {
        uri: `${HOST}/${year}/day/${day}/input`,
        method: 'GET',
        headers: {
          Cookie: options.session,
          'User-Agent': USER_AGENT
        }
      }
      return request(reqOptions)
        .then(input => {
          debug('got input, writing to cache file: %s', INPUT_CACHE_PATH)
          return fs
            .writeFileAsync(INPUT_CACHE_PATH, input, 'utf8')
            .then(() => input)
        })
        .tap(() => debug('wrote cache for input: %s', INPUT_CACHE_PATH))
    })
}
