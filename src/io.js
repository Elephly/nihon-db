var fs = require("fs");

module.exports = {
  loadDB: function(path, callback) {
    var db = {
      kanji: {},
      vocabulary: {}
    };
    fs.readFile(path, function(err, data) {
      if (err) {
        console.warn("Could not read file '" + path + "'.");
      }
      var 日本ＤＢ = (err ? db : JSON.parse(data));
      if (!日本ＤＢ.kanji) 日本ＤＢ.kanji = {};
      if (!日本ＤＢ.vocabulary) 日本ＤＢ.vocabulary = {};
      callback(日本ＤＢ);
    });
  },
  saveDB: function(path, db, callback) {

  }
};
