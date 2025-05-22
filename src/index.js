import "./styles.css";
import { Dom } from "./js/dom";
import { NodeList } from "./js/nodelist";
import { Player } from "./js/player";

const dom = new Dom();
document.querySelector(".play-button").addEventListener("click", function () {
  dom.updateInterface();
});

document.querySelector(".close-modal").addEventListener("click", () => {
  dom.closeModal(document.querySelector(".dialog"));
});

// Event delegation
document.addEventListener("click", function (event) {
  const nextButton = event.target.closest(".next-button");
  if (nextButton) {
    const playerTwoUsername = document.querySelector(".player2-username");
    if (dom.isInputEmpty(playerTwoUsername)) {
      dom.showModal("Error", "Player two username cannot be empty");
    } else {
      dom.createGameboards();
    }
  }
});

const cells = document.querySelectorAll(".ship-cell");
document.addEventListener("dragstart", function (event) {
  if (cells) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
});

// Player 1 gameboard
const cellsOne = document.querySelectorAll(".player1-cell");
document.addEventListener("dragover", (event) => {
  if (cellsOne) {
    event.preventDefault();
  }
});

const playerOne = new Player("player1");
playerOne.playerBoard.createGameboard();

document.addEventListener("drop", (event) => {
  if (cellsOne) {
    if (event.target.className !== "player1-cell") {
      dom.showModal("Error", "Cannot place ship out of board bounds");
    } else {
      event.preventDefault();
      const shipData = event.dataTransfer.getData("text");
      const shipToPlace = document.getElementById(shipData);

      const cellsPlayerOne = document.querySelectorAll(".player1-cell");
      const nodeListMatrixPlayerOne = NodeList.nodeListToMatrix(cellsPlayerOne);
      const targetCell = event.target;

      const coordinates = NodeList.getIndexOf(
        targetCell,
        nodeListMatrixPlayerOne
      );

      const x = coordinates["x"];
      const y = coordinates["y"];
      const shipLength = shipToPlace.childElementCount;

      console.log(x, y);

      playerOne.playerBoard.place(x, y, shipLength);
      dom.showShipInGameboard(
        x,
        y,
        shipLength,
        nodeListMatrixPlayerOne,
        playerOne.playerBoard.board
      );

      console.log(playerOne.playerBoard.board);
    }
  }
});

// Player 2 gameboard
// To-do
