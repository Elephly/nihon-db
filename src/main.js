// jshint esversion: 6

var assert = require("assert");
var path = require("path");
var readline = require("readline");

var io = require("./io");

var 日本ＤＢpath = path.join(__dirname, "..", "resources", "日本ＤＢ.json");
var running = true;

function menu(日本ＤＢ) {
  assert.notEqual(日本ＤＢ, null);
  while (running) {
    
  }
}

io.loadDB(日本ＤＢpath, menu);
