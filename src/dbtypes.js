// jshint esversion: 6

module.exports = {
  createCollection: function(collectionName, kanjiList = [], vocabularyList = []) {
    return {
      name: collectionName,
      kanji: kanjiList,
      vocabulary: vocabularyList
    };
  },
  createKanji: function(kanjiCharacter, onyomiReadings, kunyomiReadings, englishMeanings, vocabularyUsages) {
    return {
      character: kanjiCharacter,
      reading: {
        onyomi: onyomiReadings,
        kunyomi: kunyomiReadings
      },
      meaning: englishMeanings,
      vocabulary: vocabularyUsages
    };
  },
  createVocabularyWord: function(fullSpelling, hiraganaReading, englishMeanings) {
    return {
      spelling: fullSpelling,
      reading: hiraganaReading,
      meaning: englishMeanings
    };
  }
};
