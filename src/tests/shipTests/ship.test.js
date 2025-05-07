const Ship = require("../../js/ship.js");

// Ship public interface tests
function hitLengthTimes(times, shipObject) {
  for (let i = 0; i < times; i++) {
    shipObject.hit();
  }
}

describe("First ship class test", () => {
  const firstShip = new Ship(3);

  hitLengthTimes(firstShip.length, firstShip);

  test("Hit method test", () => {
    expect(firstShip.hits).toBe(3);
  });

  test("isSunk test", () => {
    expect(firstShip.isSunk()).toBeTruthy();
  });
});

describe("Second ship class test", () => {
  const secondShip = new Ship(4);

  hitLengthTimes(secondShip.length - 1, secondShip);

  test("Hit method test", function () {
    expect(secondShip.hits).toBe(3);
  });

  test("isSunk test", () => {
    expect(secondShip.isSunk()).toBeFalsy();
  });
});

describe("Third ship class test", () => {
  const thirdShip = new Ship(5);

  hitLengthTimes(thirdShip.length, thirdShip);

  test("Hit method test", () => {
    expect(thirdShip.hits).toBe(5);
  });

  test("isSunk test", () => {
    expect(thirdShip.isSunk()).toBeTruthy();
  });
});

describe("Fourt ship", () => {
  const fourthShip = new Ship(1);

  fourthShip.hit();
  test("Hit method test", () => {
    expect(fourthShip.hits).toBe(1);
  });

  fourthShip.hit();
  test("Hit method test", () => {
    expect(fourthShip.hit()).toBeNull();
  });
});
