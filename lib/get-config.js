'use strict'

const DECEMBER = 11
const DEFAULT_NOW = () => new Date()
const DEFAULT_PACKAGE_PATH = `${process.cwd()}/package.json`

function getPackage (path) {
  try {
    return require(path)
  } catch (ex) {
    return {}
  }
}

module.exports = function getConfig (
  args,
  { getNow = DEFAULT_NOW, pkgPath = DEFAULT_PACKAGE_PATH } = {}
) {
  const now = getNow()
  const year = now.getFullYear()
  // If it's december, use the current year, otherwise, use the previous year
  const defaultYear = now.getMonth() === DECEMBER ? year : year - 1
  // Attempt to get the package.json
  const pkg = getPackage(pkgPath)
  return Object.assign(
    {
      year: defaultYear,
      session: process.env.ADVENT_SESSION
    },
    pkg.adventConfig,
    args
  )
}
