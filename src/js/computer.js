import { Player } from "./player";
import { Sound } from "./sound";
import { NodeList } from "./nodelist";
import { Turn } from "./turn";
import { Dom } from "./dom";

const maxIndex = 9;
const sound = new Sound();
const dom = new Dom();

class Computer extends Player {
  adjacentCells = [];
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

  play(currentTurn, gameData) {
    const shipHitBackgroundColor = "#f7dadb";
    const missBackgroundColor = "#c5e3fc";

    if (currentTurn === gameData["player2"]) {
      let playerOne = gameData["player1"];
      let computer = gameData["player2"];

      while (
        currentTurn === computer &&
        (!playerOne.playerBoard.areAllShipsSunk() ||
          !computer.playerBoard.areAllShipsSunk())
      ) {
        const playerOneNodes = document.querySelectorAll(".player1-cell");
        playerOne.setNodeList(playerOneNodes);
        const nodeMatrixPlayerOne = NodeList.nodeListToMatrix(playerOneNodes);

        let x = Math.floor(Math.random() * (maxIndex + 1));
        let y = Math.floor(Math.random() * (maxIndex + 1));
        let coordinates = { x: x, y: y };

        if (this.adjacentCells.length < 1) {
          while (playerOne.playerBoard.hasCellBeenPlayed(coordinates)) {
            x = Math.floor(Math.random() * (maxIndex + 1));
            y = Math.floor(Math.random() * (maxIndex + 1));
            coordinates = { x: x, y: y };
          }
        } else {
          coordinates = this.adjacentCells.pop();
          x = coordinates["x"];
          y = coordinates["y"];
        }

        if (playerOne.playerBoard.receiveAttack(x, y)) {
          if (this.adjacentCells.length < 1) {
            let adjacentCellOne = {};
            let adjacentCellTwo = {};

            if (
              playerOne.playerBoard.board[x][y].orientation === "horizontal"
            ) {
              adjacentCellOne = { x: x, y: y + 1 };
              adjacentCellTwo = { x: x, y: y - 1 };
            } else {
              adjacentCellOne = { x: x + 1, y: y };
              adjacentCellTwo = { x: x - 1, y: y };
            }

            const adjacentCells = [adjacentCellOne, adjacentCellTwo];
            for (let i = 0; i < adjacentCells.length; i++) {
              const currentAdjacentCell = adjacentCells[i];
              if (
                !playerOne.playerBoard.hasCellBeenPlayed(currentAdjacentCell) &&
                !playerOne.playerBoard.areCoordinatesOutOfBounds(
                  currentAdjacentCell
                )
              ) {
                this.adjacentCells.push(currentAdjacentCell);
              }
            }
          }
          nodeMatrixPlayerOne[x][y].style.backgroundColor =
            shipHitBackgroundColor;
          sound.playBoomSfx();
        } else {
          nodeMatrixPlayerOne[x][y].style.backgroundColor = missBackgroundColor;
          sound.playSplashSfx();
          currentTurn = Turn.checkTurn(currentTurn, playerOne, computer);
        }

        playerOne.playerBoard.trackShots(coordinates);
        console.log(this.adjacentCells);
        dom.displayCurrentTurn(currentTurn.name);

        if (
          playerOne.playerBoard.areAllShipsSunk() ||
          computer.playerBoard.areAllShipsSunk()
        ) {
          dom.showWinModal(currentTurn.name + " has won");
          playerOne.playerBoard.disableBoard(
            NodeList.nodeListToMatrix(playerOne.nodelist)
          );
          computer.playerBoard.disableBoard(
            NodeList.nodeListToMatrix(computer.nodelist)
          );
        }
      }
    }
    return currentTurn;
  }
}

export { Computer };
