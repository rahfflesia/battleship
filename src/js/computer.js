import { Player } from "./player";

const maxIndex = 9;

class Computer extends Player {
  placeShips() {
    const shipLengths = [5, 4, 3, 3, 2];
    let i = 0;
    while (!this.playerBoard.haveAllShipsBeenPlaced()) {
      let x = Math.floor(Math.random() * (maxIndex + 1));
      let y = Math.floor(Math.random() * (maxIndex + 1));
      const orientations = ["horizontal", "vertical"];
      const randomIndex = Math.floor(Math.random() * orientations.length);

      while (x + shipLengths[i] > maxIndex || y + shipLengths[i] > maxIndex) {
        x = Math.floor(Math.random() * (maxIndex + 1));
        y = Math.floor(Math.random() * (maxIndex + 1));
      }

      if (
        this.playerBoard.place(
          x,
          y,
          shipLengths[i],
          orientations[randomIndex],
          true
        )
      )
        i++;
    }
  }
}

export { Computer };
