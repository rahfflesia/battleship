const Gameboard = require("../../js/gameboard.js");
import Ship from "../../js/ship.js";

// Gameboard public interface tests
describe("First gameboard test", () => {
  const firstGameboard = new Gameboard();
  firstGameboard.createGameboard();
  firstGameboard.place(0, 0, 3);

  const placedShip = firstGameboard.board[0][0];

  test("First place method test", () => {
    expect(placedShip instanceof Ship).toBeTruthy();
  });

  test("First receive attack method test", () => {
    expect(firstGameboard.receiveAttack(0, 0)).toBeTruthy();
  });

  test("Checking second slot of the ship on the board", () => {
    expect(firstGameboard.receiveAttack(0, 1)).toBeTruthy();
  });

  test("Checking third slot of the ship on the board", () => {
    expect(firstGameboard.receiveAttack(0, 2)).toBeTruthy();
  });

  test("Checking empty slot", () => {
    expect(firstGameboard.receiveAttack(0, 3)).toBeFalsy();
  });

  test("Sunk test", () => {
    expect(firstGameboard.areAllShipsSunk()).toBe(true);
  });
});

describe("", () => {
  const secondGameboard = new Gameboard();
  secondGameboard.createGameboard();
  secondGameboard.place(0, 0, 3, "horizontal");

  test("Attack out of bounds x axis", () => {
    expect(() => {
      secondGameboard.receiveAttack(-1, 0);
    }).toThrow(Error);
  });

  test("Attack out of bounds y axis", () => {
    expect(() => {
      secondGameboard.receiveAttack(0, 73);
    }).toThrow(Error);
  });

  test("Place in an ocuppied slot", () => {
    expect(() => {
      secondGameboard.place(0, 0, 5, "vertical");
    }).toThrow(Error);
  });

  test("Placing out of bounds x axis", () => {
    expect(() => {
      secondGameboard.place(-1, 0, 3, "horizontal");
    }).toThrow(Error);
  });

  test("Placing out of bounds y axis", () => {
    expect(() => {
      secondGameboard.place(0, 79, 2, "vertical");
    }).toThrow(Error);
  });

  test("Ship that exceeds maximum length", () => {
    expect(() => {
      secondGameboard.place(3, 3, 10, "horizontal");
    }).toThrow(Error);
  });

  test("Invalid orientation", () => {
    expect(() => {
      secondGameboard.place(3, 3, 10, "diagonal");
    }).toThrow(Error);
  });

  test("Are all ships sunk test", () => {
    expect(secondGameboard.areAllShipsSunk()).toBe(false);
  });
});
