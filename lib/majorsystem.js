var prettyjson = require('prettyjson');
var map = require('../res/map.json');
var fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const chalk = require('chalk');

function numberToLetters(number, start = '') {
  var numb = String(number);
  if (numb.length == 0) {
    return [start];
  }
  var firstDigit = numb.slice(0, 1);
  var remainder = numb.slice(1);
  var choices = [];
  for (letter of map[firstDigit]) {
    choices = choices.concat(numberToLetters(remainder, start + letter));
  }
  return choices;
}

function removeVowels(str) {
  return str.replace(/[aeiou]/gi, '');
}

function getWords() {
  return readFileAsync('./res/wordsEn.txt')
    .then((data) => {
      return data.toString().split("\n");
    })
    .catch((error) => console.log(error));
 }

function getDevoweledWords(words) {
  var transformations = {};
  for (word of words) {
    var wordWithoutVowels = removeVowels(word);
    if (!transformations[wordWithoutVowels]) {
      transformations[wordWithoutVowels] = [];
    }
    transformations[wordWithoutVowels].push(word);
  }
  return transformations;
}

function wordArrayToStrings(wordArray, line = []) {
  if (!wordArray.length) {
    console.log('line:');
    console.log(line);
    return;
  }
  var words = wordArray.shift();
  for (word of words) {
    wordArrayToStrings(wordArray, line.concat(word));
  }
}


/**
 * Returns array of mnemonics objects from devowled word.
 *
 * @param {options} 
 *   options.words - array of word arrays, keyed by devowled word
 *   options.maxDepth - Maximum number of separate words.
 */
function getMnems(devowledWord, options = {}, depth = 0)  { // return Object[]
  var words = options.words;
  var matches = [];
  for (var i = devowledWord.length; i > 0; i--) {
    var word = devowledWord.substring(0, i)
    if (words[word]) {
      var remainder = devowledWord.substring(i);
      if (!remainder) {
        matches.push({ depth, words: words[word] });
      }
      else if (depth < options.maxDepth) {
        matches.push({ depth, words: words[word], children: getMnems(remainder, options, depth + 1) });
      }
    }
  }
  return matches;
}

function capitalizeConsonants(str){
  return str.toUpperCase().replace(/[AEIOU]/g, function(l) {
   return l.toLowerCase();
  });
}

function sortByWordCount(a, b) {
  return a.split(' ').length - b.split(' ').length
}
 
function arrayReducer(flattenedArray, item) {
  return flattenedArray.concat(item); 
}

function transLine(line, start = '') { // return String[] i.e. ['fax ado', 'fax ad', 'fax adieu', 'fix ado']
  var mnems = [];
  for (word of line.words) {
    var next = start ? start +' '+ word : word;
    if (line.children && line.children.length) {
      for (child of line.children) {
        mnems = mnems.concat(transLine(child, next));
      }
    }
    else {
      mnems.push(next);
    }
  }
  return mnems;
}

function transLines(lines) {
  return [].concat.apply([], lines.map(line => transLine(line)));
}

function cap(str){
   return str.toUpperCase().replace(/[AEIOU]/g, function(l) {
         return l.toLowerCase();
           })
}

function combineArrays(arrs) {
  return [].concat.apply([], arrs);
}


function getMnemonics(num, options) {
  return getWords()
    .then((words) => {
      words = getDevoweledWords(words);
      options.words = words;

      var letters = numberToLetters(num);
      var mnems   = combineArrays(letters.map((letters) => getMnems(letters, options)));
      var lines = transLines(mnems);
      console.log('got them lines');

      return lines;


      //var out = mnems.map((mnem) => transLines(mnem));
      //return combineArrays(out);
        /*
        .map(function (letters) { 
          return getMnems(letters, options)
        }))
        .map((mnems) => transLines(mnems))
          
      return [].concat.apply([], out);
      */

    })
    .catch((error) => console.log(error));
}

function print(word, colorize) {
  if (!colorize) {
    console.log(word);
    return;
  }
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  var coloredWord = '';
  for (letter of word) {
    if (!vowels.includes(letter)) {
      coloredWord += chalk.blue(letter);
    }
    else {
      coloredWord += letter;
    }
  }
  console.log(coloredWord);
}

module.exports = {
  getMnemonics,
  print,
  capitalizeConsonants
}
