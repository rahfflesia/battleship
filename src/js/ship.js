class Ship {
  constructor(length, orientation, hits = 0) {
    this.length = length;
    this.orientation = orientation;
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
