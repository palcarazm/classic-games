import { algoritms } from "../src/algorithms.js";
export class TicTacToe {
  static HUMAN = {
    string: "circle",
    html: '<i class="far fa-circle"></i>',
  };
  static COMPUTER = {
    string: "times",
    html: '<i class="fas fa-times"></i>',
  };
  static PIECES = {
    circle: TicTacToe.HUMAN,
    circle_selected: {
      string: "circle_selected",
      html: TicTacToe.HUMAN.html,
    },
    times: TicTacToe.COMPUTER,
    times_selected: {
      string: "times_selected",
      html: TicTacToe.COMPUTER.html,
    },
    empty: {
      string: "empty",
      html: "",
    },
  };
  static STATUS = {
    HUMAN_SELECT: "human select",
    HUMAN_MOVE: "human move",
    COMPUTER_SELECT: "computer select",
    COMPUTER_MOVE: "computer move",
    GAMEOVER: "gameover",
  };
  static NBOARD = 3;
  #status;
  #winner = null;
  #board;

  /**
   * Create a Tic Tac Toe game
   * @param {array} board Game board
   * @param {string} status Game status
   */
  constructor(board = null, status = null) {
    this.#status = status || TicTacToe.STATUS.HUMAN_MOVE;
    if (board) {
      this.#board = board;
    } else {
      this.#board = [];
      for (let row = 0; row < TicTacToe.NBOARD; row++) {
        this.#board[row] = [];
        for (let col = 0; col < TicTacToe.NBOARD; col++) {
          this.#board[row][col] = TicTacToe.PIECES.empty.string;
        }
      }
    }
  }

  /**
   * Clone the current game
   * @returns Deep copy of Tic Tac Toe game
   */
  clone() {
    let board = []
    for (let row = 0; row < TicTacToe.NBOARD; row++) {
     board.push([...this.#board[row]]);
      
    }
    return new TicTacToe(
      board,
      this.#status
    );
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
          this.#board[row_ind][col_ind] = TicTacToe.PIECES.empty.string;
          break;
        }
      }
      if (found_selected) break;
    }

    let piece =
      this.#status == TicTacToe.STATUS.HUMAN_MOVE
        ? TicTacToe.HUMAN.string
        : TicTacToe.COMPUTER.string;

    this.#board[row][col] = piece;

    if (this.#hasWin(piece)) {
      this.#status = TicTacToe.STATUS.GAMEOVER;
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
      (this.#status == TicTacToe.STATUS.HUMAN_SELECT
        ? TicTacToe.HUMAN.string
        : TicTacToe.COMPUTER.string) + "_selected";
    this.#next();
  }
  
  /**
   * Perform a unselection
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   */
  setUnselect(row, col) {
    this.#board[row][col] =
    (this.#status == TicTacToe.STATUS.HUMAN_MOVE
      ? TicTacToe.HUMAN.string
      : TicTacToe.COMPUTER.string);
    
    this.#status =
    (this.#status == TicTacToe.STATUS.HUMAN_MOVE
      ? TicTacToe.STATUS.HUMAN_SELECT
      : TicTacToe.STATUS.COMPUTER_SELECT);
  }

  /**
   * Update game status
   * @private
   */
  #next() {
    switch (this.#status) {
      case TicTacToe.STATUS.HUMAN_MOVE:
        if (this.#needSelect(TicTacToe.COMPUTER.string)) {
          this.#status = TicTacToe.STATUS.COMPUTER_SELECT;
        } else {
          this.#status = TicTacToe.STATUS.COMPUTER_MOVE;
        }
        break;
      case TicTacToe.STATUS.COMPUTER_MOVE:
        if (this.#needSelect(TicTacToe.HUMAN.string)) {
          this.#status = TicTacToe.STATUS.HUMAN_SELECT;
        } else {
          this.#status = TicTacToe.STATUS.HUMAN_MOVE;
        }
        break;
      case TicTacToe.STATUS.HUMAN_SELECT:
        this.#status = TicTacToe.STATUS.HUMAN_MOVE;
        break;
      case TicTacToe.STATUS.COMPUTER_SELECT:
        this.#status = TicTacToe.STATUS.COMPUTER_MOVE;
        break;
    }
  }

  /**
   * Check if is needed to select a piece to move
   * @param {string} piece Piece to check
   * @returns {boolean}
   * @private
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
   * @private
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
   * @private
   */
  #checkWin(piece, row, col) {
    let result = false;
    if (this.#checkDirection([piece], row, col, 1, 0)) {
      if (this.#checkDirection([piece], row, col, 2, 0)) {
        result = true;
      }
    } else if (this.#checkDirection([piece], row, col, 0, 1)) {
      if (this.#checkDirection([piece], row, col, 0, 2)) {
        result = true;
      }
    } else if (this.#checkDirection([piece], row, col, 1, 1)) {
      if (this.#checkDirection([piece], row, col, 2, 2)) {
        result = true;
      }
    } else if (this.#checkDirection([piece], row, col, 1, -1)) {
      if (this.#checkDirection([piece], row, col, 2, -2)) {
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
   * @private
   */
  #checkThreats(piece, row, col) {
    let pieces = [piece, TicTacToe.PIECES.empty.string];
    let result = false;
    if (this.#checkDirection(pieces, row, col, 1, 0)) {
      if (this.#checkDirection(pieces, row, col, 2, 0)) {
        result = true;
      }
    } else if (this.#checkDirection(pieces, row, col, 0, 1)) {
      if (this.#checkDirection(pieces, row, col, 0, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(pieces, row, col, 1, 1)) {
      if (this.#checkDirection(pieces, row, col, 2, 2)) {
        result = true;
      }
    } else if (this.#checkDirection(pieces, row, col, 1, -1)) {
      if (this.#checkDirection(pieces, row, col, 2, -2)) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Check if there are a piece in this direction and step
   * @param {Array} pieces Pieces to check
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   * @param {int} row_inc Row increment
   * @param {inf} col_inc Column increment
   * @returns {boolean}
   * @private
   */
  #checkDirection(pieces, row, col, row_inc, col_inc) {
    return (
      row + row_inc < this.#board.length &&
      row + row_inc >= 0 &&
      col + col_inc < this.#board[row].length &&
      col + col_inc >= 0 &&
      pieces.includes(this.#board[row + row_inc][col + col_inc])
    );
  }

  /**
   * Get piece positions
   * @param {string} piece Piece to check
   * @returns {Array} cells
   * @private
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
    this.playMove(algoritms.alphaBetaPruning(this, 6));
  }

  /**
   * Get valid moves form current node
   * For algorithm game interface
   * @returns {Array} moves {select, move}
   */
  getChilds() {
    let moves = [];
    let turn =
      this.#status == TicTacToe.STATUS.HUMAN_MOVE ||
      this.#status == TicTacToe.STATUS.HUMAN_SELECT
        ? TicTacToe.HUMAN.string
        : TicTacToe.COMPUTER.string;
    let emptys = this.#getPieces(TicTacToe.PIECES.empty.string);

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
    let value = 0;

    value += this.#hasWin(TicTacToe.COMPUTER.string) * 100;
    value -= this.#hasWin(TicTacToe.HUMAN.string) * 200;

    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == TicTacToe.COMPUTER.string) {
          value +=
            this.#checkThreats(TicTacToe.COMPUTER.string, row_ind, col_ind) *
            10;
        } else if (this.#board[row_ind][col_ind] == TicTacToe.HUMAN.string) {
          value -=
            this.#checkThreats(TicTacToe.HUMAN.string, row_ind, col_ind) * 20;
        }else{
          value +=
            this.#checkWin(TicTacToe.COMPUTER.string, row_ind, col_ind) *
            10;
          value -=
            this.#checkWin(TicTacToe.HUMAN.string, row_ind, col_ind) * 20;
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

  /**
   * Cheks is game has finished
   * @returns {boolean}
   */
  hasFinished() {
    return this.#status == TicTacToe.STATUS.GAMEOVER;
  }
}
