import { Ship } from "./ship";

class Gameboard {
  board = [];
  missedShots = [];

  createGameBoard() {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
    }
  }

  receiveAttack(x, y) {
    const target = this.board[x][y];
    if (target instanceof Ship) {
      target.hit();
      return true;
    } else {
      return false;
    }
  }

  place(x, y, length) {
    // Cambiar la rotación en la matriz según la orientación del barco
    // Horizontal
    const newShip = new Ship(length);
    for (let i = 0; i < length; i++) {
      this.board[x][i] = newShip;
    }

    // Vertical
    /*const newShip2 = new Ship(length);
    for (let i = 0; i < length; i++) {
      this.board[i][y] = newShip2;
    }*/
  }

  trackMissedShots(arr) {
    this.missedShots.push(arr);
  }

  areAllShipsSunk() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[j].length; j++) {
        if (this.board[i][j] instanceof Ship) {
          if (!this.board[i][j].isSunk()) {
            return false;
          }
        }
      }
    }
    return true;
  }
}

export { Gameboard };
