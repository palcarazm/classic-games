import { algoritms } from "../src/algorithms.js";
export class SOS {
  static PIECES = {
    S: {
      string: "S",
      html: '<i class="fa-solid fa-s"></i>',
    },
    O: {
      string: "O",
      html: '<i class="fa-solid fa-o"></i>',
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
  #human;
  #computer;
  #lastMove = null;
  #status;
  #winner = null;
  #board;

  /**
   * Create a Tic Tac Toe game
   * @param {array} board Game board
   * @param {string} status Game status
   * @param {Object} human Human score
   * @param {Object} computer Computter score
   */
  constructor(board = null, status = null, human = null, computer = null) {
    this.#status = status || SOS.STATUS.HUMAN_MOVE;
    this.#human = human || { score: 0, sos: [] };
    this.#computer = computer || { score: 0, sos: [] };
    if (board) {
      this.#board = board;
    } else {
      this.#board = [];
      for (let row = 0; row < SOS.NBOARD; row++) {
        this.#board[row] = [];
        for (let col = 0; col < SOS.NBOARD; col++) {
          this.#board[row][col] = SOS.PIECES.empty.string;
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
    for (let row = 0; row < SOS.NBOARD; row++) {
     board.push([...this.#board[row]]);
      
    }
    return new SOS(
      board,
      this.#status,
      JSON.parse(JSON.stringify(this.#human)),
      JSON.parse(JSON.stringify(this.#computer))
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
   * @returns {string} Winner
   */
  getWinner() {
    return this.#winner;
  }

  /**
   * Get Player human
   * @returns {string} Player human
   */
  getHuman() {
    return this.#human;
  }

  /**
   * Get Player computer
   * @returns {Object} Player computer
   */
  getComputer() {
    return this.#computer;
  }

  /**
   * Get last move
   * @returns {Object} last move
   */
  getLastMove() {
    return this.#lastMove;
  }

  /**
   * Perform a move
   * @param {string} piece Piece to move
   * @param {int} row Row number [0 to 2]
   * @param {int} col Column number [0 to 2]
   */
  setMove(piece, row, col) {
    let score = null;
    this.#board[row][col] = SOS.PIECES[piece].string;
    this.#lastMove = { row: row, col: col };

    if (this.#status == SOS.STATUS.HUMAN_MOVE) {
      score = this.#getScore(row, col);
      this.#human.score += score;
    } else {
      score = this.#getScore(row, col);
      this.#computer.score += score;
    }

    if (this.#hasEnd()) {
      this.#winner =
        this.#status == SOS.STATUS.HUMAN_MOVE ? "human" : "computer";
      this.#status = SOS.STATUS.GAMEOVER;
    } else if (score == 0) {
      this.#next();
    }
  }

  /**
   * Update game status
   * @private
   */
  #next() {
    switch (this.#status) {
      case SOS.STATUS.HUMAN_MOVE:
        this.#status = SOS.STATUS.COMPUTER_MOVE;
        break;
      case SOS.STATUS.COMPUTER_MOVE:
        this.#status = SOS.STATUS.HUMAN_MOVE;
        break;
    }
  }

  /**
   * Count the number of pieces
   * @returns {Array} Number of pieces
   */
  countPieces() {
    return this.#board
      .flat()
      .reduce((r, c) => ((r[c] = (r[c] || 0) + 1), r), {});
  }

  /**
   * Check if the game has end
   * @returns {boolean}
   * @private
   */
  #hasEnd() {
    return this.countPieces()[SOS.PIECES.empty.string] == undefined;
  }

  /**
   * Get the number scored with the provided position
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @returns {int}
   * @private
   */
  #getScore(row, col) {
    if (this.#board[row][col] == SOS.PIECES.S.string) {
      return this.#getScoreS(row, col);
    } else {
      return this.#getScoreO(row, col);
    }
  }

  /**
   * Get the number scored with the provided position with an O
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @returns {int}
   * @private
   */
  #getScoreO(row, col) {
    let player =
      this.#status == SOS.STATUS.HUMAN_MOVE ? this.#human : this.#computer;

    let result = 0;
    if (this.#checkDirection([SOS.PIECES.S.string], row, col, 1, 0)) {
      if (this.#checkDirection([SOS.PIECES.S.string], row, col, -1, 0)) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row + 1, col: col },
          { row: row - 1, col: col },
        ]);
      }
    }
    if (this.#checkDirection([SOS.PIECES.S.string], row, col, 0, 1)) {
      if (this.#checkDirection([SOS.PIECES.S.string], row, col, 0, -1)) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row, col: col + 1 },
          { row: row, col: col - 1 },
        ]);
      }
    }
    if (this.#checkDirection([SOS.PIECES.S.string], row, col, 1, 1)) {
      if (this.#checkDirection([SOS.PIECES.S.string], row, col, -1, -1)) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row + 1, col: col + 1 },
          { row: row - 1, col: col - 1 },
        ]);
      }
    }
    if (this.#checkDirection([SOS.PIECES.S.string], row, col, -1, 1)) {
      if (this.#checkDirection([SOS.PIECES.S.string], row, col, 1, -1)) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row - 1, col: col + 1 },
          { row: row + 1, col: col - 1 },
        ]);
      }
    }
    return result;
  }

  /**
   * Get the number scored with the provided position with an S
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @returns {int}
   * @private
   */
  #getScoreS(row, col) {
    let result = 0;
    [1, -1].forEach((direction) => {
      result += this.#getDirectionalScoreS(row, col, direction);
    });

    return result;
  }

  /**
   * Get the number scored with the provided position and direction with an S
   * @param {int} row Row number [0 to 7]
   * @param {int} col Column number [0 to 7]
   * @param {int} direction direction number [-1 or 1]
   * @returns {int}
   * @private
   */
  #getDirectionalScoreS(row, col, direction) {
    let player =
      this.#status == SOS.STATUS.HUMAN_MOVE ? this.#human : this.#computer;
    let result = 0;
    if (
      this.#checkDirection([SOS.PIECES.O.string], row, col, 1 * direction, 0)
    ) {
      if (
        this.#checkDirection([SOS.PIECES.S.string], row, col, 2 * direction, 0)
      ) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row + 1 * direction, col: col },
          { row: row + 2 * direction, col: col },
        ]);
      }
    }
    if (
      this.#checkDirection([SOS.PIECES.O.string], row, col, 0, 1 * direction)
    ) {
      if (
        this.#checkDirection([SOS.PIECES.S.string], row, col, 0, 2 * direction)
      ) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row, col: col + 1 * direction },
          { row: row, col: col + 2 * direction },
        ]);
      }
    }
    if (
      this.#checkDirection(
        [SOS.PIECES.O.string],
        row,
        col,
        1 * direction,
        1 * direction
      )
    ) {
      if (
        this.#checkDirection(
          [SOS.PIECES.S.string],
          row,
          col,
          2 * direction,
          2 * direction
        )
      ) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row + 1 * direction, col: col + 1 * direction },
          { row: row + 2 * direction, col: col + 2 * direction },
        ]);
      }
    }
    if (
      this.#checkDirection(
        [SOS.PIECES.O.string],
        row,
        col,
        -1 * direction,
        1 * direction
      )
    ) {
      if (
        this.#checkDirection(
          [SOS.PIECES.S.string],
          row,
          col,
          -2 * direction,
          2 * direction
        )
      ) {
        result++;
        player.sos.push([
          { row: row, col: col },
          { row: row - 1 * direction, col: col + 1 * direction },
          { row: row - 2 * direction, col: col + 2 * direction },
        ]);
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
    this.playMove(algoritms.alphaBetaPruning(this, 3));
  }

  /**
   * Get valid moves form current node
   * For algorithm game interface
   * @returns {Array} moves {row, col, piece}
   */
  getChilds() { 
    if(this.#hasEnd()){return []}
    let moves = [];
    this.#getPieces(SOS.PIECES.empty.string).forEach((position) => {
      moves.push({
        row: position.row,
        col: position.col,
        piece: SOS.PIECES.O.string,
      });
      moves.push({
        row: position.row,
        col: position.col,
        piece: SOS.PIECES.S.string,
      });
    });
    moves.sort(() => Math.random() - 0.5);
    return moves;
  }

  /**
   * Get the heuristic value of the node
   * @param {Boolean} _isMax Node to maximize or minimize
   * @returns {int} Heuristic value of the node
   */
  getHeuristic(_isMax) {
    let value = 0;

    value += this.#computer.score;
    value -= this.#human.score;

    return value;
  }

  /**
   * Perform a valid move
   * @param {Object} move
   */
  playMove(move) {
    this.setMove(move.piece, move.row, move.col);
  }

  /**
   * Cheks is game has finished
   * @returns {boolean}
   */
  hasFinished() {
    return this.#hasEnd();
  }
}
