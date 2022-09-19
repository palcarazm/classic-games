import { TicTacToe } from "./game.js";

let GAME = new TicTacToe();
const $BOARD = $('#board');
const $ALERT = $('#alert');
const $COLS = $('#board .col');

$(document).ready(function () {
    /** Init */
    sync();

    /** Listeners */
    $('#reset').on('click touch',function(_e){
        GAME = new TicTacToe();
        sync();
    });
    $COLS.mouseenter(function(_e){
        let cell = parseCell($(this));
        switch (GAME.getStatus()) {
            case 'human move':
                if (cell.value == GAME.PIECES.empty.string) {
                    $(this).html(GAME.HUMAN.html);
                }
                break;
        
            default:
                break;
        }
    });
    $COLS.on('click touch',function(_e){
        let cell = parseCell($(this));
        switch (GAME.getStatus()) {
            case 'human move':
                if (cell.value == GAME.PIECES.empty.string) {
                    GAME.setMove(cell.row,cell.col);
                    sync();
                    if(GAME.getStatus() != 'gameover'){
                        GAME.computerMove();
                        sync();
                    }
                }
                break;
            case 'human select':
                if (cell.value == GAME.HUMAN.string) {
                    GAME.setSelect(cell.row,cell.col);
                    sync();
                }
                break;
        
            default:
                break;
        }
    });
    $COLS.mouseleave(function(_e){
        let cell = parseCell($(this));
        switch (GAME.getStatus()) {
            case 'human move':
                if (cell.value == GAME.PIECES.empty.string) {
                    $(this).html(GAME.PIECES.empty.html);
                }
                break;
        
            default:
                break;
        }
    });
});

function sync() {
    $BOARD.attr('game-status', GAME.getStatus());
    $COLS.each( function (){
        let cell = parseCell($(this));
        $(this)
            .attr('class','col')
            .addClass(cell.value)
            .html(GAME.PIECES[cell.value].html);

    });

    switch (GAME.getStatus()) {
        case 'human move':
            $ALERT
                .attr('class','alert')
                .addClass('alert-info')
                .html("Click in a empty cell to move.");
            break;
        case 'human select':
            $ALERT
                .attr('class','alert')
                .addClass('alert-info')
                .html("Click in one of your pieces to move.");
            break;
        case 'gameover':
            if(GAME.getWinner() == GAME.HUMAN.string){
                $ALERT
                    .attr('class','alert')
                    .addClass('alert-success')
                    .html("You Win!");
                $BOARD.addClass("success")
            }else{
                $ALERT
                    .attr('class','alert')
                    .addClass('alert-danger')
                    .html("Gameover!");
                $BOARD.addClass("fail")
            }
            break;
        default:
            $ALERT
                .attr('class','alert')
                .addClass('alert-info')
                .html("Wait for computer move.");
            break;
    } 
}

function parseCell($cell){
    return {
        row: $cell.attr('board-row'),
        col: $cell.attr('board-col'),
        value: GAME.getCell($cell.attr('board-row'), $cell.attr('board-col'))
    };
}