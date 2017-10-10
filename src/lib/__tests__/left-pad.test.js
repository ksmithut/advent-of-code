/* eslint-env jest */
'use strict'

const leftPad = require('../left-pad')

describe('left-pad', () => {
  test('repeats the given character', () => {
    expect(leftPad('', 8, '0')).toEqual('00000000')
    expect(leftPad('foo', 8, '0')).toEqual('00000foo')
  })
  test('if base string is longer than minLength, no change', () => {
    expect(leftPad('foo', 2, '0')).toEqual('foo')
  })
})
