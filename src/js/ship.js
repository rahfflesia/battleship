class Ship {
  constructor(length, hits = 0) {
    this.length = length;
    this.hits = hits;
  }

  hit() {
    if (this.hits < this.length) {
      this.hits++;
    }
    return null;
  }

  isSunk() {
    return this.length === this.hits;
  }
}

export { Ship };
