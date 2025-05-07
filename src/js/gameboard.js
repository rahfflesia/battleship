import Ship from "./ship";

const maximumIndex = 10;
const maximumLength = 5;

class Gameboard {
  board = [];
  missedShots = [];

  createGameboard() {
    for (let i = 0; i < 10; i++) {
      this.board[i] = new Array(maximumIndex);
    }
  }

  receiveAttack(x, y) {
    if (x > maximumIndex || x < 0 || y > maximumIndex || y < 0) {
      throw new Error("Index out of bounds");
    } else {
      const target = this.board[x][y];
      if (target instanceof Ship) {
        target.hit();
        return true;
      } else {
        this.board[x][y] = 0;
        return false;
      }
    }
  }

  place(x, y, length, orientation = "horizontal") {
    if (length > maximumLength) {
      throw new Error("Ship exceeds the maximum length");
    } else if (x > maximumIndex || x < 0 || y > maximumIndex || y < 0) {
      throw new Error("Index out of bounds");
    } else {
      const newShip = new Ship(length);
      if (orientation) {
        for (let i = 0; i < length; i++) {
          if (
            !(this.board[x][i] instanceof Ship) &&
            this.board[x][i] === undefined
          ) {
            this.board[x][i] = newShip;
          } else {
            throw new Error("That slot is not empty");
          }
        }
      } else if (orientation === "vertical") {
        for (let i = 0; i < length; i++) {
          if (
            !(this.board[i][y] instanceof Ship) &&
            this.board[i][y] === undefined
          ) {
            this.board[i][y] = newShip;
          } else {
            throw new Error("That slot is not empty");
          }
        }
      } else {
        throw new Error("Not a valid orientation");
      }
    }
  }

  trackMissedShots(arr) {
    this.missedShots.push(arr);
  }

  areAllShipsSunk() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
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

module.exports = Gameboard;
