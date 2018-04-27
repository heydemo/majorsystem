#!/usr/bin/env node

const ms = require('./majorsystem.js');

var argv = require('yargs')
  .usage('majorsystem [number]')
  .demandCommand(1)
  .option('depth', {
    alias: 'd',
    describe: 'Maximum number of words for the mnemonic',
    default: 3,
  })
  .option('limit', {
    describe: 'Maximum number of mnemonics to display',
    default: 10,
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

var num = argv._[0];
var limit = argv.limit;

var options = {
  maxDepth: argv.depth,
}


const start = new Date().getTime();

ms.getMnemonics(num, options)
  .then((mnems) => {
    const time = new Date().getTime() - start;
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



