'use strict'

const leftPad = require('../lib/left-pad')

const getDayPath = (day, template) => {
  // Create the day filename
  const stringDay = leftPad(String(day), 2, '0') // Make it always two length with leading 0
  return template.replace('{{num}}', stringDay)
}

module.exports = getDayPath
