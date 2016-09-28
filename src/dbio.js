var fs = require("fs");

var dbtypes = require("./dbtypes");

module.exports = {
  loadDB: function(path, callback) {
    fs.readFile(path, function(err, data) {
      if (err) {
        console.warn("Could not read file '" + path + "'.");
      }
      var 日本ＤＢ = (err ? {} : JSON.parse(data));
      if (!日本ＤＢ.collections || 日本ＤＢ.collections.length < 1) {
        日本ＤＢ.collections = [dbtypes.createCollection("default")];
      }
      callback(日本ＤＢ);
    });
  },
  saveDB: function(path, db, callback) {
    fs.writeFile(path, JSON.stringify(db), function(err) {
      if (err) {
        console.error("Error writing to file '" + path + "':" + err);
      }
      callback(db);
    });
  }
};
