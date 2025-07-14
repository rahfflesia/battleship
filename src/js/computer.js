import { Player } from "./player";
import { Sound } from "./sound";
import { NodeList } from "./nodelist";
import { Turn } from "./turn";
import { Dom } from "./dom";
import { sleep } from "./sleep";

const maxIndex = 9;
const sound = new Sound();
const dom = new Dom();
let target;

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

  async play(currentTurn, gameData) {
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

        if (this.adjacentCells.length === 0) {
          while (playerOne.playerBoard.hasCellBeenPlayed(coordinates)) {
            x = Math.floor(Math.random() * (maxIndex + 1));
            y = Math.floor(Math.random() * (maxIndex + 1));
            coordinates = { x: x, y: y };
          }
        } else {
          target = this.adjacentCells.pop();
          if (
            playerOne.playerBoard.areCoordinatesInBounds(
              target["x"],
              target["y"]
            )
          ) {
            x = target["x"];
            y = target["y"];
            if (
              playerOne.playerBoard.board[x][y].orientation === "horizontal"
            ) {
              y--;
            } else {
              x--;
            }
          }
        }

        while (
          !playerOne.playerBoard.hasCellBeenPlayed({ x: x, y: y }) &&
          playerOne.playerBoard.areCoordinatesInBounds(x, y) &&
          playerOne.playerBoard.receiveAttack(x, y)
        ) {
          playerOne.playerBoard.trackShots({ x: x, y: y });
          nodeMatrixPlayerOne[x][y].style.backgroundColor =
            shipHitBackgroundColor;
          sound.playBoomSfx();

          if (this.adjacentCells.length === 0) {
            this.adjacentCells.push(coordinates);
          }

          const cell = playerOne.playerBoard.board[x][y];
          if (cell.isSunk()) {
            target = undefined;
            this.adjacentCells = [];
            break;
          }

          if (!cell.isSunk()) {
            if (cell.orientation === "horizontal") {
              if (target === undefined) {
                y++;
              } else {
                y--;
              }
            } else {
              if (target === undefined) {
                x++;
              } else {
                x--;
              }
            }
          }
          await sleep(2000);
        }

        if (
          playerOne.playerBoard.areCoordinatesInBounds(x, y) &&
          !playerOne.playerBoard.receiveAttack(x, y) &&
          !playerOne.playerBoard.hasCellBeenPlayed({ x: x, y: y })
        ) {
          nodeMatrixPlayerOne[x][y].style.backgroundColor = missBackgroundColor;
          sound.playSplashSfx();
          currentTurn = Turn.checkTurn(currentTurn, playerOne, computer);
          playerOne.playerBoard.trackShots({ x: x, y: y });
        }
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
