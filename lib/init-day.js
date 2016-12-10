'use strict'

const path = require('path')
const Bluebird = require('bluebird')
const fs = require('fs')
const api = require('./api')
const getDayPath = require('./get-day-path')

const readFileAsync = Bluebird.promisify(fs.readFile, { context: fs })
const writeFileAsync = Bluebird.promisify(fs.writeFile, { context: fs })
const DAY_TEMPLATE_PATH = path.join(__dirname, 'templates', 'day.js')

module.exports = function initDay(options) {
  const dayFilepath = getDayPath(options.day)
  return Bluebird
    .all([
      api.getDescriptions(options)
        .catch(() => []),
      readFileAsync(DAY_TEMPLATE_PATH, 'utf8'),
      readFileAsync(dayFilepath, 'utf8')
        .catch({ code: 'ENOENT' }, () => null),
    ])
    .then(([ descriptions, template, existingFile ]) => {
      const contents = existingFile || template
      const newContents = replaceDescriptions(descriptions, contents)
      return writeFileAsync(dayFilepath, newContents, 'utf8')
    })
}

function replaceDescriptions(descriptions, template) {
  return descriptions.reduce((newTemplate, desc, i) => {
    const comment = `// {{PART_${i + 1}}}`
    return newTemplate.replace(comment, desc)
  }, template)
}
