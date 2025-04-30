import { Gameboard } from "./js/gameboard";
import { Player } from "./js/player";
import { Ship } from "./js/ship";

const board = new Gameboard();
board.createGameBoard();
for (let i = 0; i < 5; i++) {
  const x = prompt("Enter x coordinates: ");
  const y = prompt("Enter y coordinates: ");
  const longitud = prompt("Enter the length of the ship: ");
  const orientation = prompt("Enter the orientation (horizontal/vertical)");
  board.place(x, y, longitud, orientation);
  console.log(board.board);
}
