'use strict'

const COMMENT_PREFIX = '/**\n'
const LINE_PREFIX = ' * '
const COMMENT_SUFFIX = ' */'

module.exports = function commentate(content, max) {
  const comment = content.split('\n').reduce((output, line) => {
    // Create empty space indent for multiline list items and such
    const indentLength = Math.max(line.search(/[a-zA-Z`]/), 0)
    const indent = ' '.repeat(indentLength)
    // Setup the newline with the line prefix
    let newLine = `${LINE_PREFIX}${line}`
    // Wittle down the line until all lines are under 80 characters
    while (newLine.length > max) {
      // Find out the last space and split on that.
      let lastSpace = newLine.substr(0, max).lastIndexOf(' ')
      if (lastSpace <= newLine.search(/\w/)) {
        lastSpace = newLine.indexOf(' ', max)
      }
      const subLine = newLine.substr(0, lastSpace)
      newLine = `${LINE_PREFIX}${indent}${newLine.substr(lastSpace + 1)}`
      output += `${trimRight(subLine)}\n`
    }
    return `${output}${trimRight(newLine)}\n`
  }, COMMENT_PREFIX)
  return comment + COMMENT_SUFFIX
}

function trimRight(str) {
  return str.replace(/\s+$/, '')
}
