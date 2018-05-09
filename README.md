# majorsystem [![NPM version](https://badge.fury.io/js/majorsystem.svg)](https://npmjs.org/package/majorsystem) [![Build Status](https://travis-ci.org/heydemo/majorsystem.svg?branch=master)](https://travis-ci.org/heydemo/majorsystem)

> Converts numbers into Mnemonics using the [Major System](https://en.wikipedia.org/wiki/Mnemonic_major_system). Allows a configurable mapping of consonants to digits and custom word lists.

By default, it uses Lewis Carrol's consonant to digit mapping, however this can be customized by providing a JSON file using the --mapFile option.

## Installation

```sh
$ npm install --global majorsystem
```

## Usage

```sh
majorsystem --help

majorsystem [number]

Options:
  --version         Show version number                                [boolean]
  --maxWords, --mw  Maximum number of words for the mnemonic        [default: 3]
  --limit           Maximum number of mnemonics to display         [default: 10]
  --mapFile         A JSON file mapping digits to consonants       [default: ""]
  --exclude         A comma separated list of words to exclude     [default: ""]
  --wordList        A path to a wordlist file to use               [default: ""]
  --randomize       Shuffle results, still sorting by least words        [count]
  --colorize        Colorize the consonants                              [count]
  --capitalize      Colorize the consonants                              [count]
  --help, -h        Show help                                          [boolean]


Examples:

majorsystem --capitalize 314159
```

Default Consonant to Number mapping
```
0: 
  - z
  - r
1: 
  - b
  - c
2: 
  - d
  - w
3: 
  - t
  - j
4: 
  - f
  - q
5: 
  - l
  - v
6: 
  - s
  - x
7: 
  - p
  - m
8: 
  - h
  - k
9: 
  - n
  - g
```

## License

ISC © [John De Mott]()
