import { Board } from "../src/board.js";
import { SOS } from "./game.js";

let GAME = new SOS(
  null,
  Math.random() < 0.5 ? SOS.STATUS.HUMAN_MOVE : SOS.STATUS.COMPUTER_MOVE
);
const $BOARD = $("#board");
Board.render($BOARD, SOS.NBOARD, SOS.NBOARD);
const $ALERT = $("#alert");
const $COLS = $("#board .col");
const $SCORE_HUMAN = $("#score-human");
const $SCORE_COMPUTER = $("#score-computer");
const $LETTER_SELECTOR = $("#selected-letter");
let selected_letter;

$(document).ready(function () {
  /** Init */
  selected_letter = $LETTER_SELECTOR.val();
  if (GAME.getStatus() == SOS.STATUS.COMPUTER_MOVE) {
    computerPlay();
  }
  sync();

  /** Listeners */
  $("#reset").on("click touch", function (_e) {
    GAME = new SOS(
      null,
      Math.random() < 0.5 ? SOS.STATUS.HUMAN_MOVE : SOS.STATUS.COMPUTER_MOVE
    );
    if (GAME.getStatus() == SOS.STATUS.COMPUTER_MOVE) {
      computerPlay();
    }
    sync();
  });
  $LETTER_SELECTOR.on("change", function (_e) {
    selected_letter = $('input[name="selected-letter"]:checked').val();
  });
  $COLS.mouseenter(mouseenterHandler);
  $COLS.on("click touch", clickHandler);
  $COLS.mouseleave(mouseleaveHandler);
});

function sync() {
  // GAME BOARD
  $BOARD.attr("game-status", GAME.getStatus());
  $COLS.each(function () {
    let cell = parseCell($(this));
    $(this)
      .attr("class", "col")
      .addClass(cell.value)
      .html(SOS.PIECES[cell.value].html);
  });

  // SCORE BOARD
  $SCORE_HUMAN.html('').append(
    $('<i class="fa-solid fa-user"></i>'),
    $('<span class="badge rounded-pill bg-secondary mt-1">' + GAME.getHuman().score +'</span>')
  )
  $SCORE_COMPUTER.html('').append(
    $('<i class="fa-solid fa-robot"></i>'),
    $('<span class="badge rounded-pill bg-secondary mt-1">' + GAME.getComputer().score +'</span>')
  )

  // ALERT BOARD
  switch (GAME.getStatus()) {
    case SOS.STATUS.HUMAN_MOVE:
      $ALERT
        .attr("class", "alert")
        .addClass("alert-info")
        .html("Click in a empty cell to move.");
      break;
    case SOS.STATUS.GAMEOVER:
      if (GAME.getWinner() == "human") {
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

  // MOVES HIGHLIGHT
  GAME.getHuman().sos.forEach(sos => {
    sos.forEach(cell => {
      $BOARD.find('.col[board-row="' + cell.row + '"][board-col="' + cell.col + '"]').addClass('human');
    });
  });

  GAME.getComputer().sos.forEach(sos => {
    sos.forEach(cell => {
      $BOARD.find('.col[board-row="' + cell.row + '"][board-col="' + cell.col + '"]').addClass('computer');
    });
  });

  if(GAME.getLastMove()!= null){
    $BOARD.find('.col[board-row="' + GAME.getLastMove().row + '"][board-col="' + GAME.getLastMove().col + '"]').addClass('last-move');
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
    GAME.getStatus() == SOS.STATUS.HUMAN_MOVE &&
    parseCell($(evt.currentTarget)).value == SOS.PIECES.empty.string
  ) {
    $(evt.currentTarget).html(SOS.PIECES[selected_letter].html);
  }
}

function clickHandler(evt) {
  let cell = parseCell($(evt.currentTarget));
  if (GAME.getStatus() == SOS.STATUS.HUMAN_MOVE) {
    if (cell.value == SOS.PIECES.empty.string) {
      GAME.setMove(
        SOS.PIECES[selected_letter].string,
        parseInt(cell.row),
        parseInt(cell.col)
      );
      sync();
      if (!GAME.hasFinished() && GAME.getStatus() == SOS.STATUS.COMPUTER_MOVE) {
        computerPlay();
      }
    }
  }
}

function mouseleaveHandler(evt) {
  if (
    GAME.getStatus() == SOS.STATUS.HUMAN_MOVE &&
    parseCell($(evt.currentTarget)).value == SOS.PIECES.empty.string
  ) {
    $(evt.currentTarget).html(SOS.PIECES.empty.html);
  }
}

function computerPlay() {
  setTimeout(() => {
    GAME.computerMove();
    sync();
    if (!GAME.hasFinished() && GAME.getStatus() == SOS.STATUS.COMPUTER_MOVE) {
      computerPlay();
    }
  }, 0);
}
