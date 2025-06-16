import { Ship } from "./ship";

const maxIndex = 9;

class Dom {
  #modal = document.querySelector(".dialog");
  #mainMenu = document.querySelector(".main-menu");
  usernameOneInputValue = "";
  usernameTwoInputValue = "";
  // Too much repetition, might refactor later
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

    mainSection.style.border = "1px solid lightgray";
    mainSection.style.padding = "1rem";
    mainSection.style.borderRadius = ".25rem";

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = ".25rem";

    mainSection.appendChild(div);
    const nodes = [infoSpan, playerTwoUsername, nextButton];

    for (let i = 0; i < nodes.length; i++) {
      div.appendChild(nodes[i]);
    }

    infoSpan.textContent = "Player 2 username";
    infoSpan.style.fontWeight = "bold";
    infoSpan.style.fontSize = "1.5rem";

    nextButton.classList.add("next-button");
    nextButton.textContent = "Next";
  }

  #createComputerInterface() {}

  createGameboards() {
    const max = 10;
    const widthHeight = "400px";
    this.#removeAllChilds(this.#mainMenu);

    const body = document.querySelector("body");

    const mainSection = document.querySelector(".main-menu");
    mainSection.style.flexDirection = "row";
    mainSection.style.gap = "2rem";

    const playerOneGameboardContainer = document.createElement("div");
    const playerOneGameboard = document.createElement("div");
    playerOneGameboard.classList.add("gameboard");

    const shipsContainer = document.createElement("div");

    const playerTwoGameboardContainer = document.createElement("div");
    const playerTwoGameboard = document.createElement("div");
    playerTwoGameboard.classList.add("gameboard");

    const playButtonGameboardsSection = document.createElement("button");

    playerOneGameboard.style.width = widthHeight;

    shipsContainer.style.display = "flex";
    shipsContainer.style.flexDirection = "column";
    shipsContainer.style.justifyContent = "center";
    shipsContainer.style.alignItems = "center";
    shipsContainer.style.gap = ".5rem";

    playerTwoGameboard.style.width = widthHeight;

    const nodes = [
      playerOneGameboardContainer,
      shipsContainer,
      playerTwoGameboardContainer,
    ];

    for (let i = 0; i < nodes.length; i++) {
      mainSection.appendChild(nodes[i]);
    }

    const playerOneGameboardTitle = document.createElement("span");
    playerOneGameboardTitle.textContent =
      this.usernameOneInputValue + "'s gameboard";
    playerOneGameboardTitle.style.fontWeight = "bold";
    playerOneGameboardTitle.style.fontSize = "1.5rem";

    const playerTwoGameboardTitle = document.createElement("span");
    playerTwoGameboardTitle.textContent =
      this.usernameTwoInputValue + "'s gameboard";
    playerTwoGameboardTitle.style.fontWeight = "bold";
    playerTwoGameboardTitle.style.fontSize = "1.5rem";

    playerOneGameboardContainer.appendChild(playerOneGameboardTitle);
    playerTwoGameboardContainer.appendChild(playerTwoGameboardTitle);

    const widthHeightCell = "40px";

    for (let i = 0; i < max; i++) {
      const playerOneGameboardRow = document.createElement("div");
      playerOneGameboardRow.classList.add("row");
      playerOneGameboardRow.style.display = "flex";
      playerOneGameboardRow.style.gap = ".25rem";
      playerOneGameboardRow.style.marginBottom = ".25rem";
      for (let j = 0; j < max; j++) {
        const playerOneGameboardCell = document.createElement("div");
        playerOneGameboardCell.classList.add("player1-cell");
        playerOneGameboardCell.style.width = widthHeightCell;
        playerOneGameboardCell.style.height = widthHeightCell;
        playerOneGameboardCell.style.border = "1px solid lightgray";
        playerOneGameboardCell.style.borderRadius = ".25rem";
        playerOneGameboardRow.appendChild(playerOneGameboardCell);
      }
      playerOneGameboard.appendChild(playerOneGameboardRow);
    }

    playerOneGameboardContainer.appendChild(playerOneGameboard);

    const message = document.createElement("div");
    message.textContent =
      "Drag and drop the ships to their respective locations";
    shipsContainer.appendChild(message);

    const ships = [
      { name: "carrier", size: 5 },
      { name: "battleship", size: 4 },
      { name: "cruiser", size: 3 },
      { name: "submarine", size: 3 },
      { name: "destroyer", size: 2 },
    ];

    const innerShipsContainer = document.createElement("div");
    innerShipsContainer.classList.add("inner-ships-container");
    innerShipsContainer.style.display = "flex";
    innerShipsContainer.style.flexDirection = "column";
    innerShipsContainer.style.alignItems = "center";
    innerShipsContainer.style.gap = ".25rem";

    for (let i = 0; i < ships.length; i++) {
      const shipDiv = document.createElement("div");
      shipDiv.classList.add("ship");
      shipDiv.id = ships[i].name;
      shipDiv.draggable = "true";
      shipDiv.style.display = "flex";
      shipDiv.style.gap = ".25rem";
      for (let j = 0; j < ships[i].size; j++) {
        const shipCell = document.createElement("div");
        shipCell.classList.add("ship-cell");
        shipCell.style.width = widthHeightCell;
        shipCell.style.height = widthHeightCell;
        shipCell.style.border = "1px solid lightgray";
        shipCell.style.borderRadius = ".25rem";
        shipCell.style.backgroundColor = "#e3e2e1";
        shipDiv.appendChild(shipCell);
      }
      innerShipsContainer.appendChild(shipDiv);
    }

    shipsContainer.appendChild(innerShipsContainer);

    const orientationButton = document.createElement("button");
    orientationButton.classList.add("orientation-button");
    orientationButton.textContent = "horizontal";
    shipsContainer.appendChild(orientationButton);

    for (let i = 0; i < max; i++) {
      const playerTwoGameboardRow = document.createElement("div");
      playerTwoGameboardRow.classList.add("row");
      playerTwoGameboardRow.style.display = "flex";
      playerTwoGameboardRow.style.gap = ".25rem";
      playerTwoGameboardRow.style.marginBottom = ".25rem";
      for (let j = 0; j < max; j++) {
        const playerTwoGameboardCell = document.createElement("div");
        playerTwoGameboardCell.classList.add("player2-cell");
        playerTwoGameboardCell.style.width = widthHeightCell;
        playerTwoGameboardCell.style.height = widthHeightCell;
        playerTwoGameboardCell.style.border = "1px solid lightgray";
        playerTwoGameboardCell.style.borderRadius = ".25rem";
        playerTwoGameboardRow.appendChild(playerTwoGameboardCell);
      }
      playerTwoGameboard.appendChild(playerTwoGameboardRow);
    }

    playerTwoGameboardContainer.appendChild(playerTwoGameboard);

    playButtonGameboardsSection.textContent = "Play";
    playButtonGameboardsSection.classList.add("play-button-gameboards");
    body.appendChild(playButtonGameboardsSection);
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
