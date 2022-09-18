export class TicTacToe {
  HUMAN = {
    string: "circle",
    html: '<i class="far fa-circle"></i>',
  };
  COMPUTER = {
    string: "times",
    html: '<i class="fas fa-times"></i>',
  };
  PIECES = {
    circle: this.HUMAN,
    circle_selected: {
      string: "circle_selected",
      html: this.HUMAN.html,
    },
    times: this.COMPUTER,
    times_selected: {
      string: "times_selected",
      html: this.COMPUTER.html,
    },
    empty: {
      string: "empty",
      html: "",
    },
  };
  #status = "human move";
  #winner = null;
  #board = [
    [
      this.PIECES.empty.string,
      this.PIECES.empty.string,
      this.PIECES.empty.string,
    ],
    [
      this.PIECES.empty.string,
      this.PIECES.empty.string,
      this.PIECES.empty.string,
    ],
    [
      this.PIECES.empty.string,
      this.PIECES.empty.string,
      this.PIECES.empty.string,
    ],
  ];

  /**
   * Get game status
   * @returns {string} status
   */
  getStatus() {
    return this.#status;
  }

  /**
   * Get cell content
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {string} cell value
   */
  getCell(row, col) {
    return this.#board[row][col];
  }

  getWinner() {
    return this.#winner;
  }
  /**
   * Perform a move
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   */
  setMove(row, col) {
    let found_selected = false;
    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind].includes("_selected")) {
          found_selected = true;
          this.#board[row_ind][col_ind] = this.PIECES.empty.string;
          break;
        }
      }
      if (found_selected) {
        break;
      }
    }

    let piece =
      this.#status == "human move" ? this.HUMAN.string : this.COMPUTER.string;

    this.#board[row][col] = piece;

    if (this.#hasWin(piece)) {
      this.#status = "gameover";
      this.#winner = piece;
    } else {
      this.#next();
    }
  }

  /**
   * Perform a selection
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   */
  setSelect(row, col) {
    this.#board[row][col] =
      (this.#status == "human select"
        ? this.HUMAN.string
        : this.COMPUTER.string) + "_selected";
    this.#next();
  }

  /**
   * Update game status
   */
  #next() {
    switch (this.#status) {
      case "human move":
        if (this.#needSelect(this.COMPUTER.string)) {
          this.#status = "computer select";
        } else {
          this.#status = "computer move";
        }
        break;
      case "computer move":
        if (this.#needSelect(this.HUMAN.string)) {
          this.#status = "human select";
        } else {
          this.#status = "human move";
        }
        break;
      case "human select":
        this.#status = "human move";
        break;
      case "computer select":
        this.#status = "computer move";
        break;
    }
  }

  /**
   * Check if is needed to select a piece to move
   * @param {string} piece Piece to check
   * @returns {boolean}
   */
  #needSelect(piece) {
    return (
      this.#board.flat().reduce((r, c) => ((r[c] = (r[c] || 0) + 1), r), {})[
        piece
      ] == 3
    );
  }

  /**
   * Check if there is the player with the providded piece has win
   * @param {string} piece Piece to check
   * @returns {boolean}
   */
  #hasWin(piece) {
    let result = false;
    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == piece) {
          // H (+ 0)
          if (this.#hasWinHorizontal(piece, row_ind, col_ind)) {
            result = true;
          }
          // V (0 +)
          else if (this.#hasWinVertical(piece, row_ind, col_ind)) {
            result = true;
          }
          // D1 (+ +)
          else if (this.#hasWinDiagonal1(piece, row_ind, col_ind)) {
            result = true;
          }
          // D2 (+ -)
          else if (this.#hasWinDiagonal2(piece, row_ind, col_ind)) {
            result = true;
          }
        }
        if (result) {
          break;
        }
      }
      if (result) {
        break;
      }
    }
    return result;
  }

  /**
   * Check if there is the player with the providded piece has win horinzontaly
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #hasWinHorizontal(piece, row, col) {
    if (row + 1 < this.#board.length && this.#board[row + 1][col] == piece) {
      if (row + 2 < this.#board.length && this.#board[row + 2][col] == piece) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if there is the player with the providded piece has win vertically
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #hasWinVertical(piece, row, col) {
    if (
      col + 1 < this.#board[row].length &&
      this.#board[row][col + 1] == piece
    ) {
      if (
        col + 2 < this.#board[row].length &&
        this.#board[row][col + 2] == piece
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if there is the player with the providded piece has win first diagonal
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #hasWinDiagonal1(piece, row, col) {
    if (
      row + 1 < this.#board.length &&
      col + 1 < this.#board[row].length &&
      this.#board[row + 1][col + 1] == piece
    ) {
      if (
        row + 2 < this.#board.length &&
        col + 2 < this.#board[row].length &&
        this.#board[row + 2][col + 2] == piece
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if there is the player with the providded piece has win second diagonal
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #hasWinDiagonal2(piece, row, col) {
    if (
      row + 1 < this.#board.length &&
      col - 1 >= 0 &&
      this.#board[row + 1][col - 1] == piece
    ) {
      if (
        row + 2 < this.#board.length &&
        col - 2 >= 0 &&
        this.#board[row + 2][col - 2] == piece
      ) {
        return true;
      }
    }
    return false;
  }

  computerMove() {
    this.setMove(1, 0);
  }
}
