export class Board{
    /**
     * Render a Board
     * @param {JQuery<TElement>} $container 
     * @param {int} rows number of rows
     * @param {int} cols number of columns
     * @static
     */
    static render($container, rows, cols) {
        for (let row = 0; row < rows; row++) {
            let $row = $('<div class="row"></div>');
            for (let col = 0; col < cols; col++) {
                $row.append(
                    $('<div class="col"></div>')
                        .attr('board-row', row)
                        .attr('board-col', col) 
                );              
            }
            $container.append($row);
        }
    }
}