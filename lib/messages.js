'use strict'

exports.help = {
  description: 'output usage information',
}

exports.run = {
  description: 'Runs a given day with the given input.',
  part1: 'Run part 1',
  part2: 'Run part 2',
  year: 'Select the advent year you are running',
  session: 'Session cookie to make requests',
  help: [
    '  Examples:',
    '',
    '    advent run 1 --part1 \'this is my input\'',
    '    cat input.txt | advent run 1 --part1 -',
    '    advent run 1 --part1 - < input.txt',
    '    advent run 1 --part1 + --session \'session=asefsafes...\'',
    '',
    '  Notes:',
    '',
    '    For anything that reaches out to advent-of-code.com, you need to',
    '    provide your session token. You can get this by opening up the',
    '    network tab in the devtools, logging into to adventofcode.com, then',
    '    viewing what gets sent as the `Cookie:` request header on',
    '    subsequent requests. You may pass in the required value using',
    '    `--session [value]` or using the `ADVENT_SESSION` environment',
    '    variable.',
    '',
  ].join('\n'),
}

exports.init = {
  description: 'Initializes the files for a given day',
  year: exports.run.year,
  session: exports.run.session,
  help: exports.run.help,
}
