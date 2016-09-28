// jshint esversion: 6

var assert = require("assert");
var readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Menu {
  constructor(title = "<null>", parent = null, prerequisite = null) {
    this.title = title;
    this.parent = parent;
    this.options = [];
    if (parent) {
      parent.addMenuItem(new MenuItem(this, prerequisite));
    }
  }

  enter(日本ＤＢ) {
    var context = this;
    MenuView.displayMenu(this, function(selection) {
      if (selection === 0) {
        context.goBack(日本ＤＢ);
      } else {
        context.options[selection - 1].select(日本ＤＢ);
      }
    });
  }

  addMenuItem(item) {
    this.options.push(item);
  }

  goBack(日本ＤＢ) {
    if (this.parent) {
      this.parent.enter(日本ＤＢ);
    } else {
      process.exit(0);
    }
  }
}

class MenuItem {
  constructor(menu = null, procedure = null) {
    this.menu = menu;
    this.procedure = procedure;
  }

  get title() {
    if (this.menu) {
      return this.menu.title;
    } else if (this.procedure) {
      return this.procedure.title;
    } else {
      return "<null>";
    }
  }

  select(日本ＤＢ) {
    if (this.procedure) {
      this.procedure.invoke(日本ＤＢ, this.menu);
    } else if (this.menu) {
      this.menu.enter(日本ＤＢ);
    }
  }
}

class MenuProcedure {
  constructor(title = "<null>", parent = null, callback = null) {
    this.title = title;
    this.parent = parent;
    this.callback = callback;
    if (parent) {
      parent.addMenuItem(new MenuItem(null, this));
    }
  }

  invoke(日本ＤＢ, postInvokeMenu) {
    var context = this;
    MenuView.displayProcedure(this);
    this.callback(日本ＤＢ, function(日本ＤＢ) {
      MenuView.requestAcknowledgement("Completed. Press Enter.", function() {
        if (postInvokeMenu) {
          postInvokeMenu.enter(日本ＤＢ);
        } else if (context.parent) {
          context.parent.enter(日本ＤＢ);
        }
      });
    });
  }
}

class MenuView {
  static displayMenu(menu, callback) {
    var parentStack = [];
    var tempParentMenu = menu.parent;

    while (tempParentMenu)
    {
      parentStack.push(tempParentMenu);
      tempParentMenu = tempParentMenu.parent;
    }

    var tempTitle = "";
    while (parentStack.length > 0)
    {
      tempTitle += (parentStack[parentStack.length - 1].title + "->");
      parentStack.pop();
    }
    tempTitle += menu.title;

    console.log(tempTitle);

    for (var i = 0; i < menu.options.length; i++) {
      console.log("\t(" + (i + 1) + ") " + menu.options[i].title);
    }

    if (menu.parent) {
      console.log("\t(0) Back");
    } else {
      console.log("\t(0) Quit");
    }

    this.requestNumber("Select: ", 0, menu.options.length, callback);
  }

  static displayProcedure(procedure) {
    console.log(procedure.title);
  }

  static requestNumber(message, min, max, callback) {
    var context = this;
    rl.question(message, function(answer) {
      if (!answer || isNaN(answer)) {
        context.requestNumber(message, min, max, callback);
      } else {
        var n = Number(answer);
        if (n < min || n > max) {
          context.requestNumber(message, min, max, callback);
        } else {
          callback(n);
        }
      }
    });
  }

  static requestString(message, callback) {
    rl.question(message, callback);
  }

  static requestAcknowledgement(message, callback) {
    rl.question(message, function(answer) {
      callback();
    });
  }
}

module.exports = {
  Menu: Menu,
  MenuItem: MenuItem,
  MenuProcedure: MenuProcedure,
  MenuView: MenuView
};

/*
module.exports = class {
  constructor(name = "<null>", optionDisplayName = "<null>", subMenus = [], selectionAction = null) {
    this.name = name;
    this.optionDisplayName = optionDisplayName;
    this.selectionAction = selectionAction;
    this.subMenus = subMenus;
  }

  selectionCallback(日本ＤＢ) {
    assert.notEqual(日本ＤＢ, null);

    if (this.selectionAction) this.selectionAction(日本ＤＢ);

    console.log(this.name);
    for (let i = 0; i < this.subMenus.length; i++) {
      console.log("(" + (i + 1) + ")" + "\t" + this.options[i].optionDisplayName);
    }
    readline.question("Select option: ", function(option) {
      if (option > 0 || option <= this.options.length) {
        setTimeout(Number(option), 日本ＤＢ);
      }
      setTimeout(this.selectionCallback, 0, 日本ＤＢ);
    });
  }
};
*/
