# advent-of-code

A cli to help initialize/run JavaScript advent-of-code challenges.

# Installation

```sh
$ npm install -g advent-of-code
```

# Usage

## Display help

```sh
$ advent help
```

## Initialize a day

```sh
$ advent init <day> [--year <year>] [--session <session>]
```

### Options

- `<day>` - The day to initialize. Will create a file in the current working
  directory called `day{day}.js`. You can run `advent init <day>` again and it
  won't delete the file, but if you're pulling descriptions from
  adventofcode.com, then it will fill in the missing descriptions.
- `--session <session>` - The session key to use when making requests to
  adventofcode.com. To get it, open up the developer console, open up the
  network tab, then login (or refresh the page if you're already logged in).
  Then in the request for the page, look for the "Cookie" header. Copy the value
  of that header and use that for this session argument.
- `--year <year>` - If making a request to adventofcode.com, this is the year
  to use when pulling down the description. The default year is the previous
  year, unless it is the month of December.

## Run a day's code

```sh
$ advent run <day> <part> <input> [--year <year>] [--session <session>]
```

### Options

- `<day>` - The day to initialize. Will look for a file called `day{day}.js` in
  the current working directory
- `<part>` - The part to run. The day file should export a property called
  `part1` and `part2`.
- `<input>` - The input to give the function. If `-` is passed, stdin will be
  used as the input. If `+` is passed, and you have a session set, then it will
  pull the input from adventofcode.com.
- `--session <session>,--year <year>` - Works the same as `advent init`

# Notes

- No requests will be made to adventofcode.com unless you have a session set. I
  would also like to leverage a local cache so that the minimum amount of bytes
  are requested from adventofcode.com. I would love for ideas on best practices
  for caching.

- The config for `year` and `session` can also be provided in the package.json
  as config under the `adventConfig` key in your package.json. e.g.:

  ```js
  {
    // ...
    "adventConfig": {
      "year": "2015",
      "session": "session={your session id}"
    }
  }
  ```

  For your session, you can also set the `ADVENT_SESSION` environment variable
  instead.

- One thing I liked to do with my local stuff was to store my answers locally
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
used to make a lot of automated requests to their site (which is why I want to
leverage a caching solution if more people are interested in using this tool).
