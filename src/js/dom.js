import { Ship } from "./ship";
import { Sound } from "./sound";

const maxIndex = 9;

class Dom {
  #modal = document.querySelector(".dialog");
  #mainMenu = document.querySelector(".main-menu");
  usernameOneInputValue = "";
  usernameTwoInputValue = "";

  updateInterface() {
    const playerOneUsername = document.querySelector(".player1-username");
    const select = document.querySelector(".options");

    if (this.isInputEmpty(playerOneUsername)) {
      this.showModal("Error", "All inputs must be filled");
    } else if (
      !this.isInputEmpty(playerOneUsername) &&
      select.value === "Player"
    ) {
      this.#loadPlayerInterface();
    } else if (
      !this.isInputEmpty(playerOneUsername) &&
      select.value === "Computer"
    ) {
      this.#loadComputerInterface();
    } else {
      throw new Error("An error has ocurred");
    }
  }

  isInputEmpty(input) {
    return input.value.length < 1;
  }

  clearInput(input) {
    input.value = "";
  }

  setUsernameOne() {
    this.usernameOneInputValue =
      document.querySelector(".player1-username").value;
  }

  setUsernameTwo() {
    this.usernameTwoInputValue =
      document.querySelector(".player2-username").value;
  }

  #loadPlayerInterface() {
    this.#removeAllChilds(this.#mainMenu);
    this.#createPlayerInterface();
  }

  #loadComputerInterface() {
    this.#removeAllChilds(this.#mainMenu);
    this.#createComputerInterface();
  }

  clearText(container) {
    container.textContent = "";
  }

  showModal(title, message) {
    document.querySelector(".modal-title").textContent = title;
    document.querySelector(".modal-message").textContent = message;
    this.#modal.showModal();
  }

  showWinModal(message) {
    const winDialog = document.querySelector(".win-dialog");
    document.querySelector(".winner").textContent = message;
    winDialog.showModal();
  }

  closeModal(container) {
    container.close();
  }

  #removeAllChilds(container) {
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }
  }

  removeClasses(container, classes) {
    container.classList.remove(...classes);
  }

  changeContainerOrientation(flexContainer, ships, orientation) {
    if (orientation === "horizontal") {
      flexContainer.style.flexDirection = "row";
      for (let i = 0; i < ships.length; i++) {
        ships[i].style.flexDirection = "column";
      }
    } else if (orientation === "vertical") {
      flexContainer.style.flexDirection = "column";
      for (let i = 0; i < ships.length; i++) {
        ships[i].style.flexDirection = "row";
      }
    } else {
      throw new Error("Not a valid orientation");
    }
  }

  #createPlayerInterface() {
    const mainSection = document.querySelector(".main-menu");
    const div = document.createElement("div");
    const infoSpan = document.createElement("span");
    const playerTwoUsername = document.createElement("input");
    const nextButton = document.createElement("button");

    playerTwoUsername.classList.add("player2-username");
    mainSection.classList.add("main-section");
    div.classList.add("div");

    mainSection.appendChild(div);
    const nodes = [infoSpan, playerTwoUsername, nextButton];

    for (let i = 0; i < nodes.length; i++) {
      div.appendChild(nodes[i]);
    }

    infoSpan.classList.add("info-span");
    infoSpan.textContent = "Player 2 username";

    nextButton.classList.add("next-button");
    nextButton.textContent = "Next";
  }

  #createComputerInterface() {}

  createPlayerTitle(container, username) {
    container.textContent = username + "'s gameboard";
    container.classList.add("info-span");
  }

  createGameboardGrid(containerToAppend, isPlayerOne) {
    for (let i = 0; i < maxIndex + 1; i++) {
      const playerGameboardRow = document.createElement("div");
      playerGameboardRow.classList.add("row");
      for (let j = 0; j < maxIndex + 1; j++) {
        const playerGameboardCell = document.createElement("div");
        if (isPlayerOne) {
          playerGameboardCell.classList.add("player1-cell");
        } else {
          playerGameboardCell.classList.add("player2-cell");
        }
        playerGameboardRow.appendChild(playerGameboardCell);
      }
      containerToAppend.appendChild(playerGameboardRow);
    }
  }

  createShipsSection() {
    const ships = [
      { name: "carrier", size: 5 },
      { name: "battleship", size: 4 },
      { name: "cruiser", size: 3 },
      { name: "submarine", size: 3 },
      { name: "destroyer", size: 2 },
    ];

    const innerShipsContainer = document.createElement("div");
    innerShipsContainer.classList.add("inner-ships-container");

    for (let i = 0; i < ships.length; i++) {
      const shipDiv = document.createElement("div");
      shipDiv.classList.add("ship");
      shipDiv.id = ships[i].name;
      shipDiv.draggable = "true";
      for (let j = 0; j < ships[i].size; j++) {
        const shipCell = document.createElement("div");
        shipCell.classList.add("ship-cell");
        shipDiv.appendChild(shipCell);
      }
      innerShipsContainer.appendChild(shipDiv);
    }

    return innerShipsContainer;
  }

  createGameboards() {
    this.#removeAllChilds(this.#mainMenu);

    const body = document.querySelector("body");

    const mainSection = document.querySelector(".main-menu");
    mainSection.classList.add("main-section-direction");

    const playerOneGameboardContainer = document.createElement("div");
    const playerOneGameboard = document.createElement("div");
    playerOneGameboard.classList.add("gameboard");

    const shipsContainer = document.createElement("div");
    shipsContainer.classList.add("ships-container");

    const playerTwoGameboardContainer = document.createElement("div");
    const playerTwoGameboard = document.createElement("div");
    playerTwoGameboard.classList.add("gameboard");

    const playButtonGameboardsSection = document.createElement("button");

    const nodes = [
      playerOneGameboardContainer,
      shipsContainer,
      playerTwoGameboardContainer,
    ];

    for (let i = 0; i < nodes.length; i++) {
      mainSection.appendChild(nodes[i]);
    }

    const playerOneGameboardTitle = document.createElement("span");
    this.createPlayerTitle(playerOneGameboardTitle, this.usernameOneInputValue);

    const playerTwoGameboardTitle = document.createElement("span");
    this.createPlayerTitle(playerTwoGameboardTitle, this.usernameTwoInputValue);

    playerOneGameboardContainer.appendChild(playerOneGameboardTitle);
    playerTwoGameboardContainer.appendChild(playerTwoGameboardTitle);

    this.createGameboardGrid(playerOneGameboard, true);

    playerOneGameboardContainer.appendChild(playerOneGameboard);

    const message = document.createElement("div");
    message.textContent =
      "Drag and drop the ships to their respective locations";
    shipsContainer.appendChild(message);

    const innerShipsContainer = this.createShipsSection();

    shipsContainer.appendChild(innerShipsContainer);

    const orientationButton = document.createElement("button");
    orientationButton.classList.add("orientation-button");
    orientationButton.textContent = "horizontal";
    shipsContainer.appendChild(orientationButton);

    this.createGameboardGrid(playerTwoGameboard, false);

    playerTwoGameboardContainer.appendChild(playerTwoGameboard);

    playButtonGameboardsSection.textContent = "Play";
    playButtonGameboardsSection.classList.add("play-button-gameboards");
    body.appendChild(playButtonGameboardsSection);
  }

  createFirstChildLoadScreen() {
    const playerOneOptions = document.createElement("div");
    playerOneOptions.classList.add("player-1-options");

    const span = document.createElement("span");
    span.classList.add("span");
    span.textContent = "Player 1 username";

    const input = document.createElement("input");
    input.classList.add("player1-username");

    const playerOneOptionsChildren = [span, input];
    for (let i = 0; i < playerOneOptionsChildren.length; i++) {
      playerOneOptions.appendChild(playerOneOptionsChildren[i]);
    }

    return playerOneOptions;
  }

  createSecondChildLoadScreen() {
    const playerTwoOptions = document.createElement("div");
    playerTwoOptions.classList.add("player-2-options");

    const playerTwoSpan = document.createElement("span");
    playerTwoSpan.classList.add("span");
    playerTwoSpan.textContent = "Select the type of player";

    const select = document.createElement("select");
    select.classList.add("options");

    const playerOption = document.createElement("option");
    playerOption.textContent = "Player";
    playerOption.value = "Player";

    const computerOption = document.createElement("option");
    computerOption.textContent = "Computer";
    computerOption.value = "Computer";

    const selectChildren = [playerOption, computerOption];
    for (let i = 0; i < selectChildren.length; i++) {
      select.appendChild(selectChildren[i]);
    }

    const playerTwoOptionsChildren = [playerTwoSpan, select];
    for (let i = 0; i < playerTwoOptionsChildren.length; i++) {
      playerTwoOptions.appendChild(playerTwoOptionsChildren[i]);
    }

    return playerTwoOptions;
  }

  createButtonContainerLoadScreen() {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-container");

    const playButton = document.createElement("button");
    playButton.classList.add("play-button");
    playButton.textContent = "Play";

    buttonContainer.appendChild(playButton);

    return buttonContainer;
  }

  loadStartScreen() {
    const sound = new Sound();
    sound.pauseBackgroundMusic();

    const mainContainer = document.querySelector(".main-menu");
    this.#removeAllChilds(mainContainer);
    mainContainer.classList.add("main-container-start-screen");

    const mainContentContainer = document.createElement("div");
    mainContentContainer.classList.add("main-content-container");

    const playerOneOptions = this.createFirstChildLoadScreen();
    mainContentContainer.appendChild(playerOneOptions);

    const playerTwoOptions = this.createSecondChildLoadScreen();
    mainContentContainer.appendChild(playerTwoOptions);

    const buttonContainer = this.createButtonContainerLoadScreen();

    mainContainer.appendChild(mainContentContainer);
    mainContainer.appendChild(buttonContainer);
  }

  isShipContainerInBounds(x, y, length, orientation) {
    if (orientation === "horizontal") {
      for (let i = y; i < y + length; i++) {
        if (y + length > maxIndex + 1) {
          return false;
        }
      }
    } else if (orientation === "vertical") {
      for (let i = x; i < x + length; i++) {
        if (x + length > maxIndex + 1) {
          return false;
        }
      }
    } else {
      throw new Error("Not a valid orientation");
    }
    return true;
  }

  showShipInGameboard(x, y, length, nodeListMatrix, playerBoard, orientation) {
    const shipBackgroundColor = "#e3e2e1";
    if (x > maxIndex || y > maxIndex || x < 0 || y < 0) {
      return;
    } else {
      if (orientation === "horizontal") {
        if (this.isShipContainerInBounds(x, y, length, orientation)) {
          for (let i = y; i < y + length; i++) {
            if (playerBoard[x][i] instanceof Ship) {
              nodeListMatrix[x][i].style.backgroundColor = shipBackgroundColor;
            }
          }
        } else {
          return;
        }
      } else if (orientation === "vertical") {
        if (this.isShipContainerInBounds(x, y, length, orientation)) {
          for (let i = x; i < x + length; i++) {
            if (playerBoard[i][y] instanceof Ship) {
              nodeListMatrix[i][y].style.backgroundColor = shipBackgroundColor;
            }
          }
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  hideShips(nodeListMatrix) {
    const originalBackgroundColor = "#fff";
    for (let i = 0; i < nodeListMatrix.length; i++) {
      for (let j = 0; j < nodeListMatrix[i].length; j++) {
        nodeListMatrix[i][j].style.backgroundColor = originalBackgroundColor;
      }
    }
  }

  removeNode(parent, nodeIndex) {
    parent.removeChild(parent.childNodes[nodeIndex]);
  }

  displayCurrentTurn(playerName) {
    const currentTurnDiv = document.querySelector(".turns");
    currentTurnDiv.textContent = playerName + "'s turn";
  }

  updateCellInNodelist(nodeListMatrix, playerBoard) {
    const shipHitBackgroundColor = "#f7dadb";
    const missBackgroundColor = "#c5e3fc";

    for (let i = 0; i < nodeListMatrix.length; i++) {
      for (let j = 0; j < nodeListMatrix[i].length; j++) {
        if (playerBoard[i][j] instanceof Ship) {
          nodeListMatrix[i][j].style.backgroundColor = shipHitBackgroundColor;
        } else {
          nodeListMatrix[i][j].style.backgroundColor = missBackgroundColor;
        }
      }
    }
  }
}

export { Dom };
