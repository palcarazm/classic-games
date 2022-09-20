import { Board } from "../src/board.js";
import { Othello } from "./game.js";

let GAME = new Othello(
  null,
  Math.random() < 0.5 ? Othello.STATUS.HUMAN_MOVE : Othello.STATUS.COMPUTER_MOVE
);
const $BOARD = $("#board");
Board.render($BOARD, 8, 8);
const $COLS = $("#board .col");
const $ALERT = $("#alert");
const $SCORE_HUMAN = $("#score-human");
const $SCORE_COMPUTER = $("#score-computer");

$(document).ready(function () {
  /** Init */
  if (GAME.getStatus() == Othello.STATUS.COMPUTER_MOVE) {
    GAME.computerMove();
  }
  sync();

  /** Listeners */
  $("#reset").on("click touch", function (_e) {
    GAME = new Othello(
      null,
      Math.random() < 0.5
        ? Othello.STATUS.HUMAN_MOVE
        : Othello.STATUS.COMPUTER_MOVE
    );
    if (GAME.getStatus() == Othello.STATUS.COMPUTER_MOVE) {
      GAME.computerMove();
    }
    sync();
  });
  $COLS.on("click touch", clickHandler);
});

function sync() {
  $BOARD.attr("game-status", GAME.getStatus());
  $COLS.each(function () {
    let cell = parseCell($(this));
    $(this)
      .attr("class", "col")
      .addClass(cell.value)
      .html(Othello.PIECES[cell.value].html);
  });

  if (!GAME.hasFinished()) {
    setCandidates();
  }

  let lastMove = GAME.getLastMove();
  if(lastMove != null){
    $BOARD
      .find('.col[board-row="' + lastMove.row + '"][board-col="' + lastMove.col + '"]')
      .addClass('last-move');
  }

  let score = GAME.countPieces();

  $SCORE_HUMAN.html('').append(
    $(Othello.HUMAN.html),
    $('<span class="badge rounded-pill bg-secondary mt-1">' + score[Othello.HUMAN.string] +'</span>')
  )
  $SCORE_COMPUTER.html('').append(
    $(Othello.COMPUTER.html),
    $('<span class="badge rounded-pill bg-secondary mt-1">' + score[Othello.COMPUTER.string] +'</span>')
  )

  switch (GAME.getStatus()) {
    case Othello.STATUS.HUMAN_MOVE:
      $ALERT
        .attr("class", "alert")
        .addClass("alert-info")
        .html("Click in a valid cell to move.");
      break;
    case Othello.STATUS.GAMEOVER:
      if (GAME.getWinner() == Othello.HUMAN.string) {
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

function setCandidates() {
  GAME.getCandidates().forEach((candidate) => {
    $BOARD
      .find('.col[board-row="' + candidate.row + '"][board-col="' + candidate.col + '"]')
      .attr("class", "col")
      .addClass(candidate.value)
      .html(Othello.PIECES[candidate.value].html);
  });
}

function parseCell($cell) {
  return {
    row: $cell.attr("board-row"),
    col: $cell.attr("board-col"),
    value: GAME.getCell($cell.attr("board-row"), $cell.attr("board-col")),
  };
}

function clickHandler(evt) {
  if (GAME.getStatus() == Othello.STATUS.HUMAN_MOVE) {
    let valid = false;
    let cell = parseCell($(evt.currentTarget));
    for (const candidate of GAME.getCandidates()) {
      if(candidate.row == cell.row && candidate.col == cell.col){
        valid = true;
        break;
      }
    }
    if(valid){
      GAME.setMove(parseInt(cell.row), parseInt(cell.col));
      sync();
      if (!GAME.hasFinished()) {
        setTimeout(()=>{
          GAME.computerMove();
          sync();
        }, 1000);
      }
    }
  }
}
