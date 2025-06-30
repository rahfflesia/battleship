import "./styles.css";
import { Dom } from "./js/dom";
import { Player } from "./js/player";
import { Game } from "./js/game";
import { Sound } from "./js/sound";
import { Computer } from "./js/computer";

let orientation = "horizontal";
let isGameReady = false;

const sound = new Sound();
const dom = new Dom();
let selectedOption = "";

document.addEventListener("click", (event) => {
  const playButton = event.target.closest(".play-button");
  if (playButton) {
    selectedOption = dom.getSelectValue();
    dom.setUsernameOne();
    dom.updateInterface();

    const mainMenu = document.querySelector(".main-menu");
    if (mainMenu.classList.contains("main-section-direction")) {
      const classes = ["main-section-direction", "main-container-start-screen"];
      dom.removeClasses(mainMenu, classes);
    }
  }
});

const closeModalButton = document.querySelector(".close-modal");
closeModalButton.addEventListener("click", () => {
  const dialog = document.querySelector(".dialog");
  dom.closeModal(dialog);
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
      dom.createGameboards(false, true);
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

const computer = new Computer();
computer.playerBoard.createGameboard();
computer.setUsername("Computer");

// Stacked lol
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
    } else if (
      playerOne.playerBoard.haveAllShipsBeenPlaced() &&
      selectedOption === "Computer"
    ) {
      isGameReady = true;
      playerOne.setUsername(dom.usernameOneInputValue);
      dom.setComputerUsername(computer);
      dom.createGameboards(false, false, true);
      dom.removeNode(document.querySelector("body"), 11);
      dom.removeNode(document.querySelector(".main-menu"), 1);
      computer.placeShips();
      sound.playBackgroundMusic();
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

  // Player vs player
  if (cellsPlayerOne && isGameReady) {
    currentTurn = Game.play(playerOne, gameData, node, currentTurn);
  }

  if (cellsPlayerTwo && isGameReady) {
    currentTurn = Game.play(playerTwo, gameData, node, currentTurn);
  }
});

document.addEventListener("click", (event) => {
  const targetNodes = event.target.closest(".computer-cell");
  const computerCells = document.querySelectorAll(".computer-cell");
  const gameDataPvC = { player1: playerOne, player2: computer };
  computer.setNodeList(computerCells);
  const node = event.target;

  // Player vs computer
  if (targetNodes && isGameReady && selectedOption === "Computer") {
    currentTurn = Game.play(computer, gameDataPvC, node, currentTurn, true);
  }
  // Computer waits 2 secs to attack
  setTimeout(() => {
    currentTurn = computer.play(currentTurn, gameDataPvC);
  }, 2000);
});

const winDialog = document.querySelector(".win-dialog");
winDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});

document.addEventListener("click", (event) => {
  const playAgainButton = event.target.closest(".play-again");
  if (playAgainButton) {
    dom.loadStartScreen();
    dom.closeModal(winDialog);
    dom.clearText(document.querySelector(".turns"));
    playerOne.playerBoard.resetGameBoard();
    if (selectedOption === "Player") {
      playerTwo.playerBoard.resetGameBoard();
    } else {
      computer.playerBoard.resetGameBoard();
      const mainMenu = document.querySelector(".main-menu");
      if (mainMenu.classList.contains("main-section-direction")) {
        const classes = [
          "main-section-direction",
          "main-container-start-screen",
          "main-section-computer-interface",
        ];
        dom.removeClasses(mainMenu, classes);
      }
    }
  }
});

const playerOneUsernameInput = document.querySelector(".player1-username");
document.addEventListener("DOMContentLoaded", () => {
  dom.clearInput(playerOneUsernameInput);
});
