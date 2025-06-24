import { Gameboard } from "./gameboard";

class Player {
  playerBoard = new Gameboard();
  name = "";
  nodelist = undefined;

  setUsername(name) {
    this.name = name;
  }

  setNodeList(nodelist) {
    this.nodelist = nodelist;
  }
}

export { Player };
