var fs = require('fs');
fs.readFile('wordsEn.txt', function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    var transformations = {};
    for (word of array) {
      var wordWithoutVowels = removeVowels(word);
      if (!transformations[wordWithoutVowels]) {
        transformations[wordWithoutVowels] = [];
      }
      transformations[wordWithoutVowels].push(word);
    }
    console.log(transformations);
});

function removeVowels(str) {
  return str.replace(/[aeiou]/gi, '');
}
