import { Ship } from "./ship";
import { Dom } from "./dom";

const maximumIndex = 9;
const maximumLength = 5;
const dom = new Dom();

class Gameboard {
  board = [];
  missedShots = [];

  createGameboard() {
    for (let i = 0; i < 10; i++) {
      this.board[i] = new Array(maximumIndex + 1);
    }
  }

  receiveAttack(x, y) {
    if (x > maximumIndex || x < 0 || y > maximumIndex || y < 0) {
      dom.showModal("Index out of bounds");
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

  isPositionValid(x, y, length, orientation) {
    if (orientation) {
      for (let i = y; i < y + length; i++) {
        if (
          this.board[x][i] instanceof Ship ||
          this.board[x][i] !== undefined
        ) {
          return false;
        }
      }
    } else if (orientation === "vertical") {
      for (let i = x; i < x + length; i++) {
        if (
          this.board[i][y] instanceof Ship ||
          this.board[i][y] !== undefined
        ) {
          return false;
        }
      }
    }
    return true;
  }

  isShipInBounds(x, y, length, orientation) {
    if (orientation) {
      for (let i = x; i < x + length; i++) {
        if (y + length > maximumIndex + 1) {
          return false;
        }
      }
    } else if (orientation === "vertical") {
      for (let i = y; i < y + length; i++) {
        if (x + length > maximumIndex + 1) {
          return false;
        }
      }
    }
    return true;
  }

  place(x, y, length, orientation = "horizontal") {
    if (length > maximumLength) {
      dom.showModal("Error", "Ship exceeds the maximum length");
    } else if (x > maximumIndex || x < 0 || y > maximumIndex || y < 0) {
      dom.showModal("Error", "Trying to place ship out of bounds");
    } else {
      const newShip = new Ship(length);
      if (orientation) {
        if (
          this.isPositionValid(x, y, length, orientation) &&
          this.isShipInBounds(x, y, length, orientation)
        ) {
          for (let i = y; i < y + length; i++) {
            this.board[x][i] = newShip;
          }
        } else {
          dom.showModal(
            "Error",
            "All the slots required to place the ship are not empty or the ship is out of bounds"
          );
        }
      } else if (orientation === "vertical") {
        if (
          this.isPositionValid(x, y, length, orientation) &&
          this.isShipInBounds(x, y, length, orientation)
        ) {
          for (let i = x; i < x + length; i++) {
            this.board[i][y] = newShip;
          }
        } else {
          dom.showModal(
            "Error",
            "All the slots required to place the ship are not empty or the ship is out of bounds"
          );
        }
      } else {
        dom.showModal("Error", "Not a valid orientation");
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

export { Gameboard };
