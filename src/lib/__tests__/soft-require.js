/* eslint-env jest */
'use strict'

const path = require('path')
const softRequire = require('../soft-require')

describe('soft-require', () => {
  test('requires a module', () => {
    const filepath = path.resolve(__dirname, '..', 'soft-require')
    expect(softRequire(filepath)).toEqual(softRequire)
  })
  test('uses the default value if the module does not exist', () => {
    const filepath = path.resolve(__dirname, 'does-not-exist')
    expect(softRequire(filepath)).toEqual(null)
  })
  test('uses given default value if module does not exist', () => {
    const filepath = path.resolve(__dirname, 'does-not-exist')
    const defaultValue = { foo: 'bar' }
    expect(softRequire(filepath, defaultValue)).toEqual(defaultValue)
  })
})
