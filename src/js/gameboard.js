import { Ship } from "./ship";
import { Dom } from "./dom";

const maximumIndex = 9;
const maximumLength = 5;
const dom = new Dom();

class Gameboard {
  board = [];
  cellsPlayed = [];

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
        if (target.isSunk() && this.getSunkShips() <= 4) {
          dom.showModal(
            "Ship sunk",
            "You have sunk a ship of length " + target.length
          );
        } else if (this.getSunkShips() === 5) {
          dom.closeModal(document.querySelector(".dialog"));
        }
        return true;
      } else {
        this.board[x][y] = 0;
        return false;
      }
    }
  }

  areAllNeededCellsEmpty(x, y, length, orientation) {
    if (orientation === "horizontal") {
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
    if (orientation === "horizontal") {
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

  hasShipBeenPlaced(length) {
    let counter = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          this.board[i][j] instanceof Ship &&
          this.board[i][j].length === length
        )
          counter++;
      }
    }

    return length === 3 ? counter === length * 2 : counter === length;
  }

  haveAllShipsBeenPlaced() {
    const shipLengths = [2, 3, 4, 5];
    for (let i = 0; i < shipLengths.length; i++) {
      if (!this.hasShipBeenPlaced(shipLengths[i])) {
        return false;
      }
    }
    return true;
  }

  place(x, y, length, orientation, isComputer = false) {
    if (length > maximumLength) {
      dom.showModal("Error", "Ship exceeds the maximum length");
    } else if (x > maximumIndex || x < 0 || y > maximumIndex || y < 0) {
      dom.showModal("Error", "Trying to place ship out of bounds");
    } else {
      const newShip = new Ship(length);
      if (orientation === "horizontal") {
        if (!this.areAllNeededCellsEmpty(x, y, length, orientation)) {
          if (!isComputer) {
            dom.showModal(
              "Error",
              "All the cells required to place the ship are not empty"
            );
          }
          return false;
        } else if (!this.isShipInBounds(x, y, length, orientation)) {
          if (!isComputer) {
            dom.showModal("Error", "Trying to place ship out of board bounds");
          }
          return false;
        } else if (this.hasShipBeenPlaced(length)) {
          if (!isComputer) {
            dom.showModal("Error", "That ship has already been placed");
          }
          return false;
        } else {
          for (let i = y; i < y + length; i++) {
            this.board[x][i] = newShip;
          }
          return true;
        }
      } else if (orientation === "vertical") {
        if (!this.areAllNeededCellsEmpty(x, y, length, orientation)) {
          if (!isComputer) {
            dom.showModal(
              "Error",
              "All cells required to place the ship are not empty"
            );
          }
          return false;
        } else if (!this.isShipInBounds(x, y, length, orientation)) {
          if (!isComputer) {
            dom.showModal("Error", "Trying to place ship out of bounds");
          }
          return false;
        } else if (this.hasShipBeenPlaced(length)) {
          if (!isComputer) {
            dom.showModal("Error", "That ship has already been placed");
          }
          return false;
        } else {
          for (let i = x; i < x + length; i++) {
            this.board[i][y] = newShip;
          }
          return true;
        }
      } else {
        throw new Error("Not a valid orientation");
      }
    }
  }

  trackShots(coordinatesObj) {
    this.cellsPlayed.push(coordinatesObj);
  }

  hasCellBeenPlayed(coordinatesObj) {
    for (let i = 0; i < this.cellsPlayed.length; i++) {
      if (
        coordinatesObj["x"] === this.cellsPlayed[i]["x"] &&
        coordinatesObj["y"] === this.cellsPlayed[i]["y"]
      ) {
        return true;
      }
    }
    return false;
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

  disableBoard(nodeListMatrix) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const coordinatesObject = { x: i, y: j };
        if (!this.hasCellBeenPlayed(coordinatesObject)) {
          this.receiveAttack(i, j);
          this.trackShots(coordinatesObject);
          dom.updateCellInNodelist(nodeListMatrix, this.board);
        }
      }
    }
  }

  getSunkShips() {
    let shipsSunk = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] instanceof Ship) {
          if (this.board[i][j].isSunk()) {
            shipsSunk += 1 / this.board[i][j].length;
          }
        }
      }
    }
    return Math.floor(shipsSunk);
  }

  removeShips() {
    this.createGameboard();
  }

  resetGameBoard() {
    this.cellsPlayed = [];
    this.removeShips();
  }
}

export { Gameboard };
