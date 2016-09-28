// jshint esversion: 6

var path = require("path");

var dbio = require("./dbio");
var dbtypes = require("./dbtypes");
var menu = require("./menu");

var 日本ＤＢpath = path.join(__dirname, "..", "resources", "日本ＤＢ.json");

var mainMenu = new menu.Menu("日本ＤＢ");

var collectionsMenu = new menu.Menu("Collections", mainMenu);

var viewCollectionsMenu = new menu.Menu("Choose Collection", collectionsMenu);
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
