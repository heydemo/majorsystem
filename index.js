var prettyjson = require('prettyjson');
var map = require('./map.json');
var fs = require('fs');

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

function startsWith(start) {
  return function (word) {
    return (word.indexOf(start) === 0);
  }
}

function removeVowels(str) {
  return str.replace(/[aeiou]/gi, '');
}

function getWords(callback) {
  fs.readFile('wordsEn.txt', function(err, data) {
      if (err) throw err;
      callback(data.toString().split("\n"));
  });
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

function flattenWords(wordArray, line = '', lines = []) {
  console.log(arguments);
  var lines = [];
  var words = wordArray[0];
  for (word of words) {
    console.log('word: ' + word);
    if (wordArray.length == 1) {
      lines.push(line + word);
    }
    else {
      flattenWords(wordArray.slice(1), line + ' ' + word, lines);
    }
  }
  return lines;
}

function flattenLine(line) {
  if (typeof line[0] == 'string') {
    return line;
  }
  var words = wordArray[0];



}

//var choices = numberToLetters(1917);
function getMnems(devowledWord, words, depth = 0) {
  var matches = [];
  for (var i = devowledWord.length; i > 0; i--) {
    var word = devowledWord.substring(0, i)
    if (words[word]) {
      var remainder = devowledWord.substring(i);
      if (!remainder) {
        matches.push({ depth, words: words[word] });
      }
      else if (matches < 100000 && depth < 3) {
        matches.push({ depth, words: words[word], children: getMnems(remainder, words, depth + 1) });
      }
    }
  }
  return matches;
}

function transLine(line, start = '') { // return String[] i.e. ['fax ado', 'fax ad', 'fax adieu', 'fix ado']
  var mnems = [];
  for (word of line.words) {
    var next = start ? start +' '+ word : word;
    if (line.children) {
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


//console.log(choices);
getWords(function (words) {
  //var numb = 1917;
  //var wordMap = getDevoweledWords(words);
  //console.log(Object.keys(wordMap).map(removeVowels).filter(startsWith('fxd')));
  /**
  var mnems = getMnems('fxd', words);
  //var lines = flattenWords(mnems);
  //console.log(lines);
  console.log(prettyjson.render(mnems));
  console.log(JSON.stringify(mnems));
  trans = transLines(mnems);
  console.log(trans);
  */
  words = getDevoweledWords(words);

  var num = process.argv[2];
  var out = numberToLetters(num)
    .map(function (letters) { 
      return getMnems(letters, words)
    })
    .map((mnems) => transLines(mnems))
      
  out = [].concat.apply([], out).map(cap);

  out.forEach(line => console.log(line));


});



