'use strict'

function renderHints() {
    var strHtml = ''
    var elhint = document.querySelector('.hint-btns')
    for (var renderHint = 0; renderHint < 3; renderHint++) {
        strHtml += `<img class="hint-btn" src="img/monster3.png" onclick="provideHint(this)"/>`
    }

    elhint.innerHTML = strHtml
}


function provideHint(elBtn) {
    if (gGame.isHintOn || !gGame.isMinesRendered) {
        return
    }

    gGame.isHintOn = true
    elBtn.classList.add("selected")
}


// this func should peek a cell and neighbors 
function hintPeek(board, row, col, shouldShow) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            const cell = board[i][j]
            var elCell = document.querySelector(`[data-row = "${i}"][data-col="${j}"]`)

            if (shouldShow) {
                if (cell.isMine) {
                    elCell.innerHTML = MINE_IMG
                } else {
                    var counter = countMinesAroundCell(board, i, j)
                    elCell.innerHTML = counter
                }
            } else if (!cell.isShown) {
                elCell.innerHTML = ""
            }
        }
    }
}