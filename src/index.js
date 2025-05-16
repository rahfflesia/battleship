import "./styles.css";
import { Dom } from "./js/dom";

const dom = new Dom();
document.querySelector(".play-button").addEventListener("click", function () {
  dom.updateInterface();
});

document.querySelector(".close-modal").addEventListener("click", () => {
  dom.closeModal(document.querySelector(".dialog"));
});

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
