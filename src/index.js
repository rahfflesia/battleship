import "./styles.css";
import { Dom } from "./js/dom";
import { NodeList } from "./js/nodelist";

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

document.addEventListener("drop", (event) => {
  if (cellsOne) {
    event.preventDefault();
    const shipData = event.dataTransfer.getData("text");
    const shipToPlace = document.getElementById(shipData);

    const cellsPlayerOne = document.querySelectorAll(".player1-cell");
    const nodeListMatrixPlayerOne = NodeList.nodeListToMatrix(cellsPlayerOne);
    const targetCell = event.target;

    console.log(nodeListMatrixPlayerOne);
    console.log(NodeList.getIndexOf(targetCell, nodeListMatrixPlayerOne));
  }
});

// Player 2 gameboard
// To-do

// Funciona, nomás que aún no sé donde ponerlo
/*
const playerOneGameboardCells = document.querySelectorAll(".player1-cell");
const nodeListMatrixPlayerOne = NodeList.nodeListToMatrix(
  playerOneGameboardCells
);
console.log(nodeListMatrixPlayerOne);*/
