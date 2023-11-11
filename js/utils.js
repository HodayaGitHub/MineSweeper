'use strict'

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}


function countMinesAroundCell(board, row, col) {
    var mineAroundCounter = 0

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (row === i && col === j) continue

            // update the current cell number:
            var currentNeighborCell = gGameBoard[i][j]

            if (currentNeighborCell.isMine === true) {
                mineAroundCounter++
            }
        }
    }
    return mineAroundCounter;
}

