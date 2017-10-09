/* eslint-env jest */
'use strict'

const querystring = require('querystring')
const nock = require('nock')
const adventApi = require.requireActual('../advent-api')

describe('advent-api', () => {
  beforeAll(() => nock.cleanAll())
  afterEach(() => nock.cleanAll())

  test('Calls advent with appropriate headers', () => {
    expect.hasAssertions()
    const year = '2017'
    const day = '4'
    const session = 'session=mysession'
    nock(adventApi.ADVENT_HOST)
      .get(`/${year}/day/${day}/input`)
      .reply(function (uri) {
        return [200, querystring.stringify(this.req.headers)]
      })
    // Real input will be a straight up input string, we're just testing the
    // headers here
    return adventApi.getInput({ year, day, session }).then(input => {
      const data = querystring.parse(input)
      expect(data).toHaveProperty('user-agent', adventApi.USER_AGENT)
      expect(data).toHaveProperty('cookie', session)
    })
  })
})
