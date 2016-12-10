'use strict'

const request = require('request-promise')
const commentate = require('./utils/commentate')

const HOST = 'http://adventofcode.com'
const DESC_SELECTOR = '.day-desc'
const MAX_LENGTH = 80
const MARKDOWN_OPTIONS = {
  converters: [
    {
      filter: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i' ],
      replacement: (content) => content,
    },
    {
      filter: 'li',
      replacement: (content, node) => {
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n  ')
        const parent = node.parentNode
        const index = Array.prototype.indexOf.call(parent.children, node) + 1

        const prefix = (/ol/i).test(parent.nodeName) ? `${index}. ` : '- '
        return prefix + content
      },
    },
  ],
}

exports.getInput = (options) => {
  if (!options.session) {
    throw new ReferenceError('You must provide your session cookie')
  }
  return request({
    uri: `${HOST}/${options.year}/day/${options.day}/input`,
    method: 'GET',
    headers: {
      Cookie: options.session,
    },
  })
}

exports.getDescriptions = (options) => {
  // We load this here so we only load them when we need it
  const cheerio = require('cheerio') // eslint-disable-line global-require
  if (!options.session) {
    throw new ReferenceError('You must provide your session cookie')
  }
  const reqOptions = {
    uri: `${HOST}/${options.year}/day/${options.day}`,
    method: 'GET',
    headers: {
      Cookie: options.session,
    },
    transform: cheerio.load.bind(cheerio),
  }
  return request(reqOptions)
    .then(parseDesc)
    .then((parts) => parts.map((desc) => commentate(desc, MAX_LENGTH)))
}

function parseDesc($) {
  // We load this here so we only load them when we need it
  const toMarkdown = require('to-markdown') // eslint-disable-line global-require
  const parts = []
  $(DESC_SELECTOR).each((i, elem) => {
    const markdown = toMarkdown($(elem).html(), MARKDOWN_OPTIONS)
    parts.push(markdown)
  })
  return parts
}
