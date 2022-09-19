import { algoritms } from "../src/algorithms.js";
export class TicTacToe {
  #ALGORITM = new algoritms();
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
  #status
  #winner = null;
  #board;

  /**
   * Create a Tic Tac Toe game
   * @param {array} board Game board
   * @param {string} status Game status
   */
  constructor(board = null, status = null){
    this.#board = board || [
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
    this.#status = status || "human move";
  }

  /**
   * Clone the current game
   * @returns Deep copy of Tic Tac Toe game
   */
  clone(){
    return new TicTacToe([[...this.#board[0]],[...this.#board[1]],[...this.#board[2]]], this.#status);
  }

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
      if (found_selected) break;
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
    let result;
    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == piece) {
          result = this.#checkWin(piece, row_ind, col_ind);
        }
        if (result) break;
      }
      if (result) break;
    }
    return result;
  }

  /**
   * Check if there is the player with the providded piece has win
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #checkWin(piece, row, col) {
    let result = false;
    if (this.#checkDirection(piece, row, col, 1, 0)) {
      if (this.#checkDirection(piece, row, col, 2, 0)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 0, 1)) {
      if (this.#checkDirection(piece, row, col, 0, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 1, 1)) {
      if (this.#checkDirection(piece, row, col, 2, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 1, -1)) {
      if (this.#checkDirection(piece, row, col, 2, -2)) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Check if there is the player with the providded piece has a threat
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @returns {boolean}
   */
  #checkThreats(piece, row, col) {
    let result = false;
    if (this.#checkDirection(piece, row, col, 1, 0)) {
      if (this.#checkDirection(this.PIECES.empty.string, row, col, 2, 0)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 0, 1)) {
      if (this.#checkDirection(this.PIECES.empty.string, row, col, 0, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 1, 1)) {
      if (this.#checkDirection(this.PIECES.empty.string, row, col, 2, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(piece, row, col, 1, -1)) {
      if (this.#checkDirection(this.PIECES.empty.string, row, col, 2, -2)) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Check if there are a piece in this direction and step
   * @param {string} piece Piece to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @param {int} row_inc Row increment
   * @param {inf} col_inc Column increment
   * @returns {boolean}
   */
  #checkDirection(piece, row, col, row_inc, col_inc) {
    return (
      row + row_inc < this.#board.length &&
      row + row_inc >= 0 &&
      col + col_inc < this.#board[row].length &&
      col + col_inc >= 0 &&
      this.#board[row + row_inc][col + col_inc] == piece
    );
  }

  /**
   * Get piece positions
   * @param {string} piece Piece to check
   * @returns {Array} cells
   */
  #getPieces(piece) {
    let positions = [];
    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == piece) {
          positions.push({ row: row_ind, col: col_ind, value: piece });
        }
      }
    }
    return positions;
  }

  computerMove() {
    this.playMove(this.#ALGORITM.alphaBetaPruning(this,5));
  }

  /**
   * Get valid moves form current node
   * For algorithm game interface
   * @returns {Array} moves {select, move}
   */
  getChilds() {
    let moves = [];
    let turn =
      this.#status == "human move" ? this.HUMAN.string : this.COMPUTER.string;
    let emptys = this.#getPieces(this.PIECES.empty.string);

    if (this.#needSelect(turn)) {
      let pieces = this.#getPieces(turn);
      pieces.forEach((piece) => {
        emptys.forEach((empty) => {
          moves.push({ select: piece, move: empty });
        });
      });
    } else {
      emptys.forEach((empty) => {
        moves.push({ select: null, move: empty });
      });
    }

    return moves;
  }

  /**
   * Get the heuristic value of the node
   * @param {Boolean} _isMax Node to maximize or minimize
   * @returns {int} Heuristic value of the node
   */
  getHeuristic(_isMax) {
    let value =0;

    value += this.#hasWin(this.COMPUTER.string) * 100;
    value -= this.#hasWin(this.HUMAN.string) * 100;

    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == this.COMPUTER.string) {
          value +=
            this.#checkThreats(this.COMPUTER.string, row_ind, col_ind) * 2;
        } else if (this.#board[row_ind][col_ind] == this.HUMAN.string) {
          value -= this.#checkThreats(this.HUMAN.string, row_ind, col_ind) * 2;
        }
      }
    }

    return value;
  }

  /**
   * Perform a valid move
   * @param {Object} move
   */
  playMove(move) {
    if (move.select != null) {
      this.setSelect(move.select.row, move.select.col);
    }
    this.setMove(move.move.row, move.move.col);
  }
}
