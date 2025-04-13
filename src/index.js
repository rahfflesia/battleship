import { Gameboard } from "./js/gameboard";
import { Player } from "./js/player";
import { Ship } from "./js/ship";

const board = new Gameboard();
board.createGameBoard();
board.place(0, 0, 3);
board.board[0][0].hit();
board.board[0][0].hit();
board.board[0][0].hit();
console.log(board.board);
console.log(board.areAllShipsSunk());
