import "./styles.css";
import { Dom } from "./js/dom";
import { Player } from "./js/player";
import { Game } from "./js/game";
import { Sound } from "./js/sound";

let orientation = "horizontal";
let isGameReady = false;

const sound = new Sound();
const dom = new Dom();

document.addEventListener("click", (event) => {
  const playButton = event.target.closest(".play-button");
  if (playButton) {
    dom.setUsernameOne();
    dom.updateInterface();
  }
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
      dom.setUsernameTwo();
      dom.createGameboards();
    }
  }

  const orientationButton = event.target.closest(".orientation-button");
  if (orientationButton) {
    const flexContainer = document.querySelector(".inner-ships-container");
    const ships = document.querySelectorAll(".ship");
    dom.changeContainerOrientation(flexContainer, ships, orientation);
    if (orientation === "horizontal") {
      orientation = "vertical";
    } else {
      orientation = "horizontal";
    }
    orientationButton.textContent = orientation;
  }
});

const cells = document.querySelectorAll(".ship-cell");
document.addEventListener("dragstart", function (event) {
  if (cells) event.dataTransfer.setData("text/plain", event.target.id);
});

// Player 1 gameboard
const cellsOne = document.querySelectorAll(".player1-cell");
document.addEventListener("dragover", (event) => {
  if (cellsOne) event.preventDefault();
});

const playerOne = new Player("");
playerOne.playerBoard.createGameboard();

document.addEventListener("drop", (event) => {
  if (cellsOne) {
    if (
      event.target.className === "player2-cell" &&
      !playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      dom.showModal(
        "Error",
        "Player one must place all their ships before player two can start placing theirs"
      );
    } else if (
      event.target.className !== "player1-cell" &&
      event.target.className !== "player2-cell"
    ) {
      dom.showModal("Error", "Cannot place ship out of board bounds");
    } else if (
      event.target.className === "player1-cell" &&
      playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      dom.showModal("Error", "Player one has placed all their ships already");
    } else if (
      event.target.className === "player1-cell" &&
      !playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      Game.place(event, ".player1-cell", playerOne, dom, orientation);
    }
  }
});

const playerTwo = new Player("");
playerTwo.playerBoard.createGameboard();

const cellsTwo = document.querySelectorAll(".player2-cell");
document.addEventListener("dragover", (event) => {
  if (cellsTwo) event.preventDefault();
});

document.addEventListener("drop", (event) => {
  if (cellsTwo) {
    if (
      event.target.className === "player2-cell" &&
      playerTwo.playerBoard.haveAllShipsBeenPlaced()
    ) {
      dom.showModal("Error", "Player two has placed all their ships already");
    } else if (
      event.target.className === "player2-cell" &&
      playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      Game.place(event, ".player2-cell", playerTwo, dom, orientation);
    } else if (
      event.target.className === "player2-cell" &&
      !playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      dom.showModal(
        "Error",
        "Player one must place all their ships before player two can start placing theirs"
      );
    }
  }
});

document.addEventListener("click", (event) => {
  const playButton = event.target.closest(".play-button-gameboards");
  if (playButton) {
    if (
      playerOne.playerBoard.haveAllShipsBeenPlaced() &&
      playerTwo.playerBoard.haveAllShipsBeenPlaced()
    ) {
      dom.removeNode(document.querySelector(".main-menu"), 1);
      dom.removeNode(document.querySelector("body"), 11);
      isGameReady = true;
      sound.playBackgroundMusic();
      playerOne.setUsername(dom.usernameOneInputValue);
      playerTwo.setUsername(dom.usernameTwoInputValue);
      dom.displayCurrentTurn(playerOne.name);
    } else {
      dom.showModal(
        "Error",
        "Both players must have placed all their ships in order to play"
      );
    }
  }
});

let currentTurn = playerOne;
const gameData = { player1: playerOne, player2: playerTwo };

document.addEventListener("click", (event) => {
  const cellsPlayerOne = event.target.closest(".player1-cell");
  const cellsPlayerTwo = event.target.closest(".player2-cell");
  const node = event.target;

  if (cellsPlayerOne && isGameReady) {
    currentTurn = Game.play(playerOne, gameData, node, currentTurn);
  }

  if (cellsPlayerTwo && isGameReady) {
    currentTurn = Game.play(playerTwo, gameData, node, currentTurn);
  }
});

document.querySelector(".win-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
});

document.addEventListener("click", (event) => {
  const playAgainButton = event.target.closest(".play-again");
  if (playAgainButton) {
    playerOne.playerBoard.resetGameBoard();
    playerTwo.playerBoard.resetGameBoard();
    dom.loadStartScreen();
    dom.closeModal(document.querySelector(".win-dialog"));
    dom.clearText(document.querySelector(".turns"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  dom.clearInput(document.querySelector(".player1-username"));
});
