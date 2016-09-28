// jshint esversion: 6

var path = require("path");

var dbio = require("./dbio");
var dbtypes = require("./dbtypes");
var menu = require("./menu");

var 日本ＤＢpath = path.join(__dirname, "..", "resources", "日本ＤＢ.json");

var mainMenu = new menu.Menu("日本ＤＢ");

var collectionsMenu = new menu.Menu("Collections", mainMenu);

var viewCollectionsMenu = new menu.Menu("Choose Collection", collectionsMenu,
  new menu.MenuProcedure("Gathering Collections...", null, function gatherCollections(日本ＤＢ, callback) {
    viewCollectionsMenu.options = [];
    日本ＤＢ.collections.forEach(function(collection, index) {
      var tempCollectionMenu = new menu.Menu(collection.name, viewCollectionsMenu);

      var tempKanjiMenu = new menu.Menu("Kanji", tempCollectionMenu);
      var tempAddKanjiMenu = new menu.MenuProcedure("Add Kanji", tempKanjiMenu, function(日本ＤＢ, callback) {
        menu.MenuView.requestString("Enter the kanji character to add: ", function(character) {
          // TODO
          日本ＤＢ.collections[index].kanji.push(dbtypes.createKanji(character, [], [], [], []));
          callback(日本ＤＢ);
        });
      });
      var tempRemoveKanjiMenu = new menu.MenuProcedure("Remove Kanji", tempKanjiMenu, function(日本ＤＢ, callback) {
        menu.MenuView.requestString("Enter the Japanese kanji to remove: ", function(kanjiCharacter) {
          var kanjiIndexToRemove = -1;
          日本ＤＢ.collections[index].kanji.some(function(kanji, kanjiIndex) {
            if (kanji.character === kanjiCharacter) {
              kanjiIndexToRemove = kanjiIndex;
              return true;
            }
            return false;
          });
          if (kanjiIndexToRemove < 0) {
            console.warn("The selected kanji '" + kanjiCharacter + "' could not be found in the collection.");
          } else {
            日本ＤＢ.collections[index].kanji.splice(kanjiIndexToRemove, 1);
          }
          callback(日本ＤＢ);
        });
      });
      var tempKanjiSaveMenuOption = new menu.MenuProcedure("Save", tempKanjiMenu, function(日本ＤＢ, callback) {
        dbio.saveDB(日本ＤＢpath, 日本ＤＢ, callback);
      });

      var tempVocabularyMenu = new menu.Menu("Vocabulary", tempCollectionMenu);
      var tempAddVocabularyMenu = new menu.MenuProcedure("Add Vocabulary", tempVocabularyMenu, function(日本ＤＢ, callback) {
        menu.MenuView.requestString("Enter the correct Japanese spelling of the vocabulary word to add: ", function(spelling) {
          menu.MenuView.requestString("Enter the correct hiragana reading of the vocabulary word to add: ", function(reading) {
            menu.MenuView.requestString("Enter the English meaning of the vocabulary word to add: ", function(meaning) {
              // TODO: Insert in alphabetical order based on hiragana spelling
              日本ＤＢ.collections[index].vocabulary.push(dbtypes.createVocabularyWord(spelling, reading, meaning));
              callback(日本ＤＢ);
            });
          });
        });
      });
      var tempRemoveVocabularyMenu = new menu.MenuProcedure("Remove Vocabulary", tempVocabularyMenu, function(日本ＤＢ, callback) {
        menu.MenuView.requestString("Enter the correct Japanese spelling of the vocabulary word to remove: ", function(word) {
          var vocabIndexToRemove = -1;
          日本ＤＢ.collections[index].vocabulary.some(function(vocab, vocabIndex) {
            if (vocab.spelling === word) {
              vocabIndexToRemove = vocabIndex;
              return true;
            }
            return false;
          });
          if (vocabIndexToRemove < 0) {
            console.warn("The selected word '" + word + "' could not be found in the collection.");
          } else {
            日本ＤＢ.collections[index].vocabulary.splice(vocabIndexToRemove, 1);
          }
          callback(日本ＤＢ);
        });
      });
      var tempVocabularySaveMenuOption = new menu.MenuProcedure("Save", tempVocabularyMenu, function(日本ＤＢ, callback) {
        dbio.saveDB(日本ＤＢpath, 日本ＤＢ, callback);
      });

      var tempCollectionSaveMenuOption = new menu.MenuProcedure("Save", tempCollectionMenu, function(日本ＤＢ, callback) {
        dbio.saveDB(日本ＤＢpath, 日本ＤＢ, callback);
      });
    });

    callback(日本ＤＢ);
  })
);
var addCollectionOption = new menu.MenuProcedure("Add Collection", collectionsMenu, function(日本ＤＢ, callback) {
  menu.MenuView.requestString("Enter a name for the new collection: ", function(name) {
    日本ＤＢ.collections.push(dbtypes.createCollection(name));
    callback(日本ＤＢ);
  });
});
var removeCollectionMenu = new menu.Menu("Remove Collection", collectionsMenu,
  new menu.MenuProcedure("Gathering Collections...", null, function gatherCollections(日本ＤＢ, callback) {
    removeCollectionMenu.options = [];
    日本ＤＢ.collections.forEach(function(collection, index) {
      var tempRemoveCollectionProcedure = new menu.MenuProcedure(collection.name, removeCollectionMenu, function(日本ＤＢ, callback) {
        日本ＤＢ.collections.splice(index, 1);
        gatherCollections(日本ＤＢ, callback);
      });
    });
    callback(日本ＤＢ);
  })
);

var saveMenuOption = new menu.MenuProcedure("Save", mainMenu, function(日本ＤＢ, callback) {
  dbio.saveDB(日本ＤＢpath, 日本ＤＢ, callback);
});

dbio.loadDB(日本ＤＢpath, function(日本ＤＢ) {
  mainMenu.enter(日本ＤＢ);
});
