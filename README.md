# advent-of-code

A cli to help initialize/run JavaScript advent-of-code challenges.

# Installation

```sh
yarn add advent-of-code
# or install globally
yarn global add advent-of-code
```

# Configuration

You can configure the `advent` cli using the command line arguments (documented
below) or some of the arguments can be configured via a `package.json` file.

Below are the available configuration options. If you pass in command-line
arguments, they will override your `package.json` configuration.

```js
{
  "adventConfig": {
    "year": "2016",
    "nameTemplate": "day{{num}}.js",
    "templateFile": "node_modules/advent-of-code/src/templates/day.js"
  }
}
```

| `package.json` key          | CLI argument                     | Default                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------- | -------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adventConfig.year`         | `-y, --year [year]`              | currentMonth === December ? currentYear : currentYear - 1 | When pulling input from adventofcode.com, this year will be used.                                                                                                                                                                                                                                                                                                                                                                      |
| -                           | `-s, --session [cookie]`         | `process.env.ADVENT_SESSION`                              | The session cookie to use when making requests to adventofcode.com. You can get this by logging into adventofcode.com and inspecting the request in your devtools and see what your cookie value is. Should start with `session=`.                                                                                                                                                                                                     |
| `adventConfig.nameTemplate` | `-n, --name-template [template]` | `'day{{num}}.js'`                                         | The filename template to use when running and creating new day files. Wherever `{{num}}` is in the string, it will be replaced with a two digit (leading `0`s) representation of the number will be input. So if the day is `1`, using the default template, the filename will be `day01.js`.                                                                                                                                          |
| `adventConfig.templateFile` | `-t, --template-file [filepath]` | `'node_modules/advent-of-code/src/templates/day.js'`      | The template file to use when initializing a new day file. It is recommended that you have your own that fits your style. The only requirement is that you export 2 functions: `exports.part1` and `exports.part2`, or just `module.exports = { part1, part2 }`. You may also export an `options` object to configure how input is parsed. `options.noTrim` lets you choose whether or not the input gets trimmed. Default is `false`. |
| -                           | `-f, --force`                    | `false`                                                   | A flag used if you want to override an existing file with the template when calling `advent init`                                                                                                                                                                                                                                                                                                                                      |

# Usage

## Display help

```sh
advent help
```

## Initialize a day

```sh
advent init <day>
```

### Options

* `<day>` - The day to initialize. Will create a file using your `nameTemplate`
  configuration. You can run `advent init <day>` again and it won't do anything
  unless you pass the `--force` flag.
* `--name-template [template]` - See configuration above
* `--template-file [filepath]` - See configuration above
* `--force` - See configuration above

## Run a day's code

```sh
$ advent run <day> <part> <input>
```

### Options

* `<day>` - The day to initialize. Will use the file in the configuration you
  set for `nameTemplate`
* `<part>` - The part to run. The day file should export a property called
  `part1` and `part2`.
* `<input>` - The input to give the function. If `-` is passed, stdin will be
  used as the input. If `+` is passed, and you have a session set, then it will
  pull the input from adventofcode.com, or the cached value once it pulls from
  adventofcode.com the first time.
* `--year [year]` - See configuration above
* `--session [session]` - See configuration above
* `--name-template [template]` - See configuration above

# Notes

* This module leverages the [debug](https://www.npmjs.com/package/debug) module.
  Setting `DEBUG=advent` will print out debug information, such as when this
  module is pulling from local cache, which days it's trying to run/initialize,
  and so forth. When reporting bugs, please have the output from this handy so
  that I can more quickly determine the issue.

* One thing I liked to do with my local stuff was to store my answers locally
  along with example inputs (from the descriptions). The goal for this project
  was to make it easy for someone to upload their solutions to github, and
  others could pull it down and have it work with their inputs, but if there is
  interest in providing a "test suite" to test against example inputs and such,
  then I will do so.

# Disclaimer

I am not affiliated with [adventofcode.com](http://adventofcode.com) or any of
their sponsors, employees, pets, or anything relating to them. I am an active
participant, and I wanted to make a tool to make it easier to setup and run
advent of code things. Please don't abuse adventofcode.com. This tool could be
used to make a lot of automated requests to their site, which is why this tool
leverages caching. If you find that you're making too many requests to
adventofcode.com because of this module, please let me know so I can resolve any
issues. If this module is used to abuse adventofcode.com, I will unpublish it
from npm and remove this code from github.
