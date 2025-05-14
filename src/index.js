import "./styles.css";
import { Dom } from "./js/dom";

const dom = new Dom();
document.querySelector(".play-button").addEventListener("click", function () {
  dom.updateInterface();
});

document.querySelector(".close-modal").addEventListener("click", () => {
  dom.closeModal(document.querySelector(".dialog"));
});
