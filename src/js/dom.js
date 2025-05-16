class Dom {
  #modal = document.querySelector(".dialog");
  #mainMenu = document.querySelector(".main-menu");
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

  closeModal(container) {
    container.close();
  }

  #removeAllChilds(container) {
    while (container.firstChild) {
      container.removeChild(container.lastChild);
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
    mainSection.style.padding = "1.5rem";
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

    const mainSection = document.querySelector(".main-menu");
    mainSection.style.flexDirection = "row";
    mainSection.style.gap = "1rem";

    const playerOneGameboard = document.createElement("div");
    const shipsContainer = document.createElement("div");
    const playerTwoGameboard = document.createElement("div");

    playerOneGameboard.style.width = widthHeight;
    playerOneGameboard.style.height = widthHeight;

    shipsContainer.style.display = "flex";
    shipsContainer.style.flexDirection = "column";
    shipsContainer.style.justifyContent = "center";
    shipsContainer.style.alignItems = "center";
    shipsContainer.style.gap = ".5rem";

    playerTwoGameboard.style.width = widthHeight;
    playerTwoGameboard.style.height = widthHeight;

    const nodes = [playerOneGameboard, shipsContainer, playerTwoGameboard];
    for (let i = 0; i < nodes.length; i++) {
      mainSection.appendChild(nodes[i]);
    }

    const widthHeightCell = "40px";

    for (let i = 0; i < max; i++) {
      const playerOneGameboardRow = document.createElement("div");
      playerOneGameboardRow.style.display = "flex";
      for (let j = 0; j < max; j++) {
        const playerOneGameboardCell = document.createElement("div");
        playerOneGameboardCell.style.width = widthHeightCell;
        playerOneGameboardCell.style.height = widthHeightCell;
        playerOneGameboardCell.style.border = "1px solid lightgray";
        playerOneGameboardRow.appendChild(playerOneGameboardCell);
      }
      playerOneGameboard.appendChild(playerOneGameboardRow);
    }

    const message = document.createElement("div");
    message.textContent =
      "Drag and drop the ships to their respective locations";
    shipsContainer.appendChild(message);

    const ships = [
      { name: "Carrier", size: 5 },
      { name: "Battleship", size: 4 },
      { name: "Cruiser", size: 3 },
      { name: "Submarine", size: 3 },
      { name: "Destroyer", size: 2 },
    ];

    for (let i = 0; i < ships.length; i++) {
      const shipDiv = document.createElement("div");
      shipDiv.style.display = "flex";
      for (let j = 0; j < ships[i].size; j++) {
        const shipCell = document.createElement("div");
        shipCell.style.width = widthHeightCell;
        shipCell.style.height = widthHeightCell;
        shipCell.style.border = "1px solid lightgray";
        shipDiv.appendChild(shipCell);
      }
      shipsContainer.appendChild(shipDiv);
    }

    for (let i = 0; i < max; i++) {
      const playerTwoGameboardRow = document.createElement("div");
      playerTwoGameboardRow.style.display = "flex";
      for (let j = 0; j < max; j++) {
        const playerTwoGameboardCell = document.createElement("div");
        playerTwoGameboardCell.style.width = widthHeightCell;
        playerTwoGameboardCell.style.height = widthHeightCell;
        playerTwoGameboardCell.style.border = "1px solid lightgray";
        playerTwoGameboardRow.appendChild(playerTwoGameboardCell);
      }
      playerTwoGameboard.appendChild(playerTwoGameboardRow);
    }
  }
}

export { Dom };
