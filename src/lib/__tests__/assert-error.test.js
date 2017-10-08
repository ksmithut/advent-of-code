/* eslint-env jest */
'use strict'

const assertError = require('../assert-error')

describe('assert-error', () => {
  test('does not throw error if value is truthy', () => {
    assertError(true)
    assertError('true')
    assertError(7403)
  })
  test('throws error if falsy', () => {
    expect(() => assertError(false)).toThrow(Error)
    expect(() => assertError(0)).toThrow(Error)
    expect(() => assertError(null)).toThrow(Error)
    expect(() => assertError()).toThrow(Error)
  })
  test('throws given error', () => {
    expect(() => assertError(false, ReferenceError)).toThrow(ReferenceError)
    expect(() => assertError(false, TypeError, 'My message')).toThrow(TypeError)
    expect(() => assertError(false, TypeError, 'My message')).toThrow(
      'My message'
    )
    class CustomError {
      constructor (message) {
        this.message = message
      }
    }
    expect(() => assertError(false, CustomError, 'foobar')).toThrow(CustomError)
  })
})
