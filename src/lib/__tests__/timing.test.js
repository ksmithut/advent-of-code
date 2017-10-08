/* eslint-env jest */
'use strict'

const timing = require('../timing')

describe('timing', () => {
  test('it keeps track of the time', () => {
    const process = {
      hrtime: jest.fn(() => [4, 10])
    }
    const time = timing(process)
    expect(process.hrtime).toHaveBeenCalledTimes(1)
    process.hrtime.mockClear()
    process.hrtime.mockImplementation(() => [5, 11])
    const end = time()
    expect(process.hrtime).toHaveBeenCalledWith([4, 10])
    expect(end).toEqual(5000.000011)
  })
  test('works with global process', () => {
    const time = timing()
    const end = time()
    expect(typeof end).toEqual('number')
  })
})
