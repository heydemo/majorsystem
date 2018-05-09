#!/usr/bin/env node

const ms = require('../lib/majorsystem.js');

var argv = require('yargs')
  .usage('majorsystem [number]')
  .demandCommand(1)
  .option('maxWords', {
    alias: 'mw',
    describe: 'Maximum number of words for the mnemonic',
    default: 3,
  })
  .option('limit', {
    describe: 'Maximum number of mnemonics to display',
    default: 10,
  })
  .option('mapFile', {
    describe: 'A JSON file mapping digits to consonants',
    default: '',
  })
  .option('exclude', {
    describe: 'A comma separated list of words to exclude',
    default: '',
  })
  .option('wordList', {
    describe: 'A path to a wordlist file to use',
    default: '',
  })
  .option('randomize', {
    describe: 'Shuffle results, still sorting by least words',
    count: true,
  })
  .option('colorize', {
    describe: 'Colorize the consonants',
    count: true,
  })
  .option('capitalize', {
    describe: 'Colorize the consonants',
    count: true,
  })
  .help('help')
  .alias('help', 'h')
  .argv;

const num = argv._[0];
const limit = argv.limit;
const excludes = argv.exclude ? argv.exclude.split(',') : [];

const options = Object.assign({}, argv, { excludes})

ms.getMnemonics(num, options)
  .then((mnems) => {
    if (limit) {
      mnems = mnems.slice(0, limit);
    }
    
    if (argv.capitalize) {
      mnems = mnems.map(ms.capitalizeConsonants);
    }
    
    mnems.map((mnem) => {
      ms.print(mnem, argv.colorize);
    });
  })
  .catch(console.log)
