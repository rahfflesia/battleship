import { Player } from "./player";
import { NodeList } from "./nodelist";
import { Dom } from "./dom";
import { Sound } from "./sound";
import { Turn } from "./turn";

const dom = new Dom();
const sound = new Sound();

class Game {
  static play(player, gameData, node, currentTurn) {
    let firstPlayer;
    let secondPlayer;

    if (!(player instanceof Player))
      throw new Error("The player parameter must be a Player object");

    const nodeListCellsPlayerOne = document.querySelectorAll(".player1-cell");
    const nodeListCellsPlayerTwo = document.querySelectorAll(".player2-cell");

    if (player === gameData["player1"]) {
      firstPlayer = gameData["player1"];
      firstPlayer.setNodeList(nodeListCellsPlayerOne);
      secondPlayer = gameData["player2"];
      secondPlayer.setNodeList(nodeListCellsPlayerTwo);
    } else {
      firstPlayer = gameData["player2"];
      firstPlayer.setNodeList(nodeListCellsPlayerTwo);
      secondPlayer = gameData["player1"];
      secondPlayer.setNodeList(nodeListCellsPlayerOne);
    }

    if (currentTurn !== firstPlayer) {
      const shipHitBackgroundColor = "#f7dadb";
      const missBackgroundColor = "#c5e3fc";

      const nodeListMatrix = NodeList.nodeListToMatrix(firstPlayer.nodelist);
      const coordinates = NodeList.getIndexOf(node, nodeListMatrix);

      if (!firstPlayer.playerBoard.hasCellBeenPlayed(coordinates)) {
        if (
          firstPlayer.playerBoard.receiveAttack(
            coordinates["x"],
            coordinates["y"]
          )
        ) {
          node.style.backgroundColor = shipHitBackgroundColor;
          sound.playBoomSfx();
        } else {
          node.style.backgroundColor = missBackgroundColor;
          sound.playSplashSfx();
          currentTurn = Turn.checkTurn(currentTurn, firstPlayer, secondPlayer);
        }
      } else {
        dom.showModal("Error", "That cell has already been hit");
      }
      firstPlayer.playerBoard.trackShots(coordinates);
      dom.displayCurrentTurn(currentTurn.name);

      if (
        firstPlayer.playerBoard.areAllShipsSunk() ||
        secondPlayer.playerBoard.areAllShipsSunk()
      ) {
        dom.showWinModal(currentTurn.name + " has won");
        firstPlayer.playerBoard.disableBoard(
          NodeList.nodeListToMatrix(firstPlayer.nodelist)
        );
        secondPlayer.playerBoard.disableBoard(
          NodeList.nodeListToMatrix(secondPlayer.nodelist)
        );
      }
    }
    return currentTurn;
  }

  static place(event, playerClass, player, domObject, orientation) {
    event.preventDefault();
    const shipData = event.dataTransfer.getData("text");
    const shipToPlace = document.getElementById(shipData);

    const cells = document.querySelectorAll(playerClass);
    const nodeListMatrix = NodeList.nodeListToMatrix(cells);
    const targetCell = event.target;

    const coordinates = NodeList.getIndexOf(targetCell, nodeListMatrix);

    const x = coordinates["x"];
    const y = coordinates["y"];
    const shipLength = shipToPlace.childElementCount;

    player.playerBoard.place(x, y, shipLength, orientation);
    domObject.showShipInGameboard(
      x,
      y,
      shipLength,
      nodeListMatrix,
      player.playerBoard.board,
      orientation
    );

    if (player.playerBoard.haveAllShipsBeenPlaced()) {
      domObject.showModal(
        "All ships have been placed",
        "Once all ships are placed they are hidden and you cannot place more"
      );
      domObject.hideShips(nodeListMatrix);
    }
  }
}

export { Game };
