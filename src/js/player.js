import { Gameboard } from "./gameboard";

class Player {
  playerBoard = new Gameboard();
  name = "";

  setUsername(name) {
    this.name = name;
  }
}

export { Player };
