export class algoritms {
  /**
   * Alpha Beta Pruning algoritm
   * @see https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
   * @param {Object} game Game interface
   * @param {int} depth Remaining depth
   * @param {int} alpha
   * @param {int} beta
   * @param {boolean} isMax Maximazing value
   * @returns {int} Heuristic value of the branch
   */
  #alphaBetaPruning(game, depth, alpha, beta, isMax) {
    let childs = game.getChilds();
    if (depth == 0 || childs.lenght == 0) {
      return game.getHeuristic(isMax);
    }

    let value = Math.pow(10, 1000);
    if (isMax) {
      value = -1 * value;
      for (const child of childs) {
        let childGame = game.clone();
        childGame.playMove(child);
        value = Math.max(
          value,
          this.#alphaBetaPruning(childGame, depth - 1, alpha, beta, false)
        );
        if (value >= beta) break;
        alpha = Math.max(alpha, value);
      }
      return value;
    } else {
      value = +1 * value;
      for (const child of childs) {
        let childGame = game.clone();
        childGame.playMove(child);
        value = Math.min(
          value,
          this.#alphaBetaPruning(childGame, depth - 1, alpha, beta, true)
        );
        if (value <= alpha) break;
        beta = Math.min(beta, value);
      }
      return value;
    }
  }

  /**
   * Alpha Beta Pruning algoritm initialization
   * @see https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning
   * @param {Object} game Game interface
   * @param {int} depth Branch depth (default: 10)
   * @returns {Object} node to play
   */
  alphaBetaPruning(game, depth = 10) {
    let value = -1 * Math.pow(10, 1000);
    let alpha = value;
    let beta = -1 * value;
    let childs = game.getChilds();
    let result;
    for (const child of childs) {
      let childGame = game.clone();
      childGame.playMove(child);
      let chidlvalue = this.#alphaBetaPruning(
        childGame,
        depth - 1,
        alpha,
        beta,
        false
      );
      if (value < chidlvalue) {
        value = chidlvalue;
        result = { ...child };
      }
      if (value >= beta) break;
      alpha = Math.max(alpha, value);
    }
    return result;
  }
}
