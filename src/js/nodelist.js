class NodeList {
  static #max = 10;
  static nodeListToMatrix(nodeList) {
    const nodeListMatrix = [];
    const arr = Array.from(nodeList);
    for (let i = 0; i < NodeList.#max; i++) {
      nodeListMatrix[i] = new Array(NodeList.#max);
      for (let j = 0; j < NodeList.#max; j++) {
        nodeListMatrix[i][j] = arr.shift();
      }
    }
    return nodeListMatrix;
  }

  static getIndexOf(node, nodeListMatrix) {
    for (let i = 0; i < NodeList.#max; i++) {
      for (let j = 0; j < NodeList.#max; j++) {
        if (node === nodeListMatrix[i][j]) {
          return {
            x: i,
            y: j,
          };
        }
      }
    }
    return null;
  }
}

export { NodeList };
