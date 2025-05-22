import { Gameboard } from "./gameboard";

class Player {
  playerBoard = new Gameboard();
  constructor(name) {
    this.name = name;
  }
}

export { Player };
