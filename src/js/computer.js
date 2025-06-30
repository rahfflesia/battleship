import { Player } from "./player";
import { Sound } from "./sound";
import { NodeList } from "./nodelist";
import { Turn } from "./turn";
import { Dom } from "./dom";

const maxIndex = 9;
const sound = new Sound();
const dom = new Dom();

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

        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let coordinates = { x: x, y: y };

        while (playerOne.playerBoard.hasCellBeenPlayed(coordinates)) {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
          coordinates = { x: x, y: y };
        }

        if (playerOne.playerBoard.receiveAttack(x, y)) {
          nodeMatrixPlayerOne[x][y].style.backgroundColor =
            shipHitBackgroundColor;
          sound.playBoomSfx();
        } else {
          nodeMatrixPlayerOne[x][y].style.backgroundColor = missBackgroundColor;
          sound.playSplashSfx();
          currentTurn = Turn.checkTurn(currentTurn, playerOne, computer);
        }

        playerOne.playerBoard.trackShots(coordinates);
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
