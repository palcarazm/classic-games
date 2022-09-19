import { TicTacToe } from "./game.js";

let GAME = new TicTacToe(
  null,
  Math.random() < 0.5
    ? TicTacToe.STATUS.HUMAN_MOVE
    : TicTacToe.STATUS.COMPUTER_MOVE
);
const $BOARD = $("#board");
const $ALERT = $("#alert");
const $COLS = $("#board .col");

$(document).ready(function () {
  /** Init */
  if (GAME.getStatus() == TicTacToe.STATUS.COMPUTER_MOVE) {
    GAME.computerMove();
  }
  sync();

  /** Listeners */
  $("#reset").on("click touch", function (_e) {
    GAME = new TicTacToe(
        null,
        Math.random() < 0.5
          ? TicTacToe.STATUS.HUMAN_MOVE
          : TicTacToe.STATUS.COMPUTER_MOVE
      );
    sync();
  });
  $COLS.mouseenter(mouseenterHandler);
  $COLS.on("click touch", clickHandler);
  $COLS.mouseleave(mouseleaveHandler);
});

function sync() {
  $BOARD.attr("game-status", GAME.getStatus());
  $COLS.each(function () {
    let cell = parseCell($(this));
    $(this)
      .attr("class", "col")
      .addClass(cell.value)
      .html(TicTacToe.PIECES[cell.value].html);
  });

  switch (GAME.getStatus()) {
    case TicTacToe.STATUS.HUMAN_MOVE:
      $ALERT
        .attr("class", "alert")
        .addClass("alert-info")
        .html("Click in a empty cell to move.");
      break;
    case TicTacToe.STATUS.HUMAN_SELECT:
      $ALERT
        .attr("class", "alert")
        .addClass("alert-info")
        .html("Click in one of your pieces to move.");
      break;
    case TicTacToe.STATUS.GAMEOVER:
      if (GAME.getWinner() == TicTacToe.HUMAN.string) {
        $ALERT
          .attr("class", "alert")
          .addClass("alert-success")
          .html("You Win!");
        $BOARD.addClass("success");
      } else {
        $ALERT
          .attr("class", "alert")
          .addClass("alert-danger")
          .html("Gameover!");
        $BOARD.addClass("fail");
      }
      break;
    default:
      $ALERT
        .attr("class", "alert")
        .addClass("alert-info")
        .html("Wait for computer move.");
      break;
  }
}

function parseCell($cell) {
  return {
    row: $cell.attr("board-row"),
    col: $cell.attr("board-col"),
    value: GAME.getCell($cell.attr("board-row"), $cell.attr("board-col")),
  };
}

function mouseenterHandler(evt) {
  if (
    GAME.getStatus() == TicTacToe.STATUS.HUMAN_MOVE &&
    parseCell($(evt.currentTarget)).value == TicTacToe.PIECES.empty.string
  ) {
    $(evt.currentTarget).html(TicTacToe.HUMAN.html);
  }
}

function clickHandler(evt) {
  let cell = parseCell($(evt.currentTarget));
  switch (GAME.getStatus()) {
    case TicTacToe.STATUS.HUMAN_MOVE:
      if (cell.value == TicTacToe.PIECES.empty.string) {
        GAME.setMove(cell.row, cell.col);
        sync();
        if (!GAME.hasFinished()) {
          GAME.computerMove();
          sync();
        }
      }
      break;
    case TicTacToe.STATUS.HUMAN_SELECT:
      if (cell.value == TicTacToe.HUMAN.string) {
        GAME.setSelect(cell.row, cell.col);
        sync();
      }
      break;

    default:
      break;
  }
}

function mouseleaveHandler(evt) {
  if (
    GAME.getStatus() == TicTacToe.STATUS.HUMAN_MOVE &&
    parseCell($(evt.currentTarget)).value == TicTacToe.PIECES.empty.string
  ) {
    $(evt.currentTarget).html(TicTacToe.PIECES.empty.html);
  }
}
