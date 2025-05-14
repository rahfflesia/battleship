class Dom {
  #modal = document.querySelector(".dialog");
  #mainMenu = document.querySelector(".main-menu");
  updateInterface() {
    const playerOneUsername = document.querySelector(".player1-username");
    const select = document.querySelector(".options");

    if (this.#isInputEmpty(playerOneUsername)) {
      this.#showModal("Error", "All inputs must be filled");
    } else if (
      !this.#isInputEmpty(playerOneUsername) &&
      select.value === "Player"
    ) {
      this.#loadPlayerInterface();
    } else if (
      !this.#isInputEmpty(playerOneUsername) &&
      select.value === "Computer"
    ) {
      this.#loadComputerInterface();
    } else {
      throw new Error("An error has ocurred");
    }
  }

  #isInputEmpty(input) {
    return input.value.length < 1;
  }

  #loadPlayerInterface() {
    this.#removeAllChilds(this.#mainMenu);
  }

  #loadComputerInterface() {
    this.#removeAllChilds(this.#mainMenu);
  }

  #showModal(title, message) {
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
}

export { Dom };
