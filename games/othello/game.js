import { algoritms } from "../src/algorithms.js";
export class Othello {
  static HUMAN = {
    string: "light",
    html: '<i class="far fa-circle"></i>',
  };
  static COMPUTER = {
    string: "dark",
    html: '<i class="fas fa-circle"></i>',
  };
  static PIECES = {
    light: Othello.HUMAN,
    light_candidate: {
      string: "light_candidate",
      html: Othello.HUMAN.html,
    },
    dark: Othello.COMPUTER,
    dark_candidate: {
      string: "dark_candidate",
      html: Othello.COMPUTER.html,
    },
    empty: {
      string: "empty",
      html: "",
    },
  };
  static STATUS = {
    HUMAN_MOVE: "human move",
    COMPUTER_MOVE: "computer move",
    GAMEOVER: "gameover",
  };
  static NBOARD = 8; 
  #status;
  #winner = null;
  #board;
  #lastMove = null;

  /**
   * Create a Tic Tac Toe game
   * @param {array} board Game board
   * @param {string} status Game status
   */
  constructor(board = null, status = null) {
    this.#status = status || Othello.STATUS.HUMAN_MOVE;
    if (board) {
      this.#board = board;
    } else {
      this.#board = [];
      for (let row = 0; row < Othello.NBOARD; row++) {
        this.#board[row] = [];
        for (let col = 0; col < Othello.NBOARD; col++) {
          this.#board[row][col] = Othello.PIECES.empty.string;
        }
      }
      this.#board[3][3] = Othello.HUMAN.string;
      this.#board[4][4] = Othello.HUMAN.string;
      this.#board[3][4] = Othello.COMPUTER.string;
      this.#board[4][3] = Othello.COMPUTER.string;
    }
  }

  /**
   * Clone the current game
   * @returns Deep copy of game
   */
  clone() {
    let board = []
    for (let row = 0; row < Othello.NBOARD; row++) {
     board.push([...this.#board[row]]);
      
    }
    return new Othello(
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

  /**
   * Get the winner
   * @returns {string | null}
   */
  getWinner() {
    return this.#winner;
  }

  /**
   * Get the lastmove
   * @returns {Object | null}
   */
  getLastMove() {
    return this.#lastMove;
  }

  /**
   * Perform a move
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   */
  setMove(row, col) {
    this.#lastMove={row: row, col: col};
    let piece =
      this.#status == Othello.STATUS.HUMAN_MOVE
        ? Othello.HUMAN.string
        : Othello.COMPUTER.string;

    this.#board[row][col] = piece;

    [-1, 0, 1].forEach((row_dir) => {
      [-1, 0, 1].forEach((col_dir) => {
        this.#reversi(piece, row, col, row_dir, col_dir);
      });
    });

    if (this.#hasWin(piece)) {
      this.#status = Othello.STATUS.GAMEOVER;
      let pieces = this.countPieces();
      this.#winner =
        pieces[Othello.COMPUTER.string] > pieces[Othello.HUMAN.string]
          ? Othello.COMPUTER.string
          : Othello.HUMAN.string;
    } else {
      this.#next();
    }
  }

  /**
   * Update game status
   * @private
   */
  #next() {
    switch (this.#status) {
      case Othello.STATUS.HUMAN_MOVE:
        this.#status = Othello.STATUS.COMPUTER_MOVE;
        break;
      case Othello.STATUS.COMPUTER_MOVE:
        this.#status = Othello.STATUS.HUMAN_MOVE;
        break;
    }
  }

  /**
   * Check if there is the player with the providded piece has win
   * @param {string} piece Piece to check
   * @returns {boolean}
   * @private
   */
  #hasWin(piece) {
    this.#status =
      piece == Othello.HUMAN.string
        ? Othello.STATUS.COMPUTER_MOVE
        : Othello.STATUS.HUMAN_MOVE;
    let childs = this.getChilds();
    this.#status =
      piece == Othello.HUMAN.string
        ? Othello.STATUS.HUMAN_MOVE
        : Othello.STATUS.COMPUTER_MOVE;
    return childs.length === 0;
  }

  /**
   * Check if there are a piece in this direction and step
   * @param {Array} pieces Pieces to check
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
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
   * Check if cell is candidate
   * @param {Array} piece Piece to check
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @param {int} row_dir Row direction
   * @param {inf} col_dir Column direction
   * @returns {Object | null}
   * @private
   */
  #checkCandidate(piece, row, col, row_dir, col_dir) {
    let adv_piece =
      piece == Othello.HUMAN.string
        ? Othello.COMPUTER.string
        : Othello.HUMAN.string;
    for (let inc = 1; inc < 8; inc++) {
      if (
        this.#checkDirection(
          [adv_piece],
          row,
          col,
          inc * row_dir,
          inc * col_dir
        )
      ) {
        continue;
      } else {
        if (inc == 1) {
          return null;
        } else if (
          this.#checkDirection(
            [Othello.PIECES.empty.string],
            row,
            col,
            inc * row_dir,
            inc * col_dir
          )
        ) {
          return { row: row + inc * row_dir, col: col + inc * col_dir };
        } else {
          return null;
        }
      }
    }
  }

  /**
   * Get candidates positions
   * @returns {Array} Candidates
   */
  getCandidates() {
    let result =[];
    let value =
      this.#status == Othello.STATUS.HUMAN_MOVE
        ? Othello.HUMAN.string + "_candidate"
        : Othello.COMPUTER.string + "_candidate";
    this.getChilds().forEach((candidate) => {
      result.push({row: candidate.row, col:candidate.col, value: value})
    });
    return result;
  }

  /**
   * Check and reverse piece in the provided direction
   * @param {Array} piece Piece to check
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @param {int} row_dir Row direction
   * @param {inf} col_dir Column direction
   * @returns
   * @private
   */
  #reversi(piece, row, col, row_dir, col_dir) {
    let adv_piece =
      piece == Othello.HUMAN.string
        ? Othello.COMPUTER.string
        : Othello.HUMAN.string;
    for (let inc = 1; inc < 8; inc++) {
      if (
        this.#checkDirection(
          [adv_piece],
          row,
          col,
          inc * row_dir,
          inc * col_dir
        )
      ) {
        continue;
      } else {
        if (
          inc != 1 &&
          this.#checkDirection([piece], row, col, inc * row_dir, inc * col_dir)
        ) {
          for (let ind = 0; ind < inc; ind++) {
            this.#board[row + ind * row_dir][col + ind * col_dir] = piece;
          }
        }
        return;
      }
    }
  }

  /**
   * Count the number of pieces
   * @returns {Array} Number of pieces
   */
  countPieces() {
    return this.#board.flat().reduce((r, c) => ((r[c] = (r[c] || 0) + 1), r), {});
  }

  /**
   * Perform a computer move
   */
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
      this.#status == Othello.STATUS.HUMAN_MOVE
        ? Othello.HUMAN.string
        : Othello.COMPUTER.string;
    for (let row_ind = 0; row_ind < this.#board.length; row_ind++) {
      for (let col_ind = 0; col_ind < this.#board[row_ind].length; col_ind++) {
        if (this.#board[row_ind][col_ind] == turn) {
          [-1, 0, 1].forEach((row_dir) => {
            [-1, 0, 1].forEach((col_dir) => {
              let candidate = this.#checkCandidate(
                turn,
                row_ind,
                col_ind,
                row_dir,
                col_dir
              );
              if (candidate != null) {
                moves.push(candidate);
              }
            });
          });
        }
      }
    }
    return moves;
  }

  /**
   * Get the heuristic value of the node
   * @param {Boolean} _isMax Node to maximize or minimize
   * @returns {int} Heuristic value of the node
   */
  getHeuristic(_isMax) {
    let pieces = this.countPieces();
    return pieces[Othello.COMPUTER.string] - pieces[Othello.HUMAN.string];
  }

  /**
   * Perform a valid move
   * @param {Object} move
   */
  playMove(move) {
    this.setMove(move.row, move.col);
  }

  /**
   * Cheks is game has finished
   * @returns {boolean}
   */
  hasFinished() {
    return this.#status == Othello.STATUS.GAMEOVER;
  }
}
