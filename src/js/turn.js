class Turn {
  static checkTurn(currentTurn, playerOne, playerTwo) {
    return currentTurn === playerOne
      ? (currentTurn = playerTwo)
      : (currentTurn = playerOne);
  }
}

export { Turn };
