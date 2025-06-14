import "./styles.css";
import { Dom } from "./js/dom";
import { NodeList } from "./js/nodelist";
import { Player } from "./js/player";
import { Turn } from "./js/turn";
import Boom from "./assets/sfx/boom.mp3";
import Splash from "./assets/sfx/splash.mp3";
import OST from "./assets/ost/ost.mp3";

let orientation = "horizontal";
let isGameReady = false;

const shipHitSfx = new Audio(Boom);
const splashSfx = new Audio(Splash);
const backgroundMusic = new Audio(OST);

const dom = new Dom();
document.querySelector(".play-button").addEventListener("click", function () {
  dom.setUsernameOne();
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

const playerOne = new Player(dom.usernameOneInputValue);
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
    } else if (event.target.className !== "player1-cell") {
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

      playerOne.playerBoard.place(x, y, shipLength, orientation);
      dom.showShipInGameboard(
        x,
        y,
        shipLength,
        nodeListMatrixPlayerOne,
        playerOne.playerBoard.board,
        orientation
      );

      if (playerOne.playerBoard.haveAllShipsBeenPlaced()) {
        dom.showModal(
          "All ships have been placed",
          "Once all ships are placed they are hidden and you cannot place more"
        );
        dom.hideShips(nodeListMatrixPlayerOne);
      }
    }
  }
});

const playerTwo = new Player(dom.usernameTwoInputValue);
playerTwo.playerBoard.createGameboard();

const cellsTwo = document.querySelectorAll(".player2-cell");
document.addEventListener("dragover", (event) => {
  if (cellsTwo) event.preventDefault();
});

document.addEventListener("drop", (event) => {
  if (cellsTwo) {
    if (
      event.target.className === "player2-cell" &&
      playerOne.playerBoard.haveAllShipsBeenPlaced()
    ) {
      event.preventDefault();
      const shipData = event.dataTransfer.getData("text");
      const shipToPlace = document.getElementById(shipData);

      const cellsPlayerTwo = document.querySelectorAll(".player2-cell");
      const nodeListMatrixPlayerTwo = NodeList.nodeListToMatrix(cellsPlayerTwo);
      const targetCell = event.target;

      const coordinates = NodeList.getIndexOf(
        targetCell,
        nodeListMatrixPlayerTwo
      );

      const x = coordinates["x"];
      const y = coordinates["y"];
      const shipLength = shipToPlace.childElementCount;

      console.log(x, y);

      playerTwo.playerBoard.place(x, y, shipLength, orientation);
      dom.showShipInGameboard(
        x,
        y,
        shipLength,
        nodeListMatrixPlayerTwo,
        playerTwo.playerBoard.board,
        orientation
      );

      if (playerTwo.playerBoard.haveAllShipsBeenPlaced()) {
        dom.showModal(
          "All ships have been placed",
          "Player two has placed all their ships you cannot place more ships"
        );
        dom.hideShips(nodeListMatrixPlayerTwo);
      }
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
      dom.removeNode(document.querySelector("body"), 7);
      isGameReady = true;
      backgroundMusic.play();
      backgroundMusic.loop = true;
    } else {
      dom.showModal(
        "Error",
        "Both players must have placed all their ships in order to play"
      );
    }
  }
});

let currentTurn = playerOne;
document.addEventListener("click", (event) => {
  const cellsPlayerOne = event.target.closest(".player1-cell");
  const cellsPlayerTwo = event.target.closest(".player2-cell");
  const node = event.target;

  const shipHitBackground = "#e69e9e";
  const missBackground = "#809fbf";

  const nodeListCellsPlayerOne = document.querySelectorAll(".player1-cell");
  const nodeListCellsPlayerTwo = document.querySelectorAll(".player2-cell");

  if (cellsPlayerOne && isGameReady) {
    if (currentTurn !== playerOne) {
      const nodeListMatrixPlayerOne = NodeList.nodeListToMatrix(
        nodeListCellsPlayerOne
      );
      const coordinates = NodeList.getIndexOf(node, nodeListMatrixPlayerOne);
      if (!playerOne.playerBoard.hasCellBeenPlayed(coordinates)) {
        if (
          playerOne.playerBoard.receiveAttack(
            coordinates["x"],
            coordinates["y"]
          )
        ) {
          node.style.backgroundColor = shipHitBackground;
          shipHitSfx.play();
        } else {
          node.style.backgroundColor = missBackground;
          splashSfx.play();
          currentTurn = Turn.checkTurn(currentTurn, playerOne, playerTwo);
        }
      } else {
        console.log("That cell has already been hit");
      }
      playerOne.playerBoard.trackShots(coordinates);
    }

    if (
      playerOne.playerBoard.areAllShipsSunk() ||
      playerTwo.playerBoard.areAllShipsSunk()
    ) {
      dom.showModal("Game over", "The game has finished");
    }
  }

  if (cellsPlayerTwo && isGameReady) {
    if (currentTurn !== playerTwo) {
      const nodeListMatrixPlayerTwo = NodeList.nodeListToMatrix(
        nodeListCellsPlayerTwo
      );
      const coordinates = NodeList.getIndexOf(node, nodeListMatrixPlayerTwo);
      if (!playerTwo.playerBoard.hasCellBeenPlayed(coordinates)) {
        if (
          playerTwo.playerBoard.receiveAttack(
            coordinates["x"],
            coordinates["y"]
          )
        ) {
          node.style.backgroundColor = shipHitBackground;
          shipHitSfx.play();
        } else {
          node.style.backgroundColor = missBackground;
          splashSfx.play();
          currentTurn = Turn.checkTurn(currentTurn, playerOne, playerTwo);
        }
      } else {
        console.log("That cell has already been hit");
      }
      playerTwo.playerBoard.trackShots(coordinates);
    }

    if (
      playerOne.playerBoard.areAllShipsSunk() ||
      playerTwo.playerBoard.areAllShipsSunk()
    ) {
      dom.showModal("Game over", "The game has finished");
    }
  }
});
