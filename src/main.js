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
        menu.MenuView.requestNumber("Enter a positive numeric identifier for the kanji character to add or enter '0' to push it to the back of the list: ", 0, null, function readKanjiIdentifier(identifier) {
          var identifierIsGood = true;
          if (identifier > 0) {
            while (日本ＤＢ.collections[index].kanji.length < identifier) {
              日本ＤＢ.collections[index].kanji.push(null);
            }
            if (日本ＤＢ.collections[index].kanji[identifier - 1] !== null) {
              identifierIsGood = false;
              console.warn("The identifier '" + identifier + "' is already taken by '" + 日本ＤＢ.collections[index].kanji[identifier - 1].character + "'. Please choose another.");
              menu.MenuView.requestNumber("Enter a positive numeric identifier for the kanji character to add or enter '0' to push it to the back of the list: ", 0, null, readKanjiIdentifier);
            }
          }
          if (identifierIsGood) {
            menu.MenuView.requestString("Enter the kanji character to add: ", function readKanjiCharacter(character) {
              if (!character) {
                console.log("This field cannot be left blank. Please try again.");
                menu.MenuView.requestString("Enter the kanji character to add: ", readKanjiCharacter);
              } else {
                var onyomiReadings = [];
                menu.MenuView.requestString("Enter a hiragana onyomi reading for the kanji or press enter to continue: ", function readOnyomiReadings(onyomiReading) {
                  if (onyomiReading) {
                    onyomiReadings.push(onyomiReading);
                    menu.MenuView.requestString("Enter a hiragana onyomi reading for the kanji or press enter to continue: ", readOnyomiReadings);
                  } else {
                    var kunyomiReadings = [];
                    menu.MenuView.requestString("Enter a hiragana kunyomi reading for the kanji or press enter to continue: ", function readKunyomiReadings(kunyomiReading) {
                      if (kunyomiReading) {
                        kunyomiReadings.push(kunyomiReading);
                        menu.MenuView.requestString("Enter a hiragana kunyomi reading for the kanji or press enter to continue: ", readKunyomiReadings);
                      } else {
                        var englishMeanings = [];
                        menu.MenuView.requestString("Enter an english meaning for the kanji or press enter to continue: ", function readEnglishMeanings(englishMeaning) {
                          if (englishMeaning) {
                            englishMeanings.push(englishMeaning);
                            menu.MenuView.requestString("Enter an english meaning for the kanji or press enter to continue: ", readEnglishMeanings);
                          } else {
                            // TODO
                            if (identifier > 0) {
                              日本ＤＢ.collections[index].kanji[identifier - 1] = dbtypes.createKanji(character, onyomiReadings, kunyomiReadings, englishMeanings, []);
                            } else {
                              日本ＤＢ.collections[index].kanji.push(dbtypes.createKanji(character, onyomiReadings, kunyomiReadings, englishMeanings, []));
                            }
                            callback(日本ＤＢ);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
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
        menu.MenuView.requestString("Enter the correct Japanese spelling of the vocabulary word to add: ", function readVocabSpelling(spelling) {
          if (!spelling) {
            console.log("This field cannot be left blank. Please try again.");
            menu.MenuView.requestString("Enter the correct Japanese spelling of the vocabulary word to add: ", readVocabSpelling);
          } else {
            var isDuplicate = 日本ＤＢ.collections[index].vocabulary.some(function(vocab) {
              return (spelling === vocab.spelling);
            });
            if (isDuplicate) {
              console.warn("The vocabulary word '" + spelling + "' already exists in the database.");
              callback(日本ＤＢ);
            } else {
              menu.MenuView.requestString("Enter the correct hiragana reading of the vocabulary word to add: ", function readVocabReading(reading) {
                if (!reading) {
                  console.log("This field cannot be left blank. Please try again.");
                  menu.MenuView.requestString("Enter the correct hiragana reading of the vocabulary word to add: ", readVocabReading);
                } else {
                  var insertionIndex = 0;
                  var meanings = [];
                  日本ＤＢ.collections[index].vocabulary.some(function(vocab, vocabIndex) {
                    insertionIndex = vocabIndex;
                    if (reading < vocab.reading) {
                      return true;
                    }
                    return false;
                  });
                  menu.MenuView.requestString("Enter an English meaning of the vocabulary word to add or press enter to continue: ", function readVocabMeaning(meaning) {
                    if (meaning) {
                      meanings.push(meaning);
                      menu.MenuView.requestString("Enter an English meaning of the vocabulary word to add or press enter to continue: ", readVocabMeaning);
                    } else {
                      if (meanings.length < 1) {
                        console.log("This field cannot be left blank. Please try again.");
                        menu.MenuView.requestString("Enter an English meaning of the vocabulary word to add or press enter to continue: ", readVocabMeaning);
                      } else {
                        日本ＤＢ.collections[index].vocabulary.splice(insertionIndex, 0, dbtypes.createVocabularyWord(spelling, reading, meanings));
                        callback(日本ＤＢ);
                      }
                    }
                  });
                }
              });
            }
          }
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
